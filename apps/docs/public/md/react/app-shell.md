# App shell

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The frame every screen of an app sits in: a header across the top, the main links in a side bar, the page beside them. When the shell is narrower than 64rem the side bar folds behind a menu button and opens over the page. Escape, the shade, or following a link closes it again.

Docs: https://lamsa-ui.github.io/lamsa/components/app-shell

```tsx
import { AppShell, Nav } from '@lamsa-ui/react';
```

When to use something else:

- Links in a side bar only, inside your own layout: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Show where the page sits in the site: [Breadcrumbs](https://lamsa-ui.github.io/lamsa/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `menuLabel` | `string` | `Menu from labels` | Names the menu button. Translate it. |
| `mainId` | `string` | `main` | The id of the page area, for a "Skip to content" link. |
| `landmarks` | `boolean` | `true` | The header is the banner and the page the main landmark. Off inside a page that has them. |
| `brand \| actions \| sidebar` | `ReactNode` |  | Brand, header actions, and the links. |

Keyboard and screen readers:

- Enter or Space: On the menu button, open the side bar on a narrow screen.
- Escape: Close the side bar.
- The header, the side bar and the page are landmarks, so screen readers can jump between them.

## Examples

### An app

This preview is narrower than 64rem, so the side bar starts folded. Press Menu. On a wide screen it stays open beside the page.

```tsx
<AppShell
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
</AppShell>
```

### In Arabic

```tsx
<AppShell menuLabel="القائمة" …>…</AppShell>
```
