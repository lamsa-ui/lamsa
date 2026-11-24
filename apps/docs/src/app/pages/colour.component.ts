import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { css } from '../shared/docs-settings';
import { DocsSettings } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

/** The Tailwind class that reads a colour token: text-* for text colours, border-* for edges, bg-* for grounds. */
function twClass(token: string): string {
  const name = token.replace('--ui-', '');
  if (name === 'focus') return 'outline-focus';
  if (name === 'border' || name === 'divider') return `border-${name}`;
  if (name.startsWith('on-') || name.startsWith('text')) return `text-${name}`;
  return `bg-${name}`;
}

const chip = (token: string): Partial<TokenRow> => ({
  tw: twClass(token),
  previewClass: 'doc-token__chip',
  preview: { background: `var(${token})` },
});

const brand: TokenRow[] = [
  [
    '--ui-brand-blue',
    '#0059FF',
    'Logo and large fills. Primary in product UI.',
  ],
  ['--ui-brand-red', '#DC4B4B', 'Logo and large fills. Danger in product UI.'],
  ['--ui-ink', '#0B1020', 'Dark ground and text.'],
  ['--ui-paper', '#F6F7FB', 'Light ground.'],
  ['--ui-slate', '#586087', 'Labels, secondary text, borders.'],
].map(([token, value, use]) => ({ token, value, use, ...chip(token) }));

/** Light value, dark value, what for. Copied from packages/css/ui.css. */
const product: TokenRow[] = [
  ['--ui-bg', '#f6f7fb · #0b1020', 'The page.'],
  ['--ui-surface', '#ffffff · #151b30', 'Cards, fields, floating layers.'],
  ['--ui-text', '#0b1020 · #f6f7fb', 'Body text.'],
  ['--ui-text-muted', '#454c6e · #c9cee3', 'Hints and secondary text, 7:1.'],
  ['--ui-border', '#586087 · #9fa5c0', 'Field and control edges, 3:1.'],
  ['--ui-divider', '#e4e7f2 · #262d48', 'Lines between rows. Not an edge.'],
  ['--ui-primary', '#0047cc · #8fb4ff', 'The main action, links, selection.'],
  ['--ui-on-primary', '#ffffff · #0b1020', 'Text on primary.'],
  ['--ui-secondary', '#e4e7f2 · #232a45', 'Quiet buttons, tracks.'],
  ['--ui-on-secondary', '#0b1020 · #f6f7fb', 'Text on secondary.'],
  ['--ui-highlight', '#dbe6ff · #1d3a8a', 'Selected row, info badge.'],
  ['--ui-on-highlight', '#0b1020 · #f6f7fb', 'Text on highlight.'],
  ['--ui-focus', '#0047cc · #8fb4ff', 'The keyboard ring.'],
  ['--ui-danger', '#9a1d1d · #f2a3a3', 'Errors, destructive actions.'],
  ['--ui-on-danger', '#ffffff · #0b1020', 'Text on danger.'],
  ['--ui-danger-soft', '#fdeeee · #3a1418', 'Error alert and badge ground.'],
  ['--ui-success', '#14532d · #86efac', 'Done, saved, paid.'],
  ['--ui-on-success', '#ffffff · #0b1020', 'Text on success.'],
  ['--ui-success-soft', '#e3f5e9 · #0f2e1c', 'Success alert and badge ground.'],
  ['--ui-warning', '#7a3a0a · #fcd34d', 'Needs a look, not broken.'],
  ['--ui-on-warning', '#ffffff · #0b1020', 'Text on warning.'],
  ['--ui-warning-soft', '#fdf1dc · #33260a', 'Warning alert and badge ground.'],
  ['--ui-backdrop', 'rgb(11 16 32 / 0.6)', 'Behind a dialog, both themes.'],
].map(([token, value, use]) => ({ token, value, use, ...chip(token) }));

const pairs = [
  { name: 'Text on background', fg: 'text', bg: 'bg', min: 7 },
  { name: 'Text on surface', fg: 'text', bg: 'surface', min: 7 },
  { name: 'Muted text', fg: 'text-muted', bg: 'surface', min: 7 },
  { name: 'Primary', fg: 'on-primary', bg: 'primary', min: 7 },
  { name: 'Secondary', fg: 'on-secondary', bg: 'secondary', min: 7 },
  { name: 'Highlight', fg: 'on-highlight', bg: 'highlight', min: 7 },
  { name: 'Danger', fg: 'on-danger', bg: 'danger', min: 7 },
  { name: 'Danger, soft', fg: 'danger', bg: 'danger-soft', min: 7 },
  { name: 'Success', fg: 'on-success', bg: 'success', min: 7 },
  { name: 'Success, soft', fg: 'success', bg: 'success-soft', min: 7 },
  { name: 'Warning', fg: 'on-warning', bg: 'warning', min: 7 },
  { name: 'Warning, soft', fg: 'warning', bg: 'warning-soft', min: 7 },
  { name: 'Border on surface', fg: 'border', bg: 'surface', min: 3 },
  { name: 'Focus ring on background', fg: 'focus', bg: 'bg', min: 3 },
];

