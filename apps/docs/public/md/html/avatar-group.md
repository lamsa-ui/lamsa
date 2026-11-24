# Avatar group

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Several people in a small space: the first few avatars overlap and a '+3' stands for the rest. The group has a name, every avatar is still named, and '+3' is read as '3 more'.

Docs: https://ghazal-ui.github.io/ghazal/components/avatar-group

```html
<div class="ui-avatar-group" role="group" aria-label="Kitchen team">…</div>
```

When to use something else:

- One person: [Avatar](https://ghazal-ui.github.io/ghazal/components/avatar)
- Every name visible, such as a list of attendees: [A list or Data table](https://ghazal-ui.github.io/ghazal/components/data-table)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-avatar-group` | `class` |  | Overlaps the .ui-avatar children. Add role="group" and aria-label. |
| `ui-avatar-group__more` | `class` |  | On the "+n" avatar. Give it an aria-label such as "2 more". |

Keyboard and screen readers:

- The group has a name, every avatar is still named, and +3 is read as 3 more.

## Examples

### A team

```html
<div class="ui-avatar-group" role="group" aria-label="Kitchen team">
  <span class="ui-avatar" role="img" aria-label="Hatem Mohamed">HM</span>
  <span class="ui-avatar" role="img" aria-label="Mohamed Ibrahim">MI</span>
  <span class="ui-avatar" role="img" aria-label="Ibrahim Hatem">IH</span>
  <span class="ui-avatar ui-avatar-group__more" role="img" aria-label="2 more">+2</span>
</div>
```

### In Arabic

Translate the '+n' name with moreLabel.

```html
<div class="ui-avatar-group" role="group" aria-label="فريق المطبخ">
  <span class="ui-avatar" role="img" aria-label="حاتم محمد">م‌ع</span>
  <span class="ui-avatar ui-avatar-group__more" role="img" aria-label="1 آخرون">+1</span>
</div>
```
