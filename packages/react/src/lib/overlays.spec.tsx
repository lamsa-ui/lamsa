import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { Button } from './button.js';
import { Accordion, AccordionItem, Popover, Tooltip } from './overlays.js';

describe('Accordion', () => {
  function renderFaq() {
    const mounted = vi.fn();
    function Loader({ name }: { name: string }) {
      useEffect(() => mounted(name), [name]);
      return <p>{name}</p>;
    }
    const { container } = render(
      <Accordion single>
        <AccordionItem heading="Can I change my order?" defaultOpen>
          Yes, until it ships.
        </AccordionItem>
        <AccordionItem heading="How do refunds work?">
          Within 14 days.
        </AccordionItem>
        <AccordionItem heading="Invoices" lazy>
          <Loader name="Invoices list" />
        </AccordionItem>
        <AccordionItem heading="Archived" disabled>
          Old orders.
        </AccordionItem>
        <AccordionItem heading="History" lazy keep>
          <Loader name="History list" />
        </AccordionItem>
      </Accordion>,
    );
    return { items: container.querySelectorAll('details'), mounted };
  }

  it('keeps one section open in single mode, closing the other after its motion', async () => {
    const { items } = renderFaq();
    expect(items[0].open).toBe(true);
    expect(items[0].querySelector('summary')?.textContent).toBe(
      'Can I change my order?',
    );
    act(() => {
      items[1].open = true;
      items[1].dispatchEvent(new Event('toggle'));
    });
    await waitFor(() => expect(items[0].open).toBe(false));
    expect(items[1].open).toBe(true);
  });

  it('mounts lazy children on open and unmounts them once closed, unless kept', async () => {
    const { items, mounted } = renderFaq();
    expect(mounted).not.toHaveBeenCalled();
    // The browser's own toggle for the section open from the start comes a task later.
    await act(() => new Promise((done) => setTimeout(done)));
    const toggle = async (details: HTMLDetailsElement) => {
      const opening = !details.open;
      if (opening) details.open = true;
      else await userEvent.click(details.querySelector('summary')!);
      await waitFor(() => expect(details.open).toBe(opening));
      act(() => {
        details.dispatchEvent(new Event('toggle'));
      });
    };
    for (const [details, name, kept] of [
      [items[2], 'Invoices list', false],
      [items[4], 'History list', true],
    ] as const) {
      await toggle(details);
      expect(screen.getByText(name)).toBeTruthy();
      await toggle(details);
      expect(screen.queryByText(name) !== null).toBe(kept);
      await toggle(details);
      expect(screen.getByText(name)).toBeTruthy();
    }
    // Reloaded: mounted on each open. Kept: once.
    expect(mounted.mock.calls.map(([name]) => name)).toEqual([
      'Invoices list',
      'Invoices list',
      'History list',
    ]);
  });

  it('does not open a disabled section, and arrows move between headings', async () => {
    const { items } = renderFaq();
    const summaries = [...items].map((d) => d.querySelector('summary')!);
    expect(summaries[3].getAttribute('aria-disabled')).toBe('true');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    summaries[3].dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);

    summaries[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(summaries[1]);
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(summaries[4]);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(summaries[0]);
  });
});

describe('Tooltip', () => {
  it('shows on keyboard focus and describes the button', async () => {
    render(
      <Tooltip text="Copy link">
        <Button variant="ghost" aria-label="Copy">
          ⧉
        </Button>
      </Tooltip>,
    );
    await userEvent.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toBe('Copy link');
    expect(
      screen
        .getByRole('button', { name: 'Copy' })
        .getAttribute('aria-describedby'),
    ).toBe(tooltip.id);
  });
});

describe('Popover', () => {
  it('opens a dialog named by its button and closes on Escape', async () => {
    render(
      <Popover trigger={<Button variant="secondary">Delivery fee</Button>}>
        <p>Free over EGP 500.</p>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Delivery fee' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Delivery fee' });
    expect(dialog.textContent).toContain('Free over EGP 500.');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
