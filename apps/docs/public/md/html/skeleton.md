# Skeleton

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Grey shapes where content is loading, so the page does not jump when it arrives. Screen readers skip the shapes: mark the area busy and say it is loading with a spinner or a status message. With reduced motion the shapes stop pulsing.

Docs: https://ghazal-ui.github.io/ghazal/components/skeleton

```html
<div class="ui-skeleton ui-skeleton--text" aria-hidden="true">
  <span class="ui-skeleton__shape"></span>
  <span class="ui-skeleton__shape"></span>
</div>
```

When to use something else:

- Work with a known length: [Progress](https://ghazal-ui.github.io/ghazal/components/progress)
- A short wait inside a button: [Spinner](https://ghazal-ui.github.io/ghazal/components/spinner)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-skeleton` | `class` |  | The wrapper, with aria-hidden="true". |
| `ui-skeleton--text \| --circle \| --block` | `class` |  | The shape. |
| `ui-skeleton__shape` | `class` |  | One grey shape; one per line of text. |

Keyboard and screen readers:

- Screen readers skip the shapes: mark the area busy and say it is loading in words.
- With reduced motion the shapes stop pulsing.

## Examples

### A loading card

```html
<div class="ui-card" aria-busy="true">
  <span class="ui-loading" role="status">…Loading the profile</span>
  <div class="ui-skeleton ui-skeleton--circle" aria-hidden="true"><span class="ui-skeleton__shape"></span></div>
  <div class="ui-skeleton ui-skeleton--block" aria-hidden="true"><span class="ui-skeleton__shape"></span></div>
</div>
```
