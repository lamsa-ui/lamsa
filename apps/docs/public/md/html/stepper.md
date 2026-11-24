# Stepper

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A flow split into steps, such as checkout. Each step holds its own content, and the stepper shows the current one with Back and Next under it. The step names are buttons, so people can go back. Done steps have a tick and are read as Done, the current one is announced as the current step, and focus moves to the new step's content after each change.

Docs: https://lamsa-ui.github.io/lamsa/components/stepper

```html
<div class="ui-stepper">
  <ol class="ui-steps" aria-label="Checkout">...</ol>
  <section class="ui-stepper__panel">...</section>
  <div class="ui-stepper__actions">...</div>
</div>
```

When to use something else:

- Views the reader can open in any order: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Pages of a list: [Pagination](https://lamsa-ui.github.io/lamsa/components/pagination)
- What happened to a request, in time order: [Timeline](https://lamsa-ui.github.io/lamsa/components/timeline)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-stepper` | `class` |  | Wraps the list, the panels and the buttons. |
| `ui-steps` | `class` |  | On the ol. Give it an aria-label. |
| `ui-steps__item--done \| --current` | `class` |  | Per li. Put aria-current="step" on the current button, and "Done: " in a ui-visually-hidden span on done ones. |
| `ui-steps__step` | `class` |  | The button in each li. Disable it while the step cannot be reached. |
| `ui-steps__marker \| __label` | `class` |  | The circle (aria-hidden) and the name. |
| `ui-stepper__panel \| __actions` | `class` |  | One panel per step, hidden except the current one, with tabindex="-1" so focus can move to it; then the Back and Next row. |

## Examples

### Options

Turn linear on, then try to reach a later step before filling in the current one.

```html
<div class="ui-stepper">…</div>
```

### At any screen width

The same stepper in a box as wide as the slider says. It reads its own box, not the window.

```html
<div class="ui-stepper">…</div>
```

### Checkout, in order

A whole flow. The address and card steps are completed once their fields are valid; press Next with them empty to see the errors. Finish places the order.

```html
<!-- You move between steps with your own script: set the classes,
     aria-current, hidden and disabled, and focus the new panel. -->
<div class="ui-stepper">
  <ol class="ui-steps" aria-label="Checkout">
    <li class="ui-steps__item ui-steps__item--done">
      <button type="button" class="ui-steps__step" id="step-1">
        <span class="ui-steps__marker" aria-hidden="true"><i class="ui-icon ui-icon-check"></i></span>
        <span class="ui-steps__label"><span class="ui-visually-hidden">Done: </span>Cart</span>
      </button>
    </li>
    <li class="ui-steps__item ui-steps__item--current">
      <button type="button" class="ui-steps__step" id="step-2" aria-current="step">
        <span class="ui-steps__marker" aria-hidden="true">2</span>
        <span class="ui-steps__label">Address</span>
      </button>
    </li>
    <li class="ui-steps__item">
      <button type="button" class="ui-steps__step" id="step-3" disabled>
        <span class="ui-steps__marker" aria-hidden="true">3</span>
        <span class="ui-steps__label">Payment</span>
      </button>
    </li>
  </ol>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-1" hidden>…</section>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-2">…</section>
  <section class="ui-stepper__panel" tabindex="-1" aria-labelledby="step-3" hidden>…</section>
  <div class="ui-stepper__actions">
    <button class="ui-button ui-button--secondary ui-button--md" type="button">Back</button>
    <button class="ui-button ui-button--primary ui-button--md" type="button">Next</button>
  </div>
</div>
```

### In Arabic

Without linear, every step can be chosen. Translate the button labels and Done.

```html
<!-- dir="rtl" on the page: the steps run from the right -->
<div class="ui-stepper">…</div>
```
