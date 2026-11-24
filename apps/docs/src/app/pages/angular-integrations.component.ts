import { Component, computed, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { TextFieldComponent } from '@lamsa-ui/angular';
import { CodeBlockComponent } from '../shared/code-block.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-angular-integrations-page',
  imports: [
    PageComponent,
    ExampleComponent,
    CodeBlockComponent,
    FormField,
    TextFieldComponent,
  ],
  template: `
    <app-page
      title="Angular integrations"
      lead="Use Lamsa controls with Angular 22+ Signal Forms, while keeping Reactive Forms and ngModel available for existing applications."
    >
      <app-example
        title="Signal Forms"
        description="This live field uses Angular Signal Forms. Blur it empty to see the required error, then enter a value and watch the model update."
        [text]="signalForms"
      >
        <ui-text-field
          label="Work email"
          type="email"
          [formField]="profileForm.email"
          [error]="emailError()"
          class="doc-field"
        />
        <p class="doc-note">Form value: {{ profile().email || 'empty' }}</p>
      </app-example>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Reactive Forms and ngModel</h2>
        <p>
          Angular controls also implement <code>ControlValueAccessor</code>, so
          existing Reactive Forms and template-driven forms continue to work.
        </p>
        <app-code-block caption="Reactive Forms" [text]="reactiveForms" />
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">ng-forge custom field</h2>
        <p>
          This is a copyable custom-field integration example, not an Lamsa
          adapter package. Install <code>@ng-forge/dynamic-forms</code>, connect
          its field contract to <code>ui-text-field</code>, then register the
          field type in your dynamic form.
          <a
            href="https://ng-forge.com/dynamic-forms/material/building-an-adapter"
          >
            Read the ng-forge adapter guide.</a
          >
        </p>
        <app-code-block
          caption="Install ng-forge"
          text="pnpm add @ng-forge/dynamic-forms"
        />
        <app-code-block
          caption="Lamsa text-field adapter"
          [text]="ngForgeField"
        />
        <app-code-block
          caption="Register the field and use it in a FormConfig"
          [text]="ngForgeSetup"
        />
      </section>
    </app-page>
  `,
})
export class AngularIntegrationsPageComponent {
  protected readonly profile = signal({ email: '' });
  protected readonly profileForm = form(this.profile, (path) => {
    required(path.email, { message: 'Email is required' });
  });
  protected readonly emailError = computed(() => {
    const field = this.profileForm.email();
    return field.touched() && field.invalid()
      ? (field.errors()[0]?.message ?? 'Email is required')
      : undefined;
  });

  protected readonly signalForms = `import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { TextFieldComponent } from '@lamsa-ui/angular';

@Component({
  selector: 'app-profile-form',
  imports: [FormField, TextFieldComponent],
  template: \`
    <ui-text-field
      label="Work email"
      type="email"
      [formField]="profileForm.email"
      [error]="profileForm.email().touched() && profileForm.email().invalid()
        ? profileForm.email().errors()[0]?.message
        : undefined"
    />
  \`,
})
export class ProfileForm {
  readonly profile = signal({ email: '' });
  readonly profileForm = form(this.profile, (path) => {
    required(path.email, { message: 'Email is required' });
  });
}`;

  protected readonly reactiveForms = `import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldComponent } from '@lamsa-ui/angular';

@Component({
  imports: [ReactiveFormsModule, TextFieldComponent],
  template: \`
    <form [formGroup]="form">
      <ui-text-field
        label="Work email"
        type="email"
        formControlName="email"
        [error]="form.controls.email.touched && form.controls.email.invalid
          ? 'Enter a valid email'
          : undefined"
      />
    </form>
  \`,
})
export class ProfileForm {
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
}`;

  protected readonly ngForgeField = `import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { TextFieldComponent } from '@lamsa-ui/angular';
import {
  DynamicTextPipe,
  injectNgForgeField,
  NgForgeControl,
  NgForgeFieldHost,
} from '@ng-forge/dynamic-forms/integration';

interface LamsaInputProps extends Record<string, unknown> {
  type?: 'text' | 'email';
}

@Component({
  selector: 'lamsa-input-field',
  imports: [AsyncPipe, DynamicTextPipe, FormField, NgForgeControl, TextFieldComponent],
  hostDirectives: [NgForgeFieldHost],
  template: \`
    @let label = ngf.label();
    @let error = ngf.errorsToDisplay()[0]?.message;
    <ui-text-field
      ngForgeControl="input"
      [formField]="ngf.field()"
      [label]="label ? (label | dynamicText | async) ?? '' : ''"
      [type]="props()?.type ?? 'text'"
      [error]="error ? (error | dynamicText | async) ?? undefined : undefined"
    />
  \`,
})
export default class LamsaInputField {
  protected readonly ngf = injectNgForgeField<string>();
  readonly props = input<LamsaInputProps>();
}`;

  protected readonly ngForgeSetup = `import { Component } from '@angular/core';
import {
  DynamicForm,
  provideDynamicForm,
} from '@ng-forge/dynamic-forms';
import { valueFieldMapper } from '@ng-forge/dynamic-forms/integration';
import type { ApplicationConfig } from '@angular/core';
import type { FormConfig } from '@ng-forge/dynamic-forms';
import type {
  FieldTypeDefinition,
  InputField,
} from '@ng-forge/dynamic-forms/integration';

type LamsaInputDefinition = InputField<{ type?: 'text' | 'email' }>;

declare module '@ng-forge/dynamic-forms' {
  interface FieldRegistryLeaves {
    'lamsa-input': LamsaInputDefinition;
  }
}

const lamsaInput: FieldTypeDefinition<LamsaInputDefinition> = {
  name: 'lamsa-input',
  loadComponent: () => import('./lamsa-input-field'),
  mapper: valueFieldMapper,
};

export const appConfig: ApplicationConfig = {
  providers: [provideDynamicForm(lamsaInput)],
};

@Component({
  imports: [DynamicForm],
  template: \`<form [dynamic-form]="config"></form>\`,
})
export class ProfileForm {
  readonly config = {
    fields: [{
      key: 'email',
      type: 'lamsa-input',
      value: '',
      label: 'Email',
      required: true,
      email: true,
      props: { type: 'email' },
    }],
  } as const satisfies FormConfig;
}`;
}
