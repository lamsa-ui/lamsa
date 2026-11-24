# Drawer

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A side panel that slides in from the edge, for a form or the details of a row, while the list stays in sight. It is a dialog docked to the side: focus moves into it and stays there, the page behind stops scrolling, only the body scrolls, and Escape, the close button or a click outside closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/drawer

```tsx
import { Dialog } from '@lamsa-ui/react';
```

When to use something else:

- A focused task in the middle of the screen: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- A panel on a phone: [Bottom sheet](https://lamsa-ui.github.io/lamsa/components/bottom-sheet)
- The main links of the app on a phone: [App shell](https://lamsa-ui.github.io/lamsa/components/app-shell)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'alert' \| 'drawer'` | `'default'` | 'drawer': full height on the inline end. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 48rem wide; the full width on a phone. |
| `everything else` | `Dialog API` |  | title, description, open, onOpenChange, actions, dismissable and closeLabel work as in the dialog. |

## Examples

### A form in a drawer

Header and actions stay at the top and bottom of the screen; the fields scroll between them.

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Add building</Button>
<Dialog
  variant="drawer"
  title="Add building"
  description="It shows in the list once saved."
  open={open}
  onOpenChange={setOpen}
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <TextField label="Name" name="name" />
  <TextField label="Address" name="address" />
</Dialog>
```

### In Arabic

```tsx
{/* <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer */}
<Dialog variant="drawer" title="إضافة مبنى" closeLabel="إغلاق" open={open} onOpenChange={setOpen}>
  <TextField label="اسم المبنى" />
</Dialog>
```
