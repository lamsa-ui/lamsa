# Drawer

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A side panel that slides in from the edge, for a form or the details of a row, while the list stays in sight. It is a dialog docked to the side: focus moves into it and stays there, the page behind stops scrolling, only the body scrolls, and Escape, the close button or a click outside closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/drawer

```ts
import {
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
} from '@lamsa-ui/angular';
```

When to use something else:

- A focused task in the middle of the screen: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- A panel on a phone: [Bottom sheet](https://lamsa-ui.github.io/lamsa/components/bottom-sheet)
- The main links of the app on a phone: [App shell](https://lamsa-ui.github.io/lamsa/components/app-shell)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'alert' \| 'drawer'` | `'default'` | 'drawer': full height on the inline end. Open it with UiDialog.open() as any dialog. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 48rem wide; the full width on a phone. |
| `everything else` | `Dialog API` |  | title, description, closeLabel, [ui-dialog-actions], uiDialogClose and the open() config work as in the dialog. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- A dialog docked to the side, named by its title; the page behind stops scrolling.

## Examples

### A form in a drawer

Header and actions stay at the top and bottom of the screen; the fields scroll between them.

```html
<ng-template #addBuilding>
  <ui-dialog title="Add building" description="It shows in the list once saved." variant="drawer">
    <ui-text-field label="Name" [formControl]="name" />
    <ui-text-field label="Address" [formControl]="address" />
    <div ui-dialog-actions>
      <button ui-button variant="secondary" uiDialogClose>Cancel</button>
      <button ui-button [uiDialogClose]="'save'">Save</button>
    </div>
  </ui-dialog>
</ng-template>

<button ui-button (click)="add(addBuilding)">Add building</button>

// In the class
private readonly dialog = inject(UiDialog);

add(content: TemplateRef<unknown>) {
  this.dialog.open<string>(content).closed.subscribe((result) => {
    if (result === 'save') { /* ... */ }
  });
}
```

### In Arabic

```html
<!-- <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer -->
<ui-dialog title="إضافة مبنى" variant="drawer" closeLabel="إغلاق">
  <ui-text-field label="اسم المبنى" />
  ...
</ui-dialog>
```
