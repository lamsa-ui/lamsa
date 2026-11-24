# Skeleton

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Grey shapes where content is loading, so the page does not jump when it arrives. Screen readers skip the shapes: mark the area busy and say it is loading with a spinner or a status message. With reduced motion the shapes stop pulsing.

Docs: https://lamsa-ui.github.io/lamsa/components/skeleton

```tsx
import { Skeleton } from '@lamsa-ui/react';
```

When to use something else:

- Work with a known length: [Progress](https://lamsa-ui.github.io/lamsa/components/progress)
- A short wait inside a button: [Spinner](https://lamsa-ui.github.io/lamsa/components/spinner)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `shape` | `'text' \| 'circle' \| 'block'` | `'text'` | Lines, an avatar, or an image or card. |
| `lines` | `number` | `1` | Lines of text; the last one is shorter. |

Keyboard and screen readers:

- Screen readers skip the shapes: mark the area busy and say it is loading in words.
- With reduced motion the shapes stop pulsing.

## Examples

### A loading card

```tsx
<Card aria-busy>
  <Spinner label="Loading the profile" />
  <Skeleton shape="circle" />
  <Skeleton lines={2} />
  <Skeleton shape="block" />
  <Skeleton lines={3} />
</Card>
```
