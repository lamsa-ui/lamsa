# Accordion

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A stack of sections that open and close, such as questions and answers. Built on the native details element, so it opens with Enter and Space, works without script, and the browser's find-in-page opens the section that holds the match. Sections grow and shrink smoothly both ways, Up and Down move between the headings, and the chevron mirrors in Arabic.

Docs: https://lamsa-ui.github.io/lamsa/components/accordion

```html
<div class="ui-accordion">
  <details class="ui-accordion__item" name="faq">
    <summary><span class="ui-accordion__heading">Can I change my order?</span></summary>
    <div class="ui-accordion__content"><p>Yes, until it ships.</p></div>
  </details>
</div>
```

When to use something else:

- Switch between views of the same thing, one at a time: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Hide one optional detail behind a button: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)
- Show steps the reader must go through in order: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-accordion` | `class` |  | The wrapper. |
| `ui-accordion--icon-start` | `class` |  | On the wrapper: the chevron before each heading. |
| `ui-accordion__item` | `class` |  | On each details; one name for one at a time. Add --icon-start or --no-icon for one item. |
| `ui-accordion__heading, __description` | `class` |  | Inside the summary: the heading text, and a quieter line. |
| `ui-accordion__content` | `class` |  | Around the content. It grows and shrinks; without script, Safari closes it at once. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or Space: Open or close the section.
- Up or Down: Move to the previous or next heading, wrapping round.
- Home or End: Go to the first or last heading.
- Native details elements: they open without script, and find in page opens the section that holds the match.
- In plain HTML only the Up, Down, Home and End keys need script.

## Examples

### Questions

single keeps one section open at a time.

```html
<!-- The same name on each details keeps one open at a time -->
<div class="ui-accordion">
  <details class="ui-accordion__item" name="faq" open>
    <summary><span class="ui-accordion__heading">Can I change my order?</span></summary>
    <div class="ui-accordion__content"><p>Yes, until it ships.</p></div>
  </details>
  <details class="ui-accordion__item" name="faq">
    <summary><span class="ui-accordion__heading">How do refunds work?</span></summary>
    <div class="ui-accordion__content"><p>Send the item back within 14 days.</p></div>
  </details>
</div>
```

### Chevron at the start

As in a tree: it points to where the text reads on, and turns down to open. A description adds a quieter line.

```html
<div class="ui-accordion ui-accordion--icon-start">
  <details class="ui-accordion__item">
    <summary>
      <span class="ui-accordion__heading">Shipping address
        <span class="ui-accordion__description">12 Tahrir Street, Cairo</span>
      </span>
    </summary>
    <div class="ui-accordion__content"><p>Change it until the order ships.</p></div>
  </details>
</div>
```

### Lazy, kept and disabled

Lazy content is created when its section opens, such as a list that loads from an API, and goes once it has closed, so each open loads it again. keep holds on to it instead. A disabled section stays focusable and announced.

```html
<!-- No lazy content without script: fill the section on its toggle event.
     A disabled summary needs a click handler that calls preventDefault. -->
<summary aria-disabled="true">…</summary>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the chevron moves to the left -->
<div class="ui-accordion">…</div>
```

### In Arabic, chevron at the start

It points left, where Arabic reads on, and turns down to open.

```html
<!-- At the start, right to left, it points left until it opens -->
<div class="ui-accordion ui-accordion--icon-start">…</div>
```
