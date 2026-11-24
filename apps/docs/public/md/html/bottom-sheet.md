# Bottom sheet

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A panel that slides up from the bottom of the screen, for a short choice or the details of an item, mostly on phones. It is a dialog docked to the bottom: focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click above it closes it.

Docs: https://ghazal-ui.github.io/ghazal/components/bottom-sheet

```html
<dialog class="ui-dialog ui-dialog--sheet" closedby="any" aria-labelledby="title">...</dialog>
<!-- open it with dialog.showModal(), never show() -->
```

When to use something else:

- A task on a wide screen: [Dialog](https://ghazal-ui.github.io/ghazal/components/dialog)
- Navigation or filters that slide in from the side: [Drawer](https://ghazal-ui.github.io/ghazal/components/drawer)
- A short list of actions: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `dialog.ui-dialog.ui-dialog--sheet` | `element + class` |  | Open it with showModal(), never show(), so focus is trapped and the page is inert. |
| `ui-dialog--sm \| --lg` | `class` |  | Its width on a wide screen: 24 or 48rem; 32rem without it. |
| `everything else` | `` |  | The same markup and classes as the dialog. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- A dialog docked to the bottom, named by its title; the page behind stops scrolling.

## Examples

### Order details

The title and the actions stay in view; the details sit between them.

```html
<dialog class="ui-dialog ui-dialog--sheet" closedby="any" id="order"
  aria-labelledby="order-title" aria-describedby="order-description">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="order-title">Order 1042</h2>
      <p class="ui-dialog__description" id="order-description">Delivered today at 2:40 pm.</p>
    </div>
  </header>
  <div class="ui-dialog__body">
    <p>2 × Chicken shawarma, 1 × Lentil soup</p>
  </div>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--secondary ui-button--md" value="close">Close</button>
    <button class="ui-button ui-button--primary ui-button--md" value="reorder">Order again</button>
  </form>
</dialog>
```
