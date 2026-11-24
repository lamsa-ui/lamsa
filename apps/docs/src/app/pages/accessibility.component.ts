import { Component, inject } from '@angular/core';
import { DocsSettings } from '../shared/docs-settings';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-accessibility',
  imports: [PageComponent],
  template: `
    <app-page
      title="Accessibility statement"
      lead="Lamsa is built so that everyone can use what is made with it: with a keyboard, a screen reader, high contrast, zoom or a small phone, in Arabic and in English. This page says what we aim for, how we check it, and what is not done yet."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What we aim for</h2>
        <ul class="doc-list">
          <li>
            Every component meets the
            <a href="https://www.w3.org/TR/WCAG22/">
              Web Content Accessibility Guidelines (WCAG) 2.2</a
            >
            at level AA, in light and dark, left to right and right to left.
          </li>
          <li>
            Text goes further than AA: it reaches 7:1 contrast against its
            background in both themes (level AAA). Borders, focus rings and
            controls reach 3:1.
          </li>
          <li>
            Colour never carries meaning alone, every control works with the
            keyboard alone, and focus is always visible.
          </li>
          <li>
            Each component follows the matching
            <a href="https://www.w3.org/WAI/ARIA/apg/">
              WAI-ARIA Authoring Practices</a
            >
            pattern, or uses the native HTML element when one exists.
            @switch (settings.framework()) {
              @case ('angular') {
                Angular components are built on the Angular CDK.
              }
              @case ('react') {
                React components are built on React Aria.
              }
              @case ('vue') {
                Vue overlays, menus, dates and trees are built on Reka UI.
              }
              @case ('html') {
                Plain HTML gives you the classes and the markup; the keyboard
                script for tabs, menus and other widgets is yours to add, as
                each page says.
              }
            }
          </li>
          <li>
            Touch targets are at least 24 by 24 pixels, the WCAG 2.2 minimum,
            and buttons and fields are 44 pixels tall or more.
          </li>
          <li>
            Motion stops when the system asks for reduced motion, and every
            control keeps its edges and states in Windows high contrast.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">How we check it</h2>
        <ul class="doc-list">
          <li>
            A contrast test measures every colour pair of both themes; the build
            fails below the target.
          </li>
          <li>
            On every push, axe-core checks every page of this site in light and
            dark and in each framework's view, and again with dialogs, menus,
            popovers, tooltips and toasts open. Any problem fails the build.
          </li>
          <li>
            Unit tests check each component's roles, names, states and keys.
          </li>
          <li>
            By hand: keyboard only, Windows high contrast (forced colours), and
            reflow at 320 pixels wide.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Not done yet</h2>
        <ul class="doc-list">
          <li>
            Testing with real screen readers: NVDA and JAWS on Windows,
            VoiceOver on macOS and iOS, TalkBack on Android, including Arabic
            voices. Automated checks catch only part of what a screen reader
            user meets.
          </li>
          <li>
            The audit with dialogs, menus and popups open covers the Angular and
            HTML views only. React and Vue pages are audited in their resting
            state.
          </li>
          <li>
            Tooltips never show on touch screens, so nothing needed may live
            only in a tooltip.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What stays with your app</h2>
        <p>
          A component can only be as accessible as the page around it. Your app
          still needs to:
        </p>
        <ul class="doc-list">
          <li>
            set <code>lang</code> and <code>dir</code> on the
            <code>html</code> element, and change them with the language;
          </li>
          <li>give each page its own title and one main heading;</li>
          <li>write text alternatives for its images, and real labels;</li>
          <li>
            keep 7:1 for text and 3:1 for borders if it re-brands the colours.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Tell us</h2>
        <p>
          If something is hard or impossible to use, please
          <a href="https://github.com/lamsa-ui/lamsa/issues">
            open an issue on GitHub</a
          >
          and say which component, which browser, and which assistive
          technology.
        </p>
        <p class="doc-muted">
          Written on <time datetime="2026-11-19">19 November 2026</time>, and
          reviewed with every release.
        </p>
      </section>
    </app-page>
  `,
})
export class AccessibilityComponent {
  protected readonly settings = inject(DocsSettings);
}
