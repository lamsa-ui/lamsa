# @lamsa-ui/angular

Accessible Angular 22 components in the Lamsa design system, right to left ready: 61 components, from button, text field and date picker to data table, dialog and app shell. Built on signals and the Angular CDK; styles come from [`@lamsa-ui/css`](../css). See [every component](https://lamsa-ui.github.io/lamsa/) with its code.

```shell
pnpm add @lamsa-ui/angular @lamsa-ui/css @angular/cdk
pnpm add -D tailwindcss @tailwindcss/postcss
```

```css
/* styles.css; .postcssrc.json: { "plugins": { "@tailwindcss/postcss": {} } } */
@import 'tailwindcss';
@import '@lamsa-ui/css/tailwind.css';
@import '@angular/cdk/overlay-prebuilt.css';
@import '@angular/cdk/a11y-prebuilt.css';
```

```ts
import { BadgeComponent, ButtonComponent, CardComponent, DialogComponent, SelectComponent, TextareaComponent, TextFieldComponent, UiAlertDialog, UiDialog } from '@lamsa-ui/angular';
```

### Forms

Form controls support Angular Reactive Forms and `ngModel` through `ControlValueAccessor`, and Angular 22 Signal Forms through the same component API:

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { CheckboxComponent, TextFieldComponent } from '@lamsa-ui/angular';

@Component({
  imports: [FormField, TextFieldComponent, CheckboxComponent],
  template: `
    <ui-text-field label="Email" [formField]="profileForm.email" [error]="profileForm.email().touched() && profileForm.email().invalid() ? profileForm.email().errors()[0]?.message : undefined" />
    <ui-checkbox label="Accept terms" [formField]="profileForm.accepted" />
  `,
})
export class ProfileForm {
  readonly model = signal({ email: '', accepted: false });
  readonly profileForm = form(this.model, (path) => {
    required(path.email, { message: 'Email is required' });
  });
}
```

The application owns validation rules and translated messages; pass the resulting message to the component's `error` input. Existing `formControlName`, `[formControl]`, and `ngModel` usage remains supported.

[Source and docs](https://github.com/lamsa-ui/lamsa). MIT licence.
