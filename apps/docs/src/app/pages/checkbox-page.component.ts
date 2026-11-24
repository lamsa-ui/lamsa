import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-checkbox-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    CheckboxComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Checkbox"
      lead="A yes or no that is saved with the form, such as accepting the terms. The native checkbox in the primary colour; the whole label is the hit area, at least 44px tall."
      [usage]="usage"
    >
      <app-example title="With a hint" [code]="basic">
        <ui-checkbox
          label="Email me about my orders"
          hint="One email per order, no adverts."
        />
      </app-example>

      <app-example
        title="With an error"
        description="The message is announced and tied to the checkbox, so a screen reader hears why the form did not send."
        [code]="error"
      >
        <ui-checkbox
          label="I accept the terms"
          [formControl]="terms"
          [error]="terms.invalid ? 'Accept the terms to continue' : undefined"
        />
      </app-example>

      <app-example
        title="Some of a list"
        description="indeterminate shows a dash on a parent checkbox when only some items under it are ticked."
        [code]="indeterminate"
      >
        <ui-checkbox label="All files" [indeterminate]="true" />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-checkbox label="ابعتلي إيميل عن طلباتي" />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class CheckboxPageComponent {
  protected readonly terms = new FormControl(false, {
    nonNullable: true,
    validators: Validators.requiredTrue,
  });

  protected readonly usage = {
    angular: `import { CheckboxComponent } from '@lamsa-ui/angular';
// The value is true or false. Works with formControlName, [formControl] and ngModel.`,
    react: `import { Checkbox } from '@lamsa-ui/react';
// Every other prop goes to the input: checked, onChange, name, ref.`,
    vue: `import { Checkbox } from '@lamsa-ui/vue';
// Bind it with v-model; every other attribute goes to the input: name, required.`,
    html: `<label class="ui-check">
  <input type="checkbox" name="updates" />
  Email me about my orders
</label>`,
  };

  protected readonly basic = {
    angular: `<ui-checkbox
  label="Email me about my orders"
  hint="One email per order, no adverts."
  formControlName="updates"
/>`,
    react: `<Checkbox
  label="Email me about my orders"
  hint="One email per order, no adverts."
  checked={updates}
  onChange={(e) => setUpdates(e.target.checked)}
/>`,
    vue: `<Checkbox
  label="Email me about my orders"
  hint="One email per order, no adverts."
  v-model="updates"
/>`,
    html: `<div class="ui-field">
  <label class="ui-check">
    <input type="checkbox" id="updates" aria-describedby="updates-hint" />
    Email me about my orders
  </label>
  <p class="ui-field__hint" id="updates-hint">One email per order, no adverts.</p>
</div>`,
  };

  protected readonly error = {
    angular: `<ui-checkbox
  label="I accept the terms"
  formControlName="terms"
  [error]="form.controls.terms.invalid ? 'Accept the terms to continue' : undefined"
/>`,
    react: `<Checkbox
  label="I accept the terms"
  checked={terms}
  onChange={(e) => setTerms(e.target.checked)}
  error={terms ? undefined : 'Accept the terms to continue'}
/>`,
    vue: `<Checkbox
  label="I accept the terms"
  v-model="terms"
  :error="terms ? undefined : 'Accept the terms to continue'"
/>`,
    html: `<div class="ui-field ui-field--invalid">
  <label class="ui-check">
    <input type="checkbox" id="terms" aria-invalid="true" aria-describedby="terms-error" />
    I accept the terms
  </label>
  <p class="ui-field__error" id="terms-error" role="alert">Accept the terms to continue</p>
</div>`,
  };

  protected readonly indeterminate = {
    angular: `<ui-checkbox label="All files" [indeterminate]="some()" formControlName="all" />`,
    react: `<Checkbox label="All files" indeterminate={some} checked={all} onChange={toggleAll} />`,
    vue: `<Checkbox label="All files" :indeterminate="some" :checked="all" @change="toggleAll" />`,
    html: `<label class="ui-check">
  <input type="checkbox" id="all" />
  All files
</label>
<script>document.getElementById('all').indeterminate = true;</script>`,
  };

  protected readonly arabic = {
    angular: `<!-- dir="rtl" on the page or any ancestor -->
<ui-checkbox label="ابعتلي إيميل عن طلباتي" />`,
    react: `{/* dir="rtl" on the page or any ancestor */}
<Checkbox label="ابعتلي إيميل عن طلباتي" />`,
    vue: `<!-- dir="rtl" on the page or any ancestor -->
<Checkbox label="ابعتلي إيميل عن طلباتي" />`,
    html: `<!-- dir="rtl" on the page or any ancestor -->
<label class="ui-check">
  <input type="checkbox" />
  ابعتلي إيميل عن طلباتي
</label>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'One choice from a few options',
      use: 'Radio group',
      path: '/components/radio-group',
    },
    {
      need: 'A setting that takes effect at once',
      use: 'Switch',
      path: '/components/switch',
    },
    {
      need: 'Several choices from a long list',
      use: 'Combobox or Chip input',
      path: '/components/chip-input',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. The visible label; the whole label is the hit area.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the checkbox, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the checkbox invalid and announces the message.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Shows a dash: some of the items under it are ticked.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input, for tests.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text, read with the checkbox.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks it invalid and announces the message.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Shows a dash: some of the items under it are ticked.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input.',
      },
      {
        name: '...props',
        type: 'input props',
        description:
          'Every native input prop: checked, defaultChecked, onChange, name, ref.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text, read with the checkbox.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks it invalid and announces the message.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Shows a dash: some of the items under it are ticked.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input.',
      },
    ],
    html: [
      {
        name: 'ui-check',
        type: 'class',
        description: 'On the label that wraps the input and its text.',
      },
      {
        name: 'ui-field, ui-field--invalid',
        type: 'class',
        description:
          'A wrapper when there is a hint or an error; list their ids in aria-describedby.',
      },
    ],
  };
}
