import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PinInputComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-pin-input-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    PinInputComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="PIN input"
      lead="A code sent by text message, one box per digit. Typing moves along, Backspace goes back, and pasting the code fills every box. On a phone the keyboard offers the code from the message, and the boxes take it all at once."
      [usage]="usage"
    >
      <app-example
        title="A verification code"
        description="complete fires once the last box is filled, so the code can be checked without a button."
        [code]="basic"
      >
        <div class="grid gap-2">
          <ui-pin-input
            label="Verification code"
            hint="Sent to +20 10 1234 5678."
            [formControl]="code"
            (complete)="checked.set($event)"
          />
          <p class="text-text-muted" aria-live="polite">
            {{ checked() ? 'Checking ' + checked() + '…' : '' }}
          </p>
        </div>
      </app-example>

      <app-example
        title="A PIN"
        description="secret shows dots, for a number the person chose rather than one sent to them."
        [code]="secret"
      >
        <ui-pin-input label="Card PIN" [length]="4" secret />
      </app-example>

      <app-example
        title="In Arabic"
        description="The boxes still run left to right, as the digits do."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-pin-input
          label="رمز التحقق"
          [cellLabel]="cellArabic"
          error="الرمز غير صحيح. أعد المحاولة."
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class PinInputPageComponent {
  protected readonly code = new FormControl('');
  protected readonly checked = signal('');
  protected readonly cellArabic = (n: number, of: number) =>
    `الرقم ${n.toLocaleString('ar-EG')} من ${of.toLocaleString('ar-EG')}`;

  protected readonly usage = {
    angular: `import { PinInputComponent } from '@lamsa-ui/angular';
// The value is the digits typed so far, as one string.`,
    react: `import { PinInput } from '@lamsa-ui/react';`,
    vue: `import { PinInput } from '@lamsa-ui/vue';`,
    html: `<div class="ui-field">
  <span class="ui-field__label" id="code-label">Verification code</span>
  <div class="ui-pin" role="group" aria-labelledby="code-label">...</div>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-pin-input label="Verification code" formControlName="code" (complete)="verify($event)" />`,
    react: `<PinInput label="Verification code" onComplete={verify} />`,
    vue: `<PinInput label="Verification code" @complete="verify" />`,
    html: `<div class="ui-field">
  <span class="ui-field__label" id="code-label">Verification code</span>
  <div class="ui-pin" role="group" aria-labelledby="code-label">
    <input class="ui-input ui-pin__cell" inputmode="numeric" placeholder=" "
      autocomplete="one-time-code" aria-label="Digit 1 of 6" />
    <input class="ui-input ui-pin__cell" inputmode="numeric" placeholder=" "
      autocomplete="off" aria-label="Digit 2 of 6" />
    <!-- … one per digit; a script moves focus as each is typed -->
  </div>
</div>`,
  };

  protected readonly secret = {
    angular: `<ui-pin-input label="Card PIN" [length]="4" secret />`,
    react: `<PinInput label="Card PIN" length={4} secret />`,
    vue: `<PinInput label="Card PIN" :length="4" secret />`,
    html: `<input class="ui-input ui-pin__cell" type="password" inputmode="numeric" … />`,
  };

  protected readonly arabic = {
    angular: `<ui-pin-input label="رمز التحقق" [cellLabel]="cell" error="الرمز غير صحيح. أعد المحاولة." />

cell = (n: number, of: number) => \`الرقم \${n.toLocaleString('ar-EG')} من \${of.toLocaleString('ar-EG')}\`;`,
    react: `<PinInput label="رمز التحقق" cellLabel={cell} error="الرمز غير صحيح. أعد المحاولة." />`,
    vue: `<PinInput label="رمز التحقق" :cellLabel="cell" error="الرمز غير صحيح. أعد المحاولة." />`,
    html: `<!-- .ui-pin keeps left to right inside an Arabic page. -->`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Names the boxes as a group.',
    },
    {
      name: 'length',
      type: 'number',
      default: '6',
      description: 'How many digits.',
    },
    {
      name: 'secret',
      type: 'boolean',
      default: 'false',
      description: 'Dots instead of digits, for a PIN.',
    },
    {
      name: 'cellLabel',
      type: '(n, of) => string',
      default: '`Digit ${n} of ${of}` from labels',
      description: "Each box's name for screen readers. Translate it.",
    },
    {
      name: 'hint | error',
      type: 'string',
      description: 'Help text, and the translated error that marks it invalid.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A password',
      use: 'Text field with type password',
      path: '/components/text-field',
    },
    {
      need: 'A phone number',
      use: 'Phone field',
      path: '/components/phone-field',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: '(complete)',
        type: 'string',
        description: 'Every box is filled: the whole code.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue | onChange',
        type: 'string',
        description: 'Controlled or starting digits.',
      },
      {
        name: 'onComplete',
        type: '(code: string) => void',
        description: 'Every box is filled.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Submits the code as one value with a form.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'string',
        description: 'The code typed so far.',
      },
      {
        name: '@complete',
        type: 'event',
        description: 'Fires with the code once every box is filled.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Adds a hidden input with the whole code, for forms.',
      },
    ],
    html: [
      {
        name: 'ui-pin',
        type: 'class',
        description: 'The row of boxes, a named group. Always left to right.',
      },
      {
        name: 'ui-pin__cell',
        type: 'class',
        description:
          'With ui-input, one box. placeholder=" " lets a filled box show darker.',
      },
    ],
  };
}
