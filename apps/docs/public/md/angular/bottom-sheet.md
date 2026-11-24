# Bottom sheet

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A panel that slides up from the bottom of the screen, for a short choice or the details of an item, mostly on phones. It is a dialog docked to the bottom: focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click above it closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/bottom-sheet

```ts
import {
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
} from '@lamsa-ui/angular';
```

When to use something else:

- A task on a wide screen: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- Navigation or filters that slide in from the side: [Drawer](https://lamsa-ui.github.io/lamsa/components/drawer)
- A short list of actions: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'alert' \| 'drawer' \| 'sheet'` | `'default'` | 'sheet': docked to the bottom. Open it with UiDialog.open() as any dialog. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Its width on a wide screen: 24, 32 or 48rem. The full width on a phone. |
| `everything else` | `Dialog API` |  | title, description, closeLabel, [ui-dialog-actions], uiDialogClose and the open() config work as in the dialog. |

## Examples

### Order details

The title and the actions stay in view; the details sit between them.

```html
<ng-template #order>
  <ui-dialog title="Order 1042" description="Delivered today at 2:40 pm." variant="sheet">
    <p>2 × Chicken shawarma, 1 × Lentil soup</p>
    <div ui-dialog-actions>
      <button ui-button variant="secondary" uiDialogClose>Close</button>
      <button ui-button [uiDialogClose]="'reorder'">Order again</button>
    </div>
  </ui-dialog>
</ng-template>

<button ui-button (click)="show(order)">Order 1042</button>

// In the class
private readonly dialog = inject(UiDialog);

show(content: TemplateRef<unknown>) {
  this.dialog.open<string>(content).closed.subscribe((result) => {
    if (result === 'reorder') { /* ... */ }
  });
}
```
