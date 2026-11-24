import { Component, resource } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes,
} from '@angular/router';
import {
  BadgeComponent,
  SpinnerComponent,
  TextFieldComponent,
  TabComponent,
  TabContentDirective,
  TabNavComponent,
  TabsComponent,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

/** Stands in for a list from an API: answers after a second, and says when. */
@Component({
  selector: 'app-tab-api-demo',
  imports: [SpinnerComponent],
  template: `
    @if (data.isLoading()) {
      <ui-spinner [label]="'Loading ' + what" showLabel />
    } @else if (data.value(); as value) {
      <p class="doc-flat">{{ value }}</p>
    }
  `,
})
export class TabApiDemoComponent {
  protected readonly what = 'invoices';
  protected readonly data = resource({
    loader: () =>
      new Promise<string>((resolve) =>
        setTimeout(
          () =>
            resolve(
              `3 ${this.what}, loaded at ${new Date().toLocaleTimeString()}.`,
            ),
          1000,
        ),
      ),
  });
}

@Component({
  template: `<p class="doc-flat">Hatem Mohamed, hatem&#64;example.com.</p>`,
})
class ProfileTabComponent {}

@Component({
  imports: [TabApiDemoComponent],
  template: `<app-tab-api-demo />`,
})
class BillingTabComponent {}

@Component({
  imports: [TextFieldComponent],
  template: `<ui-text-field label="Recovery note" class="doc-field" />`,
})
class SecurityTabComponent {}

/** The routed tabs example: each tab is a child page of this one. Security is kept. */
export const tabRoutes: Routes = [
  { path: '', component: ProfileTabComponent },
  { path: 'billing', component: BillingTabComponent },
  {
    path: 'security',
    component: SecurityTabComponent,
    data: { keep: true },
  },
];

@Component({
  selector: 'app-tabs-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TabsComponent,
    TabComponent,
    TabContentDirective,
    TabNavComponent,
    TabApiDemoComponent,
    BadgeComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  template: `
    <app-page
      title="Tabs"
      lead="Views of one thing side by side, such as an order's details and its history. Tab reaches the chosen tab, the arrow keys move between tabs and show each one, Home and End go to the first and last. The chosen tab gets a bar and full-strength text, not only a colour."
      [usage]="usage"
    >
      <app-example title="An order" [code]="basic">
        <ui-tabs label="Order 1042" class="doc-wide">
          <ui-tab label="Details">
            <p class="doc-flat">
              Delivered to 12 Tahrir Street, Cairo.
              <ui-badge variant="success">Paid</ui-badge>
            </p>
          </ui-tab>
          <ui-tab label="Invoice" disabled>
            <p class="doc-flat">Not ready yet.</p>
          </ui-tab>
          <ui-tab label="History">
            <p class="doc-flat">
              Placed on 2 November, delivered on 4 November.
            </p>
          </ui-tab>
        </ui-tabs>
      </app-example>

      <app-example
        title="Many tabs"
        description="Wider than the page, the tabs scroll. Choosing one, by click or arrow key, moves it to the middle, so the tabs on both sides of it stay in sight. Under reduced motion it moves without gliding."
        [code]="many"
      >
        <ui-tabs label="Sales by month" class="doc-wide">
          @for (month of months; track month) {
            <ui-tab [label]="month">
              <p class="doc-flat">Sales for {{ month }}.</p>
            </ui-tab>
          }
        </ui-tabs>
      </app-example>

      <app-example
        title="Load when shown"
        description="Put content that calls an API in an ng-template with uiTabContent: it is created, and its call made, only when the tab is chosen. Without it, everything inside a tab is created with the page. The spinner tells screen readers the panel is loading."
        [code]="lazy"
      >
        <ui-tabs label="Customer 518" class="doc-wide">
          <ui-tab label="Details">
            <p class="doc-flat">Customer since 2021.</p>
          </ui-tab>
          <ui-tab label="Invoices">
            <ng-template uiTabContent><app-tab-api-demo /></ng-template>
          </ui-tab>
        </ui-tabs>
      </app-example>

      <app-example
        title="Keep or reload"
        description="By default, lazy content is created again each time its tab is chosen, so it loads fresh: watch the time change. Add keep to a tab to load it once and find it as it was when you come back, with what was typed and where it was scrolled."
        [code]="keep"
      >
        <ui-tabs label="Invoices" class="doc-wide">
          <ui-tab label="Reloads">
            <ng-template uiTabContent><app-tab-api-demo /></ng-template>
          </ui-tab>
          <ui-tab label="Kept" keep>
            <ng-template uiTabContent><app-tab-api-demo /></ng-template>
          </ui-tab>
        </ui-tabs>
      </app-example>

      <app-example
        title="A page for each tab"
        description='When each tab has its own address, use ui-tab-nav: links styled as tabs, over a router-outlet. They are links, not a tablist, so Tab moves through them, the back button works and each one can open in a new browser tab. The current one is marked aria-current="page". Each visit makes the page again, so Billing loads again; Security is kept with KeepRouteStrategy: type a note, go to another tab and come back.'
        [code]="routed"
      >
        <div class="ui-tabs doc-wide">
          <ui-tab-nav label="Account">
            @for (page of pages; track page.path) {
              <a
                class="ui-tab"
                [routerLink]="page.path"
                routerLinkActive
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
                >{{ page.label }}</a
              >
            }
          </ui-tab-nav>
          <router-outlet />
        </div>
      </app-example>

      <app-example
        title="In Arabic"
        description="The tabs run right to left and the arrow keys follow: the right arrow goes back."
        [rtl]="true"
        [code]="arabic"
      >
        <ui-tabs label="الطلب ١٠٤٢" class="doc-wide">
          <ui-tab label="التفاصيل">
            <p class="doc-flat">اتسلّم في ١٢ شارع التحرير، القاهرة.</p>
          </ui-tab>
          <ui-tab label="السجل">
            <p class="doc-flat">اتطلب يوم ٢ نوفمبر.</p>
          </ui-tab>
        </ui-tabs>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TabsPageComponent {
  protected readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  protected readonly pages = [
    { path: './', label: 'Profile' },
    { path: 'billing', label: 'Billing' },
    { path: 'security', label: 'Security' },
  ];

  protected readonly usage = {
    angular: `import {
  TabComponent,
  TabContentDirective, // content created only when its tab is shown
  TabNavComponent, // tabs that are pages, with the router
  TabsComponent,
  KeepRouteStrategy, // keeps a routed tab's page between visits
} from '@lamsa-ui/angular';`,
    react: `import { TabNav, Tabs } from '@lamsa-ui/react';
// Arrow keys follow the locale's direction: wrap Arabic pages in <I18nProvider locale="ar">.`,
    vue: `import { TabNav, Tabs } from '@lamsa-ui/vue';
// Arrow keys follow the locale's direction: wrap Arabic pages in <I18nProvider locale="ar">.`,
    html: `<!-- Tabs need script for the keyboard. Follow the WAI-ARIA tabs pattern with these classes: -->
<div class="ui-tabs">
  <div class="ui-tabs__list" role="tablist" aria-label="Order 1042">
    <button class="ui-tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">Details</button>
    <button class="ui-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">History</button>
  </div>
  <div class="ui-tabs__panel" role="tabpanel" id="p1" aria-labelledby="t1" tabindex="0">…</div>
  <div class="ui-tabs__panel" role="tabpanel" id="p2" aria-labelledby="t2" tabindex="0" hidden>…</div>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-tabs label="Order 1042" [(selected)]="tab">
  <ui-tab label="Details">…</ui-tab>
  <ui-tab label="Invoice" disabled>…</ui-tab>
  <ui-tab label="History">…</ui-tab>
</ui-tabs>`,
    react: `<Tabs
  label="Order 1042"
  tabs={[
    { id: 'details', label: 'Details', content: <Details /> },
    { id: 'invoice', label: 'Invoice', content: <Invoice />, disabled: true },
    { id: 'history', label: 'History', content: <History /> },
  ]}
  selected={tab}
  onChange={setTab}
/>`,
    vue: `<Tabs
  v-model:selected="tab"
  label="Order 1042"
  :tabs="[
    { id: 'details', label: 'Details' },
    { id: 'invoice', label: 'Invoice', disabled: true },
    { id: 'history', label: 'History' },
  ]"
>
  <template #details><Details /></template>
  <template #invoice><Invoice /></template>
  <template #history><History /></template>
</Tabs>`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly many = {
    angular: `<ui-tabs label="Sales by month">
  @for (month of months; track month) {
    <ui-tab [label]="month">…</ui-tab>
  }
</ui-tabs>`,
    react: `<Tabs
  label="Sales by month"
  tabs={months.map((month) => ({ id: month, label: month, content: <Sales month={month} /> }))}
/>`,
    vue: `<Tabs label="Sales by month" :tabs="months.map((month) => ({ id: month, label: month }))">
  <template v-for="month in months" #[month]><Sales :month="month" /></template>
</Tabs>`,
    html: `<!-- .ui-tabs__list scrolls on its own. To centre the chosen tab, scroll only the list:
     list.scrollBy({ left: tabCentre - listCentre }) -->`,
  };

  protected readonly lazy = {
    angular: `<ui-tabs label="Customer 518">
  <ui-tab label="Details">…</ui-tab>
  <ui-tab label="Invoices">
    <ng-template uiTabContent><app-invoices /></ng-template>
  </ui-tab>
</ui-tabs>

// app-invoices: the call starts when the tab is first chosen.
readonly invoices = httpResource<Invoice[]>(() => '/api/invoices');

@if (invoices.isLoading()) {
  <ui-spinner label="Loading invoices" showLabel />
} @else { … }`,
    react: `// A tab's content mounts only while it is chosen, so its fetch starts then.
<Tabs
  label="Customer 518"
  tabs={[
    { id: 'details', label: 'Details', content: <Details /> },
    { id: 'invoices', label: 'Invoices', content: <Invoices /> },
  ]}
/>`,
    vue: `<!-- A tab's panel mounts only while it is chosen, so its fetch starts then. -->
<Tabs
  label="Customer 518"
  :tabs="[
    { id: 'details', label: 'Details' },
    { id: 'invoices', label: 'Invoices' },
  ]"
>
  <template #details><Details /></template>
  <template #invoices><Invoices /></template>
</Tabs>`,
  };

  protected readonly keep = {
    angular: `<ui-tabs label="Invoices">
  <!-- Created, and loaded, again on each visit -->
  <ui-tab label="Reloads">
    <ng-template uiTabContent><app-invoices /></ng-template>
  </ui-tab>
  <!-- Loaded once, then kept while hidden -->
  <ui-tab label="Kept" keep>
    <ng-template uiTabContent><app-invoices /></ng-template>
  </ui-tab>
</ui-tabs>`,
    react: `<Tabs
  label="Invoices"
  tabs={[
    // Mounted, and fetched, again on each visit
    { id: 'reloads', label: 'Reloads', content: <Invoices /> },
    // Fetched once, then kept while hidden
    { id: 'kept', label: 'Kept', content: <Invoices />, keep: true },
  ]}
/>`,
    vue: `<Tabs
  label="Invoices"
  :tabs="[
    { id: 'reloads', label: 'Reloads' },
    { id: 'kept', label: 'Kept', keep: true },
  ]"
>
  <!-- reloads: mounted, and fetched, again on each visit. kept: fetched once, then kept while hidden -->
  <template #reloads><Invoices /></template>
  <template #kept><Invoices /></template>
</Tabs>`,
  };

  protected readonly routed = {
    angular: `<ui-tab-nav label="Account">
  <a class="ui-tab" routerLink="./" routerLinkActive ariaCurrentWhenActive="page"
     [routerLinkActiveOptions]="{ exact: true }">Profile</a>
  <a class="ui-tab" routerLink="billing" routerLinkActive ariaCurrentWhenActive="page">Billing</a>
  <a class="ui-tab" routerLink="security" routerLinkActive ariaCurrentWhenActive="page">Security</a>
</ui-tab-nav>
<router-outlet />

// Routes: each tab is a child of the page. data.keep keeps Security between visits.
{
  path: 'account',
  component: AccountPage,
  children: [
    { path: '', component: Profile },
    { path: 'billing', component: Billing },
    { path: 'security', component: Security, data: { keep: true } },
  ],
}

// app.config.ts
providers: [{ provide: RouteReuseStrategy, useClass: KeepRouteStrategy }]`,
    react: `// NavLink marks the current link aria-current="page".
<TabNav label="Account">
  <NavLink className="ui-tab" to="" end>Profile</NavLink>
  <NavLink className="ui-tab" to="billing">Billing</NavLink>
  <NavLink className="ui-tab" to="security">Security</NavLink>
</TabNav>
<Outlet />`,
    vue: `// NavLink marks the current link aria-current="page".
<TabNav label="Account">
  <NavLink class="ui-tab" to="" end>Profile</NavLink>
  <NavLink class="ui-tab" to="billing">Billing</NavLink>
  <NavLink class="ui-tab" to="security">Security</NavLink>
</TabNav>
<Outlet />`,
    html: `<nav class="ui-tabs__list" aria-label="Account">
  <a class="ui-tab" href="/account" aria-current="page">Profile</a>
  <a class="ui-tab" href="/account/billing">Billing</a>
</nav>`,
  };

  protected readonly arabic = {
    angular: `<ui-tabs label="الطلب ١٠٤٢">
  <ui-tab label="التفاصيل">…</ui-tab>
  <ui-tab label="السجل">…</ui-tab>
</ui-tabs>`,
    react: `<I18nProvider locale="ar">
  <Tabs label="الطلب ١٠٤٢" tabs={tabs} />
</I18nProvider>`,
    vue: `<I18nProvider locale="ar">
  <Tabs label="الطلب ١٠٤٢" :tabs="tabs" />
</I18nProvider>`,
    html: `<!-- dir="rtl" on the page; the arrow keys must flip in your script -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Links to other pages',
      use: 'Navigation',
      path: '/components/nav',
    },
    {
      need: 'Change how the same content is shown',
      use: 'Segmented control',
      path: '/components/segmented-control',
    },
    {
      need: 'Sections the reader may open together',
      use: 'Accordion',
      path: '/components/accordion',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required, on ui-tabs. Names the tab list.',
      },
      {
        name: '[(selected)]',
        type: 'number',
        default: '0',
        description: 'The index of the chosen tab.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid prefix; each tab gets -<index>.',
      },
      {
        name: 'ui-tab label',
        type: 'string',
        description: 'Required. The text on the tab.',
      },
      {
        name: 'ui-tab disabled',
        type: 'boolean',
        default: 'false',
        description: 'Shown but not chosen; arrow keys skip it.',
      },
      {
        name: 'ui-tab keep',
        type: 'boolean',
        default: 'false',
        description:
          'Keeps uiTabContent once shown, hidden while another tab is chosen. Off, it is made again on each visit.',
      },
      {
        name: 'ng-template uiTabContent',
        type: 'directive',
        description:
          "Inside ui-tab. The tab's content, created only when the tab is chosen.",
      },
      {
        name: 'ui-tab-nav label',
        type: 'string',
        description:
          'Required. Names the navigation; put links with class="ui-tab" inside.',
      },
      {
        name: 'KeepRouteStrategy',
        type: 'RouteReuseStrategy',
        description:
          'Provide it as the RouteReuseStrategy; a route with data: { keep: true } keeps its page between tabs, until the reader leaves the section.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the tab list.',
      },
      {
        name: 'tabs',
        type: 'TabItem[]',
        description:
          'Required. { id, label, content, disabled?, keep? }. content mounts only while its tab is chosen; keep holds it once shown.',
      },
      {
        name: 'selected, defaultSelected',
        type: 'string',
        description: "The chosen tab's id.",
      },
      {
        name: 'onChange',
        type: '(id: string) => void',
        description: 'Called when another tab is chosen.',
      },
      {
        name: 'TabNav label',
        type: 'string',
        description:
          'Required. Names the navigation; put links with className="ui-tab" inside, the current one aria-current="page".',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the tab list.',
      },
      {
        name: 'tabs',
        type: 'TabItem[]',
        description:
          'Required. { id, label, disabled?, keep? }. Each panel is the slot named after its id; it mounts only while its tab is chosen, and keep holds it once shown.',
      },
      {
        name: 'v-model:selected',
        type: 'string',
        description: "The chosen tab's id.",
      },
      {
        name: 'TabNav label',
        type: 'string',
        description:
          'Required. Names the navigation; put links with className="ui-tab" inside, the current one aria-current="page".',
      },
    ],
    html: [
      { name: 'ui-tabs', type: 'class', description: 'The wrapper.' },
      {
        name: 'ui-tabs__list',
        type: 'class',
        description:
          'On the element with role="tablist", or on a <nav> of links. Scrolls when the tabs are wider.',
      },
      {
        name: 'ui-tabs__bar, ui-tabs__scroll',
        type: 'class',
        description:
          'A row holding the list and an arrow button at each end; give the arrows tabindex="-1" and aria-hidden="true".',
      },
      {
        name: 'ui-tab',
        type: 'class',
        description:
          'On each button with role="tab" (aria-selected marks the chosen one), or each link (aria-current="page").',
      },
      {
        name: 'ui-tabs__panel',
        type: 'class',
        description: 'On each element with role="tabpanel".',
      },
    ],
  };
}
