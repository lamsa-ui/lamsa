import { Component } from '@angular/core';
import { AppShellComponent, NavComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-app-shell-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    AppShellComponent,
    NavComponent,
  ],
  template: `
    <app-page
      title="App shell"
      lead="The frame every screen of an app sits in: a header across the top, the main links in a side bar, the page beside them. When the shell is narrower than 64rem the side bar folds behind a menu button and opens over the page. Escape, the shade, or following a link closes it again."
      [usage]="usage"
    >
      <app-example
        title="An app"
        description="This preview is narrower than 64rem, so the side bar starts folded. Press Menu. On a wide screen it stays open beside the page."
        [code]="basic"
      >
        <ui-app-shell class="doc-shell" [landmarks]="false" mainId="demo-main">
          <a uiShellBrand class="ui-shell__brand" href="#top">Lamsa</a>
          <ui-nav uiShellSidebar label="Shop">
            <ul>
              <li><a href="#orders" aria-current="page">Orders</a></li>
              <li><a href="#invoices">Invoices</a></li>
              <li><a href="#customers">Customers</a></li>
            </ul>
          </ui-nav>
          <h2 class="ui-head-sm">Orders</h2>
          <p class="text-text-muted">Twelve new orders since this morning.</p>
        </ui-app-shell>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-app-shell
          class="doc-shell"
          menuLabel="القائمة"
          mainId="demo-main-ar"
          [landmarks]="false"
        >
          <a uiShellBrand class="ui-shell__brand" href="#top">إنيجما</a>
          <ui-nav uiShellSidebar label="المتجر">
            <ul>
              <li><a href="#orders" aria-current="page">الطلبات</a></li>
              <li><a href="#invoices">الفواتير</a></li>
            </ul>
          </ui-nav>
          <h2 class="ui-head-sm">الطلبات</h2>
          <p class="text-text-muted">اثنا عشر طلبًا جديدًا منذ الصباح.</p>
        </ui-app-shell>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AppShellPageComponent {
  protected readonly usage = {
    angular: `import { AppShellComponent, NavComponent } from '@lamsa-ui/angular';
// Put it once, in the root component, around the router outlet.`,
    react: `import { AppShell, Nav } from '@lamsa-ui/react';`,
    vue: `import { AppShell, Nav } from '@lamsa-ui/vue';`,
    html: `<div class="ui-shell">
  <header class="ui-shell__header">...</header>
  <div class="ui-shell__body">
    <div class="ui-shell__sidebar" id="sidebar">...</div>
    <main class="ui-shell__main" id="main">...</main>
  </div>
</div>`,
  };

  protected readonly basic = {
    angular: `<a class="doc-skip" href="#main">Skip to content</a>
<ui-app-shell>
  <a uiShellBrand class="ui-shell__brand" routerLink="/">Lamsa</a>
  <ui-language-switcher uiShellActions [languages]="languages" />
  <ui-nav uiShellSidebar label="Main">
    <ul>
      <li><a routerLink="/orders" routerLinkActive ariaCurrentWhenActive="page">Orders</a></li>
      <li><a routerLink="/invoices" routerLinkActive ariaCurrentWhenActive="page">Invoices</a></li>
    </ul>
  </ui-nav>
  <router-outlet />
</ui-app-shell>`,
    react: `<AppShell
  brand={<a className="ui-shell__brand" href="/">Lamsa</a>}
  actions={<LanguageSwitcher languages={languages} />}
  sidebar={
    <Nav label="Main">
      <ul>
        <li><a href="/orders" aria-current="page">Orders</a></li>
        <li><a href="/invoices">Invoices</a></li>
      </ul>
    </Nav>
  }
>
  <Outlet />
</AppShell>`,
    vue: `<AppShell>
  <template #brand><a class="ui-shell__brand" href="/">Lamsa</a></template>
  <template #actions><LanguageSwitcher v-model:current="language" :languages="languages" /></template>
  <template #sidebar>
    <Nav label="Main">
      <ul>
        <li><a href="/orders" aria-current="page">Orders</a></li>
        <li><a href="/invoices">Invoices</a></li>
      </ul>
    </Nav>
  </template>
  <RouterView />
</AppShell>`,
    html: `<div class="ui-shell">
  <header class="ui-shell__header">
    <!-- Toggle .ui-shell--open on .ui-shell and aria-expanded here with a script. -->
    <button type="button" class="ui-button ui-button--ghost ui-button--icon ui-shell__menu"
      aria-label="Menu" aria-expanded="false" aria-controls="sidebar">
      <i class="ui-icon ui-icon-menu"></i>
    </button>
    <a class="ui-shell__brand" href="/">Lamsa</a>
  </header>
  <div class="ui-shell__body">
    <div class="ui-shell__sidebar" id="sidebar">
      <nav class="ui-nav" aria-label="Main">…</nav>
    </div>
    <main class="ui-shell__main" id="main" tabindex="-1">…</main>
  </div>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-app-shell menuLabel="القائمة">…</ui-app-shell>`,
    react: `<AppShell menuLabel="القائمة" …>…</AppShell>`,
    vue: `<AppShell menuLabel="القائمة" …>…</AppShell>`,
    html: `<!-- dir="rtl": the side bar sits on the right and opens from there. -->`,
  };

  private readonly shared = [
    {
      name: 'menuLabel',
      type: 'string',
      default: 'Menu from labels',
      description: 'Names the menu button. Translate it.',
    },
    {
      name: 'mainId',
      type: 'string',
      default: 'main',
      description: 'The id of the page area, for a "Skip to content" link.',
    },
    {
      name: 'landmarks',
      type: 'boolean',
      default: 'true',
      description:
        'The header is the banner and the page the main landmark. Off inside a page that has them.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Links in a side bar only, inside your own layout',
      use: 'Navigation',
      path: '/components/nav',
    },
    {
      need: 'Show where the page sits in the site',
      use: 'Breadcrumbs',
      path: '/components/breadcrumbs',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: '[uiShellBrand] | [uiShellActions] | [uiShellSidebar]',
        type: 'slot',
        description:
          'Brand at the start of the header, actions at its end, links in the side bar. The rest is the page.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'brand | actions | sidebar',
        type: 'ReactNode',
        description: 'Brand, header actions, and the links.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: '#brand | #actions | #sidebar',
        type: 'slot',
        description:
          "The header's name and controls, and the side bar's navigation. The default slot is the page.",
      },
    ],
    html: [
      {
        name: 'ui-shell | ui-shell--open',
        type: 'class',
        description: 'The frame; --open shows the folded side bar.',
      },
      {
        name: 'ui-shell__header | __body | __sidebar | __main',
        type: 'class',
        description: 'Its parts.',
      },
      {
        name: '--ui-shell-header | --ui-shell-sidebar',
        type: 'token',
        default: '4rem | 16rem',
        description: 'Header height and side bar width.',
      },
    ],
  };
}
