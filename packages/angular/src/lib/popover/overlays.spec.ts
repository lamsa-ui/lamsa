import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AccordionComponent,
  AccordionContentDirective,
  AccordionItemComponent,
} from '../accordion/accordion.component';
import { ButtonComponent } from '../button/button.component';
import { TooltipDirective } from '../tooltip/tooltip';
import { PopoverTriggerDirective } from './popover';

@Component({
  imports: [
    AccordionComponent,
    AccordionContentDirective,
    AccordionItemComponent,
    TooltipDirective,
    PopoverTriggerDirective,
    ButtonComponent,
  ],
  template: `
    <ui-accordion single>
      <details ui-accordion-item heading="Can I change my order?" open>
        <p>Yes, until it ships.</p>
      </details>
      <details ui-accordion-item heading="How do refunds work?">
        <p>Within 14 days.</p>
      </details>
      <details ui-accordion-item heading="Invoices">
        <ng-template uiAccordionContent
          ><p data-testid="lazy">Loaded</p></ng-template
        >
      </details>
      <details ui-accordion-item heading="Archived" disabled>
        <p>Old orders.</p>
      </details>
      <details ui-accordion-item heading="History" keep>
        <ng-template uiAccordionContent
          ><p data-testid="kept">Kept</p></ng-template
        >
      </details>
    </ui-accordion>
    <button ui-button data-testid="copy" uiTooltip="Copy link">Copy</button>
    <button ui-button data-testid="fee" [uiPopoverTrigger]="info">Fee</button>
    <ng-template #info>
      <p>Free over EGP 500.</p>
      <button ui-button data-testid="inside">Got it</button>
    </ng-template>
  `,
})
class HostComponent {}

describe('accordion, tooltip and popover', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const get = (id: string) =>
      document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!;
    return { fixture, root, get };
  }

  it('keeps one section open in single mode, closing the other after its motion', async () => {
    const { fixture, root } = await setup();
    const items = root.querySelectorAll('details');
    expect(items[0].open).toBe(true);
    expect(items[0].querySelector('summary')?.textContent?.trim()).toBe(
      'Can I change my order?',
    );
    items[1].open = true;
    items[1].dispatchEvent(new Event('toggle'));
    await fixture.whenStable();
    expect(items[1].open).toBe(true);
    expect(items[0].open).toBe(false);
    expect(items[0].hasAttribute('data-closing')).toBe(false);
  });

  it('creates lazy content on open and removes it once closed, unless kept', async () => {
    const { fixture, root } = await setup();
    const items = root.querySelectorAll('details');
    const toggle = async (details: HTMLDetailsElement) => {
      if (details.open) details.querySelector('summary')!.click();
      else details.open = true;
      await Promise.resolve(); // the close waits for its motion first
      details.dispatchEvent(new Event('toggle'));
      await fixture.whenStable();
    };
    for (const [details, id, kept] of [
      [items[2], 'lazy', false],
      [items[4], 'kept', true],
    ] as const) {
      const content = () => details.querySelector(`[data-testid="${id}"]`);
      expect(content()).toBeNull();
      await toggle(details);
      const first = content();
      expect(first).not.toBeNull();
      await toggle(details);
      expect(details.open).toBe(false);
      expect(content() !== null).toBe(kept);
      await toggle(details);
      // Kept: the same element. Reloaded: a new one.
      expect(content() === first).toBe(kept);
    }
  });

  it('does not open a disabled section, and arrows move between headings', async () => {
    const { root } = await setup();
    const summaries = root.querySelectorAll('summary');
    const archived = summaries[3];
    expect(archived.getAttribute('aria-disabled')).toBe('true');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    archived.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);

    summaries[0].focus();
    const key = (k: string) =>
      document.activeElement!.dispatchEvent(
        new KeyboardEvent('keydown', { key: k, bubbles: true }),
      );
    key('ArrowDown');
    expect(document.activeElement).toBe(summaries[1]);
    key('End');
    expect(document.activeElement).toBe(summaries[4]);
    key('ArrowDown');
    expect(document.activeElement).toBe(summaries[0]);
    key('ArrowUp');
    expect(document.activeElement).toBe(summaries[4]);
  });

  it('describes the control with the tooltip and shows it on focus until Escape', async () => {
    const { fixture, get } = await setup();
    const copy = get('copy');
    const description = document.getElementById(
      copy.getAttribute('aria-describedby')!,
    );
    expect(description?.textContent).toBe('Copy link');

    copy.dispatchEvent(new FocusEvent('focus'));
    await fixture.whenStable();
    const tooltip = document.querySelector('[role="tooltip"]');
    expect(tooltip?.textContent).toBe('Copy link');

    copy.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('opens the popover named by its button, moves focus in, and closes on Escape', async () => {
    const { fixture, get } = await setup();
    const fee = get('fee');
    expect(fee.getAttribute('aria-haspopup')).toBe('dialog');
    fee.click();
    await fixture.whenStable();

    const panel = document.querySelector<HTMLElement>('ui-popover')!;
    expect(fee.getAttribute('aria-expanded')).toBe('true');
    expect(fee.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-labelledby')).toBe(fee.id);
    expect(document.activeElement).toBe(get('inside'));

    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(document.querySelector('ui-popover')).toBeNull();
    expect(fee.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(fee);
  });
});
