# Alert dialog

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short message that needs an answer before the reader goes on: confirm a delete, keep or discard changes. Only its buttons answer: Escape and a click outside do nothing, because the reader has to choose. Focus starts on the safest button.

Docs: https://lamsa-ui.github.io/lamsa/components/alert-dialog

```html
<dialog class="ui-dialog ui-dialog--sm ui-dialog--alert" role="alertdialog"
  closedby="none" oncancel="event.preventDefault()"
  aria-labelledby="title" aria-describedby="message">...</dialog>
```

When to use something else:

- Ask for more than a yes or no, such as a form: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- Confirm something that can be undone: [Toast with an Undo action](https://lamsa-ui.github.io/lamsa/components/toast)
- Warn about something on the page without stopping the reader: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `role="alertdialog"` | `attribute` |  | On the dialog. Name and describe it with aria-labelledby and aria-describedby. |
| `ui-dialog--alert` | `class` |  | Centres the icon, heading and actions. |
| `ui-dialog__icon--info \| --success \| --warning \| --danger` | `class` |  | The tone icon, with aria-hidden="true". |
| `autofocus` | `attribute` |  | On the safest button, so focus starts there. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between its buttons; focus stays inside.
- Escape and a click outside do nothing: only its buttons answer.
- Focus starts on the safest button, and the title and message are read when it opens.

## Examples

### Confirm a destructive action

The danger tone shows an icon, and the title says it in words. Focus starts on Cancel, so pressing Enter by habit deletes nothing.

```html
<dialog class="ui-dialog ui-dialog--sm ui-dialog--alert" id="delete-file" role="alertdialog"
  closedby="none" oncancel="event.preventDefault()"
  aria-labelledby="delete-title" aria-describedby="delete-message">
  <header class="ui-dialog__header">
    <span class="ui-dialog__icon ui-dialog__icon--danger" aria-hidden="true"><i class="ui-icon ui-icon-circle-x"></i></span>
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="delete-title">Delete report.pdf?</h2>
      <p class="ui-dialog__description" id="delete-message">It is removed for everyone. This cannot be undone.</p>
    </div>
  </header>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--secondary ui-button--md" value="cancel" autofocus>Cancel</button>
    <button class="ui-button ui-button--danger ui-button--md" value="delete">Delete</button>
  </form>
</dialog>
<!-- returnValue is "delete" or "cancel". closedby="none" turns Escape off; oncancel covers browsers without closedby. -->
```

### More than two answers

Up to three actions, in reading order. Mark the one focus should start on.

```html
<form method="dialog" class="ui-dialog__actions">
  <button class="ui-button ui-button--danger ui-button--md" value="discard">Discard</button>
  <button class="ui-button ui-button--secondary ui-button--md" value="stay">Keep editing</button>
  <button class="ui-button ui-button--primary ui-button--md" value="save" autofocus>Save</button>
</form>
```

### Tell, then move on

One action for news the reader should not miss. Keep these rare: most news belongs in the page, not in a dialog.

```html
<span class="ui-dialog__icon ui-dialog__icon--success" aria-hidden="true"><i class="ui-icon ui-icon-circle-check"></i></span>
...
<form method="dialog" class="ui-dialog__actions">
  <button class="ui-button ui-button--primary ui-button--md">OK</button>
</form>
```
