import { Component } from '@angular/core';
import { NavComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-nav-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    NavComponent,
  ],
  template: `
    <app-page
      title="Navigation"
      lead="The app's main links, in a side bar. A named navigation landmark, links at least 44px tall, and the current page marked with a bar and bold text, not only a fill. On a phone, put the same links in a drawer."
      [usage]="usage"
    >
      <app-example title="A side bar" [code]="basic">
        <ui-nav label="Main" class="doc-field">
          <h2 class="ui-nav__title ui-label">Sales</h2>
          <ul>
            <li><a href="#orders" aria-current="page">Orders</a></li>
            <li><a href="#invoices">Invoices</a></li>
            <li><a href="#customers">Customers</a></li>
          </ul>
          <h2 class="ui-nav__title ui-label">Settings</h2>
          <ul>
            <li><a href="#team">Team</a></li>
          </ul>
        </ui-nav>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-nav label="الرئيسية" class="doc-field">
          <ul>
            <li><a href="#orders" aria-current="page">الطلبات</a></li>
            <li><a href="#invoices">الفواتير</a></li>
          </ul>
        </ui-nav>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class NavPageComponent {
  protected readonly usage = {
    angular: `import { NavComponent } from '@ghazal-ui/angular';
// Mark the current link with routerLinkActive ariaCurrentWhenActive="page".`,
    react: `import { Nav } from '@ghazal-ui/react';`,
    vue: `import { Nav } from '@ghazal-ui/vue';`,
    html: `<nav class="ui-nav" aria-label="Main">
  <ul>
    <li><a href="/orders" aria-current="page">Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</nav>`,
  };

  protected readonly basic = {
    angular: `<ui-nav label="Main">
  <h2 class="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a routerLink="/orders" routerLinkActive ariaCurrentWhenActive="page">Orders</a></li>
    <li><a routerLink="/invoices" routerLinkActive ariaCurrentWhenActive="page">Invoices</a></li>
  </ul>
</ui-nav>`,
    react: `<Nav label="Main">
  <h2 className="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a href="/orders" aria-current={page === 'orders' ? 'page' : undefined}>Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</Nav>`,
    vue: `<Nav label="Main">
  <h2 class="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a href="/orders" :aria-current="page === 'orders' ? 'page' : undefined">Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</Nav>`,
    html: `<nav class="ui-nav" aria-label="Main">
  <h2 class="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a href="/orders" aria-current="page">Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</nav>`,
  };

  protected readonly arabic = {
    angular: `<ui-nav label="الرئيسية">…</ui-nav>`,
    react: `<Nav label="الرئيسية">…</Nav>`,
    vue: `<Nav label="الرئيسية">…</Nav>`,
    html: `<!-- dir="rtl" on the page: the current page's bar moves to the right -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A whole app layout with header and side bar',
      use: 'App shell',
      path: '/components/app-shell',
    },
    { need: 'Views of one page', use: 'Tabs', path: '/components/tabs' },
    {
      need: 'Where the page sits in the site',
      use: 'Breadcrumbs',
      path: '/components/breadcrumbs',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. Names the landmark, so it differs from other navigation.',
      },
      {
        name: 'content',
        type: 'ul, h2',
        description: 'Lists of links, with optional group titles.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the landmark.',
      },
      {
        name: '...props',
        type: 'nav props',
        description: 'Every native nav prop.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the landmark.',
      },
    ],
    html: [
      {
        name: 'ui-nav',
        type: 'class',
        description: 'On a nav with aria-label.',
      },
      {
        name: 'ui-nav__title',
        type: 'class',
        description: 'A group title; add ui-label for the mono caps.',
      },
      {
        name: 'aria-current="page"',
        type: 'attribute',
        description: "On the current page's link.",
      },
    ],
  };
}
