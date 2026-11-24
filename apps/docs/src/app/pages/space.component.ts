import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { css, markup, type FrameworkCode } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

@Component({
  selector: 'app-space',
  imports: [
    PageComponent,
    CodeBlockComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Space"
      lead="One spacing scale for padding, margin and gap, one radius, two shared sizes."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Spacing</h2>
        <p>
          Quarters of a rem, the same step as Tailwind: <code>p-4</code> is
          <code>--ui-space-4</code>, 1rem.
        </p>
        <app-token-table label="Spacing tokens" [rows]="spaceRows" />
        <app-code-block [code]="usage" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Padding, margin and gap classes</h2>
        <p>
          Tailwind's classes read the kit's scale. Without Tailwind, the kit's
          own <code>ui-</code> classes do the same.
        </p>
        <app-token-table
          label="Padding, margin and gap classes"
          tokenHeading="Tailwind"
          valueHeading="Without Tailwind"
          useHeading="Sets"
          [rows]="utilities"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the classes</h2>
        <p>Every demo below and its code follow the slider.</p>
        <app-step
          label="Step"
          [max]="space.length - 1"
          [valuetext]="step().n + ', ' + step().rem"
          [(value)]="index"
        >
          <code>{{ step().tw }}</code> · {{ step().rem }} · {{ step().px }}px
        </app-step>

        <app-example
          title="Padding"
          [description]="
            'p-' + step().tw + ': space inside the box, on all four sides.'
          "
          [code]="demoCode('padding')"
        >
          <div class="doc-tint" [class]="'p-' + step().tw">
            <div class="doc-block">Content</div>
          </div>
        </app-example>

        <app-example
          title="Margin"
          [description]="
            'mb-' +
            step().tw +
            ' on the first box: space outside it, before the next one.'
          "
          [code]="demoCode('margin')"
        >
          <div class="doc-tint doc-tint--flow">
            <div class="doc-block" [class]="'mb-' + step().tw">First</div>
            <div class="doc-block">Second</div>
          </div>
        </app-example>

        <app-example
          title="Gap"
          [description]="
            'gap-' +
            step().tw +
            ' on a flex or grid parent: the same space between every child, none at the edges.'
          "
          [code]="demoCode('gap')"
        >
          <div class="doc-tint flex flex-wrap" [class]="'gap-' + step().tw">
            @for (item of ['One', 'Two', 'Three', 'Four', 'Five']; track item) {
              <div class="doc-block">{{ item }}</div>
            }
          </div>
        </app-example>

        <app-example
          title="Start flips in Arabic"
          [description]="
            'ps-' +
            step().tw +
            ' is padding on the start side: the left in English, the right in Arabic.'
          "
          [code]="demoCode('start')"
          [rtl]="true"
        >
          <div class="doc-tint" [class]="'ps-' + step().tw">
            <div class="doc-block">المحتوى</div>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Radius</h2>
        <p>Every radius is worked out from <code>--ui-radius</code>.</p>
        <app-token-table label="Radius tokens" [rows]="radiusRows" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the radius</h2>
        <p>Set <code>--ui-radius</code>; real components follow.</p>
        <app-step
          label="Base radius"
          [max]="radiusSteps.length - 1"
          [valuetext]="radius()"
          [(value)]="radiusIndex"
        >
          <code>{{ radius() }}</code> · {{ radiusPx() }}px
        </app-step>

        <app-example
          title="One token re-shapes the kit"
          description="Button, field and badge take the base; the card takes double."
          [code]="radiusCode()"
        >
          <div class="doc-swatches" [style]="radiusStyle()">
            <div class="ui-card">
              <p class="ui-card__title">Order</p>
              <div class="ui-field">
                <label class="ui-field__label" for="radius-demo-input"
                  >Coupon</label
                >
                <input
                  id="radius-demo-input"
                  class="ui-input"
                  value="LAMSA10"
                />
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button class="ui-button ui-button--primary" type="button">
                  Apply
                </button>
                <span class="ui-badge ui-badge--success">Saved</span>
              </div>
            </div>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Sizes</h2>
        <p>Two sizes every control and row of buttons shares.</p>
        <app-token-table label="Size tokens" [rows]="sizeRows" />
      </section>
    </app-page>
  `,
})
export class SpaceComponent {
  protected readonly space = [
    ['0', 'Reset a default margin or padding.'],
    ['0-5', 'Badge padding, an icon nudged into line with text.'],
    ['1', 'Inside lists and menus, between an icon and its label.'],
    ['1-5', 'Between a label, its control and its hint.'],
    ['2', 'Between buttons in a row (--ui-gap).'],
    ['2-5', 'Textarea and badge padding.'],
    ['3', 'Inside a control, between the items of a list.'],
    ['4', 'Between fields in a form, around a dialog on small screens.'],
    ['5', 'Between groups of fields.'],
    ['6', 'Card and dialog padding.'],
    ['7', 'Large card padding.'],
    ['8', 'Empty states, between blocks inside a section.'],
    ['10', 'Between sections on small screens.'],
    ['12', 'Between sections.'],
    ['16', 'Above and below a page header.'],
    ['20', 'Between bands of a landing page.'],
    ['24', 'Hero padding.'],
    ['32', 'Hero padding on wide screens.'],
  ].map(([n, use]) => {
    const quarters = Number(n.replace('-', '.'));
    return {
      n,
      use,
      /** Tailwind writes a half step with a dot: 0.5, not 0-5. */
      tw: n.replace('-', '.'),
      rem: quarters ? `${quarters / 4}rem` : '0',
      px: quarters * 4,
    };
  });

  protected readonly spaceRows: TokenRow[] = this.space.map((s) => ({
    token: `--ui-space-${s.n}`,
    value: `${s.rem} · ${s.px}px`,
    use: s.use,
    tw: `p-${s.tw} · gap-${s.tw}`,
    previewClass: 'doc-space__bar',
    preview: { 'inline-size': `var(--ui-space-${s.n})` },
  }));

  protected readonly radii = [
    {
      token: '--ui-radius-none',
      value: '0',
      use: 'Square: a drawer against the screen edge, the foot of a bottom sheet.',
    },
    {
      token: '--ui-radius-xs',
      value: '0.125rem',
      use: 'Hairline details. No component uses it yet.',
    },
    { token: '--ui-radius-sm', value: '0.25rem', use: 'Skeleton text lines.' },
    {
      token: '--ui-radius-md',
      value: '0.375rem',
      use: 'Items inside a list or menu (smaller than the list around them), tooltips.',
    },
    {
      token: '--ui-radius',
      value: '0.5rem',
      use: 'The base: buttons, fields, lists, menus, popovers, alerts.',
    },
    {
      token: '--ui-radius-lg',
      value: '0.75rem',
      use: 'Medium panels of your own. No component uses it yet.',
    },
    {
      token: '--ui-radius-xl',
      value: '1rem',
      use: 'Cards, dialogs and the top of a bottom sheet.',
    },
    {
      token: '--ui-radius-2xl',
      value: '1.5rem',
      use: 'Large panels of your own. No component uses it yet.',
    },
    {
      token: '--ui-radius-full',
      value: '9999px',
      use: 'Pills and circles: badges, switches, spinners, progress bars, round icons.',
    },
  ];

  protected readonly radiusRows: TokenRow[] = this.radii.map((r) => ({
    token: r.token,
    value: r.value,
    use: r.use,
    tw:
      'rounded-' +
      (r.token === '--ui-radius' ? 'ui' : r.token.replace('--ui-radius-', '')),
    previewClass: 'doc-token__box',
    preview: { 'border-radius': `var(${r.token})` },
  }));

  protected readonly sizeRows: TokenRow[] = [
    {
      token: '--ui-control-height',
      value: '2.75rem · 44px',
      use: 'Smallest touch target: buttons, fields, list items, tabs. Large buttons take 3.25rem.',
      tw: 'min-h-11',
      previewClass: 'doc-token__box',
      preview: { 'block-size': 'var(--ui-control-height)' },
    },
    {
      token: '--ui-gap',
      value: 'var(--ui-space-2)',
      use: 'Between buttons in a row and items in a group.',
      tw: 'gap-2',
      previewClass: 'doc-space__bar',
      preview: { 'inline-size': 'var(--ui-gap)' },
    },
  ];

  /** Base radius choices in rem, 0 to 1.5 in eighths; starts at the default 0.5rem. */
  protected readonly radiusSteps = Array.from({ length: 13 }, (_, i) => i / 8);
  protected readonly radiusIndex = signal(4);
  protected readonly radius = computed(() => {
    const rem = this.radiusSteps[this.radiusIndex()];
    return rem ? `${rem}rem` : '0';
  });
  protected readonly radiusPx = computed(
    () => this.radiusSteps[this.radiusIndex()] * 16,
  );
  /** The scale is worked out on :root, so a nested override has to repeat it. */
  protected readonly radiusStyle = computed(() => {
    const r = this.radius();
    return {
      '--ui-radius': r,
      '--ui-radius-xs': `calc(${r} / 4)`,
      '--ui-radius-sm': `calc(${r} / 2)`,
      '--ui-radius-md': `calc(${r} * 0.75)`,
      '--ui-radius-lg': `calc(${r} * 1.5)`,
      '--ui-radius-xl': `calc(${r} * 2)`,
      '--ui-radius-2xl': `calc(${r} * 3)`,
    };
  });
  protected readonly radiusCode = computed(() =>
    css(`:root {\n  --ui-radius: ${this.radius()};\n}`),
  );

  /** The step every demo uses; starts at --ui-space-4. */
  protected readonly index = signal(7);
  protected readonly step = computed(() => this.space[this.index()]);

  protected demoCode(
    demo: 'padding' | 'margin' | 'gap' | 'start',
  ): FrameworkCode {
    const n = this.step().tw;
    return markup(
      {
        padding: `<div class="p-${n}">Content</div>`,
        margin: `<div class="mb-${n}">First</div>\n<div>Second</div>`,
        gap: `<div class="flex flex-wrap gap-${n}">\n  <div>One</div>\n  <div>Two</div>\n  <div>Three</div>\n</div>`,
        start: `<div dir="rtl" lang="ar">\n  <div class="ps-${n}">المحتوى</div>\n</div>`,
      }[demo],
    );
  }

  protected readonly utilities: TokenRow[] = [
    ['p', 'm', 'Padding or margin on all four sides.'],
    ['px', 'mx', 'Start and end.'],
    ['py', 'my', 'Top and bottom.'],
    ['pt', 'mt', 'Top.'],
    ['pb', 'mb', 'Bottom.'],
    ['ps', 'ms', 'Start: left in English, right in Arabic.'],
    ['pe', 'me', 'End: right in English, left in Arabic.'],
    ['gap', '', 'Between children of a flex or grid, both ways.'],
    ['gap-x', '', 'Between columns.'],
    ['gap-y', '', 'Between rows.'],
  ].map(([a, b, use]) => ({
    token: `${a}-4` + (b ? ` · ${b}-4` : ''),
    value: `ui-${a}-4` + (b ? ` · ui-${b}-4` : ''),
    use,
  }));

  protected readonly usage =
    markup(`<section class="ui-card mb-12 grid gap-4 p-6">
  <h2 class="head-sm">Order summary</h2>
  <div class="flex py-2">
    <span>Delivery</span>
    <span class="ms-auto">EGP 45</span>
  </div>
</section>`);
}
