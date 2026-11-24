import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-text-field-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TextFieldComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Text field"
      lead="Label, input, hint and error as one control. The label, hint and error are tied to the input, so screen readers read all three."
      [usage]="usage"
    >
      <app-example title="With a hint" [code]="hint">
        <ui-text-field
          label="Email"
          type="email"
          hint="We only use it for order updates."
          autocomplete="email"
          class="doc-field"
        />
      </app-example>

      <app-example
        title="With an error"
        description="Pass the translated message. The input gets aria-invalid, a thicker border, and the message is announced. Colour is never the only sign."
        [code]="error"
      >
        <ui-text-field
          label="Full name"
          [formControl]="name"
          [error]="name.invalid ? 'Enter your full name' : undefined"
          class="doc-field"
        />
      </app-example>

      <app-example
        title="Disabled"
        description="Disable it through the form control, as with any input."
        [code]="disabled"
      >
        <ui-text-field
          label="Order number"
          [formControl]="order"
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-text-field
          label="البريد الإلكتروني"
          type="email"
          hint="بنستخدمه لتحديثات الطلب بس."
          class="doc-field"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TextFieldPageComponent {
  protected readonly name = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });
  protected readonly order = new FormControl(
    { value: 'ORD-1042', disabled: true },
    { nonNullable: true },
  );

  protected readonly usage = {
    react: `import { TextField } from '@lamsa-ui/react';
// Every other prop goes to the input: value, onChange, name, ref,
// so it works with React Hook Form's register() too.`,
    vue: `import { TextField } from '@lamsa-ui/vue';
// Bind it with v-model; every other attribute goes to the input:
// name, autocomplete, required, maxlength.`,
    angular: `import { TextFieldComponent } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="email">Email</label>
  <input class="ui-input" id="email" type="email" />
</div>`,
  };

  protected readonly hint = {
    react: `<TextField
  label="Email"
  type="email"
  hint="We only use it for order updates."
  autoComplete="email"
  name="email"
/>`,
    vue: `<TextField
  label="Email"
  type="email"
  hint="We only use it for order updates."
  autoComplete="email"
  name="email"
/>`,
    angular: `<ui-text-field
  label="Email"
  type="email"
  hint="We only use it for order updates."
  autocomplete="email"
  formControlName="email"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="email">Email</label>
  <input class="ui-input" id="email" type="email" autocomplete="email" aria-describedby="email-hint" />
  <p class="ui-field__hint" id="email-hint">We only use it for order updates.</p>
</div>`,
  };

  protected readonly error = {
    react: `const [name, setName] = useState('');

<TextField
  label="Full name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={name ? undefined : 'Enter your full name'}
/>`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
const name = ref('');
</script>

<template>
  <TextField
    v-model="name"
    label="Full name"
    :error="name ? undefined : 'Enter your full name'"
  />
</template>`,
    angular: `<ui-text-field
  label="Full name"
  formControlName="name"
  [error]="form.controls.name.invalid ? 'Enter your full name' : undefined"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="name">Full name</label>
  <input class="ui-input" id="name" aria-invalid="true" aria-describedby="name-error" />
  <p class="ui-field__error" id="name-error" role="alert">Enter your full name</p>
</div>`,
  };

  protected readonly disabled = {
    react: `<TextField label="Order number" defaultValue="ORD-1042" disabled />`,
    vue: `<TextField label="Order number" model-value="ORD-1042" disabled />`,
    angular: `order = new FormControl({ value: 'ORD-1042', disabled: true });

<ui-text-field label="Order number" [formControl]="order" />`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="order">Order number</label>
  <input class="ui-input" id="order" value="ORD-1042" disabled />
</div>`,
  };

  protected readonly arabic = {
    react: `{/* dir="rtl" on the page or any ancestor */}
<TextField label="البريد الإلكتروني" type="email" hint="بنستخدمه لتحديثات الطلب بس." />`,
    vue: `<!-- dir="rtl" on the page or any ancestor -->
<TextField label="البريد الإلكتروني" type="email" hint="بنستخدمه لتحديثات الطلب بس." />`,
    angular: `<!-- dir="rtl" on the page or any ancestor -->
<ui-text-field label="البريد الإلكتروني" type="email" hint="بنستخدمه لتحديثات الطلب بس." />`,
    html: `<!-- dir="rtl" on the page or any ancestor -->
<div class="ui-field">
  <label class="ui-field__label" for="email">البريد الإلكتروني</label>
  <input class="ui-input" id="email" type="email" aria-describedby="email-hint" />
  <p class="ui-field__hint" id="email-hint">بنستخدمه لتحديثات الطلب بس.</p>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Several lines of text',
      use: 'Textarea',
      path: '/components/textarea',
    },
    {
      need: 'A unit or currency beside the value',
      use: 'Input group',
      path: '/components/input-group',
    },
    {
      need: 'A number with − and + buttons',
      use: 'Number field',
      path: '/components/number-field',
    },
    {
      need: 'Search with a clear button',
      use: 'Search field',
      path: '/components/search-field',
    },
  ];

  protected readonly api = {
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the input.',
      },
      {
        name: 'type',
        type: "'text' | 'email' | 'password' | 'search' | 'tel' | 'url'",
        default: "'text'",
        description: 'The input type.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the input, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the input invalid and announces the message.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input, for tests.',
      },
      {
        name: '...props',
        type: 'input props',
        description:
          'Every native input prop: value, defaultValue, onChange, name, autoComplete, disabled, ref.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the input.',
      },
      {
        name: 'type',
        type: "'text' | 'email' | 'password' | 'search' | 'tel' | 'url'",
        default: "'text'",
        description: 'The input type.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the input, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the input invalid and announces the message.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input, for tests.',
      },
    ],
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the input.',
      },
      {
        name: 'type',
        type: "'text' | 'email' | 'password' | 'search' | 'tel' | 'url'",
        default: "'text'",
        description: 'The input type.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the input, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the input invalid and announces the message.',
      },
      {
        name: 'autocomplete',
        type: 'string',
        description: 'The browser autofill hint, such as email or name.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input, for tests.',
      },
    ],
    html: [
      {
        name: 'ui-field',
        type: 'class',
        description: 'The wrapper: stacks label, input, hint and error.',
      },
      {
        name: 'ui-field__label',
        type: 'class',
        description: 'On the label; its for matches the input id.',
      },
      {
        name: 'ui-input',
        type: 'class',
        description: 'On the input (also works on a native select).',
      },
      {
        name: 'ui-field__hint',
        type: 'class',
        description: 'Help text; list its id in the input aria-describedby.',
      },
      {
        name: 'ui-field__error',
        type: 'class',
        description:
          'The error, with role="alert"; set aria-invalid="true" on the input and list the error id in aria-describedby.',
      },
    ],
  };
}
