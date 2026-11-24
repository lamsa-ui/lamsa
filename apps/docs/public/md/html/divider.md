# Divider

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A thin line between groups of content. Reach for space first: a divider is for when space alone does not show where one group ends.

Docs: https://lamsa-ui.github.io/lamsa/components/divider

```html
<hr class="ui-divider" />
```

When to use something else:

- A frame around a group: [Card](https://lamsa-ui.github.io/lamsa/components/card)
- Space between groups: Tailwind gap or margin classes

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-divider` | `class` |  | Required. On an hr it is a separator already; on a div add role="separator". |
| `ui-divider--vertical` | `class` |  | Vertical. Add aria-orientation="vertical". |
| `ui-divider--label` | `class` |  | Words in the middle. No separator role, so the words are read. |

Keyboard and screen readers:

- Read as a separator; a divider with words in the middle is read as those words instead.

## Examples

### Between sections

```html
<hr class="ui-divider" />
```

### With words

The words are read as normal text, so a screen reader hears 'or' between the two choices.

```html
<div class="ui-divider ui-divider--label">or</div>
```

### Vertical

Between items in a row. It stretches to the row's height.

```html
<div class="flex items-center gap-3">
  <span>18 orders</span>
  <div class="ui-divider ui-divider--vertical" role="separator" aria-orientation="vertical"></div>
  <span>3 in the kitchen</span>
</div>
```

### In Arabic

```html
<div class="ui-divider ui-divider--label">أو</div>
```
