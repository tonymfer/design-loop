#!/usr/bin/env node
/**
 * fixture-flaw-checker.js — Parse HTML fixtures, extract CSS, check for visual flaws.
 *
 * Usage:
 *   node tests/fixture-flaw-checker.js <fixture> <check> [args...]
 *
 * Checks:
 *   spacing-varies <selector> <property>         Values are NOT uniform across matching elements
 *   spacing-uniform <selector> <property>        Values ARE uniform (inverse of spacing-varies)
 *   contrast-fails <selector>                    Foreground/bg pair fails WCAG AA (4.5:1)
 *   contrast-passes <selector>                   All foreground/bg pairs pass WCAG AA
 *   property-missing <selector> <pseudo>         No rules with given pseudo-class exist
 *   property-exists <selector> <pseudo>          Rules with given pseudo-class DO exist
 *   tokens-ignored <token-prefix>                Hardcoded values used instead of var(--token)
 *   tokens-used <token-prefix> --min-ratio <n>   Token compliance above threshold
 *   hierarchy-flat <heading-sel> <body-sel>      Heading/body font-size ratio < 1.3
 *   hierarchy-clear <heading-sel> <body-sel>     Heading/body font-size ratio >= 1.5
 *   rendering-broken <check-type>                Specific rendering defect present
 *   rendering-fixed <check-type>                 Rendering defect resolved
 *   property-value <selector> <property> <regex> Property matches regex pattern
 *   property-absent <selector> <property>        Property not set on any matching element
 *   property-present <selector> <property>       Property IS set on matching elements
 *   recommended-distinct                         [data-recommended] card has visual distinction
 *
 * Output: JSON { "pass": bool, "detail": string }
 */

'use strict';

const fs = require('fs');
const { parseHTML } = require('linkedom');

// ── CSS Parsing Helpers ──────────────────────────────────────

/**
 * Extract all CSS text from <style> blocks in the document.
 */
function extractCSS(document) {
  const styles = document.querySelectorAll('style');
  return Array.from(styles).map(s => s.textContent).join('\n');
}

/**
 * Parse CSS text into an array of { selector, properties: { prop: value } }.
 * Handles nested selectors (nth-child, pseudo-classes) but NOT @media queries deeply.
 */
function parseRules(cssText) {
  const rules = [];
  // Remove comments
  const clean = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove @media wrappers (keep inner rules) — simple single-level
  const unwrapped = clean.replace(/@media[^{]*\{([\s\S]*?)\}\s*\}/g, '$1');

  // Match selector { ... } blocks
  const ruleRegex = /([^{}]+?)\{([^{}]*?)\}/g;
  let match;
  while ((match = ruleRegex.exec(unwrapped)) !== null) {
    const selectorGroup = match[1].trim();
    const body = match[2].trim();
    if (selectorGroup.startsWith('@') || selectorGroup.startsWith(':root')) {
      // Still parse :root for token extraction
      if (selectorGroup.includes(':root')) {
        const props = parseProperties(body);
        rules.push({ selector: ':root', properties: props });
      }
      continue;
    }
    // Split comma-separated selectors
    const selectors = selectorGroup.split(',').map(s => s.trim());
    const props = parseProperties(body);
    for (const sel of selectors) {
      rules.push({ selector: sel, properties: props });
    }
  }
  return rules;
}

/**
 * Parse "prop: value; prop2: value2;" into { prop: value }
 */
function parseProperties(body) {
  const props = {};
  const lines = body.split(';').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const prop = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (prop && val && !prop.startsWith('/*')) {
      props[prop] = val;
    }
  }
  return props;
}

/**
 * Get the resolved CSS property value for elements matching a selector.
 * Looks at both <style> rules and inline styles.
 * Returns array of { element, value } for each matching element.
 */
function getPropertyValues(document, cssRules, selector, property) {
  const elements = document.querySelectorAll(selector);
  const results = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    let value = null;

    // Check inline style first (highest specificity)
    if (el.style && el.style[camelCase(property)]) {
      value = el.style[camelCase(property)];
    }

    if (!value) {
      // Check nth-child rules (highest CSS specificity among style block rules)
      for (const rule of cssRules) {
        if (matchesNthChild(rule.selector, selector, i) && rule.properties[property]) {
          value = rule.properties[property];
        }
      }
    }

    if (!value) {
      // Check class-based / tag-based rules
      for (const rule of cssRules) {
        if (selectorMatches(rule.selector, selector) && rule.properties[property]) {
          value = rule.properties[property];
        }
      }
    }

    results.push({ index: i, value });
  }

  return results;
}

