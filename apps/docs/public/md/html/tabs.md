# Tabs

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Views of one thing side by side, such as an order's details and its history. Tab reaches the chosen tab, the arrow keys move between tabs and show each one, Home and End go to the first and last. The chosen tab gets a bar and full-strength text, not only a colour.

Docs: https://lamsa-ui.github.io/lamsa/components/tabs

```html
<!-- Tabs need script for the keyboard. Follow the WAI-ARIA tabs pattern with these classes: -->
<div class="ui-tabs">
  <div class="ui-tabs__list" role="tablist" aria-label="Order 1042">
    <button class="ui-tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">Details</button>
    <button class="ui-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">History</button>
  </div>
  <div class="ui-tabs__panel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
  <div class="ui-tabs__panel" role="tabpanel" id="p2" aria-labelledby="t2" tabindex="0" hidden>…</div>
</div>
```

When to use something else:

- Links to other pages: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Change how the same content is shown: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- Sections the reader may open together: [Accordion](https://lamsa-ui.github.io/lamsa/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-tabs` | `class` |  | The wrapper. |
| `ui-tabs__list` | `class` |  | On the element with role="tablist", or on a <nav> of links. Scrolls when the tabs are wider. |
| `ui-tabs__bar, ui-tabs__scroll` | `class` |  | A row holding the list and an arrow button at each end; give the arrows tabindex="-1" and aria-hidden="true". |
| `ui-tab` | `class` |  | On each button with role="tab" (aria-selected marks the chosen one), or each link (aria-current="page"). |
| `ui-tabs__panel` | `class` |  | On each element with role="tabpanel". |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Tab: Reach the chosen tab, and Tab again moves into its panel.
- Left or Right: Move to the previous or next tab and show it. Flipped in Arabic.
- Home or End: Go to the first or last tab.
- Read as tabs, with how many there are and which is chosen.

## Examples

### An order

```html
<!-- See "Use it" -->
```

### Many tabs

Wider than the page, the tabs scroll. Choosing one, by click or arrow key, moves it to the middle, so the tabs on both sides of it stay in sight. Under reduced motion it moves without gliding.

```html
<!-- .ui-tabs__list scrolls on its own. To centre the chosen tab, scroll only the list:
     list.scrollBy({ left: tabCentre - listCentre }) -->
```

### A page for each tab

```html
<nav class="ui-tabs__list" aria-label="Account">
  <a class="ui-tab" href="/account" aria-current="page">Profile</a>
  <a class="ui-tab" href="/account/billing">Billing</a>
</nav>
```

### In Arabic

The tabs run right to left and the arrow keys follow: the right arrow goes back.

```html
<!-- dir="rtl" on the page; the arrow keys must flip in your script -->
```
