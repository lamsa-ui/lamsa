# @lamsa-ui/react

Accessible React 19 components in the Lamsa design system, right to left ready: 61 components, from button, text field and date picker to data table, dialog and app shell. Built on React Aria; styles come from [`@lamsa-ui/css`](../css). See [every component](https://lamsa-ui.github.io/lamsa/) with its code.

```shell
pnpm add @lamsa-ui/react @lamsa-ui/css
pnpm add -D tailwindcss @tailwindcss/vite
```

```css
/* src/index.css, imported once in main.tsx; add tailwindcss() from @tailwindcss/vite to the Vite plugins */
@import 'tailwindcss';
@import '@lamsa-ui/css/tailwind.css';
```

```tsx
import { Button, Dialog, Select, TextField, useAlertDialog } from '@lamsa-ui/react';
```

Works with React Server Components: the files that need the browser start with `'use client'`.

### Forms

The React controls stay independent of form libraries. Native fields accept the usual input props; for compound controls, React Hook Form's `Controller` maps the field value, change/blur handlers, name, and focus ref. Install React Hook Form in your app:

```shell
pnpm add react-hook-form
```

```tsx
import { Controller, useForm } from 'react-hook-form';
import { Select, TextField } from '@lamsa-ui/react';

type Checkout = { email: string; city: string };

function CheckoutForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Checkout>();

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <TextField label="Email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
      <Controller
        name="city"
        control={control}
        rules={{ required: 'Choose a city' }}
        render={({ field, fieldState }) => (
          <Select
            label="City"
            options={[
              { value: 'cai', label: 'Cairo' },
              { value: 'alx', label: 'Alexandria' },
            ]}
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
}
```

Validation rules and translated messages belong to the application. Controlled components expose `onBlur` and a ref to their focusable element for touched-state and focus-on-error behavior.

[Docs](https://lamsa-ui.github.io/lamsa/) · [Source](https://github.com/lamsa-ui/lamsa). MIT licence.
