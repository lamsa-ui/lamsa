import { Component, computed, signal } from '@angular/core';
import { markup } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

@Component({
  selector: 'app-focus',
  imports: [
    PageComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Focus"
      lead="One ring marks the keyboard on every control, 3:1 in both themes, for the keyboard only."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Tokens</h2>
        <p>Outside the edge on controls, inside it on list items.</p>
        <app-token-table label="Focus tokens" [rows]="rows" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the ring</h2>
        <p>
          Both placements follow the tokens; the inset one uses minus the width.
        </p>
        <app-step
          label="Width"
          [min]="1"
          [max]="6"
          [valuetext]="width() + ' pixels'"
          [(value)]="width"
          >{{ width() }}px</app-step
        >
        <app-step
          label="Offset"
          [max]="6"
          [valuetext]="offset() + ' pixels'"
          [(value)]="offset"
          >{{ offset() }}px</app-step
        >

        <app-example
          title="Outside and inset"
          description="A button gets the ring outside; a menu item gets it inside, so its neighbours never cover it."
          [code]="code()"
        >
          <div class="doc-focus" [style]="ringStyle()">
            <span
              class="ui-button ui-button--primary ui-button--md doc-ring"
              aria-hidden="true"
              >Save</span
            >
            <span class="doc-focus__list" aria-hidden="true">
              <span class="doc-focus__item">Orders</span>
              <span class="doc-focus__item doc-ring doc-ring--inset"
                >Invoices</span
              >
              <span class="doc-focus__item">Settings</span>
            </span>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>Dialogs take focus on open and hand it back on close.</li>
          <li>Lists keep focus on the control and ring the active option.</li>
          <li>
            A sticky header needs <code>scroll-padding-block-start</code> so it
            never hides focus.
          </li>
        </ul>
      </section>
    </app-page>
  `,
})
export class FocusComponent {
  protected readonly rows: TokenRow[] = [
    {
      token: '--ui-focus',
      value: '#0047cc · #8fb4ff',
      use: 'Ring colour, light and dark. 3:1 on the page.',
      tw: 'outline-focus',
      previewClass: 'doc-token__chip',
      preview: { background: 'var(--ui-focus)' },
    },
    {
      token: '--ui-focus-width',
      value: '3px',
      use: 'Ring thickness.',
      tw: 'focus-visible:focus-ring',
      previewClass: 'doc-token__box doc-ring',
    },
    {
      token: '--ui-focus-offset',
      value: '2px',
      use: 'Gap from the edge. Inset rings use minus the width.',
      tw: 'focus-visible:focus-ring-inset',
      previewClass: 'doc-token__box doc-ring doc-ring--inset',
    },
  ];

  protected readonly width = signal(3);
  protected readonly offset = signal(2);
  protected readonly ringStyle = computed(() => ({
    '--ui-focus-width': `${this.width()}px`,
    '--ui-focus-offset': `${this.offset()}px`,
  }));
  protected readonly code = computed(() =>
    markup(
      `<!-- The tokens: --ui-focus-width: ${this.width()}px; --ui-focus-offset: ${this.offset()}px -->
<button class="ui-button ui-button--primary">Save</button>
<a class="rounded-ui px-3 py-2 focus-visible:focus-ring" href="/orders">Orders</a>
<li class="px-3 focus-visible:focus-ring-inset" tabindex="-1">Invoices</li>`,
    ),
  );
}
