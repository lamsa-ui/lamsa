import { Component } from '@angular/core';
import {
  ButtonComponent,
  PopoverTriggerDirective,
  SwitchComponent,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-popover-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    PopoverTriggerDirective,
    SwitchComponent,
  ],
  template: `
    <app-page
      title="Popover"
      lead="A small panel next to its button, for a few details or a couple of settings. It is not modal: focus moves into it, and Escape or a click outside closes it and puts focus back on the button. Screen readers name it after the button. For a task that needs the reader's full attention, use a dialog."
      [usage]="usage"
    >
      <app-example title="Details" [code]="basic">
        <button ui-button variant="secondary" [uiPopoverTrigger]="fee">
          Delivery fee
        </button>
        <ng-template #fee>
          <p class="ui-popover__title">EGP 45 in Cairo and Giza</p>
          <p>Free on orders over EGP 500.</p>
        </ng-template>
      </app-example>

      <app-example title="A few settings" [code]="settings">
        <button ui-button variant="secondary" [uiPopoverTrigger]="view">
          View options
        </button>
        <ng-template #view>
          <ui-switch label="Show paid orders" />
          <ui-switch label="Compact rows" />
        </ng-template>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class PopoverPageComponent {
  protected readonly usage = {
    angular: `import { PopoverTriggerDirective } from '@lamsa-ui/angular';
// On the Angular CDK overlay. Add @angular/cdk/overlay-prebuilt.css.`,
    react: `import { Popover } from '@lamsa-ui/react';`,
    vue: `import { Popover } from '@lamsa-ui/vue';`,
    html: `<!-- The native popover attribute opens it with no script; place it yourself. -->
<button class="ui-button ui-button--secondary" popovertarget="fee" id="fee-button">Delivery fee</button>
<div class="ui-popover" id="fee" popover role="dialog" aria-labelledby="fee-button">
  <p>Free on orders over EGP 500.</p>
</div>`,
  };

  protected readonly basic = {
    angular: `<button ui-button variant="secondary" [uiPopoverTrigger]="fee">Delivery fee</button>
<ng-template #fee>
  <p class="ui-popover__title">EGP 45 in Cairo and Giza</p>
  <p>Free on orders over EGP 500.</p>
</ng-template>`,
    react: `<Popover trigger={<Button variant="secondary">Delivery fee</Button>}>
  <p className="ui-popover__title">EGP 45 in Cairo and Giza</p>
  <p>Free on orders over EGP 500.</p>
</Popover>`,
    vue: `<Popover>
  <template #trigger><Button variant="secondary">Delivery fee</Button></template>
  <p class="ui-popover__title">EGP 45 in Cairo and Giza</p>
  <p>Free on orders over EGP 500.</p>
</Popover>`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly settings = {
    angular: `<button ui-button variant="secondary" [uiPopoverTrigger]="view">View options</button>
<ng-template #view>
  <ui-switch label="Show paid orders" formControlName="paid" />
  <ui-switch label="Compact rows" formControlName="compact" />
</ng-template>`,
    react: `<Popover trigger={<Button variant="secondary">View options</Button>}>
  <Switch label="Show paid orders" />
  <Switch label="Compact rows" />
</Popover>`,
    vue: `<Popover>
  <template #trigger><Button variant="secondary">View options</Button></template>
  <Switch label="Show paid orders" />
  <Switch label="Compact rows" />
</Popover>`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A short label for an icon button',
      use: 'Tooltip',
      path: '/components/tooltip',
    },
    { need: 'A list of actions', use: 'Menu', path: '/components/menu' },
    {
      need: 'A task that needs the reader’s full attention',
      use: 'Dialog',
      path: '/components/dialog',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: '[uiPopoverTrigger]',
        type: 'TemplateRef',
        description: 'Required, on the button: the content to show.',
      },
    ],
    react: [
      {
        name: 'trigger',
        type: 'ReactElement',
        description: 'Required. One pressable element, such as Button.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'The content of the panel.',
      },
      {
        name: 'placement',
        type: "'bottom start' | 'top start' | …",
        default: "'bottom start'",
        description: 'Where it opens, if there is room.',
      },
    ],
    vue: [
      {
        name: '#trigger',
        type: 'slot',
        description: 'Required. One pressable element, such as Button.',
      },
      {
        name: 'default slot',
        type: 'slot',
        description: 'The content of the panel.',
      },
      {
        name: 'placement',
        type: "'bottom start' | 'top start' | …",
        default: "'bottom start'",
        description: 'Where it opens, if there is room.',
      },
    ],
    html: [
      {
        name: 'ui-popover',
        type: 'class',
        description: 'On the panel, with role="dialog" named by its button.',
      },
      {
        name: 'ui-popover__title',
        type: 'class',
        description: 'A bold first line.',
      },
    ],
  };
}
