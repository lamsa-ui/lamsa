import { Component } from '@angular/core';
import {
  ButtonComponent,
  CardComponent,
  EmptyStateComponent,
} from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-empty-state-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    EmptyStateComponent,
    ButtonComponent,
    CardComponent,
  ],
  template: `
    <app-page
      title="Empty state"
      lead="What a list, table or page shows while it has nothing in it. It says what will appear here, why it is empty now, and offers the one action that fills it."
      [usage]="usage"
    >
      <app-example
        title="First use"
        description="Nothing has been made yet: name what goes here and give the action that makes the first one."
        [code]="first"
      >
        <ui-card class="w-full">
          <ui-empty-state title="No orders yet">
            <p>Orders show here as soon as a customer pays.</p>
            <div ui-empty-state-actions>
              <button ui-button type="button">Share your menu</button>
            </div>
          </ui-empty-state>
        </ui-card>
      </app-example>

      <app-example
        title="No results"
        description="A search or filter matched nothing: say so, and give the way back."
        [code]="results"
      >
        <ui-card class="w-full">
          <ui-empty-state title="No orders match “Mohamed”">
            <p>Check the spelling, or search by order number.</p>
            <div ui-empty-state-actions>
              <button ui-button variant="secondary" type="button">
                Clear search
              </button>
            </div>
          </ui-empty-state>
        </ui-card>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-card class="w-full">
          <ui-empty-state title="لا توجد طلبات بعد">
            <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
          </ui-empty-state>
        </ui-card>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class EmptyStatePageComponent {
  protected readonly usage = {
    angular: `import { EmptyStateComponent } from '@ghazal-ui/angular';`,
    react: `import { EmptyState } from '@ghazal-ui/react';`,
    vue: `import { EmptyState } from '@ghazal-ui/vue';`,
    html: `<div class="ui-empty-state">...</div>`,
  };

  protected readonly first = {
    angular: `<ui-empty-state title="No orders yet">
  <p>Orders show here as soon as a customer pays.</p>
  <div ui-empty-state-actions>
    <button ui-button>Share your menu</button>
  </div>
</ui-empty-state>`,
    react: `<EmptyState
  title="No orders yet"
  actions={<Button>Share your menu</Button>}
>
  <p>Orders show here as soon as a customer pays.</p>
</EmptyState>`,
    vue: `<EmptyState title="No orders yet">
  <p>Orders show here as soon as a customer pays.</p>
  <template #actions>
    <Button>Share your menu</Button>
  </template>
</EmptyState>`,
    html: `<div class="ui-empty-state">
  <h3 class="ui-empty-state__title">No orders yet</h3>
  <p>Orders show here as soon as a customer pays.</p>
  <div class="ui-empty-state__actions">
    <button class="ui-button ui-button--primary">Share your menu</button>
  </div>
</div>`,
  };

  protected readonly results = {
    angular: `<ui-empty-state title="No orders match “Mohamed”">
  <p>Check the spelling, or search by order number.</p>
  <div ui-empty-state-actions>
    <button ui-button variant="secondary">Clear search</button>
  </div>
</ui-empty-state>`,
    react: `<EmptyState
  title="No orders match “Mohamed”"
  actions={<Button variant="secondary">Clear search</Button>}
>
  <p>Check the spelling, or search by order number.</p>
</EmptyState>`,
    vue: `<EmptyState title="No orders match “Mohamed”">
  <p>Check the spelling, or search by order number.</p>
  <template #actions>
    <Button variant="secondary">Clear search</Button>
  </template>
</EmptyState>`,
    html: `<div class="ui-empty-state">
  <h3 class="ui-empty-state__title">No orders match “Mohamed”</h3>
  <p>Check the spelling, or search by order number.</p>
  <div class="ui-empty-state__actions">
    <button class="ui-button ui-button--secondary">Clear search</button>
  </div>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-empty-state title="لا توجد طلبات بعد">
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</ui-empty-state>`,
    react: `<EmptyState title="لا توجد طلبات بعد">
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</EmptyState>`,
    vue: `<EmptyState title="لا توجد طلبات بعد">
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</EmptyState>`,
    html: `<div class="ui-empty-state">
  <h3 class="ui-empty-state__title">لا توجد طلبات بعد</h3>
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Content that is still loading',
      use: 'Skeleton',
      path: '/components/skeleton',
    },
    { need: 'Something went wrong', use: 'Alert', path: '/components/alert' },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'title',
        type: 'string',
        description: 'Required. What is missing, as a heading.',
      },
      {
        name: 'level',
        type: '2 | 3 | 4',
        default: '3',
        description: 'Heading level of the title, so it fits the page outline.',
      },
      {
        name: '[ui-empty-state-actions]',
        type: 'slot',
        description: 'The action that fills the space. One, usually.',
      },
    ],
    react: [
      {
        name: 'title',
        type: 'string',
        description: 'Required. What is missing, as a heading.',
      },
      {
        name: 'level',
        type: '2 | 3 | 4',
        default: '3',
        description: 'Heading level of the title, so it fits the page outline.',
      },
      {
        name: 'actions',
        type: 'ReactNode',
        description: 'The action that fills the space. One, usually.',
      },
    ],
    vue: [
      {
        name: 'title',
        type: 'string',
        description: 'Required. What is missing, as a heading.',
      },
      {
        name: 'level',
        type: '2 | 3 | 4',
        default: '3',
        description: 'Heading level of the title, so it fits the page outline.',
      },
      {
        name: '#actions',
        type: 'slot',
        description: 'The action that fills the space. One, usually.',
      },
    ],
    html: [
      {
        name: 'ui-empty-state',
        type: 'class',
        description: 'Required. Centres its content.',
      },
      {
        name: 'ui-empty-state__title',
        type: 'class',
        description: 'On the heading.',
      },
      {
        name: 'ui-empty-state__actions',
        type: 'class',
        description: 'Around the buttons.',
      },
    ],
  };
}
