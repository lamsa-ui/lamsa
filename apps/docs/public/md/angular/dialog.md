# Dialog

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A modal window for a task that needs the reader's full attention: a short form, details, terms. Focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click outside closes it.

Docs: https://ghazal-ui.github.io/ghazal/components/dialog

```ts
import {
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
} from '@ghazal-ui/angular';
```

When to use something else:

- A yes or no question that must be answered: [Alert dialog](https://ghazal-ui.github.io/ghazal/components/alert-dialog)
- Content beside the page, such as filters: [Drawer](https://ghazal-ui.github.io/ghazal/components/drawer)
- A short note next to the button: [Popover](https://ghazal-ui.github.io/ghazal/components/popover)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `UiDialog.open(content, config?)` | `DialogRef<R>` |  | Opens a component or a template. closed emits the result once. |
| `config.data` | `D` |  | Read it with inject(DIALOG_DATA) in a component, or let-data in a template. |
| `config.dismissable` | `boolean` | `true` | false: only your own buttons close it. Escape and a click outside do nothing, and the close button is hidden. |
| `config.initialFocus` | `CSS selector` | `the heading` | The element to focus first. |
| `<ui-dialog> title` | `string` |  | Required. The heading; it names the dialog. |
| `<ui-dialog> description` | `string` |  | A sentence under the title, read with it. |
| `<ui-dialog> size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 48rem wide, never wider than the screen. |
| `<ui-dialog> closeLabel` | `string` | `'Close' from labels` | Accessible name of the close button; pass the translated text. |
| `[ui-dialog-actions]` | `content slot` |  | The buttons; they line up at the end and stay in view. |
| `uiDialogClose` | `directive` |  | On a button: closes the dialog with its value, or none when bare. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- Named by its title; the page behind stops scrolling and cannot be reached.

## Examples

### A form in a dialog

The title names the dialog and the description is read with it. The actions stay at the bottom.

```html
<!-- A template (or a component) holds the content -->
<ng-template #editAddress>
  <ui-dialog title="Edit address" description="We deliver your next orders here.">
    <ui-text-field label="Street" [formControl]="street" />
    <ui-text-field label="Building" [formControl]="building" />
    <div ui-dialog-actions>
      <button ui-button variant="secondary" uiDialogClose>Cancel</button>
      <button ui-button [uiDialogClose]="'save'">Save</button>
    </div>
  </ui-dialog>
</ng-template>

<button ui-button (click)="edit(editAddress)">Edit address</button>

// In the class
private readonly dialog = inject(UiDialog);

edit(content: TemplateRef<unknown>) {
  this.dialog.open<string>(content).closed.subscribe((result) => {
    if (result === 'save') { /* ... */ }
  });
}
```

### Long content

When the content is longer than the screen, only the body scrolls: the title and the buttons stay in view. The large size suits reading.

```html
<ui-dialog title="Terms of ordering" size="lg">
  <p>...</p>
  <div ui-dialog-actions>
    <button ui-button uiDialogClose>Close</button>
  </div>
</ui-dialog>
```

### Only its buttons close it

For a form that a stray click or key must not throw away: a click outside and Escape do nothing, and the close button is hidden, so Cancel and Save are the way out. Works the same on a drawer and a bottom sheet.

```html
this.dialog.open(content, { dismissable: false });
// a drawer or sheet too: the variant lives on <ui-dialog>, the option on open()
```
