# Avatar

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A person's photo, or their initials when there is no photo or it fails to load. Screen readers hear the person's name, never the file name.

Docs: https://lamsa-ui.github.io/lamsa/components/avatar

```tsx
import { Avatar } from '@lamsa-ui/react';
```

When to use something else:

- Show several people in a small space: [Avatar group](https://lamsa-ui.github.io/lamsa/components/avatar-group)
- Show a status next to a person, such as online: [Status dot](https://lamsa-ui.github.io/lamsa/components/status-dot)
- A logo or a product picture: A plain img with alt text

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `name` | `string` |  | Required. Read by screen readers and turned into the initials. |
| `src` | `string` |  | The photo. Initials show while it is missing or broken. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 32, 40 or 56 pixels. |
| `decorative` | `boolean` | `false` | Hides it from screen readers, for when the name is on screen next to it. |

## Examples

### Initials and sizes

Initials are the first letter of the first and last word, so they work for Arabic names too. A broken photo falls back to initials.

```tsx
<Avatar name="Mona Adel" size="sm" />
<Avatar name="Karim Hassan" />
<Avatar name="Sara Nabil" size="lg" src="/sara.jpg" />
```

### Next to a name

When the name is written beside it, mark the avatar decorative so a screen reader says the name once.

```tsx
<div className="flex items-center gap-3">
  <Avatar name="Mona Adel" decorative />
  <span>Mona Adel</span>
</div>
```

### In Arabic

```tsx
<Avatar name="منى عادل" />
```
