// Runs the Phase 3.5 state discovery probe against an HTML fixture
// Usage: node tests/probe-runner.js <fixture.html>

const { parseHTML } = require('linkedom');
const fs = require('fs');

const htmlFile = process.argv[2];
if (!htmlFile) {
  console.error('Usage: node probe-runner.js <fixture.html>');
  process.exit(1);
}

const html = fs.readFileSync(htmlFile, 'utf-8');
const { document } = parseHTML(html);

// Phase 3.5 state discovery probe (exact copy from SKILL.md)
const states = { tabs: [], modals: [], navItems: [], accordions: [] };

document.querySelectorAll('[role="tablist"] [role="tab"], [data-state], [aria-selected]').forEach(el => {
  const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
  const isActive = el.getAttribute('aria-selected') === 'true'
    || el.getAttribute('data-state') === 'active'
    || el.classList.contains('active');
  if (label) {
    states.tabs.push({
      label,
      selector: el.id ? '#' + el.id : '[role="tab"]',
      active: isActive
    });
  }
});

document.querySelectorAll('nav a, [role="navigation"] a, [data-screen]').forEach(el => {
  const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
  const href = el.getAttribute('href') || '';
  if (label && !states.navItems.find(n => n.label === label)) {
    states.navItems.push({ label, href, selector: el.id ? '#' + el.id : null });
  }
});

document.querySelectorAll('[aria-haspopup], [data-dialog-trigger], [data-modal-trigger]').forEach(el => {
  const label = el.textContent?.trim().slice(0, 50) || el.getAttribute('aria-label') || '';
  if (label) {
    states.modals.push({
      trigger: el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
      label
    });
  }
});

document.querySelectorAll('details > summary, [role="button"][aria-expanded]').forEach(el => {
  const label = el.textContent?.trim().slice(0, 50) || '';
  if (label) {
    states.accordions.push({ label, expanded: false });
  }
});

const total = states.tabs.length + states.modals.length + states.navItems.length + states.accordions.length;
process.stdout.write(JSON.stringify({ ...states, totalStates: total }));
