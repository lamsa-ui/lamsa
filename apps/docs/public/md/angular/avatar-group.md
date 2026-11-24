# Avatar group

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Several people in a small space: the first few avatars overlap and a '+3' stands for the rest. The group has a name, every avatar is still named, and '+3' is read as '3 more'.

Docs: https://ghazal-ui.github.io/ghazal/components/avatar-group

```ts
import { AvatarGroupComponent } from '@ghazal-ui/angular';
```

When to use something else:

- One person: [Avatar](https://ghazal-ui.github.io/ghazal/components/avatar)
- Every name visible, such as a list of attendees: [A list or Data table](https://ghazal-ui.github.io/ghazal/components/data-table)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Who the group is, for screen readers. |
| `people` | `AvatarPerson[]` |  | Required. { name, src? } for each person, in order. |
| `max` | `number` | `4` | How many avatars to show before "+n". |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of every avatar. |
| `moreLabel` | `(count: number) => string` | `(n) => `${n} more` from labels` | The spoken name of "+n". Translate it. |

Keyboard and screen readers:

- The group has a name, every avatar is still named, and +3 is read as 3 more.

## Examples

### A team

```html
<ui-avatar-group label="Kitchen team" [people]="people" [max]="3" />

people = [{ name: 'Hatem Mohamed', src: '/hatem.jpg' }, { name: 'Mohamed Ibrahim' }, …];
```

### In Arabic

Translate the '+n' name with moreLabel.

```html
<ui-avatar-group label="فريق المطبخ" [people]="people" [max]="2" [moreLabel]="more" />

more = (count: number) => `${count} آخرون`;
```
