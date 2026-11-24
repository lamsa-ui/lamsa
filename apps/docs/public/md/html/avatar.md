# Avatar

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A person's photo, or their initials when there is no photo or it fails to load. Screen readers hear the person's name, never the file name.

Docs: https://lamsa-ui.github.io/lamsa/components/avatar

```html
<span class="ui-avatar" role="img" aria-label="Hatem Mohamed">HM</span>
```

When to use something else:

- Show several people in a small space: [Avatar group](https://lamsa-ui.github.io/lamsa/components/avatar-group)
- Show a status next to a person, such as online: [Status dot](https://lamsa-ui.github.io/lamsa/components/status-dot)
- A logo or a product picture: A plain img with alt text

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-avatar` | `class` |  | Required. Add role="img" and aria-label with the name, or aria-hidden="true" when the name is beside it. |
| `ui-avatar--sm \| --lg` | `class` |  | The size. Without one it is 40 pixels. |
| `--ui-avatar-size` | `custom property` | `2.5rem` | Any other size; the initials scale with it. |
| `img alt=""` | `child` |  | The photo. Its alt stays empty: the avatar itself carries the name. Swap to initials on its error event. |

Keyboard and screen readers:

- Screen readers hear the person’s name, never the file name.

## Examples

### Initials and sizes

Initials are the first letter of the first and last word, so they work for Arabic names too. A broken photo falls back to initials.

```html
<span class="ui-avatar ui-avatar--sm" role="img" aria-label="Hatem Mohamed">HM</span>
<span class="ui-avatar" role="img" aria-label="Mohamed Ibrahim">MI</span>
<span class="ui-avatar ui-avatar--lg" role="img" aria-label="Ibrahim Hatem">
  <img src="/ibrahim.jpg" alt="" />
</span>
```

### Next to a name

When the name is written beside it, mark the avatar decorative so a screen reader says the name once.

```html
<div class="flex items-center gap-3">
  <span class="ui-avatar" aria-hidden="true">HM</span>
  <span>Hatem Mohamed</span>
</div>
```

### In Arabic

```html
<span class="ui-avatar" role="img" aria-label="حاتم محمد">م&zwnj;ع</span>
```
