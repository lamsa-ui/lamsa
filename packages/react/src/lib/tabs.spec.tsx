import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TabNav, Tabs } from './tabs.js';

/** Counts how often it mounts, as a list that fetches would fetch. */
let loads = 0;
function Loader({ name }: { name: string }) {
  useState(() => loads++);
  return <input aria-label={name} />;
}

describe('Tabs content', () => {
  it('mounts again on each visit, unless the tab keeps it', async () => {
    loads = 0;
    render(
      <Tabs
        label="Invoices"
        tabs={[
          { id: 'reload', label: 'Reloads', content: <Loader name="R" /> },
          {
            id: 'kept',
            label: 'Kept',
            content: <Loader name="K" />,
            keep: true,
          },
        ]}
      />,
    );
    expect(loads).toBe(1);
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: 'Kept' }));
    await user.type(screen.getByLabelText('K'), 'note');
    await user.click(screen.getByRole('tab', { name: 'Reloads' }));
    // The kept panel stays in the page, but hidden and out of the reading order.
    expect(screen.queryByRole('textbox', { name: 'K' })).toBeNull();
    await user.click(screen.getByRole('tab', { name: 'Kept' }));
    await user.click(screen.getByRole('tab', { name: 'Reloads' }));
    await user.click(screen.getByRole('tab', { name: 'Kept' }));
    expect(screen.getByLabelText<HTMLInputElement>('K').value).toBe('note');
    // Reloads mounted three times, Kept once.
    expect(loads).toBe(4);
  });
});

describe('TabNav', () => {
  it('is a named navigation of links, with no arrows while the tabs fit', () => {
    render(
      <TabNav label="Account">
        <a className="ui-tab" href="/profile" aria-current="page">
          Profile
        </a>
        <a className="ui-tab" href="/billing">
          Billing
        </a>
      </TabNav>,
    );
    const nav = screen.getByRole('navigation', { name: 'Account' });
    expect(nav.querySelectorAll('a.ui-tab')).toHaveLength(2);
    expect(nav.querySelector('.ui-tabs__scroll')).toBeNull();
  });
});
