# Tabs

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Views of one thing side by side, such as an order's details and its history. Tab reaches the chosen tab, the arrow keys move between tabs and show each one, Home and End go to the first and last. The chosen tab gets a bar and full-strength text, not only a colour.

Docs: https://ghazal-ui.github.io/ghazal/components/tabs

```ts
import {
  TabComponent,
  TabContentDirective, // content created only when its tab is shown
  TabNavComponent, // tabs that are pages, with the router
  TabsComponent,
  KeepRouteStrategy, // keeps a routed tab's page between visits
} from '@ghazal-ui/angular';
```

When to use something else:

- Links to other pages: [Navigation](https://ghazal-ui.github.io/ghazal/components/nav)
- Change how the same content is shown: [Segmented control](https://ghazal-ui.github.io/ghazal/components/segmented-control)
- Sections the reader may open together: [Accordion](https://ghazal-ui.github.io/ghazal/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required, on ui-tabs. Names the tab list. |
| `[(selected)]` | `number` | `0` | The index of the chosen tab. |
| `testId` | `string` |  | data-testid prefix; each tab gets -<index>. |
| `ui-tab label` | `string` |  | Required. The text on the tab. |
| `ui-tab disabled` | `boolean` | `false` | Shown but not chosen; arrow keys skip it. |
| `ui-tab keep` | `boolean` | `false` | Keeps uiTabContent once shown, hidden while another tab is chosen. Off, it is made again on each visit. |
| `ng-template uiTabContent` | `directive` |  | Inside ui-tab. The tab's content, created only when the tab is chosen. |
| `ui-tab-nav label` | `string` |  | Required. Names the navigation; put links with class="ui-tab" inside. |
| `KeepRouteStrategy` | `RouteReuseStrategy` |  | Provide it as the RouteReuseStrategy; a route with data: { keep: true } keeps its page between tabs, until the reader leaves the section. |

Keyboard and screen readers:

- Tab: Reach the chosen tab, and Tab again moves into its panel.
- Left or Right: Move to the previous or next tab and show it. Flipped in Arabic.
- Home or End: Go to the first or last tab.
- Read as tabs, with how many there are and which is chosen.

## Examples

### An order

```html
<ui-tabs label="Order 1042" [(selected)]="tab">
  <ui-tab label="Details">…</ui-tab>
  <ui-tab label="Invoice" disabled>…</ui-tab>
  <ui-tab label="History">…</ui-tab>
</ui-tabs>
```

### Many tabs

Wider than the page, the tabs scroll. Choosing one, by click or arrow key, moves it to the middle, so the tabs on both sides of it stay in sight. Under reduced motion it moves without gliding.

```html
<ui-tabs label="Sales by month">
  @for (month of months; track month) {
    <ui-tab [label]="month">…</ui-tab>
  }
</ui-tabs>
```

### Load when shown

Put content that calls an API in an ng-template with uiTabContent: it is created, and its call made, only when the tab is chosen. Without it, everything inside a tab is created with the page. The spinner tells screen readers the panel is loading.

```html
<ui-tabs label="Customer 518">
  <ui-tab label="Details">…</ui-tab>
  <ui-tab label="Invoices">
    <ng-template uiTabContent><app-invoices /></ng-template>
  </ui-tab>
</ui-tabs>

// app-invoices: the call starts when the tab is first chosen.
readonly invoices = httpResource<Invoice[]>(() => '/api/invoices');

@if (invoices.isLoading()) {
  <ui-spinner label="Loading invoices" showLabel />
} @else { … }
```

### Keep or reload

By default, lazy content is created again each time its tab is chosen, so it loads fresh: watch the time change. Add keep to a tab to load it once and find it as it was when you come back, with what was typed and where it was scrolled.

```html
<ui-tabs label="Invoices">
  <!-- Created, and loaded, again on each visit -->
  <ui-tab label="Reloads">
    <ng-template uiTabContent><app-invoices /></ng-template>
  </ui-tab>
  <!-- Loaded once, then kept while hidden -->
  <ui-tab label="Kept" keep>
    <ng-template uiTabContent><app-invoices /></ng-template>
  </ui-tab>
</ui-tabs>
```

### A page for each tab

```html
<ui-tab-nav label="Account">
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
providers: [{ provide: RouteReuseStrategy, useClass: KeepRouteStrategy }]
```

### In Arabic

The tabs run right to left and the arrow keys follow: the right arrow goes back.

```html
<ui-tabs label="الطلب ١٠٤٢">
  <ui-tab label="التفاصيل">…</ui-tab>
  <ui-tab label="السجل">…</ui-tab>
</ui-tabs>
```
