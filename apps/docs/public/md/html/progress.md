# Progress

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

How far a long task has got, such as an upload. The native progress bar, named by its label, with the amount in words beside it. Without a value it shows a moving band: work is going on but its length is not known.

Docs: https://lamsa-ui.github.io/lamsa/components/progress

```html
<div class="ui-progress">
  <div class="ui-progress__head">
    <span class="ui-progress__label" id="upload">Uploading invoice.pdf</span>
    <span class="ui-progress__value" aria-hidden="true">64%</span>
  </div>
  <progress class="ui-progress__bar" aria-labelledby="upload" value="64" max="100"></progress>
</div>
```

When to use something else:

- A level that is not work being done, such as storage used: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)
- Waiting with no idea how long: [Spinner](https://lamsa-ui.github.io/lamsa/components/spinner)
- Steps the reader goes through: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-progress` | `class` |  | The wrapper: label, amount, bar. |
| `ui-progress__bar` | `class` |  | On the progress element, named with aria-labelledby. |
| `ui-progress__label, __value` | `class` |  | The words above it; hide the amount from screen readers. |

## Examples

### Known amount

```html
<progress class="ui-progress__bar" aria-labelledby="import" value="3" max="5"
          aria-valuetext="3 of 5 files"></progress>
```

### Unknown amount

```html
<!-- No value attribute -->
<progress class="ui-progress__bar" aria-labelledby="prepare"></progress>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the bar fills from the right -->
```
