import { Component } from '@angular/core';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-react-integrations-page',
  imports: [PageComponent, CodeBlockComponent],
  template: `
    <app-page
      title="React integrations"
      lead="Ghazal React controls stay independent of form libraries. React Hook Form is a familiar choice for validation: register native fields directly and use Controller for compound controls."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">React Hook Form</h2>
        <p>
          Install React Hook Form in your app; it is not a dependency of
          <code>@ghazal-ui/react</code>. This example validates a text field
          with <code>register</code> and a compound Select with
          <code>Controller</code>.
        </p>
        <app-code-block caption="Install" text="pnpm add react-hook-form" />
        <app-code-block
          caption="TextField and Select with validation"
          [text]="reactHookForm"
        />
        <p class="doc-note">
          Validation rules and translated messages stay in your application.
          Ghazal controls expose the value, blur, name, and focus-ref hooks the
          form library needs.
        </p>
      </section>
    </app-page>
  `,
})
export class ReactIntegrationsPageComponent {
  protected readonly reactHookForm = `import { Controller, useForm } from 'react-hook-form';
import { Select, TextField } from '@ghazal-ui/react';

type Checkout = { email: string; city: string };

const cities = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];

export function CheckoutForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Checkout>();

  return (
    <form noValidate onSubmit={handleSubmit((values) => console.log(values))}>
      <TextField
        label="Email"
        type="email"
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
      />
      <Controller
        name="city"
        control={control}
        rules={{ required: 'Choose a city' }}
        render={({ field, fieldState }) => (
          <Select
            label="City"
            options={cities}
            value={field.value || null}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            error={fieldState.error?.message}
          />
        )}
      />
      <button type="submit">Continue</button>
    </form>
  );
}`;
}
