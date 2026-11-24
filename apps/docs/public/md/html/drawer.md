# Drawer

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A side panel that slides in from the edge, for a form or the details of a row, while the list stays in sight. It is a dialog docked to the side: focus moves into it and stays there, the page behind stops scrolling, only the body scrolls, and Escape, the close button or a click outside closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/drawer

```html
<dialog class="ui-dialog ui-dialog--drawer" closedby="any" aria-labelledby="title">...</dialog>
<!-- open it with dialog.showModal(), never show() -->
```

When to use something else:

- A focused task in the middle of the screen: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- A panel on a phone: [Bottom sheet](https://lamsa-ui.github.io/lamsa/components/bottom-sheet)
- The main links of the app on a phone: [App shell](https://lamsa-ui.github.io/lamsa/components/app-shell)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `dialog.ui-dialog.ui-dialog--drawer` | `element + class` |  | Open it with showModal(), never show(), so focus is trapped and the page is inert. |
| `ui-dialog--sm \| --lg` | `class` |  | 24 or 48rem wide; 32rem without it. |
| `everything else` | `` |  | The same markup and classes as the dialog. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- A dialog docked to the side, named by its title; the page behind stops scrolling.

## Examples

### A form in a drawer

Header and actions stay at the top and bottom of the screen; the fields scroll between them.

```html
<dialog class="ui-dialog ui-dialog--drawer" closedby="any" id="add-building"
  aria-labelledby="building-title" aria-describedby="building-description">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="building-title">Add building</h2>
      <p class="ui-dialog__description" id="building-description">It shows in the list once saved.</p>
    </div>
  </header>
  <form method="dialog">
    <div class="ui-dialog__body">
      <div class="ui-field">
        <label class="ui-field__label" for="name">Name</label>
        <input class="ui-input" id="name" name="name" />
      </div>
    </div>
    <div class="ui-dialog__actions">
      <button class="ui-button ui-button--secondary ui-button--md" value="cancel">Cancel</button>
      <button class="ui-button ui-button--primary ui-button--md" value="save">Save</button>
    </div>
  </form>
</dialog>
```

### In Arabic

```html
<!-- <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer -->
<dialog class="ui-dialog ui-dialog--drawer" closedby="any" aria-labelledby="building-title">...</dialog>
```
