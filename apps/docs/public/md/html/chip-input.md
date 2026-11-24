# Chip input

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A text field that collects several short values, such as toppings, email addresses or skills. Each value becomes a tag with its own named remove button. Screen readers hear each value being added and removed, and focus never falls off the field.

Docs: https://lamsa-ui.github.io/lamsa/components/chip-input

```html
<div class="ui-chips">...</div>
<!-- Adding, removing, focus and announcements need script: use the Angular or React component. -->
```

When to use something else:

- One value from a known list: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- A few choices that fit on screen: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- Show labels the user cannot type: [Tag](https://lamsa-ui.github.io/lamsa/components/tag)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-chips` | `class` |  | The box that looks like a text field. |
| `ui-chips__list \| __input` | `class` |  | The list of tags and the text field. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or ,: Add what is typed as a tag.
- Backspace: In an empty field, move to the last tag’s remove button.
- Enter or Space: On a remove button, remove that tag.
- Each tag has its own remove button, named after its value.
- Adding and removing are announced, and focus moves to the next tag or back to the field.

## Examples

### Toppings

Type, then Enter or a comma. Backspace in the empty field moves to the last tag; Enter on its × removes it and moves focus to the next.

```html
<div class="ui-field">
  <label class="ui-field__label" for="toppings">Toppings</label>
  <div class="ui-chips">
    <ul class="ui-chips__list" aria-label="Toppings">
      <li><span class="ui-tag">…tag with its × button…</span></li>
    </ul>
    <input class="ui-chips__input" id="toppings" aria-describedby="toppings-hint" />
  </div>
  <p class="ui-field__hint" id="toppings-hint">Press Enter after each one.</p>
  <span class="ui-visually-hidden" aria-live="polite"><!-- "Olives added" --></span>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page: tags and text run from the right -->
```