function camelCase(prop) {
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Check if a CSS rule's selector targets nth-child of a base selector.
 * e.g. rule ".card:nth-child(2)" matches base ".card" at index 1
 */
function matchesNthChild(ruleSelector, baseSelector, elementIndex) {
  const nthRegex = new RegExp(
    escapeRegex(baseSelector) + ':nth-child\\((\\d+)\\)'
  );
  const m = ruleSelector.match(nthRegex);
  if (m) return parseInt(m[1]) === elementIndex + 1;
  return false;
}

/**
 * Simple selector matching — checks if ruleSelector targets baseSelector.
 */
function selectorMatches(ruleSelector, baseSelector) {
  // Exact match or starts-with (handles compound selectors)
  const ruleParts = ruleSelector.split(/\s+/);
  const baseParts = baseSelector.split(/\s+/);
  // Check if the last part of rule matches base (simple heuristic)
  const ruleEnd = ruleParts[ruleParts.length - 1];
  const baseEnd = baseParts[baseParts.length - 1];
  // Strip pseudo-classes for base matching
  const ruleBase = ruleEnd.replace(/:[^ ]+/g, '');
  return ruleBase === baseEnd;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── WCAG Contrast Helpers ────────────────────────────────────

/**
 * Parse hex color to {r,g,b} (0-255).
 */
function parseColor(hex) {
  if (!hex || !hex.startsWith('#')) return null;
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  if (hex.length !== 6) return null;
  return {
    r: parseInt(hex.slice(0,2), 16),
    g: parseInt(hex.slice(2,4), 16),
    b: parseInt(hex.slice(4,6), 16),
  };
}

/**
 * Relative luminance per WCAG 2.0.
 */
function luminance({r, g, b}) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Contrast ratio between two colors.
 */
function contrastRatio(c1, c2) {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Find the foreground color for elements matching a selector.
 * Returns array of { fg, bg, ratio }.
 */
function getContrastInfo(document, cssRules, selector) {
  const results = [];
  // Find color for the selector
  let fgColor = null;
  for (const rule of cssRules) {
    if (selectorMatches(rule.selector, selector) && rule.properties['color']) {
      fgColor = rule.properties['color'];
    }
  }
  if (!fgColor) return results;

  // Assume white background unless found
  let bgColor = '#ffffff';
  // Check parent containers for background
  const bgProps = ['background', 'background-color'];
  for (const rule of cssRules) {
    for (const bp of bgProps) {
      if (rule.properties[bp]) {
        const val = rule.properties[bp];
        if (val.startsWith('#') && val.length <= 7) {
          // Only use if it's a simple color on a plausible parent
          // We use the closest background we find
        }
      }
    }
  }

  const fg = parseColor(fgColor);
  const bg = parseColor(bgColor);
  if (fg && bg) {
    results.push({ fg: fgColor, bg: bgColor, ratio: contrastRatio(fg, bg) });
  }
  return results;
}

// ── Check Implementations ────────────────────────────────────

const checks = {
  /**
   * spacing-varies: Property values NOT uniform across matching elements.
   */
  'spacing-varies'(document, cssRules, args) {
    const [selector, property] = args;
    const values = getPropertyValues(document, cssRules, selector, property);
    const definedValues = values.filter(v => v.value != null).map(v => v.value);
    if (definedValues.length < 2) {
      return { pass: false, detail: `Only ${definedValues.length} elements with ${property} found` };
    }
    const unique = [...new Set(definedValues)];
    const varies = unique.length > 1;
    return {
      pass: varies,
      detail: varies
        ? `${unique.length} distinct ${property} values: ${unique.join(', ')}`
        : `All ${property} values uniform: ${unique[0]}`
    };
  },

  /**
   * spacing-uniform: Property values ARE uniform (inverse).
   */
  'spacing-uniform'(document, cssRules, args) {
    const result = checks['spacing-varies'](document, cssRules, args);
    return { pass: !result.pass, detail: result.detail };
  },

  /**
   * contrast-fails: At least one foreground/bg pair fails WCAG AA.
   */
  'contrast-fails'(document, cssRules, args) {
    const [selector] = args;
    const info = getContrastInfo(document, cssRules, selector);
    if (info.length === 0) {
      return { pass: false, detail: `No color info found for ${selector}` };
    }
    const failing = info.filter(i => i.ratio < 4.5);
    return {
      pass: failing.length > 0,
      detail: info.map(i => `${i.fg} on ${i.bg} = ${i.ratio.toFixed(2)}:1`).join('; ')
    };
  },

  /**
   * contrast-passes: All foreground/bg pairs pass WCAG AA.
   */
  'contrast-passes'(document, cssRules, args) {
    const result = checks['contrast-fails'](document, cssRules, args);
    return { pass: !result.pass, detail: result.detail };
  },

  /**
   * property-missing: No CSS rules with given pseudo-class exist for the selector.
   */
  'property-missing'(document, cssRules, args) {
    const [selector, pseudo] = args;
    const pattern = new RegExp(escapeRegex(selector) + '.*' + escapeRegex(pseudo));
    const found = cssRules.some(r => pattern.test(r.selector));
    return {
      pass: !found,
      detail: found
        ? `Found ${pseudo} rule for ${selector}`
        : `No ${pseudo} rule found for ${selector}`
    };
  },

  /**
   * property-exists: CSS rules with given pseudo-class DO exist.
   */
  'property-exists'(document, cssRules, args) {
    const result = checks['property-missing'](document, cssRules, args);
    return { pass: !result.pass, detail: result.detail };
  },

  /**
   * tokens-ignored: Hardcoded values used instead of var(--token-prefix).
   * Counts properties that SHOULD use tokens but use hardcoded values instead.
   */
  'tokens-ignored'(document, cssRules, args) {
    const [tokenPrefix] = args;
    // Get token values from :root
    const rootRule = cssRules.find(r => r.selector === ':root');
    if (!rootRule) {
      return { pass: false, detail: 'No :root rule with tokens found' };
    }
    const tokenValues = {};
    for (const [prop, val] of Object.entries(rootRule.properties)) {
      if (prop.startsWith(tokenPrefix)) {
        tokenValues[val] = prop;
      }
    }

    let hardcoded = 0;
    let tokenized = 0;
    for (const rule of cssRules) {
      if (rule.selector === ':root') continue;
      for (const [, val] of Object.entries(rule.properties)) {
        if (val.includes('var(')) {
          tokenized++;
        } else {
          // Check if this value matches a token value
          for (const tokenVal of Object.keys(tokenValues)) {
            if (val === tokenVal || val.includes(tokenVal)) {
              hardcoded++;
              break;
            }
          }
        }
      }
    }

    const total = hardcoded + tokenized;
    const ratio = total > 0 ? tokenized / total : 1;
    return {
      pass: hardcoded > 0,
      detail: `${hardcoded} hardcoded, ${tokenized} tokenized (compliance: ${(ratio * 100).toFixed(0)}%)`
    };
  },

  /**
   * tokens-used: Token compliance above threshold.
   */
  'tokens-used'(document, cssRules, args) {
    const [tokenPrefix, ...rest] = args;
    let minRatio = 0.9;
    const ratioIdx = rest.indexOf('--min-ratio');
    if (ratioIdx !== -1 && rest[ratioIdx + 1]) {
      minRatio = parseFloat(rest[ratioIdx + 1]);
    }

    const rootRule = cssRules.find(r => r.selector === ':root');
    if (!rootRule) {
      return { pass: false, detail: 'No :root rule with tokens found' };
    }

    const tokenValues = {};
    for (const [prop, val] of Object.entries(rootRule.properties)) {
      if (prop.startsWith(tokenPrefix)) {
        tokenValues[val] = prop;
      }
    }

    let hardcoded = 0;
    let tokenized = 0;
    for (const rule of cssRules) {
      if (rule.selector === ':root') continue;
      for (const [, val] of Object.entries(rule.properties)) {
        if (val.includes('var(')) {
          tokenized++;
        } else {
          for (const tokenVal of Object.keys(tokenValues)) {
            if (val === tokenVal || val.includes(tokenVal)) {
              hardcoded++;
              break;
            }
          }
        }
      }
    }

    const total = hardcoded + tokenized;
    const ratio = total > 0 ? tokenized / total : 1;
    return {
      pass: ratio >= minRatio,
      detail: `Token compliance: ${(ratio * 100).toFixed(0)}% (min: ${(minRatio * 100).toFixed(0)}%)`
    };
  },

  /**
   * hierarchy-flat: Heading/body font-size ratio < 1.3.
   */
  'hierarchy-flat'(document, cssRules, args) {
    const [headingSel, bodySel] = args;
    const headingSize = getFontSizeRem(cssRules, headingSel);
    const bodySize = getFontSizeRem(cssRules, bodySel);

    if (!headingSize || !bodySize) {
      return { pass: false, detail: `Could not resolve font sizes: h=${headingSize}, b=${bodySize}` };
    }

    const ratio = headingSize / bodySize;
    return {
      pass: ratio < 1.3,
      detail: `${headingSel}=${headingSize}rem, ${bodySel}=${bodySize}rem, ratio=${ratio.toFixed(2)}`
    };
  },

  /**
   * hierarchy-clear: Heading/body font-size ratio >= 1.5.
   */
  'hierarchy-clear'(document, cssRules, args) {
    const [headingSel, bodySel] = args;
    const headingSize = getFontSizeRem(cssRules, headingSel);
    const bodySize = getFontSizeRem(cssRules, bodySel);

    if (!headingSize || !bodySize) {
      return { pass: false, detail: `Could not resolve font sizes: h=${headingSize}, b=${bodySize}` };
    }

    const ratio = headingSize / bodySize;
    return {
      pass: ratio >= 1.5,
      detail: `${headingSel}=${headingSize}rem, ${bodySel}=${bodySize}rem, ratio=${ratio.toFixed(2)}`
    };
  },

  /**
   * rendering-broken: Specific rendering defect present.
   */
  'rendering-broken'(document, cssRules, args) {
    const [checkType] = args;
    const cssText = extractCSS(document);
    // Strip comments for property detection
    const cssClean = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

    switch (checkType) {
      case 'missing-webkit-clip': {
        // Has background-clip: text but NOT -webkit-background-clip: text
        const hasClip = cssClean.includes('background-clip: text');
        const hasWebkit = cssClean.includes('-webkit-background-clip: text');
        return {
          pass: hasClip && !hasWebkit,
          detail: hasClip && !hasWebkit
            ? 'background-clip: text without -webkit- prefix'
            : `clip=${hasClip}, webkit=${hasWebkit}`
        };
      }
      case 'solid-bg-backdrop': {
        // backdrop-filter used but the SAME rule's background is solid (not rgba)
        const backdropRules = cssRules.filter(r => r.properties['backdrop-filter']);
        if (backdropRules.length === 0) {
          return { pass: false, detail: 'No backdrop-filter rules found' };
        }
        const hasSolidBg = backdropRules.some(r => {
          const bg = r.properties['background'] || r.properties['background-color'] || '';
          return bg && !bg.includes('rgba') && !bg.includes('hsla');
        });
        return {
          pass: hasSolidBg,
          detail: `backdrop-filter rules: ${backdropRules.length}, solid-bg=${hasSolidBg}`
        };
      }
      case 'overflow-clip': {
        // Elements with small fixed height + overflow:hidden
        let found = false;
        for (const rule of cssRules) {
          if (rule.properties['overflow'] === 'hidden' && rule.properties['height']) {
            const h = parseFloat(rule.properties['height']);
            if (h > 0 && h < 120) {
              found = true;
              break;
            }
          }
        }
        return {
          pass: found,
          detail: found ? 'Found small container with overflow:hidden' : 'No overflow clip found'
        };
      }
      case 'broken-img': {
        // img tags without src attribute
        const imgs = document.querySelectorAll('img');
        const broken = Array.from(imgs).filter(img => !img.getAttribute('src'));
        return {
          pass: broken.length > 0,
          detail: `${broken.length} img elements without src`
        };
      }
      default:
        return { pass: false, detail: `Unknown check type: ${checkType}` };
    }
  },

  /**
   * rendering-fixed: Rendering defect resolved (inverse).
   */
  'rendering-fixed'(document, cssRules, args) {
    const result = checks['rendering-broken'](document, cssRules, args);
    return { pass: !result.pass, detail: result.detail };
  },

  /**
   * property-value: Property matches regex pattern.
   */
  'property-value'(document, cssRules, args) {
    const [selector, property, pattern] = args;
    const values = getPropertyValues(document, cssRules, selector, property);
    const definedValues = values.filter(v => v.value != null).map(v => v.value);

    if (definedValues.length === 0) {
      // Also check directly in CSS rules
      let found = null;
      for (const rule of cssRules) {
        if (selectorMatches(rule.selector, selector) && rule.properties[property]) {
          found = rule.properties[property];
        }
      }
      if (found) {
        const regex = new RegExp(pattern);
        return {
          pass: regex.test(found),
          detail: `${property}="${found}" ${regex.test(found) ? 'matches' : 'does not match'} /${pattern}/`
        };
      }
      return { pass: false, detail: `No ${property} found for ${selector}` };
    }

    const regex = new RegExp(pattern);
    const matching = definedValues.filter(v => regex.test(v));
    return {
      pass: matching.length > 0,
      detail: `${matching.length}/${definedValues.length} values match /${pattern}/: ${definedValues.join(', ')}`
    };
  },

  /**
   * property-absent: Property not set on any matching element.
   */
  'property-absent'(document, cssRules, args) {
    const [selector, property] = args;
    // Check CSS rules
    let found = false;
    for (const rule of cssRules) {
      if (selectorMatches(rule.selector, selector) && rule.properties[property]) {
        found = true;
        break;
      }
    }
    // Check inline styles
    if (!found) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (el.style && el.style[camelCase(property)]) {
          found = true;
          break;
        }
      }
    }
    return {
      pass: !found,
      detail: found ? `${property} found on ${selector}` : `No ${property} on ${selector}`
    };
  },

  /**
   * property-present: Property IS set on matching elements.
   */
  'property-present'(document, cssRules, args) {
    const result = checks['property-absent'](document, cssRules, args);
    return { pass: !result.pass, detail: result.detail };
  },

  /**
   * recommended-distinct: [data-recommended] card has visual distinction.
   */
  'recommended-distinct'(document, cssRules, args) {
    // Check if any rule specifically targets [data-recommended]
    const hasRule = cssRules.some(r =>
      r.selector.includes('[data-recommended]') &&
      Object.keys(r.properties).length > 0 &&
      // Must have actual visual distinction (not just inherited)
      (r.properties['background'] || r.properties['background-color'] ||
       r.properties['border'] || r.properties['border-color'] ||
       r.properties['box-shadow'] || r.properties['transform'])
    );
    return {
      pass: hasRule,
      detail: hasRule
        ? 'Recommended card has distinct styling'
        : 'No distinct styling for [data-recommended]'
    };
  },

  /**
   * font-size-varies: Check that font-size values vary across matching elements.
   * Used for CU dashboard to verify metric values DON'T have hierarchy.
   */
  'font-size-uniform'(document, cssRules, args) {
    return checks['spacing-uniform'](document, cssRules, [...args, 'font-size'].slice(0, 2));
  },
};

// ── Helpers ──────────────────────────────────────────────────

/**
 * Extract font-size in rem for a selector from CSS rules.
 */
function getFontSizeRem(cssRules, selector) {
  for (const rule of cssRules) {
    if (selectorMatches(rule.selector, selector) && rule.properties['font-size']) {
      return parseSizeToRem(rule.properties['font-size']);
    }
  }
  return null;
}

/**
 * Convert CSS size value to rem (approximate).
 */
function parseSizeToRem(value) {
  if (value.endsWith('rem')) return parseFloat(value);
  if (value.endsWith('px')) return parseFloat(value) / 16;
  if (value.endsWith('em')) return parseFloat(value);
  return parseFloat(value) || null;
}

// ── Main ─────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node fixture-flaw-checker.js <fixture> <check> [args...]');
    process.exit(2);
  }

  const [fixturePath, checkName, ...checkArgs] = args;

  if (!checks[checkName]) {
    console.error(`Unknown check: ${checkName}`);
    console.error(`Available: ${Object.keys(checks).join(', ')}`);
    process.exit(2);
  }

  if (!fs.existsSync(fixturePath)) {
    console.error(`File not found: ${fixturePath}`);
    process.exit(2);
  }

  const html = fs.readFileSync(fixturePath, 'utf-8');
  const { document } = parseHTML(html);
  const cssText = extractCSS(document);
  const cssRules = parseRules(cssText);

  const result = checks[checkName](document, cssRules, checkArgs);
  console.log(JSON.stringify(result));
  process.exit(result.pass ? 0 : 1);
}

main();
