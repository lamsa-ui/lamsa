# Keyboard key

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A key to press, on the native kbd element, so screen readers and search engines know it is a key. For a shortcut write one key per element, with the joining + as plain text.

Docs: https://ghazal-ui.github.io/ghazal/components/kbd

```ts
import { KbdComponent } from '@ghazal-ui/angular';
```

When to use something else:

- Code or a value the reader types, such as a coupon: A plain code element
- A short label for a status: [Badge](https://ghazal-ui.github.io/ghazal/components/badge)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `kbd[ui-kbd]` | `selector` |  | On a native kbd element. The key name is its content. |

Keyboard and screen readers:

- The native kbd element, so screen readers and search engines know it is a key.

## Examples

### A shortcut

```html
<p>Press <kbd ui-kbd>Ctrl</kbd> + <kbd ui-kbd>K</kbd> to search.</p>
```

### In Arabic

Key names stay as printed on the keyboard.

```html
<p>اضغط <kbd ui-kbd>Esc</kbd> للإغلاق.</p>
```
