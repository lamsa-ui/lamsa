# Rating

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Stars out of five, to pick a score or to show one. Picking uses real radio buttons, so Tab reaches the stars, arrow keys move between them and a screen reader says 3 stars, 3 of 5. Filled stars are solid and empty ones an outline, so the shape tells them apart, not only colour.

Docs: https://ghazal-ui.github.io/ghazal/components/rating

```html
<fieldset class="ui-rating">...</fieldset>
```

When to use something else:

- An exact number: [Number field](https://ghazal-ui.github.io/ghazal/components/number-field)
- Show a score the reader cannot change: [Meter](https://ghazal-ui.github.io/ghazal/components/meter)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-rating` | `class` |  | On the fieldset, or on the read-only span with role="img". |
| `ui-rating__star` | `class` |  | One label per star, holding a hidden radio and its name. |
| `ui-rating--readonly \| ui-rating__star--on` | `class` |  | Read-only score, and the stars it fills. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Real radio buttons, read as 3 stars, 3 of 5.
- Filled stars are solid and empty ones an outline, so shape tells them apart.

## Examples

### Pick a score

```html
<fieldset class="ui-rating">
  <legend class="ui-field__label">How was the food?</legend>
  <span class="ui-rating__stars">
    <label class="ui-rating__star">
      <input type="radio" name="food" value="1" class="ui-visually-hidden" />
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>
      <span class="ui-visually-hidden">1 star</span>
    </label>
    <!-- … one label per star, up to 5 -->
  </span>
</fieldset>
```

### Show a score

Read as one image with the score in words. A score with a fraction fills to the nearest star; the words keep the exact number.

```html
<span class="ui-rating ui-rating--readonly" role="img" aria-label="4.6 out of 5 stars">
  <span class="ui-rating__stars">
    <span class="ui-rating__star ui-rating__star--on"><svg viewBox="0 0 24 24"><path d="…same star…" /></svg></span>
    <!-- … --on on the first 5 (rounded), plain on the rest -->
  </span>
</span>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the stars run from the right -->
<span class="ui-visually-hidden">٣ نجوم</span>
```
