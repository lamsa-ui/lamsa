import { Component } from '@angular/core';
import { BadgeComponent, CardComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-card-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    CardComponent,
    BadgeComponent,
  ],
  template: `
    <app-page
      title="Card"
      lead="A surface that groups related content: a summary, a list, a form. Cards are flat, with a thin border; shadows are kept for things that float, like menus and dialogs."
      [usage]="usage"
    >
      <app-example
        title="With a title"
        description="Set the heading level so the title fits the page: level 2 under the page title, level 3 inside a section."
        [code]="titled"
      >
        <ui-card title="Order #1042" class="doc-field">
          <p class="doc-flat">2 items · 340 EGP</p>
          <ui-badge variant="success">Paid</ui-badge>
        </ui-card>
      </app-example>

      <app-example
        title="Roomy"
        description="More padding, for a card that stands alone on a page."
        [code]="roomy"
      >
        <ui-card title="Today" padding="lg" class="doc-field">
          <p class="doc-flat">18 orders, 3 still in the kitchen.</p>
        </ui-card>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-card title="طلب رقم ١٠٤٢" class="doc-field">
          <p class="doc-flat">صنفين · ٣٤٠ جنيه</p>
        </ui-card>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class CardPageComponent {
  protected readonly usage = {
    angular: `import { CardComponent } from '@ghazal-ui/angular';`,
    react: `import { Card } from '@ghazal-ui/react';`,
    vue: `import { Card } from '@ghazal-ui/vue';`,
    html: `<div class="ui-card">...</div>`,
  };

  protected readonly titled = {
    angular: `<ui-card title="Order #1042">
  <p>2 items · 340 EGP</p>
  <ui-badge variant="success">Paid</ui-badge>
</ui-card>`,
    react: `<Card title="Order #1042">
  <p>2 items · 340 EGP</p>
  <Badge variant="success">Paid</Badge>
</Card>`,
    vue: `<Card title="Order #1042">
  <p>2 items · 340 EGP</p>
  <Badge variant="success">Paid</Badge>
</Card>`,
    html: `<div class="ui-card">
  <h3 class="ui-card__title">Order #1042</h3>
  <p>2 items · 340 EGP</p>
  <span class="ui-badge ui-badge--success">Paid</span>
</div>`,
  };

  protected readonly roomy = {
    angular: `<ui-card title="Today" padding="lg" [level]="2">
  <p>18 orders, 3 still in the kitchen.</p>
</ui-card>`,
    react: `<Card title="Today" padding="lg" level={2}>
  <p>18 orders, 3 still in the kitchen.</p>
</Card>`,
    vue: `<Card title="Today" padding="lg" :level="2">
  <p>18 orders, 3 still in the kitchen.</p>
</Card>`,
    html: `<div class="ui-card ui-card--lg">
  <h2 class="ui-card__title">Today</h2>
  <p>18 orders, 3 still in the kitchen.</p>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-card title="طلب رقم ١٠٤٢">
  <p>صنفين · ٣٤٠ جنيه</p>
</ui-card>`,
    react: `<Card title="طلب رقم ١٠٤٢">
  <p>صنفين · ٣٤٠ جنيه</p>
</Card>`,
    vue: `<Card title="طلب رقم ١٠٤٢">
  <p>صنفين · ٣٤٠ جنيه</p>
</Card>`,
    html: `<div class="ui-card">
  <h3 class="ui-card__title">طلب رقم ١٠٤٢</h3>
  <p>صنفين · ٣٤٠ جنيه</p>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Separate two groups with a line only',
      use: 'Divider',
      path: '/components/divider',
    },
    {
      need: 'Label and value pairs, such as order details',
      use: 'Property list',
      path: '/components/property-list',
    },
    {
      need: 'One number and how it changed',
      use: 'Stat',
      path: '/components/stat',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'title',
        type: 'string',
        description: 'Optional heading at the top of the card.',
      },
      {
        name: 'level',
        type: '2 | 3 | 4',
        default: '3',
        description: 'The heading level of the title.',
      },
      {
        name: 'padding',
        type: "'md' | 'lg'",
        default: "'md'",
        description: '1.5rem or 2rem inside the border.',
      },
    ],
    react: [
      {
        name: 'title',
        type: 'string',
        description: 'Optional heading at the top of the card.',
      },
      {
        name: 'level',
        type: '2 | 3 | 4',
        default: '3',
        description: 'The heading level of the title.',
      },
      {
        name: 'padding',
        type: "'md' | 'lg'",
        default: "'md'",
        description: '1.5rem or 2rem inside the border.',
      },
      {
        name: '...props',
        type: 'div props',
        description: 'Every native div prop: id, aria-label, ref.',
      },
    ],
    vue: [
      {
        name: 'title',
        type: 'string',
        description: 'Optional heading at the top of the card.',
      },
      {
        name: 'level',
        type: '2 | 3 | 4',
        default: '3',
        description: 'The heading level of the title.',
      },
      {
        name: 'padding',
        type: "'md' | 'lg'",
        default: "'md'",
        description: '1.5rem or 2rem inside the border.',
      },
    ],
    html: [
      {
        name: 'ui-card',
        type: 'class',
        description: 'Required. Stacks its children with a 1rem gap.',
      },
      {
        name: 'ui-card--lg',
        type: 'class',
        description: 'More padding.',
      },
      {
        name: 'ui-card__title',
        type: 'class',
        description: 'On the heading (h2 to h4, to fit the page).',
      },
    ],
  };
}
