import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-slider-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    SliderComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Slider"
      lead="A value picked along a range, such as a price limit or a volume. It is the browser's own range input, so arrow keys, Page Up and Down, Home and End all move it, and the value is written beside the label. For an exact number, use a number field."
      [usage]="usage"
    >
      <app-example
        title="With a unit"
        description="format turns the number into what people read and hear, so a screen reader says EGP 500, not 500."
        [code]="basic"
      >
        <ui-slider
          class="doc-field"
          label="Price limit"
          hint="Only dishes under this price show."
          [max]="2000"
          [step]="50"
          [format]="egp"
          [formControl]="price"
        />
      </app-example>

      <app-example title="Disabled" [code]="disabled">
        <ui-slider class="doc-field" label="Volume" [formControl]="volume" />
      </app-example>

      <app-example
        title="In Arabic"
        description="The track fills from the right."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-slider
          class="doc-field"
          label="أقصى سعر"
          [max]="2000"
          [step]="50"
          [format]="egpArabic"
          [formControl]="priceArabic"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SliderPageComponent {
  protected readonly price = new FormControl(500, { nonNullable: true });
  protected readonly priceArabic = new FormControl(500, { nonNullable: true });
  protected readonly volume = new FormControl(
    { value: 40, disabled: true },
    { nonNullable: true },
  );
  protected readonly egp = (v: number) => `EGP ${v.toLocaleString('en')}`;
  protected readonly egpArabic = (v: number) =>
    `${v.toLocaleString('ar-EG')} جنيه`;

  protected readonly usage = {
    angular: `import { SliderComponent } from '@lamsa-ui/angular';
// The value is a number. Works with formControlName, [formControl] and ngModel.`,
    react: `import { Slider } from '@lamsa-ui/react';
// Every other prop goes to the input: step, name, disabled, ref.`,
    vue: `import { Slider } from '@lamsa-ui/vue';
// Every other prop goes to the input: step, name, disabled, ref.`,
    html: `<input type="range" class="ui-slider" />`,
  };

  protected readonly basic = {
    angular: `<ui-slider
  label="Price limit"
  hint="Only dishes under this price show."
  [max]="2000"
  [step]="50"
  [format]="egp"
  formControlName="price"
/>

egp = (v: number) => \`EGP \${v.toLocaleString('en')}\`;`,
    react: `<Slider
  label="Price limit"
  hint="Only dishes under this price show."
  max={2000}
  step={50}
  format={(v) => \`EGP \${v.toLocaleString('en')}\`}
  value={price}
  onChange={(e) => setPrice(Number(e.target.value))}
/>`,
    vue: `<Slider
  v-model="price"
  label="Price limit"
  hint="Only dishes under this price show."
  :max="2000"
  :step="50"
  :format="(v) => \`EGP \${v.toLocaleString('en')}\`"
/>`,
    html: `<div class="ui-field">
  <div class="ui-slider__head">
    <label class="ui-field__label" for="price">Price limit</label>
    <output class="ui-slider__value" for="price" aria-hidden="true">EGP 500</output>
  </div>
  <input type="range" class="ui-slider" id="price" max="2000" step="50" value="500"
    aria-valuetext="EGP 500" aria-describedby="price-hint"
    style="--ui-slider-fill: 25%" />
  <p class="ui-field__hint" id="price-hint">Only dishes under this price show.</p>
</div>
<!-- On input: update the output, aria-valuetext and --ui-slider-fill
     ((value - min) / (max - min) × 100%). Firefox fills the track itself. -->`,
  };

  protected readonly disabled = {
    angular: `volume = new FormControl({ value: 40, disabled: true });`,
    react: `<Slider label="Volume" defaultValue={40} disabled />`,
    vue: `<Slider label="Volume" :model-value="40" disabled />`,
    html: `<input type="range" class="ui-slider" disabled />`,
  };

  protected readonly arabic = {
    angular: `<ui-slider label="أقصى سعر" [max]="2000" [step]="50"
  [format]="egp" formControlName="price" />

egp = (v: number) => \`\${v.toLocaleString('ar-EG')} جنيه\`;`,
    react: `<Slider label="أقصى سعر" max={2000} step={50}
  format={(v) => \`\${v.toLocaleString('ar-EG')} جنيه\`} />`,
    vue: `<Slider label="أقصى سعر" :max="2000" :step="50"
  :format="(v) => \`\${v.toLocaleString('ar-EG')} جنيه\`" />`,
    html: `<!-- dir="rtl" on the page or any ancestor: the track fills from the right -->
<input type="range" class="ui-slider" aria-valuetext="٥٠٠ جنيه" />`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Names the slider.',
    },
    {
      name: 'min | max',
      type: 'number',
      default: '0 | 100',
      description: 'The ends of the range.',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      description: 'How far one arrow key press moves it.',
    },
    {
      name: 'format',
      type: '(value: number) => string',
      description: 'The value as shown and as read aloud, with its unit.',
    },
    {
      name: 'hint',
      type: 'string',
      description: 'Help under the slider, read after the label.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'An exact value',
      use: 'Number field',
      path: '/components/number-field',
    },
    {
      need: 'Show a level the reader cannot change',
      use: 'Meter',
      path: '/components/meter',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue',
        type: 'number',
        description: 'Controlled or starting value.',
      },
      {
        name: '...props',
        type: 'input props',
        description: 'Every native input prop: onChange, name, disabled, ref.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'number',
        description: 'The value. Starts at min without a binding.',
      },
    ],
    html: [
      { name: 'ui-slider', type: 'class', description: 'On the range input.' },
      {
        name: '--ui-slider-fill',
        type: 'custom property',
        default: '0%',
        description:
          'How much of the track is filled, in WebKit browsers. Set it on input.',
      },
      {
        name: 'ui-slider__head | __value',
        type: 'class',
        description: 'The row with the label and the written value.',
      },
    ],
  };
}
