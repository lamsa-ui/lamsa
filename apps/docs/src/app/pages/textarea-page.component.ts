import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-textarea-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TextareaComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Textarea"
      lead="The multi-line twin of the text field: the same label, hint and error, with room for a few lines. The reader can make it taller."
      [usage]="usage"
    >
      <app-example title="With a hint" [code]="hint">
        <ui-textarea
          label="Delivery notes"
          hint="Gate code, floor, anything the driver should know."
          [rows]="4"
          class="doc-field"
        />
      </app-example>

      <app-example
        title="With an error"
        description="Same rules as the text field: the message is announced, and the border thickens, so colour is never the only sign."
        [code]="error"
      >
        <ui-textarea
          label="Reason for the refund"
          [formControl]="reason"
          [error]="reason.invalid ? 'Tell us what went wrong' : undefined"
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-textarea
          label="ملاحظات التوصيل"
          hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها."
          class="doc-field"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TextareaPageComponent {
  protected readonly reason = new FormControl('', {
    nonNullable: true,
    validators: Validators.required,
  });

  protected readonly usage = {
    angular: `import { TextareaComponent } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.`,
    react: `import { Textarea } from '@lamsa-ui/react';
// Every other prop goes to the textarea: value, onChange, rows, maxLength, ref.`,
    vue: `import { Textarea } from '@lamsa-ui/vue';
// Bind it with v-model; every other attribute goes to the textarea: rows, maxlength.`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="notes">Delivery notes</label>
  <textarea class="ui-input" id="notes" rows="4"></textarea>
</div>`,
  };

  protected readonly hint = {
    angular: `<ui-textarea
  label="Delivery notes"
  hint="Gate code, floor, anything the driver should know."
  [rows]="4"
  formControlName="notes"
/>`,
    react: `<Textarea
  label="Delivery notes"
  hint="Gate code, floor, anything the driver should know."
  rows={4}
  name="notes"
/>`,
    vue: `<Textarea
  label="Delivery notes"
  hint="Gate code, floor, anything the driver should know."
  :rows="4"
  name="notes"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="notes">Delivery notes</label>
  <textarea class="ui-input" id="notes" rows="4" aria-describedby="notes-hint"></textarea>
  <p class="ui-field__hint" id="notes-hint">Gate code, floor, anything the driver should know.</p>
</div>`,
  };

  protected readonly error = {
    angular: `<ui-textarea
  label="Reason for the refund"
  formControlName="reason"
  [error]="form.controls.reason.invalid ? 'Tell us what went wrong' : undefined"
/>`,
    react: `<Textarea
  label="Reason for the refund"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  error={reason ? undefined : 'Tell us what went wrong'}
/>`,
    vue: `<Textarea
  label="Reason for the refund"
  v-model="reason"
  :error="reason ? undefined : 'Tell us what went wrong'"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="reason">Reason for the refund</label>
  <textarea class="ui-input" id="reason" aria-invalid="true" aria-describedby="reason-error"></textarea>
  <p class="ui-field__error" id="reason-error" role="alert">Tell us what went wrong</p>
</div>`,
  };

  protected readonly arabic = {
    angular: `<!-- dir="rtl" on the page or any ancestor -->
<ui-textarea label="ملاحظات التوصيل" hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها." />`,
    react: `{/* dir="rtl" on the page or any ancestor */}
<Textarea label="ملاحظات التوصيل" hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها." />`,
    vue: `<!-- dir="rtl" on the page or any ancestor -->
<Textarea label="ملاحظات التوصيل" hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها." />`,
    html: `<!-- dir="rtl" on the page or any ancestor -->
<div class="ui-field">
  <label class="ui-field__label" for="notes">ملاحظات التوصيل</label>
  <textarea class="ui-input" id="notes" aria-describedby="notes-hint"></textarea>
  <p class="ui-field__hint" id="notes-hint">كود البوابة، الدور، أي حاجة السواق محتاج يعرفها.</p>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'One line of text',
      use: 'Text field',
      path: '/components/text-field',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the textarea.',
      },
      {
        name: 'rows',
        type: 'number',
        default: '3',
        description: 'Height in lines. The reader can still make it taller.',
      },
      {
        name: 'maxlength',
        type: 'number',
        description: 'The most characters it accepts.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the textarea, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the textarea invalid and announces the message.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the textarea, for tests.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the textarea.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the textarea, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the textarea invalid and announces the message.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the textarea, for tests.',
      },
      {
        name: '...props',
        type: 'textarea props',
        default: 'rows: 3',
        description:
          'Every native textarea prop: value, onChange, rows, maxLength, name, ref.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the textarea.',
      },
      {
        name: 'hint',
        type: 'string',
        description: 'Help text under the textarea, read with it.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the textarea invalid and announces the message.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the textarea, for tests.',
      },
    ],
    html: [
      {
        name: 'textarea.ui-input',
        type: 'element + class',
        description: 'Inside a ui-field, with a label as for the text field.',
      },
      {
        name: 'ui-field__hint, ui-field__error',
        type: 'class',
        description:
          'As for the text field: list their ids in aria-describedby; set aria-invalid="true" with an error.',
      },
    ],
  };
}
