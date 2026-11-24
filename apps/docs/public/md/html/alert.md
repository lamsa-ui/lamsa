# Alert

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A message in the page, such as a problem with the whole form or a notice about the account. The title says what it is in words; the icon's shape and the colour repeat it. For a note after an action, use a toast; for a question that needs an answer, an alert dialog.

Docs: https://ghazal-ui.github.io/ghazal/components/alert

```html
<div class="ui-alert ui-alert--success">
  <i class="ui-icon ui-icon-circle-check ui-alert__icon" aria-hidden="true"></i>
  <div class="ui-alert__body">
    <p class="ui-alert__title">Payment received</p>
    <p>Invoice 1042 is paid.</p>
  </div>
</div>
```

When to use something else:

- Confirm an action that just finished: [Toast](https://ghazal-ui.github.io/ghazal/components/toast)
- Stop the reader until they decide: [Alert dialog](https://ghazal-ui.github.io/ghazal/components/alert-dialog)
- Show a status in a row or a card: [Badge](https://ghazal-ui.github.io/ghazal/components/badge)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-alert` | `class` |  | On its own it is the info tone. |
| `ui-alert--success \| --warning \| --danger` | `class` |  | The tone. |
| `ui-alert__icon, __body, __title, __actions, __close` | `class` |  | The parts. Hide the icon from screen readers. |

Keyboard and screen readers:

- The title says what it is in words; the icon and the colour only repeat it.

## Examples

### Tones

Body text passes 7:1 on every tone, in both themes.

```html
<div class="ui-alert">…</div>                 <!-- info -->
<div class="ui-alert ui-alert--success">…</div>
<div class="ui-alert ui-alert--warning">…</div>
<div class="ui-alert ui-alert--danger">…</div>
```

### With actions, and closable

Close removes it from the page; the button's name says what it does.

```html
<div class="ui-alert ui-alert--warning">
  <i class="ui-icon ui-icon-triangle-alert ui-alert__icon" aria-hidden="true"></i>
  <div class="ui-alert__body">
    <p class="ui-alert__title">Your plan ends on 1 December</p>
    <p>Renew it to keep your reports.</p>
    <div class="ui-alert__actions"><button class="ui-button ui-button--primary ui-button--sm">Renew</button></div>
  </div>
  <button class="ui-button ui-button--ghost ui-alert__close" aria-label="Dismiss">✕</button>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the coloured edge moves to the right -->
```
