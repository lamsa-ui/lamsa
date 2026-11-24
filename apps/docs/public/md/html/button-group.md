# Button group

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Buttons that belong together, joined into one bar. The group has a name, so a screen reader says what the buttons are for before it reads them.

Docs: https://lamsa-ui.github.io/lamsa/components/button-group

```html
<div class="ui-button-group" role="group" aria-label="Invoice">…</div>
```

When to use something else:

- One choice that changes the view: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- Many controls with arrow-key movement, as in an editor: [Toolbar](https://lamsa-ui.github.io/lamsa/components/toolbar)
- More actions than fit on a phone: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-button-group` | `class` |  | Joins the .ui-button children. Add role="group" and an aria-label. |

Keyboard and screen readers:

- Tab: Move from button to button.
- A named group, read before its buttons.

## Examples

### Actions on one thing

Each button is still a normal button: Tab reaches every one.

```html
<div class="ui-button-group" role="group" aria-label="Invoice">
  <button class="ui-button ui-button--secondary ui-button--md" type="button">Download</button>
  <button class="ui-button ui-button--secondary ui-button--md" type="button">Print</button>
  <button class="ui-button ui-button--secondary ui-button--md" type="button">Email</button>
</div>
```

### In Arabic

```html
<div class="ui-button-group" role="group" aria-label="الفاتورة">
  <button class="ui-button ui-button--secondary ui-button--md" type="button">تنزيل</button>
  <button class="ui-button ui-button--secondary ui-button--md" type="button">طباعة</button>
</div>
```