/** WCAG 2.x contrast of two computed `rgb(r, g, b)` colours. */
function contrast(a: string, b: string): number {
  const lum = (rgb: string) => {
    const [r, g, bl] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

@Component({
  selector: 'app-colour',
  imports: [
    PageComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Colour"
      lead="Two brand colours, three neutrals, and product shades tuned until small text reaches 7:1."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Brand</h2>
        <p>The core palette, as is: fills, the logo and large text only.</p>
        <app-token-table label="Brand colours" [rows]="brand" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Product tokens</h2>
        <p>Use these in product code, never a hex: dark mode follows.</p>
        <app-token-table label="Product colour tokens" [rows]="product" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Contrast, measured live</h2>
        <p>Each pair measured in the theme on screen: 7:1 text, 3:1 edges.</p>
        <div class="doc-pairs">
          @for (p of pairs; track p.name; let i = $index) {
            <div
              class="doc-pair"
              data-pair
              [style.background]="'var(--ui-' + p.bg + ')'"
              [style.color]="'var(--ui-' + p.fg + ')'"
            >
              <strong>{{ p.name }}</strong>
              <code>--ui-{{ p.fg }} on --ui-{{ p.bg }}</code>
              <strong
                >{{ ratios()[i] ?? '…' }}:1 ·
                {{ +(ratios()[i] ?? 0) >= p.min ? 'passes' : 'fails' }}
                {{ p.min }}:1</strong
              >
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try a primary colour</h2>
        <p>
          Re-brand with one token; the ratio says if small text still reads.
        </p>
        <app-step
          label="Hue"
          [max]="359"
          [valuetext]="hue() + ' degrees'"
          [(value)]="hue"
          >{{ hue() }}°</app-step
        >
        <app-step
          label="Lightness"
          [min]="10"
          [max]="70"
          [valuetext]="light() + ' percent'"
          [(value)]="light"
          >{{ light() }}%</app-step
        >

        <app-example
          title="One token re-colours every action"
          [description]="
            'White on ' +
            primary() +
            ': ' +
            primaryRatio() +
            ':1, ' +
            (+primaryRatio() >= 7 ? 'passes' : 'fails') +
            ' 7:1.'
          "
          [code]="primaryCode()"
        >
          <div class="doc-tint--row ui-gap-3" [style]="primaryStyle()">
            <button
              #primaryButton
              class="ui-button ui-button--primary"
              type="button"
            >
              Pay EGP 450
            </button>
            <button class="ui-button ui-button--secondary" type="button">
              Later
            </button>
            <label class="ui-switch">
              <input
                class="ui-switch__input"
                type="checkbox"
                role="switch"
                checked
              />
              Email receipt
            </label>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Brand blue and red: fills and large text only, never small text.
          </li>
          <li>Red means errors and destructive actions, nothing else.</li>
          <li>No hex in product code: <code>--ui-*</code> tokens only.</li>
        </ul>
      </section>
    </app-page>
  `,
})
export class ColourComponent {
  protected readonly brand = brand;
  protected readonly product = product;
  protected readonly pairs = pairs;
  protected readonly ratios = signal<string[]>([]);

  /** Starts near the shipped light primary, #0047cc. */
  protected readonly hue = signal(219);
  protected readonly light = signal(40);
  protected readonly primary = computed(
    () => `hsl(${this.hue()} 100% ${this.light()}%)`,
  );
  protected readonly primaryStyle = computed(() => ({
    '--ui-primary': this.primary(),
    '--ui-on-primary': '#ffffff',
  }));
  protected readonly primaryCode = computed(() =>
    css(
      `:root {\n  --ui-primary: ${this.primary()};\n  --ui-on-primary: #ffffff;\n}\n/* bg-primary, text-primary and every kit component follow */`,
    ),
  );
  protected readonly primaryRatio = signal('…');
  private readonly primaryButton =
    viewChild.required<ElementRef<HTMLElement>>('primaryButton');

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const settings = inject(DocsSettings);
    afterRenderEffect(() => {
      settings.theme();
      const rows = [...host.querySelectorAll<HTMLElement>('[data-pair]')];
      this.ratios.set(
        rows.map((row) => {
          const style = getComputedStyle(row);
          return contrast(style.color, style.backgroundColor).toFixed(1);
        }),
      );
    });
    afterRenderEffect(() => {
      this.primary();
      const style = getComputedStyle(this.primaryButton().nativeElement);
      this.primaryRatio.set(
        contrast(style.color, style.backgroundColor).toFixed(1),
      );
    });
  }
}
