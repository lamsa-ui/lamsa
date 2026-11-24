import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { markup } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';
import { StepComponent } from '../shared/step.component';
import {
  TokenTableComponent,
  type TokenRow,
} from '../shared/token-table.component';

const styles = [
  ['head-3xl', '2.25–3.5rem / 1.1', 'Landing hero.'],
  ['head-2xl', '2–2.75rem / 1.15', 'Page title.'],
  ['head-xl', '1.625–2rem / 1.2', 'Big section.'],
  ['head-lg', '1.75rem / 1.25', 'Section.'],
  ['head-md', '1.5rem / 1.3', 'Sub-section.'],
  ['head-sm', '1.25rem / 1.3', 'Card or dialog title.'],
  ['head-xs', '1.125rem / 1.4', 'Group or list header.'],
  ['head-2xs', '1rem / 1.4', 'Smallest headline.'],
  ['body-lg', '1.25rem / 1.5', 'Lead paragraph.'],
  ['body-md', '1rem / 1.5', 'Body text and controls.'],
  ['body-sm', '0.875rem / 1.5', 'Hints and captions only.'],
].map(([name, size, use]) => ({ name, size, use }));

@Component({
  selector: 'app-typography',
  imports: [
    PageComponent,
    CodeBlockComponent,
    ExampleComponent,
    StepComponent,
    TokenTableComponent,
  ],
  template: `
    <app-page
      title="Typography"
      lead="Five free faces, shipped in the package. Every stack is Latin then Arabic."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Families</h2>
        <p>Headlines, body and labels each have one stack.</p>
        <app-token-table label="Font families" [rows]="families" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Type styles</h2>
        <p>
          One class sets face, weight, size and line height, and takes variants:
          <code>head-lg md:head-2xl</code>. Without Tailwind, add
          <code>ui-</code>: <code>ui-head-lg</code>.
        </p>
        <app-token-table label="Type styles" [rows]="styleRows" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Try the scale</h2>
        <p>The same line in English and Arabic, at every step.</p>
        <app-step
          label="Style"
          [max]="styles.length - 1"
          [valuetext]="style().name + ', ' + style().size"
          [(value)]="index"
        >
          <code>{{ style().name }}</code> · {{ style().size }}
        </app-step>

        <app-example
          [title]="style().name"
          [description]="style().use"
          [code]="demoCode()"
        >
          <div class="doc-type-demo">
            <p [class]="style().name" lang="en" dir="ltr">
              Code nobody dares to touch
            </p>
            <p [class]="style().name" lang="ar" dir="rtl">
              الكود اللي محدش بيجرؤ يلمسه
            </p>
          </div>
        </app-example>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Body weights</h2>
        <p>Tailwind's weights on a body style; heads stay ExtraBold.</p>
        <app-token-table
          label="Body weights"
          tokenHeading="Without Tailwind"
          [rows]="weights"
        />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Size tokens</h2>
        <p>Sizes alone, for inside a control where a style does not fit.</p>
        <app-token-table label="Size tokens" [rows]="sizes" />
        <app-code-block [code]="usage" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Rules</h2>
        <ul class="doc-list">
          <li>
            Body text never under 1rem; <code>body-sm</code> is hints only.
          </li>
          <li>Pick the class by look, the h1–h6 by the outline.</li>
          <li>Arabic is never letter-spaced or set in italics.</li>
        </ul>
      </section>
    </app-page>
  `,
})
export class TypographyComponent {
  protected readonly styles = styles;

  protected readonly families: TokenRow[] = [
    {
      token: '--ui-font-display',
      value: 'Archivo Expanded · Alexandria',
      use: 'Headlines, ExtraBold.',
      tw: 'font-display',
    },
    {
      token: '--ui-font',
      value: 'IBM Plex Sans · IBM Plex Sans Arabic',
      use: 'Body and controls. The page default.',
      tw: 'font-sans',
    },
    {
      token: '--ui-font-mono',
      value: 'IBM Plex Mono · IBM Plex Sans Arabic',
      use: 'Labels, upper case: class ui-label.',
      tw: 'font-mono',
    },
  ].map((r) => ({
    ...r,
    previewText: 'Aa أب',
    preview: { 'font-family': `var(${r.token})`, 'font-size': '1.25rem' },
  }));

  protected readonly styleRows: TokenRow[] = styles.map((s) => ({
    token: `--ui-${s.name}`,
    value: s.size,
    use: s.use,
    tw: s.name,
    previewClass: `ui-${s.name}`,
    previewText: 'Aa',
  }));

  protected readonly weights: TokenRow[] = [
    ['', '400', 'Regular: body text.', 'body-md'],
    ['-m', '500', 'Medium: labels in a form.', 'body-md font-medium'],
    ['-s', '600', 'SemiBold: totals, a key figure.', 'body-md font-semibold'],
    ['-b', '700', 'Bold: a word that must stand out.', 'body-md font-bold'],
  ].map(([suffix, value, use, tw]) => ({
    token: `ui-body-md${suffix}`,
    value,
    use,
    tw,
    previewClass: `ui-body-md${suffix}`,
    previewText: 'Total 1,240 EGP',
  }));

  protected readonly sizes: TokenRow[] = [
    ['--ui-text-3xl', '2.75rem', 'Page headline.', 'text-3xl'],
    ['--ui-text-2xl', '2rem', 'Section headline.', 'text-2xl'],
    ['--ui-text-xl', '1.5rem', 'Sub-section headline.', 'text-xl'],
    ['--ui-text-lg', '1.25rem', 'Lead paragraph, dialog title.', 'text-lg'],
    ['--ui-font-size', '1rem', 'Body text and controls.', 'text-base'],
    ['--ui-text-sm', '0.875rem', 'Hints, captions, labels.', 'text-sm'],
  ].map(([token, value, use, tw]) => ({
    token,
    value,
    use,
    tw,
    previewText: 'Aa',
    preview: { 'font-size': `var(${token})`, 'line-height': '1' },
  }));

  /** Starts at body-md. */
  protected readonly index = signal(9);
  protected readonly style = computed(() => styles[this.index()]);
  protected readonly demoCode = computed(() =>
    markup(`<h2 class="${this.style().name}">Code nobody dares to touch</h2>`),
  );

  protected readonly usage = markup(`<article class="ui-card">
  <h3 class="head-sm">March</h3>
  <p class="body-md font-semibold">3 orders · 1,240 EGP</p>
  <p class="body-sm text-text-muted">Refunds show after 5 working days.</p>
</article>`);
}
