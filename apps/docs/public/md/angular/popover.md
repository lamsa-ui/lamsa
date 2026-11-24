# Popover

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A small panel next to its button, for a few details or a couple of settings. It is not modal: focus moves into it, and Escape or a click outside closes it and puts focus back on the button. Screen readers name it after the button. For a task that needs the reader's full attention, use a dialog.

Docs: https://ghazal-ui.github.io/ghazal/components/popover

```ts
import { PopoverTriggerDirective } from '@ghazal-ui/angular';
// On the Angular CDK overlay. Add @angular/cdk/overlay-prebuilt.css.
```

When to use something else:

- A short label for an icon button: [Tooltip](https://ghazal-ui.github.io/ghazal/components/tooltip)
- A list of actions: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)
- A task that needs the reader’s full attention: [Dialog](https://ghazal-ui.github.io/ghazal/components/dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `[uiPopoverTrigger]` | `TemplateRef` |  | Required, on the button: the content to show. |

Keyboard and screen readers:

- Enter or Space: Open it from its button; focus moves in.
- Escape: Close it, and put focus back on the button.
- Named after its button. It is not modal, so the page stays reachable.

## Examples

### Details

```html
<button ui-button variant="secondary" [uiPopoverTrigger]="fee">Delivery fee</button>
<ng-template #fee>
  <p class="ui-popover__title">EGP 45 in Cairo and Giza</p>
  <p>Free on orders over EGP 500.</p>
</ng-template>
```

### A few settings

```html
<button ui-button variant="secondary" [uiPopoverTrigger]="view">View options</button>
<ng-template #view>
  <ui-switch label="Show paid orders" formControlName="paid" />
  <ui-switch label="Compact rows" formControlName="compact" />
</ng-template>
```
