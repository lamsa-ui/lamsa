# Toggle

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A button that stays pressed until it is pressed again. The label stays the same; screen readers hear 'pressed' or 'not pressed', and the look changes in fill and border, not colour alone.

Docs: https://lamsa-ui.github.io/lamsa/components/toggle

```html
<button class="ui-button ui-button--secondary ui-button--md ui-toggle" type="button" aria-pressed="false">Pin order</button>
```

When to use something else:

- A setting that takes effect at once, such as notifications: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- One of several views, such as grid or list: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- An action that happens once, such as Save: [Button](https://lamsa-ui.github.io/lamsa/components/button)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-toggle` | `class` |  | On a .ui-button--secondary button. Your script flips aria-pressed on click. |
| `aria-pressed` | `"true" \| "false"` |  | Required. The state, read by screen readers and the CSS. |

Keyboard and screen readers:

- Enter or Space: Press it, or let it go.
- Read as a toggle button, pressed or not pressed; the label never changes.

## Examples

### With a label

Pressed is shown by the fill and a thicker border.

```html
<button class="ui-button ui-button--secondary ui-button--md ui-toggle" type="button" aria-pressed="false">
  Pin order
</button>
<script>
  const toggle = document.querySelector('.ui-toggle');
  toggle.addEventListener('click', () =>
    toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true')),
  );
</script>
```

### Icon only

With no words on it, the aria-label names it.

```html
<button class="ui-button ui-button--secondary ui-button--md ui-button--icon ui-toggle" type="button" aria-pressed="true" aria-label="Favourite">
  <i class="ui-icon ui-icon-star" aria-hidden="true"></i>
</button>
```

### In Arabic

```html
<button class="ui-button ui-button--secondary ui-button--md ui-toggle" type="button" aria-pressed="false">تثبيت الطلب</button>
```
