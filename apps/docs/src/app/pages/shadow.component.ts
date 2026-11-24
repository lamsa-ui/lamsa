import { Component, computed, signal } from '@angular/core';
import { css } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

@Component({
  selector: 'app-shadow',
  imports: [
    PageComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Shadow"
      lead="One shadow for everything that floats, and a backdrop behind what blocks the page."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Shadow</h2>
        <p>
          Only what floats has a shadow: lists, menus, popovers, dialogs,
          toasts. Cards stay flat.
        </p>
        <app-token-table label="Shadow tokens" [rows]="shadowRows" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the shadow</h2>
        <p>Offset and blur grow together; the colour stays the token.</p>
        <app-step
          label="Depth"
          [max]="16"
          [valuetext]="shadow()"
          [(value)]="depth"
        >
          <code>{{ shadow() }}</code>
        </app-step>

        <app-example
          title="A floating layer"
          description="Every menu, popover, dialog and toast reads --ui-shadow, so one override moves them all."
          [code]="shadowCode()"
        >
          <div class="doc-depth" [style.--ui-shadow]="shadowValue()">
            <div class="doc-depth__float">
              <p class="ui-card__title">Floating</p>
              <p>A menu, popover or dialog.</p>
            </div>
          </div>
        </app-example>
      </section>
    </app-page>
  `,
})
export class ShadowComponent {
  protected readonly shadowRows: TokenRow[] = [
    {
      token: '--ui-shadow',
      value: '0 8px 24px var(--ui-shadow-color)',
      use: 'Every floating layer, with a transparent border so high contrast keeps its edge.',
      tw: 'shadow-ui',
      previewClass: 'doc-token__box',
      preview: { 'box-shadow': 'var(--ui-shadow)' },
    },
    {
      token: '--ui-shadow-color',
      value: 'ink 18%, slate 40% on dark',
      use: 'A dark shadow is lost on a dark page, so dark mode casts a light slate glow.',
      previewClass: 'doc-token__chip',
      preview: { background: 'var(--ui-shadow-color)' },
    },
    {
      token: '--ui-backdrop',
      value: 'rgb(11 16 32 / 0.6)',
      use: 'Behind a dialog, drawer or bottom sheet.',
      tw: 'bg-backdrop',
      previewClass: 'doc-token__chip',
      preview: { background: 'var(--ui-backdrop)' },
    },
  ];

  /** Shadow depth: offset n px, blur 3n px; 8 is the default 0 8px 24px. */
  protected readonly depth = signal(8);
  protected readonly shadow = computed(
    () => `0 ${this.depth()}px ${this.depth() * 3}px`,
  );
  protected readonly shadowValue = computed(
    () => `${this.shadow()} var(--ui-shadow-color)`,
  );
  protected readonly shadowCode = computed(() =>
    css(`:root {\n  --ui-shadow: ${this.shadowValue()};\n}`),
  );
}
