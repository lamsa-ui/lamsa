# Button

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Styles the native button, so it keeps everything the browser gives a button: focus, Enter and Space, form submit. Nine variants, three sizes, icons, and hover, press and focus feedback.

Docs: https://ghazal-ui.github.io/ghazal/components/button

```html
<button class="ui-button ui-button--primary ui-button--md">Save</button>
```

When to use something else:

- Go to another page: A link (a href)
- A state that stays on or off, such as bold: [Toggle](https://ghazal-ui.github.io/ghazal/components/toggle)
- Several actions that belong together: [Button group](https://ghazal-ui.github.io/ghazal/components/button-group)
- More actions than fit, behind one button: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-button` | `class` |  | Required on every button. |
| `ui-button--primary \| --secondary \| --ghost \| --danger \| --outline \| --soft \| --link \| --success \| --warning` | `class` |  | The variant. Use exactly one. |
| `ui-button--sm \| --md \| --lg` | `class` |  | The size. Use exactly one. |
| `ui-button--icon, ui-button__icon` | `class` |  | Square icon-only button; wrapper span (aria-hidden) for an icon beside a label. |
| `aria-busy="true" + disabled` | `attribute` |  | Loading state; add a span.ui-spinner with aria-hidden="true" before the label. |

Keyboard and screen readers:

- Enter or Space: Press the button.
- A native button, so its role, focus and form submit come from the browser.
- A button with only an icon needs a label in words for screen readers.

## Examples

### Variants

One primary action per screen. Danger is for actions that destroy something.

```html
<button class="ui-button ui-button--primary ui-button--md">Save</button>
<button class="ui-button ui-button--secondary ui-button--md">Cancel</button>
<button class="ui-button ui-button--ghost ui-button--md">Skip</button>
<button class="ui-button ui-button--danger ui-button--md">Delete</button>
<button class="ui-button ui-button--success ui-button--md">Approve</button>
<button class="ui-button ui-button--warning ui-button--md">Review</button>
<button class="ui-button ui-button--outline ui-button--md">Edit</button>
<button class="ui-button ui-button--soft ui-button--md">Details</button>
<button class="ui-button ui-button--link ui-button--md">Learn more</button>
```

### Icons

Icons before or after the label are hidden from screen readers. An icon-only button needs an aria-label.

```html
<button class="ui-button ui-button--primary ui-button--md">
  <span class="ui-button__icon" aria-hidden="true"><i class="ui-icon ui-icon-plus"></i></span>
  New file
</button>
<button class="ui-button ui-button--outline ui-button--md ui-button--icon" aria-label="Search">
  <i class="ui-icon ui-icon-search" aria-hidden="true"></i>
</button>
```

### Sizes

Even the small size stays 44 pixels high, the smallest comfortable touch target.

```html
<button class="ui-button ui-button--primary ui-button--sm">Small</button>
<button class="ui-button ui-button--primary ui-button--md">Medium</button>
<button class="ui-button ui-button--primary ui-button--lg">Large</button>
```

### Loading

Disables the button, marks it busy for screen readers and shows a spinner.

```html
<button class="ui-button ui-button--primary ui-button--md" disabled aria-busy="true">
  <span class="ui-spinner" aria-hidden="true"></span>
  Save changes
</button>
```

### Disabled

```html
<button class="ui-button ui-button--primary ui-button--md" disabled>Save</button>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<button class="ui-button ui-button--primary ui-button--md">حفظ</button>
<button class="ui-button ui-button--secondary ui-button--md">إلغاء</button>
```
