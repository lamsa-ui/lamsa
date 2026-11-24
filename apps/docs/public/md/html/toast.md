# Toast

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short note after an action, such as Saved, at the bottom end of the screen. Screen readers hear it as it comes. It closes by itself after 6 seconds, but never while the pointer or focus is on it, and never when it holds an action, so nobody loses the Undo to a timer.

Docs: https://lamsa-ui.github.io/lamsa/components/toast

```html
<!-- Toasts need script to come and go. The markup they use: -->
<section aria-label="Notifications">
  <ol class="ui-toast-region">
    <li class="ui-alert ui-alert--success ui-toast">…as an alert</li>
  </ol>
</section>
<!-- Announce each one through a live region that is already on the page. -->
```

When to use something else:

- A message that must stay until it is fixed: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)
- A decision the reader must make now: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-toast-region` | `class` |  | The list at the bottom end of the screen. |
| `ui-toast` | `class` |  | On each ui-alert in it: shadow and entry motion. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Tab: Reach the action or the close button inside a toast.
- Toasts sit in a named live region, so each one is read as it comes.
- The timer waits while the pointer or focus is on a toast, and never runs on one with an action.

## Examples

### Tones

Danger is announced at once; the others wait for the screen reader to finish.

```html
<li class="ui-alert ui-alert--danger ui-toast">
  <i class="ui-icon ui-icon-circle-x ui-alert__icon" aria-hidden="true"></i>
  <div class="ui-alert__body">
    <p class="ui-alert__title">Payment failed</p>
    <p>The card was declined. Try another card.</p>
  </div>
  <button class="ui-button ui-button--ghost ui-alert__close" aria-label="Dismiss">✕</button>
</li>
```

### With an action

It stays until it is closed or its button is pressed.

```html
<div class="ui-alert__actions">
  <button class="ui-button ui-button--secondary ui-button--sm">Undo</button>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page: toasts sit at the bottom left -->
```
