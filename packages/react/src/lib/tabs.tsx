'use client';

import { useState, type ReactNode } from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  type Key,
} from 'react-aria-components';
import { cx } from './class-names.js';
import { TabScrollButton, useTabStrip } from './tab-strip.js';

export interface TabItem {
  id: string;
  label: string;
  /** Mounts only while its tab is chosen, so a fetch inside starts then. */
  content: ReactNode;
  disabled?: boolean;
  /**
   * Keeps the content once it has been shown, hidden while another tab is chosen, so
   * coming back finds it as it was. Off, it mounts again, and fetches again, each visit.
   */
  keep?: boolean;
}

export interface TabsProps {
  /** Names the tab list, such as the thing the tabs are about. */
  label: string;
  tabs: readonly TabItem[];
  /** The chosen tab's id, when you control it. */
  selected?: string;
  defaultSelected?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Views of one thing side by side, on React Aria: arrow keys move between tabs and show
 * each one, Home and End go to the first and last. When the tabs are wider than the page
 * they scroll, the chosen one moves to the middle, and arrows at the ends scroll them for
 * a mouse. Arrow keys follow the locale's direction, so wrap Arabic pages in
 * `<I18nProvider locale="ar">` from react-aria-components.
 *
 * ```tsx
 * <Tabs label="Order 1042" tabs={[{ id: 'details', label: 'Details', content: <Details /> }]} />
 * ```
 */
export function Tabs({
  label,
  tabs,
  selected,
  defaultSelected,
  onChange,
  className,
}: TabsProps) {
  const { ref, state, scroll } = useTabStrip<HTMLDivElement>();
  const [visited, setVisited] = useState<ReadonlySet<string>>(
    () =>
      new Set([
        selected ?? defaultSelected ?? tabs.find((t) => !t.disabled)?.id ?? '',
      ]),
  );
  const visit = (id: string) =>
    setVisited((now) => (now.has(id) ? now : new Set(now).add(id)));
  // A controlled tab chosen from outside counts as visited too (set while rendering, as React advises).
  if (selected && !visited.has(selected))
    setVisited(new Set(visited).add(selected));

  return (
    <AriaTabs
      className={cx('ui-tabs', className)}
      selectedKey={selected}
      defaultSelectedKey={defaultSelected}
      onSelectionChange={(key: Key) => {
        visit(String(key));
        onChange?.(String(key));
      }}
      disabledKeys={tabs.filter((t) => t.disabled).map((t) => t.id)}
    >
      <div className="ui-tabs__bar">
        <TabScrollButton toward="start" state={state} onScroll={scroll} />
        <TabList ref={ref} aria-label={label} className="ui-tabs__list">
          {tabs.map((tab) => (
            <Tab key={tab.id} id={tab.id} className="ui-tab">
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabScrollButton toward="end" state={state} onScroll={scroll} />
      </div>
      {tabs.map((tab) => (
        <TabPanel
          key={tab.id}
          id={tab.id}
          className="ui-tabs__panel"
          shouldForceMount={!!tab.keep && visited.has(tab.id)}
          // A kept panel that is not chosen stays mounted, inert: hide it too.
          style={({ isInert }) => (isInert ? { display: 'none' } : undefined)}
        >
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}

export interface TabNavProps {
  /** Names the navigation landmark, such as the section the pages belong to. */
  label: string;
  /**
   * Links with `className="ui-tab"`; mark the current one `aria-current="page"`
   * (react-router's NavLink does it for you).
   */
  children: ReactNode;
  className?: string;
}

/**
 * Tabs that are pages, each with its own address: links styled as tabs, over your
 * router's outlet. They stay links, not a tablist, so Tab moves through them and each
 * one can open in a new browser tab. The current link scrolls to the middle.
 *
 * ```tsx
 * <TabNav label="Account">
 *   <NavLink className="ui-tab" to="profile">Profile</NavLink>
 *   <NavLink className="ui-tab" to="billing">Billing</NavLink>
 * </TabNav>
 * <Outlet />
 * ```
 */
export function TabNav({ label, children, className }: TabNavProps) {
  const { ref, state, scroll } = useTabStrip<HTMLDivElement>();
  return (
    <nav aria-label={label} className={cx('ui-tabs__bar', className)}>
      <TabScrollButton toward="start" state={state} onScroll={scroll} />
      <div ref={ref} className="ui-tabs__list">
        {children}
      </div>
      <TabScrollButton toward="end" state={state} onScroll={scroll} />
    </nav>
  );
}
