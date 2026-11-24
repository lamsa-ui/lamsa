# Toolbar

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A row of controls that counts as one stop for the Tab key. Inside it the arrow keys move from control to control, flipped in Arabic; Home and End jump to the ends. Tab again leaves it.

Docs: https://ghazal-ui.github.io/ghazal/components/toolbar

```html
<div class="ui-toolbar" role="toolbar" aria-label="Note">…</div>
```

When to use something else:

- Two or three buttons that sit together: [Button group](https://ghazal-ui.github.io/ghazal/components/button-group)
- Links to other pages: [Navigation](https://ghazal-ui.github.io/ghazal/components/nav)
- Actions that do not fit, behind one button: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-toolbar` | `class` |  | With role="toolbar" and aria-label. The arrow keys are your script. |
| `ui-toolbar__separator` | `class` |  | A line between groups. Add role="separator". |
| `aria-orientation="vertical"` | `attribute` |  | Stacks the controls; up and down arrows move. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Tab: Enter the toolbar, and Tab again leaves it.
- Left or Right: Move to the previous or next control, wrapping round. Flipped in Arabic.
- Up or Down: The same, in a vertical toolbar.
- Home or End: Go to the first or last control.
- Read as a toolbar with its name and orientation.

## Examples

### Editor actions

Tab in, then use the arrow keys. Tab out and back: focus returns to the last control you used.

```html
<div class="ui-toolbar" role="toolbar" aria-label="Note">
  <button class="ui-button ui-button--ghost ui-button--md ui-button--icon" type="button" aria-label="Undo" tabindex="0">
    <i class="ui-icon ui-icon-undo-2" aria-hidden="true"></i>
  </button>
  <button class="ui-button ui-button--ghost ui-button--md ui-button--icon" type="button" aria-label="Redo" tabindex="-1">
    <i class="ui-icon ui-icon-redo-2" aria-hidden="true"></i>
  </button>
  <div class="ui-toolbar__separator" role="separator"></div>
  <button class="ui-button ui-button--ghost ui-button--md" type="button" tabindex="-1">Copy</button>
</div>
<!-- Your script: arrow keys move focus and the tabindex="0" to the next control. -->
```

### In Arabic

```html
<div class="ui-toolbar" role="toolbar" aria-label="الطلب">
  <button class="ui-button ui-button--ghost ui-button--md" type="button" tabindex="0">طباعة</button>
  <button class="ui-button ui-button--ghost ui-button--md" type="button" tabindex="-1">استرداد</button>
</div>
```
