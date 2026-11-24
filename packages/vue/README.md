# @lamsa-ui/vue

Accessible Vue 3.5 components for the Lamsa design system, right to left ready: the same 61 components, names and options as `@lamsa-ui/angular` and `@lamsa-ui/react`, styled by [`@lamsa-ui/css`](../css). Overlays, menus, dates and trees run on [Reka UI](https://reka-ui.com).

```shell
pnpm add @lamsa-ui/vue @lamsa-ui/css vue
```

Import the design-system stylesheet once in the app:

```css
@import '@lamsa-ui/css/ui.css';
```

```vue
<script setup lang="ts">
import { Button, TextField } from '@lamsa-ui/vue';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <form>
    <TextField v-model="email" label="Email" type="email" required />
    <Button type="submit">Continue</Button>
  </form>
</template>
```

Values bind with `v-model` (and `v-model:open`, `v-model:page`, `v-model:selected` for a second value), callbacks are events (`@dismiss`, `@run`), and content goes in slots (`#actions`, `#trigger`). Wrap the app in `<ToastProvider>` to use `useToast()`; `useAlertDialog()` gives `alert()` and `confirm()` as promises. Pass `dir="rtl"` on an ancestor for right-to-left layouts.

Every component, with live examples and its Vue code: [lamsa-ui.github.io/lamsa](https://lamsa-ui.github.io/lamsa/).

[Docs and source](https://github.com/lamsa-ui/lamsa). MIT licence.
