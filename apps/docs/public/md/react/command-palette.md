# Command palette

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A search over the app's actions, in a dialog. Ctrl+K or ⌘K opens it from anywhere; typing filters, the arrow keys move and Enter runs. Screen readers hear how many commands match as you type. Keep a visible button for it too: a shortcut nobody knows about is no way in.

Docs: https://lamsa-ui.github.io/lamsa/components/command-palette

```tsx
import { CommandPalette, type Command } from '@lamsa-ui/react';
```

When to use something else:

- Pick a value inside a form: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- Search the items of one list: [Search field](https://lamsa-ui.github.io/lamsa/components/search-field)
- A few actions on one thing: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `commands` | `Command[]` |  | Required. { id, label, keywords?, shortcut? }. Keywords find a command by other words; shortcut is only shown. |
| `shortcut` | `string \| null` | `'k'` | The letter that opens it with Ctrl or ⌘. null turns it off. |
| `title \| placeholder` | `string` | `'Commands'` | Names the dialog and the field; text in the empty field. |
| `emptyLabel \| closeLabel` | `string` |  | Shown when nothing matches; the close button. Translate them. |
| `countLabel` | `(count: number) => string` | ``${n} commands`` | Announced as you type. Translate it. |
| `open \| onOpenChange` | `boolean \| (open) => void` |  | Open or closed; Ctrl+K and Escape call onOpenChange. |
| `onRun` | `(command: Command) => void` |  | The command to run, after the dialog has closed and focus is back. |

## Examples

### Commands

Press Ctrl+K (⌘K on a Mac) on this page, or the button. Try typing invoice: keywords find New order.

```tsx
<Button variant="secondary" onClick={() => setOpen(true)}>Commands</Button>
<CommandPalette commands={commands} open={open} onOpenChange={setOpen} onRun={go} />
```
