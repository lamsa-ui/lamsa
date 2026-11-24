import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { pageSlots } from './page-slots';
import { PaginationComponent } from './pagination.component';

describe('pageSlots', () => {
  it('lists every page up to seven', () => {
    expect(pageSlots(1, 1)).toEqual([1]);
    expect(pageSlots(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('keeps the ends and the neighbours, with gaps between', () => {
    expect(pageSlots(1, 10)).toEqual([1, 2, 3, 4, 0, 10]);
    expect(pageSlots(5, 10)).toEqual([1, 0, 4, 5, 6, 0, 10]);
    expect(pageSlots(10, 10)).toEqual([1, 0, 7, 8, 9, 10]);
  });

  it('shows a single hidden page instead of a gap', () => {
    expect(pageSlots(4, 10)).toEqual([1, 2, 3, 4, 5, 0, 10]);
    expect(pageSlots(7, 10)).toEqual([1, 0, 6, 7, 8, 9, 10]);
  });
});

@Component({
  imports: [PaginationComponent],
  template: `
    <ui-pagination
      [(page)]="page"
      [(pageSize)]="pageSize"
      [total]="42"
      [pageSizes]="[10, 20]"
      [labels]="{ page: pageLabel }"
    />
  `,
})
class HostComponent {
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly pageLabel = (page: number) => `صفحة ${page}`;
}

describe('PaginationComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const q = <E extends Element>(selector: string) =>
      root.querySelector<E>(selector)!;
    return { fixture, root, q };
  }

  it('is a named navigation with the current page marked and a summary', async () => {
    const { root, q } = await setup();
    expect(q('nav').getAttribute('aria-label')).toBe('Pagination');
    expect(q('[aria-current="page"]').getAttribute('aria-label')).toBe(
      'صفحة 1',
    );
    expect(q('[role="status"]').textContent?.trim()).toBe('1–10 of 42');
    expect(root.querySelectorAll('.ui-pagination__page')).toHaveLength(5);
  });

  it('moves between pages and keeps previous focusable but unavailable on page 1', async () => {
    const { fixture, q } = await setup();
    const previous = q<HTMLButtonElement>(
      '[data-testid="ui-pagination-previous"]',
    );
    expect(previous.disabled).toBe(false);
    expect(previous.getAttribute('aria-disabled')).toBe('true');

    previous.click();
    expect(fixture.componentInstance.page()).toBe(1);

    q<HTMLButtonElement>('[data-testid="ui-pagination-next"]').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.page()).toBe(2);
    expect(q('[role="status"]').textContent?.trim()).toBe('11–20 of 42');
    expect(previous.getAttribute('aria-disabled')).toBeNull();
  });

  it('changes the page size and goes back to page 1', async () => {
    const { fixture, q } = await setup();
    fixture.componentInstance.page.set(3);
    await fixture.whenStable();

    q<HTMLButtonElement>('[data-testid="ui-pagination-size"]').click();
    await fixture.whenStable();
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
    expect(document.querySelector('[role="menu"]')?.classList).toContain(
      'ui-menu--trigger-width',
    );
    expect(document.querySelectorAll('[role="menuitem"]')).toHaveLength(2);
    const ten = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ).find((item) => item.textContent?.trim() === '10')!;
    ten.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.page()).toBe(3);

    q<HTMLButtonElement>('[data-testid="ui-pagination-size"]').click();
    await fixture.whenStable();
    const twenty = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ).find((item) => item.textContent?.trim() === '20')!;
    twenty.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.pageSize()).toBe(20);
    expect(fixture.componentInstance.page()).toBe(1);
    expect(q('[role="status"]').textContent?.trim()).toBe('1–20 of 42');
  });
});
