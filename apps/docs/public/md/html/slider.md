# Slider

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A value picked along a range, such as a price limit or a volume. It is the browser's own range input, so arrow keys, Page Up and Down, Home and End all move it, and the value is written beside the label. For an exact number, use a number field.

Docs: https://lamsa-ui.github.io/lamsa/components/slider

```html
<input type="range" class="ui-slider" />
```

When to use something else:

- An exact value: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- Show a level the reader cannot change: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-slider` | `class` |  | On the range input. |
| `--ui-slider-fill` | `custom property` | `0%` | How much of the track is filled, in WebKit browsers. Set it on input. |
| `ui-slider__head \| __value` | `class` |  | The row with the label and the written value. |

Keyboard and screen readers:

- Left or Right or Up or Down: Move by one step.
- Page Up or Page Down: Move by a bigger step.
- Home or End: Go to the lowest or highest value.
- The browser’s own range input, named by its label; the value is also written beside it.

## Examples

### With a unit

format turns the number into what people read and hear, so a screen reader says EGP 500, not 500.

```html
<div class="ui-field">
  <div class="ui-slider__head">
    <label class="ui-field__label" for="price">Price limit</label>
    <output class="ui-slider__value" for="price" aria-hidden="true">EGP 500</output>
  </div>
  <input type="range" class="ui-slider" id="price" max="2000" step="50" value="500"
    aria-valuetext="EGP 500" aria-describedby="price-hint"
    style="--ui-slider-fill: 25%" />
  <p class="ui-field__hint" id="price-hint">Only dishes under this price show.</p>
</div>
<!-- On input: update the output, aria-valuetext and --ui-slider-fill
     ((value - min) / (max - min) × 100%). Firefox fills the track itself. -->
```

### Disabled

```html
<input type="range" class="ui-slider" disabled />
```

### In Arabic

The track fills from the right.

```html
<!-- dir="rtl" on the page or any ancestor: the track fills from the right -->
<input type="range" class="ui-slider" aria-valuetext="٥٠٠ جنيه" />
```
