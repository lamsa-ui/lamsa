# Radio group

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

One choice from a short list, with every option in view. Native radios: Tab reaches the group, arrow keys move the choice. For more than five or six options, use a select.

Docs: https://ghazal-ui.github.io/ghazal/components/radio-group

```html
<div class="ui-field" role="radiogroup" aria-labelledby="speed-label">
  <span class="ui-field__label" id="speed-label">Delivery</span>
  <div class="ui-choices">
    <label class="ui-check"><input type="radio" name="speed" value="std" /> Standard</label>
    <label class="ui-check"><input type="radio" name="speed" value="exp" /> Express</label>
  </div>
</div>
```

When to use something else:

- Several choices at once: [Checkbox](https://ghazal-ui.github.io/ghazal/components/checkbox)
- More than about 7 options: [Select](https://ghazal-ui.github.io/ghazal/components/select)
- Switch the view of the page: [Segmented control](https://ghazal-ui.github.io/ghazal/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `role="radiogroup"` | `attribute` |  | On the ui-field wrapper, with aria-labelledby pointing at the label. |
| `ui-choices` | `class` |  | Holds the radios, one per line. |
| `ui-choices--inline` | `class` |  | Puts them side by side. |
| `ui-check` | `class` |  | On each label that wraps a radio. Give every radio the same name. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Native radios in a named group, so the group name is read first.

## Examples

### One per line

```html
<div class="ui-field" role="radiogroup" aria-labelledby="speed-label" aria-describedby="speed-hint">
  <span class="ui-field__label" id="speed-label">Delivery</span>
  <p class="ui-field__hint" id="speed-hint">Same day is not available for this address.</p>
  <div class="ui-choices">
    <label class="ui-check"><input type="radio" name="speed" value="std" checked /> Standard, 3 to 5 days</label>
    <label class="ui-check"><input type="radio" name="speed" value="exp" /> Express, next day</label>
    <label class="ui-check"><input type="radio" name="speed" value="same" disabled /> Same day</label>
  </div>
</div>
```

### Side by side, with an error

Short answers can sit on one line. An error adds a red edge and the message, which is announced.

```html
<div class="ui-field ui-field--invalid" role="radiogroup" aria-labelledby="parking-label"
     aria-invalid="true" aria-describedby="parking-error">
  <span class="ui-field__label" id="parking-label">Do you have a parking space?</span>
  <div class="ui-choices ui-choices--inline">
    <label class="ui-check"><input type="radio" name="parking" value="yes" /> Yes</label>
    <label class="ui-check"><input type="radio" name="parking" value="no" /> No</label>
  </div>
  <p class="ui-field__error" id="parking-error" role="alert">Choose yes or no</p>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor; the markup is the same -->
```
