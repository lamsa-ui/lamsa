# Status dot

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A small coloured dot before the word for a live state: online, busy, offline. The word is always there and carries the meaning; the dot lets the eye scan a long list.

Docs: https://lamsa-ui.github.io/lamsa/components/status-dot

```html
<span class="ui-status-dot ui-status-dot--success">Online</span>
```

When to use something else:

- A status that stands out in a table row, such as Paid: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)
- A message about the status: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-status-dot` | `class` |  | On a span holding the word. Tones: --info, --success, --warning, --danger. |

## Examples

### Tones

```html
<span class="ui-status-dot ui-status-dot--success">Online</span>
<span class="ui-status-dot ui-status-dot--warning">Busy</span>
<span class="ui-status-dot ui-status-dot--danger">Down</span>
<span class="ui-status-dot ui-status-dot--info">Syncing</span>
<span class="ui-status-dot">Offline</span>
```

### In Arabic

```html
<span class="ui-status-dot ui-status-dot--success">متصل</span>
```
