# Keyboard key

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A key to press, on the native kbd element, so screen readers and search engines know it is a key. For a shortcut write one key per element, with the joining + as plain text.

Docs: https://ghazal-ui.github.io/ghazal/components/kbd

```ts
import { Kbd } from '@ghazal-ui/vue';
```

When to use something else:

- Code or a value the reader types, such as a coupon: A plain code element
- A short label for a status: [Badge](https://ghazal-ui.github.io/ghazal/components/badge)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `#default` | `slot` |  | The key name. |

Keyboard and screen readers:

- The native kbd element, so screen readers and search engines know it is a key.

## Examples

### A shortcut

```vue
<p>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.</p>
```

### In Arabic

Key names stay as printed on the keyboard.

```vue
<p>اضغط <Kbd>Esc</Kbd> للإغلاق.</p>
```
