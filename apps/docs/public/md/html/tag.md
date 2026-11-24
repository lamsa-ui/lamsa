# Tag

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A label the user added or can take away, such as an active filter or a topic. For a status like Paid or Late, use a badge.

Docs: https://lamsa-ui.github.io/lamsa/components/tag

```html
<span class="ui-tag">Angular</span>
```

When to use something else:

- A status the user cannot remove: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)
- Let the user type new labels: [Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-tag` | `class` |  | Required. |
| `ui-tag__remove` | `class` |  | The × button, 24 pixels square. Label it with aria-labelledby: its own aria-label, then the text. |

## Examples

### Labels

```html
<ul class="flex flex-wrap gap-2" aria-label="Topics">
  <li><span class="ui-tag">Angular</span></li>
  <li><span class="ui-tag">React</span></li>
</ul>
```

### Removable

The × is read as 'Remove Paid'. After a tag goes, focus moves to the next tag, or to Reset when none is left, so the keyboard never drops to the top of the page.

```html
<span class="ui-tag">
  <span id="tag-paid">Paid</span>
  <button type="button" class="ui-tag__remove" id="tag-paid-x"
    aria-label="Remove" aria-labelledby="tag-paid-x tag-paid">
    <i class="ui-icon ui-icon-x" aria-hidden="true"></i>
  </button>
</span>
```

### In Arabic

```html
<span class="ui-tag">
  <span id="tag-cairo">القاهرة</span>
  <button type="button" class="ui-tag__remove" id="tag-cairo-x"
    aria-label="إزالة" aria-labelledby="tag-cairo-x tag-cairo">...</button>
</span>
```
