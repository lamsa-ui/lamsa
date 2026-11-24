import { Component } from '@angular/core';
import {
  BadgeComponent,
  PropertyComponent,
  PropertyListComponent,
} from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-property-list-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    BadgeComponent,
    PropertyComponent,
    PropertyListComponent,
  ],
  template: `
    <app-page
      title="Property list"
      lead="Label and value pairs, such as the details of one order. Built on the native description list, so screen readers say how many items there are and pair each label with its value."
      [usage]="usage"
    >
      <app-example
        title="Order details"
        description="Two columns when there is room. Make the box narrow and each label goes above its value."
        [code]="order"
      >
        <dl ui-property-list class="w-full max-w-xl">
          <div ui-property term="Order">#1042</div>
          <div ui-property term="Status">
            <ui-badge variant="success">Paid</ui-badge>
          </div>
          <div ui-property term="Customer">Mona Adel</div>
          <div ui-property term="Delivery">14 Tahrir Street, Dokki, Giza</div>
          <div ui-property term="Total">EGP 370</div>
        </dl>
      </app-example>

      <app-example title="Stacked, in Arabic" [rtl]="true" [code]="arabic">
        <dl ui-property-list layout="stacked" class="w-full max-w-sm">
          <div ui-property term="الطلب">١٠٤٢</div>
          <div ui-property term="الإجمالي">٣٧٠ جنيه</div>
        </dl>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class PropertyListPageComponent {
  protected readonly usage = {
    angular: `import { PropertyComponent, PropertyListComponent } from '@lamsa-ui/angular';`,
    react: `import { Property, PropertyList } from '@lamsa-ui/react';`,
    vue: `import { Property, PropertyList } from '@lamsa-ui/vue';`,
    html: `<dl class="ui-property-list">…</dl>`,
  };

  protected readonly order = {
    angular: `<dl ui-property-list>
  <div ui-property term="Order">#1042</div>
  <div ui-property term="Status"><ui-badge variant="success">Paid</ui-badge></div>
  <div ui-property term="Customer">Mona Adel</div>
  <div ui-property term="Delivery">14 Tahrir Street, Dokki, Giza</div>
  <div ui-property term="Total">EGP 370</div>
</dl>`,
    react: `<PropertyList>
  <Property term="Order">#1042</Property>
  <Property term="Status"><Badge variant="success">Paid</Badge></Property>
  <Property term="Customer">Mona Adel</Property>
  <Property term="Delivery">14 Tahrir Street, Dokki, Giza</Property>
  <Property term="Total">EGP 370</Property>
</PropertyList>`,
    vue: `<PropertyList>
  <Property term="Order">#1042</Property>
  <Property term="Status"><Badge variant="success">Paid</Badge></Property>
  <Property term="Customer">Mona Adel</Property>
  <Property term="Delivery">14 Tahrir Street, Dokki, Giza</Property>
  <Property term="Total">EGP 370</Property>
</PropertyList>`,
    html: `<dl class="ui-property-list">
  <div class="ui-property-list__item"><dt>Order</dt><dd>#1042</dd></div>
  <div class="ui-property-list__item">
    <dt>Status</dt><dd><span class="ui-badge ui-badge--success">Paid</span></dd>
  </div>
  <div class="ui-property-list__item"><dt>Total</dt><dd>EGP 370</dd></div>
</dl>`,
  };

  protected readonly arabic = {
    angular: `<dl ui-property-list layout="stacked">
  <div ui-property term="الطلب">١٠٤٢</div>
  <div ui-property term="الإجمالي">٣٧٠ جنيه</div>
</dl>`,
    react: `<PropertyList layout="stacked">
  <Property term="الطلب">١٠٤٢</Property>
  <Property term="الإجمالي">٣٧٠ جنيه</Property>
</PropertyList>`,
    vue: `<PropertyList layout="stacked">
  <Property term="الطلب">١٠٤٢</Property>
  <Property term="الإجمالي">٣٧٠ جنيه</Property>
</PropertyList>`,
    html: `<dl class="ui-property-list ui-property-list--stacked">
  <div class="ui-property-list__item"><dt>الطلب</dt><dd>١٠٤٢</dd></div>
</dl>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Many records with the same fields',
      use: 'Data table',
      path: '/components/data-table',
    },
    {
      need: 'One headline number',
      use: 'Stat',
      path: '/components/stat',
    },
    {
      need: 'Values the reader edits',
      use: 'Text field and the other form fields',
      path: '/components/text-field',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'layout',
        type: "'columns' | 'stacked'",
        default: "'columns'",
        description:
          'On dl[ui-property-list]. Stacked puts each label above its value at any width.',
      },
      {
        name: 'term',
        type: 'string',
        description:
          'On div[ui-property], required: the label. Its content is the value.',
      },
    ],
    react: [
      {
        name: 'layout',
        type: "'columns' | 'stacked'",
        default: "'columns'",
        description:
          'On PropertyList. Stacked puts each label above its value at any width.',
      },
      {
        name: 'term',
        type: 'string',
        description:
          'On Property, required: the label. Its children are the value.',
      },
    ],
    vue: [
      {
        name: 'layout',
        type: "'columns' | 'stacked'",
        default: "'columns'",
        description:
          'On PropertyList. Stacked puts each label above its value at any width.',
      },
      {
        name: 'term',
        type: 'string',
        description: 'On Property, required: the label. Its slot is the value.',
      },
    ],
    html: [
      {
        name: 'ui-property-list',
        type: 'class',
        description: 'On a dl. Add --stacked for labels above values.',
      },
      {
        name: 'ui-property-list__item',
        type: 'class',
        description: 'A div holding one dt and one dd.',
      },
    ],
  };
}
