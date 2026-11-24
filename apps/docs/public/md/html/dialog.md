# Dialog

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A modal window for a task that needs the reader's full attention: a short form, details, terms. Focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click outside closes it.

Docs: https://ghazal-ui.github.io/ghazal/components/dialog

```html
<dialog class="ui-dialog" closedby="any" aria-labelledby="title">...</dialog>
<!-- open it with dialog.showModal(), never show() -->
```

When to use something else:

- A yes or no question that must be answered: [Alert dialog](https://ghazal-ui.github.io/ghazal/components/alert-dialog)
- Content beside the page, such as filters: [Drawer](https://ghazal-ui.github.io/ghazal/components/drawer)
- A short note next to the button: [Popover](https://ghazal-ui.github.io/ghazal/components/popover)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `dialog.ui-dialog` | `element + class` |  | Open it with showModal(), never show(), so focus is trapped and the page is inert. |
| `ui-dialog--sm \| --lg` | `class` |  | 24 or 48rem wide; 32rem without it. |
| `closedby="any"` | `attribute` |  | A click outside closes it too, in browsers that support it; Escape always does. closedby="none" plus oncancel="event.preventDefault()": only your buttons close it. |
| `aria-labelledby / aria-describedby` | `attribute` |  | Point at the title and the description ids. |
| `ui-dialog__header, __heading, __title, __description` | `class` |  | The heading area. |
| `ui-dialog__body` | `class` |  | The content; it scrolls when it is long. |
| `form[method="dialog"] + ui-dialog__actions` | `element + class` |  | Buttons inside close the dialog and set returnValue to their value. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- Named by its title; the page behind stops scrolling and cannot be reached.

## Examples

### A form in a dialog

The title names the dialog and the description is read with it. The actions stay at the bottom.

```html
<button class="ui-button ui-button--primary ui-button--md" type="button"
  onclick="document.getElementById('edit-address').showModal()">Edit address</button>

<dialog class="ui-dialog" closedby="any" id="edit-address"
  aria-labelledby="address-title" aria-describedby="address-description">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="address-title">Edit address</h2>
      <p class="ui-dialog__description" id="address-description">We deliver your next orders here.</p>
    </div>
  </header>
  <form method="dialog">
    <div class="ui-dialog__body">
      <div class="ui-field">
        <label class="ui-field__label" for="street">Street</label>
        <input class="ui-input" id="street" name="street" />
      </div>
    </div>
    <div class="ui-dialog__actions">
      <button class="ui-button ui-button--secondary ui-button--md" value="cancel">Cancel</button>
      <button class="ui-button ui-button--primary ui-button--md" value="save">Save</button>
    </div>
  </form>
</dialog>
<!-- after it closes, dialog.returnValue is "save", "cancel", or "" (Escape) -->
```

### Long content

When the content is longer than the screen, only the body scrolls: the title and the buttons stay in view. The large size suits reading.

```html
<dialog class="ui-dialog ui-dialog--lg" closedby="any" aria-labelledby="terms-title">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="terms-title">Terms of ordering</h2>
    </div>
  </header>
  <!-- tabindex="0": text-only content that scrolls must take focus, so the keyboard can scroll it -->
  <div class="ui-dialog__body" tabindex="0">
    <p>...</p>
  </div>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--primary ui-button--md">Close</button>
  </form>
</dialog>
```

### Only its buttons close it

For a form that a stray click or key must not throw away: a click outside and Escape do nothing, and the close button is hidden, so Cancel and Save are the way out. Works the same on a drawer and a bottom sheet.

```html
<!-- closedby="none" turns Escape off; the cancel handler covers browsers without closedby -->
<dialog class="ui-dialog" closedby="none" oncancel="event.preventDefault()" aria-labelledby="note-title">...</dialog>
```
