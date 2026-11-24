# Combobox

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A text field that filters a list as you type, for a long list such as countries. Focus stays in the field: arrow keys move through the matches, Enter picks one and Escape closes the list. The value is always one of the options.

Docs: https://lamsa-ui.github.io/lamsa/components/combobox

```html
<!-- A combobox needs script for the keyboard and the list. Use a framework package,
     or follow the WAI-ARIA combobox pattern with these classes: -->
<input class="ui-input" role="combobox" aria-expanded="true" aria-controls="list" />
<ul class="ui-listbox" role="listbox" id="list">
  <li class="ui-option ui-option--active" role="option" aria-selected="false">Egypt</li>
</ul>
```

When to use something else:

- One choice from fewer than about 10 options: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Several values: [Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)
- Find a page or run a command from anywhere: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-input + role="combobox"` | `element` |  | The field, with aria-expanded, aria-controls and aria-activedescendant. |
| `ui-listbox, ui-option, ui-option--active` | `class` |  | The list, as for the select. |
| `ui-listbox__empty` | `class` |  | The "no matches" line, with role="status". |

## Examples

### Countries

```html
<!-- See "Use it": the markup a script should produce -->
```

### With an error

```html
<div class="ui-field ui-field--invalid">…</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
```
