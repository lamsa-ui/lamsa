import { Component } from '@angular/core';
import { BadgeComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-badge-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    BadgeComponent,
  ],
  template: `
    <app-page
      title="Badge"
      lead="A short status label, such as the state of an order. The words carry the meaning and the colour only repeats it, so every status reads the same without colour."
      [usage]="usage"
    >
      <app-example
        title="Variants"
        description="Each pair of text and fill passes 7:1 in both themes. Danger uses brand red, so keep it for problems."
        [code]="variants"
      >
        <ui-badge>Draft</ui-badge>
        <ui-badge variant="info">New</ui-badge>
        <ui-badge variant="success">Paid</ui-badge>
        <ui-badge variant="warning">Late</ui-badge>
        <ui-badge variant="danger">Cancelled</ui-badge>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-badge variant="success">مدفوع</ui-badge>
        <ui-badge variant="warning">متأخر</ui-badge>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class BadgePageComponent {
  protected readonly usage = {
    angular: `import { BadgeComponent } from '@lamsa-ui/angular';`,
    react: `import { Badge } from '@lamsa-ui/react';`,
    vue: `import { Badge } from '@lamsa-ui/vue';`,
    html: `<span class="ui-badge ui-badge--success">Paid</span>`,
  };

  protected readonly variants = {
    angular: `<ui-badge>Draft</ui-badge>
<ui-badge variant="info">New</ui-badge>
<ui-badge variant="success">Paid</ui-badge>
<ui-badge variant="warning">Late</ui-badge>
<ui-badge variant="danger">Cancelled</ui-badge>`,
    react: `<Badge>Draft</Badge>
<Badge variant="info">New</Badge>
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Late</Badge>
<Badge variant="danger">Cancelled</Badge>`,
    vue: `<Badge>Draft</Badge>
<Badge variant="info">New</Badge>
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Late</Badge>
<Badge variant="danger">Cancelled</Badge>`,
    html: `<span class="ui-badge">Draft</span>
<span class="ui-badge ui-badge--info">New</span>
<span class="ui-badge ui-badge--success">Paid</span>
<span class="ui-badge ui-badge--warning">Late</span>
<span class="ui-badge ui-badge--danger">Cancelled</span>`,
  };

  protected readonly arabic = {
    angular: `<ui-badge variant="success">مدفوع</ui-badge>
<ui-badge variant="warning">متأخر</ui-badge>`,
    react: `<Badge variant="success">مدفوع</Badge>
<Badge variant="warning">متأخر</Badge>`,
    vue: `<Badge variant="success">مدفوع</Badge>
<Badge variant="warning">متأخر</Badge>`,
    html: `<span class="ui-badge ui-badge--success">مدفوع</span>
<span class="ui-badge ui-badge--warning">متأخر</span>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A label the user added or can remove, such as a filter',
      use: 'Tag',
      path: '/components/tag',
    },
    {
      need: 'A live state such as online or offline',
      use: 'Status dot',
      path: '/components/status-dot',
    },
    {
      need: 'A message the reader must read',
      use: 'Alert',
      path: '/components/alert',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'variant',
        type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: 'The colour. The text must say the status too.',
      },
    ],
    react: [
      {
        name: 'variant',
        type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: 'The colour. The text must say the status too.',
      },
      {
        name: '...props',
        type: 'span props',
        description: 'Every native span prop: id, title, ref.',
      },
    ],
    vue: [
      {
        name: 'variant',
        type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: 'The colour. The text must say the status too.',
      },
    ],
    html: [
      {
        name: 'ui-badge',
        type: 'class',
        description: 'Required. On its own it is the neutral badge.',
      },
      {
        name: 'ui-badge--info | --success | --warning | --danger',
        type: 'class',
        description: 'The colour. Use one at most.',
      },
    ],
  };
}
