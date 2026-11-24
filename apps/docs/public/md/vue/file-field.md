# File field

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

The browser's own file input, with a label, hint and error, in a zone that also takes files dropped on it. The native button and file names stay, so it works with the keyboard, screen readers and phone cameras as usual.

Docs: https://ghazal-ui.github.io/ghazal/components/file-field

```ts
import { FileField } from '@ghazal-ui/vue';
// onFiles gets a File[] for a pick or a drop. Every other prop goes to the input.
```

When to use something else:

- Typed text or a link to a file: [Text field](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label. |
| `@files` | `event` |  | Called after a pick or a drop. |
| `hint, error, dropText` | `string` |  | As in Angular. |
| `testId` | `string` |  | data-testid on the input. |

Keyboard and screen readers:

- Enter or Space: Open the file chooser.
- The browser’s own file input: the button and the chosen file names are read as usual.
- Dropping files is a shortcut; the button always works.

## Examples

### One file

accept limits what the picker offers. It cannot stop a drop, so check the type and size again on the server.

```vue
<FileField label="Invoice" accept=".pdf" hint="PDF, up to 5 MB." @files="files = $event" />
```

### Several files, with an error

```vue
<FileField
  label="Photos of the damage"
  accept="image/*"
  multiple
  dropText="Or drop photos here"
  :error="photos.length ? undefined : 'Add at least one photo'"
  @files="photos = $event"
/>
```

### In Arabic

```vue
<FileField label="الفاتورة" dropText="أو اسحب الملف هنا" @files="files = $event" />
```
