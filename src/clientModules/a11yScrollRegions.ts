/**
 * WCAG 2.1.1: horizontally scrollable tables and code blocks must be reachable
 * by keyboard. After each route change, give overflowing regions tabindex=0
 * and an accessible name.
 */
import type {ClientModule} from '@docusaurus/types';

function enhance(): void {
  document.querySelectorAll<HTMLElement>('.markdown table, .markdown pre').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 1 && !el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', el.tagName === 'TABLE' ? 'Scrollable table' : 'Scrollable code block');
      }
    }
  });
}

const clientModule: ClientModule = {
  onRouteDidUpdate() {
    // wait for layout
    window.setTimeout(enhance, 300);
  },
};

export default clientModule;
