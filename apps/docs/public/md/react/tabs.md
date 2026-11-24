# Tabs

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Views of one thing side by side, such as an order's details and its history. Tab reaches the chosen tab, the arrow keys move between tabs and show each one, Home and End go to the first and last. The chosen tab gets a bar and full-strength text, not only a colour.

Docs: https://lamsa-ui.github.io/lamsa/components/tabs

```tsx
import { TabNav, Tabs } from '@lamsa-ui/react';
// Arrow keys follow the locale's direction: wrap Arabic pages in <I18nProvider locale="ar">.
```

When to use something else:

- Links to other pages: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Change how the same content is shown: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- Sections the reader may open together: [Accordion](https://lamsa-ui.github.io/lamsa/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the tab list. |
| `tabs` | `TabItem[]` |  | Required. { id, label, content, disabled?, keep? }. content mounts only while its tab is chosen; keep holds it once shown. |
| `selected, defaultSelected` | `string` |  | The chosen tab's id. |
| `onChange` | `(id: string) => void` |  | Called when another tab is chosen. |
| `TabNav label` | `string` |  | Required. Names the navigation; put links with className="ui-tab" inside, the current one aria-current="page". |

Keyboard and screen readers:

- Tab: Reach the chosen tab, and Tab again moves into its panel.
- Left or Right: Move to the previous or next tab and show it. Flipped in Arabic.
- Home or End: Go to the first or last tab.
- Read as tabs, with how many there are and which is chosen.

## Examples

### An order

```tsx
<Tabs
  label="Order 1042"
  tabs={[
    { id: 'details', label: 'Details', content: <Details /> },
    { id: 'invoice', label: 'Invoice', content: <Invoice />, disabled: true },
    { id: 'history', label: 'History', content: <History /> },
  ]}
  selected={tab}
  onChange={setTab}
/>
```

### Many tabs

Wider than the page, the tabs scroll. Choosing one, by click or arrow key, moves it to the middle, so the tabs on both sides of it stay in sight. Under reduced motion it moves without gliding.

```tsx
<Tabs
  label="Sales by month"
  tabs={months.map((month) => ({ id: month, label: month, content: <Sales month={month} /> }))}
/>
```

### Load when shown

Put content that calls an API in an ng-template with uiTabContent: it is created, and its call made, only when the tab is chosen. Without it, everything inside a tab is created with the page. The spinner tells screen readers the panel is loading.

```tsx
// A tab's content mounts only while it is chosen, so its fetch starts then.
<Tabs
  label="Customer 518"
  tabs={[
    { id: 'details', label: 'Details', content: <Details /> },
    { id: 'invoices', label: 'Invoices', content: <Invoices /> },
  ]}
/>
```

### Keep or reload

By default, lazy content is created again each time its tab is chosen, so it loads fresh: watch the time change. Add keep to a tab to load it once and find it as it was when you come back, with what was typed and where it was scrolled.

```tsx
<Tabs
  label="Invoices"
  tabs={[
    // Mounted, and fetched, again on each visit
    { id: 'reloads', label: 'Reloads', content: <Invoices /> },
    // Fetched once, then kept while hidden
    { id: 'kept', label: 'Kept', content: <Invoices />, keep: true },
  ]}
/>
```

### A page for each tab

```tsx
// NavLink marks the current link aria-current="page".
<TabNav label="Account">
  <NavLink className="ui-tab" to="" end>Profile</NavLink>
  <NavLink className="ui-tab" to="billing">Billing</NavLink>
  <NavLink className="ui-tab" to="security">Security</NavLink>
</TabNav>
<Outlet />
```

### In Arabic

The tabs run right to left and the arrow keys follow: the right arrow goes back.

```tsx
<I18nProvider locale="ar">
  <Tabs label="الطلب ١٠٤٢" tabs={tabs} />
</I18nProvider>
```
