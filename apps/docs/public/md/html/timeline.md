# Timeline

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A chronological record of decisions and updates. Each event can show who acted, when it happened, and the outcome, so a case's approval history is easy to scan.

Docs: https://lamsa-ui.github.io/lamsa/components/timeline

```html
<ol class="ui-timeline" aria-label="Approval history">...</ol>
```

When to use something else:

- Steps still to do: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)
- Many records to sort and filter: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-timeline` | `class` |  | On the ordered list. Set an accessible aria-label. |
| `ui-timeline__item` | `class` |  | On each list item, in chronological order. |
| `ui-timeline__marker--approved \| --pending \| --rejected` | `class` |  | Colors and styles the status marker. |
| `ui-timeline__status--approved \| --pending \| --rejected` | `class` |  | Styles the visible status label. |

Keyboard and screen readers:

- An ordered list, so screen readers say how many events there are; each date is a time element.

## Examples

### Case approval history

A manager approved the request, finance is reviewing it, and the owner is notified once the final decision is made.

```html
<ol class="ui-timeline" aria-label="Approval history">
  <li class="ui-timeline__item">
    <span class="ui-timeline__marker ui-timeline__marker--approved" aria-hidden="true">
      <i class="ui-icon ui-icon-check"></i>
    </span>
    <article class="ui-timeline__content">
      <div class="ui-timeline__heading">
        <h3 class="ui-timeline__title">Manager approval</h3>
        <span class="ui-timeline__status ui-timeline__status--approved">Approved</span>
      </div>
      <p class="ui-timeline__meta">
        <span>Mohamed Hatem</span><time datetime="2026-11-18T11:42:00+02:00">18 Nov 2026, 11:42</time>
      </p>
      <p class="ui-timeline__description">Approved within the department travel budget.</p>
    </article>
  </li>
  <!-- Repeat for each event in chronological order. -->
</ol>
```

### In Arabic

```html
<!-- Set dir="rtl" on the page. Inline-start/end mirror the connector automatically. -->
<ol class="ui-timeline" aria-label="سجل الموافقات">...</ol>
```
