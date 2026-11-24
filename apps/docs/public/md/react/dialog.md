# Dialog

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A modal window for a task that needs the reader's full attention: a short form, details, terms. Focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click outside closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/dialog

```tsx
import { Dialog } from '@lamsa-ui/react';
```

When to use something else:

- A yes or no question that must be answered: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)
- Content beside the page, such as filters: [Drawer](https://lamsa-ui.github.io/lamsa/components/drawer)
- A short note next to the button: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `title` | `string` |  | Required. The heading; it names the dialog. |
| `open / onOpenChange` | `boolean / (open) => void` |  | Required. onOpenChange(false) comes from Escape, the backdrop or the close button. |
| `description` | `string` |  | A sentence under the title, read with it. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 48rem wide, never wider than the screen. |
| `actions` | `ReactNode` |  | The buttons; they line up at the end and stay in view. |
| `dismissable` | `boolean` | `true` | false: only your own buttons close it. Escape and a click outside do nothing, and the close button is hidden. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button; pass the translated text. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- Named by its title; the page behind stops scrolling and cannot be reached.

## Examples

### A form in a dialog

The title names the dialog and the description is read with it. The actions stay at the bottom.

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Edit address</Button>
<Dialog
  title="Edit address"
  description="We deliver your next orders here."
  open={open}
  onOpenChange={setOpen}
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <TextField label="Street" name="street" />
  <TextField label="Building" name="building" />
</Dialog>
```

### Long content

When the content is longer than the screen, only the body scrolls: the title and the buttons stay in view. The large size suits reading.

```tsx
<Dialog
  title="Terms of ordering"
  size="lg"
  open={open}
  onOpenChange={setOpen}
  actions={<Button onClick={() => setOpen(false)}>Close</Button>}
>
  <p>...</p>
</Dialog>
```

### Only its buttons close it

For a form that a stray click or key must not throw away: a click outside and Escape do nothing, and the close button is hidden, so Cancel and Save are the way out. Works the same on a drawer and a bottom sheet.

```tsx
<Dialog dismissable={false} title="Note for the driver" open={open} onOpenChange={setOpen}>
  ...
</Dialog>
```
