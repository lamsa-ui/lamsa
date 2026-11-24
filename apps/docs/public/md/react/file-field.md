# File field

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The browser's own file input, with a label, hint and error, in a zone that also takes files dropped on it. The native button and file names stay, so it works with the keyboard, screen readers and phone cameras as usual.

Docs: https://lamsa-ui.github.io/lamsa/components/file-field

```tsx
import { FileField } from '@lamsa-ui/react';
// onFiles gets a File[] for a pick or a drop. Every other prop goes to the input.
```

When to use something else:

- Typed text or a link to a file: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label. |
| `onFiles` | `(files: File[]) => void` |  | Called after a pick or a drop. |
| `hint, error, dropText` | `string` |  | As in Angular. |
| `testId` | `string` |  | data-testid on the input. |
| `...props` | `input props` |  | Every native input prop: accept, multiple, name, onChange, ref. |

## Examples

### One file

accept limits what the picker offers. It cannot stop a drop, so check the type and size again on the server.

```tsx
<FileField label="Invoice" accept=".pdf" hint="PDF, up to 5 MB." onFiles={setFiles} />
```

### Several files, with an error

```tsx
<FileField
  label="Photos of the damage"
  accept="image/*"
  multiple
  dropText="Or drop photos here"
  onFiles={setPhotos}
  error={photos.length ? undefined : 'Add at least one photo'}
/>
```

### In Arabic

```tsx
<FileField label="الفاتورة" dropText="أو اسحب الملف هنا" onFiles={setFiles} />
```
