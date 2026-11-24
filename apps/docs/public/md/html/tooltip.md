# Tooltip

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short label for a control, shown on hover and on keyboard focus and read by screen readers as its description. The pointer can move onto it and Escape hides it. Touch screens never show tooltips, so never put anything needed in one.

Docs: https://lamsa-ui.github.io/lamsa/components/tooltip

```html
<!-- A tooltip needs script to show and hide. The markup it uses: -->
<button class="ui-button ui-button--ghost" aria-label="Copy link" aria-describedby="tip">…</button>
<span class="ui-tooltip" role="tooltip" id="tip">Copy link</span>
```

When to use something else:

- Content with links or buttons: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)
- Help the reader needs to fill a field: [The field’s hint](https://lamsa-ui.github.io/lamsa/components/text-field)
- Show a keyboard shortcut: [Keyboard key inside the tooltip](https://lamsa-ui.github.io/lamsa/components/kbd)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-tooltip` | `class` |  | On the element with role="tooltip". |
| `aria-describedby` | `attribute` |  | On the control, pointing at the tooltip's id. |

## Examples

### On icon buttons

The button still needs its own name; the tooltip shows that name to sighted users.

```html
<!-- See "Use it" -->
```

### In Arabic

```html
<!-- dir="rtl" on the page; the markup is the same -->
```
