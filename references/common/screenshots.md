# Screenshot Strategy

High-resolution section-level captures instead of tiny full-page images.

## Landmark Detection

Find semantic landmarks via `agent-browser eval --stdin`:

```bash
agent-browser eval --stdin <<'JS'
(() => {
  const selectors = 'section, header, main, footer, article, [role="banner"], [role="main"], [role="contentinfo"]';
  const elements = [...document.querySelectorAll(selectors)]
    .filter(el => el.offsetHeight > 50 && el.offsetWidth > 100);
  return JSON.stringify({
    count: elements.length,
    sections: elements.map((el, i) => ({
      index: i,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      className: (el.className || '').toString().split(' ').slice(0, 3).join(' '),
      height: el.offsetHeight,
      top: el.getBoundingClientRect().top + window.scrollY
    }))
  });
})()
JS
```

## Fixed/Sticky Element Handling

Before any `--full` (full-page) capture, detect and temporarily hide fixed/sticky elements that would otherwise float in the middle of the stitched image.

### Detection Probe

```bash
agent-browser eval --stdin <<'JS'
(() => {
  const fixed = [];
  document.querySelectorAll('*').forEach(el => {
    const style = getComputedStyle(el);
    if ((style.position === 'fixed' || style.position === 'sticky') &&
        el.offsetHeight > 30 && el.offsetWidth > 100) {
      fixed.push({
        selector: el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className ? '.' + el.className.toString().split(' ')[0] : ''),
        position: style.position,
        height: el.offsetHeight,
        width: el.offsetWidth,
        tag: el.tagName.toLowerCase()
      });
    }
  });
  return JSON.stringify({ count: fixed.length, elements: fixed });
})()
JS
```

Store result as `FIXED_ELEMENTS`.

### Mitigation (for `--full` captures only)

If `FIXED_ELEMENTS.count > 0`:

**Before capture:**
```bash
agent-browser eval --stdin <<'JS'
(() => {
  const fixedEls = document.querySelectorAll('*');
  const hidden = [];
  fixedEls.forEach(el => {
    const style = getComputedStyle(el);
    if ((style.position === 'fixed' || style.position === 'sticky') &&
        el.offsetHeight > 30 && el.offsetWidth > 100) {
      el.dataset.dlOriginalVisibility = el.style.visibility;
      el.style.visibility = 'hidden';
      hidden.push(el.tagName);
    }
  });
  return JSON.stringify({ hidden_count: hidden.length });
})()
JS
```

**After capture — restore immediately:**
```bash
agent-browser eval --stdin <<'JS'
(() => {
  document.querySelectorAll('[data-dl-original-visibility]').forEach(el => {
    el.style.visibility = el.dataset.dlOriginalVisibility || '';
    delete el.dataset.dlOriginalVisibility;
  });
  return 'restored';
})()
JS
```

**Important:** Only apply to `--full` captures. Viewport-sized captures should keep fixed elements visible (they appear correctly in viewport shots).

## Decision: NODE MODE vs SCROLL MODE

- **>= 3 landmarks found → NODE MODE**: For each section, scroll it into view and take an annotated viewport screenshot.

  Scroll each section into view:
  ```bash
  agent-browser eval "document.querySelectorAll('section, header, main, footer, article')[N].scrollIntoView({block:'start',behavior:'instant'})"
  ```
  Then capture with annotated element labels:
  ```bash
  agent-browser screenshot section-N.png --annotate
  ```
  The `--annotate` flag overlays numbered labels on interactive elements — these correspond to `@e` refs and give richer context for scoring. Use `Read` tool to view the saved image.

- **< 3 landmarks → SCROLL MODE**: Take viewport-sized screenshots stepping down the page with 30% overlap.
  ```bash
  agent-browser eval --stdin <<'JS'
  (() => {
    const totalHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const step = Math.floor(viewportHeight * 0.7);
    const positions = [];
    for (let y = 0; y < totalHeight; y += step) {
      positions.push(y);
    }
    return JSON.stringify({ totalHeight, viewportHeight, step, positions });
  })()
  JS
  ```
  For each position: `agent-browser eval "window.scrollTo(0, <position>)"` then `agent-browser screenshot scroll-N.png --annotate`. Use `Read` tool to view the saved image.

## Overview Shot

**Always take 1 overview shot** at the default viewport (no scroll) for context:
```bash
agent-browser screenshot overview.png --annotate
```
Use `Read` tool to view the saved image.

## Responsive Pass

After completing the desktop screenshots, cycle through a mobile viewport:

```bash
agent-browser set viewport 375 667
agent-browser screenshot mobile-overview.png --annotate
agent-browser set viewport 1440 900
```

Use `Read` tool to view the mobile screenshot. Flag any responsive breakage (overflow, stacked elements colliding, text too small) as Polish issues.

## State Discovery (when DISCOVER_STATES=true)

After initial screenshots, discover interactive states within the page. Run a JS probe via `agent-browser eval --stdin`:

```bash
agent-browser eval --stdin <<'JS'
(() => {
  const states = { tabs: [], modals: [], navItems: [], accordions: [] };

  // Tab panels
  document.querySelectorAll('[role="tablist"] [role="tab"], [data-state], [aria-selected]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
    const isActive = el.getAttribute('aria-selected') === 'true'
      || el.getAttribute('data-state') === 'active'
      || el.classList.contains('active');
    if (label) {
      states.tabs.push({
        label,
        selector: el.id ? '#' + el.id : `[role="tab"]:nth-child(${Array.from(el.parentElement.children).indexOf(el) + 1})`,
        active: isActive
      });
    }
  });

  // Navigation items
  document.querySelectorAll('nav a, [role="navigation"] a, [data-screen]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
    const href = el.getAttribute('href') || '';
    if (label && !states.navItems.find(n => n.label === label)) {
      states.navItems.push({ label, href, selector: el.id ? '#' + el.id : null });
    }
  });

  // Modals/drawers
  document.querySelectorAll('[aria-haspopup], [data-dialog-trigger], [data-modal-trigger]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
    if (label) {
      states.modals.push({
        trigger: el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
        label
      });
    }
  });

  // Accordions/collapsibles
  document.querySelectorAll('details > summary, [role="button"][aria-expanded]').forEach(el => {
    const label = el.textContent?.trim().slice(0, 50) || '';
    if (label) {
      states.accordions.push({ label, expanded: el.parentElement?.open || el.getAttribute('aria-expanded') === 'true' });
    }
  });

  const total = states.tabs.length + states.modals.length + states.navItems.length + states.accordions.length;
  return JSON.stringify({ ...states, totalStates: total });
})()
JS
```

Store the result as `DISCOVERED_STATES`.

If `totalStates > 0`, iterate through each discovered state:

```
For each inactive tab:
  1. Click: agent-browser eval "document.querySelector('<selector>').click()"
  2. Wait: agent-browser wait 500
  3. Screenshot using node/scroll strategy — name: state-tab-<label>-section-N.png
  4. Return to default state by clicking the originally-active tab

For each modal trigger:
  1. Click trigger
  2. Wait 800ms for animation
  3. Screenshot: agent-browser screenshot state-modal-<label>.png --annotate
  4. Close: click dismiss button or press Escape
  5. Wait 500ms

For each collapsed accordion:
  1. Click to expand
  2. Screenshot
  3. Click to collapse (restore state)
```

All state screenshots feed into scoring alongside default-view screenshots.
