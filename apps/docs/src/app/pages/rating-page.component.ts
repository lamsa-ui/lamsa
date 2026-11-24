import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-rating-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    RatingComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Rating"
      lead="Stars out of five, to pick a score or to show one. Picking uses real radio buttons, so Tab reaches the stars, arrow keys move between them and a screen reader says 3 stars, 3 of 5. Filled stars are solid and empty ones an outline, so the shape tells them apart, not only colour."
      [usage]="usage"
    >
      <app-example title="Pick a score" [code]="pick">
        <ui-rating label="How was the food?" [formControl]="food" />
      </app-example>

      <app-example
        title="Show a score"
        description="Read as one image with the score in words. A score with a fraction fills to the nearest star; the words keep the exact number."
        [code]="show"
      >
        <div class="flex items-center gap-2">
          <ui-rating [value]="4.6" readonly />
          <span class="text-text-muted">4.6 from 212 orders</span>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-rating
          label="ما رأيك في الأكل؟"
          [starLabel]="starArabic"
          [formControl]="foodArabic"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class RatingPageComponent {
  protected readonly food = new FormControl<number | null>(null);
  protected readonly foodArabic = new FormControl<number | null>(4);
  protected readonly starArabic = (n: number) =>
    n === 1
      ? 'نجمة واحدة'
      : n === 2
        ? 'نجمتان'
        : `${n.toLocaleString('ar-EG')} نجوم`;

  protected readonly usage = {
    angular: `import { RatingComponent } from '@lamsa-ui/angular';
// The value is a number, or null before a pick. Works with formControlName, [formControl] and ngModel.`,
    react: `import { Rating } from '@lamsa-ui/react';`,
    vue: `import { Rating } from '@lamsa-ui/vue';`,
    html: `<fieldset class="ui-rating">...</fieldset>`,
  };

  protected readonly pick = {
    angular: `<ui-rating label="How was the food?" formControlName="food" />`,
    react: `<Rating label="How was the food?" value={food} onChange={setFood} />`,
    vue: `<Rating label="How was the food?" v-model="food" />`,
    html: `<fieldset class="ui-rating">
  <legend class="ui-field__label">How was the food?</legend>
  <span class="ui-rating__stars">
    <label class="ui-rating__star">
      <input type="radio" name="food" value="1" class="ui-visually-hidden" />
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
      <span class="ui-visually-hidden">1 star</span>
    </label>
    <!-- … one label per star, up to 5 -->
  </span>
</fieldset>`,
  };

  protected readonly show = {
    angular: `<ui-rating [value]="4.6" readonly />
<span>4.6 from 212 orders</span>`,
    react: `<Rating value={4.6} readOnly />
<span>4.6 from 212 orders</span>`,
    vue: `<Rating :value="4.6" readOnly />
<span>4.6 from 212 orders</span>`,
    html: `<span class="ui-rating ui-rating--readonly" role="img" aria-label="4.6 out of 5 stars">
  <span class="ui-rating__stars">
    <span class="ui-rating__star ui-rating__star--on"><svg viewBox="0 0 24 24"><path d="…same star…" /></svg></span>
    <!-- … --on on the first 5 (rounded), plain on the rest -->
  </span>
</span>`,
  };

  protected readonly arabic = {
    angular: `<ui-rating label="ما رأيك في الأكل؟" [starLabel]="star" formControlName="food" />

star = (n: number) => n === 1 ? 'نجمة واحدة' : n === 2 ? 'نجمتان' : \`\${n.toLocaleString('ar-EG')} نجوم\`;`,
    react: `<Rating label="ما رأيك في الأكل؟" starLabel={star} value={food} onChange={setFood} />`,
    vue: `<Rating label="ما رأيك في الأكل؟" :starLabel="star" v-model="food" />`,
    html: `<!-- dir="rtl" on the page: the stars run from the right -->
<span class="ui-visually-hidden">٣ نجوم</span>`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description:
        'Names the stars, as the fieldset legend. Required when people pick.',
    },
    {
      name: 'max',
      type: 'number',
      default: '5',
      description: 'How many stars.',
    },
    {
      name: 'starLabel',
      type: '(stars: number) => string',
      default: '`${n} stars` from labels',
      description:
        'The name of one star, read by screen readers. Translate it.',
    },
    {
      name: 'scoreLabel',
      type: '(value, max) => string',
      default: '`${v} out of ${m} stars` from labels',
      description: 'The read-only score in words. Translate it.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'An exact number',
      use: 'Number field',
      path: '/components/number-field',
    },
    {
      need: 'Show a score the reader cannot change',
      use: 'Meter',
      path: '/components/meter',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        description: 'Only shows [value]; nothing to pick.',
      },
      {
        name: 'value',
        type: 'number',
        description:
          'The score to show when readonly. A form control sets it otherwise.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'readOnly',
        type: 'boolean',
        default: 'false',
        description: 'Only shows value; nothing to pick.',
      },
      {
        name: 'value | defaultValue',
        type: 'number | null',
        description: 'Controlled or starting score.',
      },
      {
        name: 'onChange',
        type: '(value: number) => void',
        description: 'Called with the picked number of stars.',
      },
      {
        name: 'name | disabled',
        type: 'string | boolean',
        description: 'Passed to the radios and the fieldset.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'readOnly',
        type: 'boolean',
        default: 'false',
        description: 'Shows a score as stars, for reading only.',
      },
      {
        name: 'v-model',
        type: 'number | null',
        description: 'The score.',
      },
      {
        name: 'name | disabled',
        type: 'string | boolean',
        description: 'For the radios underneath.',
      },
      {
        name: '@blur',
        type: 'event',
        description: 'When focus leaves a star.',
      },
    ],
    html: [
      {
        name: 'ui-rating',
        type: 'class',
        description:
          'On the fieldset, or on the read-only span with role="img".',
      },
      {
        name: 'ui-rating__star',
        type: 'class',
        description: 'One label per star, holding a hidden radio and its name.',
      },
      {
        name: 'ui-rating--readonly | ui-rating__star--on',
        type: 'class',
        description: 'Read-only score, and the stars it fills.',
      },
    ],
  };
}
