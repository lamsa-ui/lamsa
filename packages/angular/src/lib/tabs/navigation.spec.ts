import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../button/button.component';
import {
  MenuComponent,
  MenuItemComponent,
  MenuTriggerDirective,
} from '../menu/menu';
import { BreadcrumbsComponent, NavComponent } from '../nav/nav.component';
import { TabComponent, TabsComponent } from './tabs.component';

@Component({
  imports: [
    TabsComponent,
    TabComponent,
    BreadcrumbsComponent,
    NavComponent,
    MenuTriggerDirective,
    MenuComponent,
    MenuItemComponent,
    ButtonComponent,
  ],
  template: `
    <ui-tabs label="Order 1042" [(selected)]="tab" testId="tab">
      <ui-tab label="Details"><p>Details panel</p></ui-tab>
      <ui-tab label="Invoice" disabled><p>Invoice panel</p></ui-tab>
      <ui-tab label="History"><p>History panel</p></ui-tab>
    </ui-tabs>
    <ui-breadcrumbs>
      <li><a href="/orders">Orders</a></li>
      <li><span aria-current="page">Order 1042</span></li>
    </ui-breadcrumbs>
    <ui-nav label="Main">
      <ul>
        <li><a href="/orders" aria-current="page">Orders</a></li>
      </ul>
    </ui-nav>
    <button ui-button [uiMenuTrigger]="menu" data-testid="actions">
      Actions
    </button>
    <ng-template #menu>
      <ui-menu>
        <button ui-menu-item (triggered)="picked.set('edit')">Edit</button>
        <button ui-menu-item danger (triggered)="picked.set('delete')">
          Delete
        </button>
      </ui-menu>
    </ng-template>
  `,
})
class HostComponent {
  readonly tab = signal(0);
  readonly picked = signal('');
}

describe('tabs, breadcrumbs, nav and menu', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const tab = (i: number) =>
      root.querySelector<HTMLButtonElement>(`[data-testid="tab-${i}"]`)!;
    const key = async (target: Element, key: string) => {
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true }),
      );
      await fixture.whenStable();
    };
    return { fixture, root, tab, key, host: fixture.componentInstance };
  }

  it('ties each tab to its panel and shows only the chosen one', async () => {
    const { root, tab } = await setup();
    expect(
      root.querySelector('[role="tablist"]')?.getAttribute('aria-label'),
    ).toBe('Order 1042');
    expect(tab(0).getAttribute('aria-selected')).toBe('true');
    expect(tab(0).tabIndex).toBe(0);
    expect(tab(2).tabIndex).toBe(-1);
    const panel = document.getElementById(
      tab(0).getAttribute('aria-controls')!,
    )!;
    expect(panel.getAttribute('role')).toBe('tabpanel');
    expect(panel.textContent).toContain('Details panel');
    expect(root.textContent).not.toContain('History panel');
  });

  it('moves with the arrow keys past disabled tabs, and Home and End', async () => {
    const { root, tab, key, host } = await setup();
    tab(0).focus();
    await key(tab(0), 'ArrowRight');
    expect(host.tab()).toBe(2);
    expect(document.activeElement).toBe(tab(2));
    expect(root.textContent).toContain('History panel');

    await key(tab(2), 'ArrowRight');
    expect(host.tab()).toBe(0);
    await key(tab(0), 'End');
    expect(host.tab()).toBe(2);
    await key(tab(2), 'Home');
    expect(host.tab()).toBe(0);
  });

  it('names the breadcrumb and nav landmarks', async () => {
    const { root } = await setup();
    const landmarks = root.querySelectorAll('[role="navigation"]');
    expect(
      Array.from(landmarks).map((l) => l.getAttribute('aria-label')),
    ).toEqual(['Breadcrumb', 'Main']);
    expect(root.querySelector('ui-breadcrumbs ol li')).not.toBeNull();
  });

  it('opens the menu and runs the chosen action', async () => {
    const { fixture, root, host } = await setup();
    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-testid="actions"]',
    )!;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    trigger.click();
    await fixture.whenStable();
    const menu = document.querySelector('[role="menu"]')!;
    expect(menu.classList).toContain('ui-menu');
    const items = menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    expect(items).toHaveLength(2);
    expect(items[1].classList).toContain('ui-menu__item--danger');

    items[1].click();
    await fixture.whenStable();
    expect(host.picked()).toBe('delete');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });
});
