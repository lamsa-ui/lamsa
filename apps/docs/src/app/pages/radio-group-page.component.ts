import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioGroupComponent, type SelectOption } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-radio-group-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    RadioGroupComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Radio group"
      lead="One choice from a short list, with every option in view. Native radios: Tab reaches the group, arrow keys move the choice. For more than five or six options, use a select."
      [usage]="usage"
    >
      <app-example title="One per line" [code]="basic">
        <ui-radio-group
          label="Delivery"
          hint="Same day is not available for this address."
          [options]="speeds"
          [formControl]="speed"
        />
      </app-example>

      <app-example
        title="Side by side, with an error"
        description="Short answers can sit on one line. An error adds a red edge and the message, which is announced."
        [code]="inline"
      >
        <ui-radio-group
          label="Do you have a parking space?"
          orientation="horizontal"
          [options]="yesNo"
          [formControl]="parking"
          [error]="parking.invalid ? 'Choose yes or no' : undefined"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-radio-group label="التوصيل" [options]="speedsAr" />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class RadioGroupPageComponent {
  protected readonly speeds: SelectOption<string>[] = [
    { value: 'std', label: 'Standard, 3 to 5 days' },
    { value: 'exp', label: 'Express, next day' },
    { value: 'same', label: 'Same day', disabled: true },
  ];
  protected readonly speedsAr: SelectOption<string>[] = [
    { value: 'std', label: 'عادي، من ٣ لـ ٥ أيام' },
    { value: 'exp', label: 'سريع، تاني يوم' },
  ];
  protected readonly yesNo: SelectOption<boolean>[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];
  protected readonly speed = new FormControl('std');
  protected readonly parking = new FormControl<boolean | null>(
    null,
    Validators.required,
  );

  protected readonly usage = {
    angular: `import { RadioGroupComponent } from '@lamsa-ui/angular';
// Options are { value, label, disabled? }, as for ui-select.`,
    react: `import { RadioGroup } from '@lamsa-ui/react';`,
    vue: `import { RadioGroup } from '@lamsa-ui/vue';`,
    html: `<div class="ui-field" role="radiogroup" aria-labelledby="speed-label">
  <span class="ui-field__label" id="speed-label">Delivery</span>
  <div class="ui-choices">
    <label class="ui-check"><input type="radio" name="speed" value="std" /> Standard</label>
    <label class="ui-check"><input type="radio" name="speed" value="exp" /> Express</label>
  </div>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-radio-group
  label="Delivery"
  hint="Same day is not available for this address."
  [options]="speeds"
  formControlName="speed"
/>`,
    react: `<RadioGroup
  label="Delivery"
  hint="Same day is not available for this address."
  options={speeds}
  value={speed}
  onChange={setSpeed}
/>`,
    vue: `<RadioGroup
  label="Delivery"
  hint="Same day is not available for this address."
  :options="speeds"
  v-model="speed"
/>`,
    html: `<div class="ui-field" role="radiogroup" aria-labelledby="speed-label" aria-describedby="speed-hint">
  <span class="ui-field__label" id="speed-label">Delivery</span>
  <p class="ui-field__hint" id="speed-hint">Same day is not available for this address.</p>
  <div class="ui-choices">
    <label class="ui-check"><input type="radio" name="speed" value="std" checked /> Standard, 3 to 5 days</label>
    <label class="ui-check"><input type="radio" name="speed" value="exp" /> Express, next day</label>
    <label class="ui-check"><input type="radio" name="speed" value="same" disabled /> Same day</label>
  </div>
</div>`,
  };

  protected readonly inline = {
    angular: `<ui-radio-group
  label="Do you have a parking space?"
  orientation="horizontal"
  [options]="yesNo"
  formControlName="parking"
  [error]="form.controls.parking.invalid ? 'Choose yes or no' : undefined"
/>`,
    react: `<RadioGroup
  label="Do you have a parking space?"
  orientation="horizontal"
  options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
  value={parking}
  onChange={setParking}
  error={parking ? undefined : 'Choose yes or no'}
/>`,
    vue: `<RadioGroup
  label="Do you have a parking space?"
  orientation="horizontal"
  :options="[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]"
  v-model="parking"
  :error="parking ? undefined : 'Choose yes or no'"
/>`,
    html: `<div class="ui-field ui-field--invalid" role="radiogroup" aria-labelledby="parking-label"
     aria-invalid="true" aria-describedby="parking-error">
  <span class="ui-field__label" id="parking-label">Do you have a parking space?</span>
  <div class="ui-choices ui-choices--inline">
    <label class="ui-check"><input type="radio" name="parking" value="yes" /> Yes</label>
    <label class="ui-check"><input type="radio" name="parking" value="no" /> No</label>
  </div>
  <p class="ui-field__error" id="parking-error" role="alert">Choose yes or no</p>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-radio-group label="التوصيل" [options]="speeds" formControlName="speed" />`,
    react: `<RadioGroup label="التوصيل" options={speeds} value={speed} onChange={setSpeed} />`,
    vue: `<RadioGroup label="التوصيل" :options="speeds" v-model="speed" />`,
    html: `<!-- dir="rtl" on the page or any ancestor; the markup is the same -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Several choices at once',
      use: 'Checkbox',
      path: '/components/checkbox',
    },
    {
      need: 'More than about 7 options',
      use: 'Select',
      path: '/components/select',
    },
    {
      need: 'Switch the view of the page',
      use: 'Segmented control',
      path: '/components/segmented-control',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the group.',
      },
      {
        name: 'options',
        type: 'RadioOption<T>[]',
        description: 'Required. { value, label, disabled? } for each radio.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Side by side for two or three short answers.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the label, read with the group.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the group invalid and announces the message.',
      },
      {
        name: 'compareWith',
        type: '(a: T, b: T) => boolean',
        default: '===',
        description:
          'How to match the form value to an option, for object values.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid prefix; each radio gets -<index>.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the group.',
      },
      {
        name: 'options',
        type: 'RadioOption<T>[]',
        description: 'Required. { value, label, disabled? } for each radio.',
      },
      {
        name: 'value, defaultValue',
        type: 'T',
        description: 'The chosen value, controlled or not.',
      },
      {
        name: 'onChange',
        type: '(value: T) => void',
        description: 'Called with the new choice.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Side by side for two or three short answers.',
      },
      {
        name: 'hint, error',
        type: 'string',
        description: 'As for the text field.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Disables every radio.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Form field name; made up when left out.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid prefix; each radio gets -<index>.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the group.',
      },
      {
        name: 'options',
        type: 'RadioOption<T>[]',
        description: 'Required. { value, label, disabled? } for each radio.',
      },
      {
        name: 'v-model',
        type: 'string',
        description: 'The chosen value.',
      },
      {
        name: '@change',
        type: 'event',
        description:
          'The native change event; v-model already holds the new choice.',
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Side by side for two or three short answers.',
      },
      {
        name: 'hint, error',
        type: 'string',
        description: 'As for the text field.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Disables every radio.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Form field name; made up when left out.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid prefix; each radio gets -<index>.',
      },
    ],
    html: [
      {
        name: 'role="radiogroup"',
        type: 'attribute',
        description:
          'On the ui-field wrapper, with aria-labelledby pointing at the label.',
      },
      {
        name: 'ui-choices',
        type: 'class',
        description: 'Holds the radios, one per line.',
      },
      {
        name: 'ui-choices--inline',
        type: 'class',
        description: 'Puts them side by side.',
      },
      {
        name: 'ui-check',
        type: 'class',
        description:
          'On each label that wraps a radio. Give every radio the same name.',
      },
    ],
  };
}
