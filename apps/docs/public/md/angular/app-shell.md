# App shell

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The frame every screen of an app sits in: a header across the top, the main links in a side bar, the page beside them. When the shell is narrower than 64rem the side bar folds behind a menu button and opens over the page. Escape, the shade, or following a link closes it again.

Docs: https://lamsa-ui.github.io/lamsa/components/app-shell

```ts
import { AppShellComponent, NavComponent } from '@lamsa-ui/angular';
// Put it once, in the root component, around the router outlet.
```

When to use something else:

- Links in a side bar only, inside your own layout: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Show where the page sits in the site: [Breadcrumbs](https://lamsa-ui.github.io/lamsa/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `menuLabel` | `string` | `Menu from labels` | Names the menu button. Translate it. |
| `mainId` | `string` | `main` | The id of the page area, for a "Skip to content" link. |
| `landmarks` | `boolean` | `true` | The header is the banner and the page the main landmark. Off inside a page that has them. |
| `[uiShellBrand] \| [uiShellActions] \| [uiShellSidebar]` | `slot` |  | Brand at the start of the header, actions at its end, links in the side bar. The rest is the page. |

Keyboard and screen readers:

- Enter or Space: On the menu button, open the side bar on a narrow screen.
- Escape: Close the side bar.
- The header, the side bar and the page are landmarks, so screen readers can jump between them.

## Examples

### An app

This preview is narrower than 64rem, so the side bar starts folded. Press Menu. On a wide screen it stays open beside the page.

```html
<a class="doc-skip" href="#main">Skip to content</a>
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
</ui-app-shell>
```

### In Arabic

```html
<ui-app-shell menuLabel="القائمة">…</ui-app-shell>
```
