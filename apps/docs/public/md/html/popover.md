# Popover

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A small panel next to its button, for a few details or a couple of settings. It is not modal: focus moves into it, and Escape or a click outside closes it and puts focus back on the button. Screen readers name it after the button. For a task that needs the reader's full attention, use a dialog.

Docs: https://lamsa-ui.github.io/lamsa/components/popover

```html
<!-- The native popover attribute opens it with no script; place it yourself. -->
<button class="ui-button ui-button--secondary" popovertarget="fee" id="fee-button">Delivery fee</button>
<div class="ui-popover" id="fee" popover role="dialog" aria-labelledby="fee-button">
  <p>Free on orders over EGP 500.</p>
</div>
```

When to use something else:

- A short label for an icon button: [Tooltip](https://lamsa-ui.github.io/lamsa/components/tooltip)
- A list of actions: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)
- A task that needs the reader’s full attention: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-popover` | `class` |  | On the panel, with role="dialog" named by its button. |
| `ui-popover__title` | `class` |  | A bold first line. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or Space: Open it from its button; focus moves in.
- Escape: Close it, and put focus back on the button.
- Named after its button. It is not modal, so the page stays reachable.

## Examples

### Details

```html
<!-- See "Use it" -->
```

### A few settings

```html
<!-- See "Use it" -->
```
