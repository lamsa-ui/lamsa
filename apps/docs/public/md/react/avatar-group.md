# Avatar group

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Several people in a small space: the first few avatars overlap and a '+3' stands for the rest. The group has a name, every avatar is still named, and '+3' is read as '3 more'.

Docs: https://lamsa-ui.github.io/lamsa/components/avatar-group

```tsx
import { AvatarGroup } from '@lamsa-ui/react';
```

When to use something else:

- One person: [Avatar](https://lamsa-ui.github.io/lamsa/components/avatar)
- Every name visible, such as a list of attendees: [A list or Data table](https://lamsa-ui.github.io/lamsa/components/data-table)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Who the group is, for screen readers. |
| `people` | `AvatarPerson[]` |  | Required. { name, src? } for each person, in order. |
| `max` | `number` | `4` | How many avatars to show before "+n". |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of every avatar. |
| `moreLabel` | `(count: number) => string` | `(n) => `${n} more`` | The spoken name of "+n". Translate it. |

## Examples

### A team

```tsx
<AvatarGroup label="Kitchen team" people={people} max={3} />
```

### In Arabic

Translate the '+n' name with moreLabel.

```tsx
<AvatarGroup
  label="فريق المطبخ"
  people={people}
  max={2}
  moreLabel={(count) => `${count} آخرون`}
/>
```
