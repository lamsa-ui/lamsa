import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink, RouterLinkActive } from '@angular/router';
import {
  TabComponent,
  TabContentDirective,
  TabNavComponent,
  TabsComponent,
} from './tabs.component';

/** Counts how often it is created, as a list that loads from an API would load. */
let loads = 0;
@Component({ selector: 'ui-loader-probe', template: `<p>Loaded</p>` })
class LoaderComponent {
  constructor() {
    loads++;
  }
}

@Component({
  imports: [TabsComponent, TabComponent, TabContentDirective, LoaderComponent],
  template: `
    <ui-tabs label="Order" [(selected)]="tab" testId="tab">
      <ui-tab label="Details"><p>Details</p></ui-tab>
      <ui-tab label="Reload">
        <ng-template uiTabContent
          ><ui-loader-probe data-testid="reload"
        /></ng-template>
      </ui-tab>
      <ui-tab label="Keep" keep>
        <ng-template uiTabContent
          ><ui-loader-probe data-testid="keep"
        /></ng-template>
      </ui-tab>
    </ui-tabs>
  `,
})
class TabsHostComponent {
  readonly tab = signal(0);
}

describe('tabs content', () => {
  async function setup() {
    loads = 0;
    const fixture = TestBed.createComponent(TabsHostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const choose = async (i: number) => {
      fixture.componentInstance.tab.set(i);
      await fixture.whenStable();
    };
    const find = (id: string) => root.querySelector(`[data-testid="${id}"]`);
    return { choose, find };
  }

  it('creates lazy content only when its tab is shown', async () => {
    const { choose, find } = await setup();
    expect(loads).toBe(0);
    await choose(1);
    expect(loads).toBe(1);
    expect(find('reload')).not.toBeNull();
  });

  it('creates it again on each visit, unless the tab keeps it', async () => {
    const { choose, find } = await setup();
    await choose(1);
    await choose(0);
    expect(find('reload')).toBeNull();
    await choose(1);
    expect(loads).toBe(2);

    await choose(2);
    await choose(0);
    // Kept, but hidden with its panel, so it is out of sight and out of the reading order.
    expect(
      find('keep')?.closest('[role="tabpanel"]')?.hasAttribute('hidden'),
    ).toBe(true);
    await choose(2);
    expect(loads).toBe(3);
  });
});

@Component({ template: `` })
class EmptyComponent {}

@Component({
  imports: [TabNavComponent, RouterLink, RouterLinkActive],
  template: `
    <ui-tab-nav label="Account">
      <a
        class="ui-tab"
        routerLink="/profile"
        routerLinkActive
        ariaCurrentWhenActive="page"
        >Profile</a
      >
      <a
        class="ui-tab"
        routerLink="/billing"
        routerLinkActive
        ariaCurrentWhenActive="page"
        >Billing</a
      >
    </ui-tab-nav>
  `,
})
class NavHostComponent {}

describe('tab nav', () => {
  it('is a named navigation of links, marking the current page', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'profile', component: EmptyComponent },
          { path: 'billing', component: EmptyComponent },
        ]),
      ],
    });
    const fixture = TestBed.createComponent(NavHostComponent);
    const root: HTMLElement = fixture.nativeElement;
    const links = root.querySelectorAll<HTMLAnchorElement>('a');
    links[1].click();
    await fixture.whenStable();

    const nav = root.querySelector('ui-tab-nav')!;
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Account');
    expect(links[0].hasAttribute('aria-current')).toBe(false);
    expect(links[1].getAttribute('aria-current')).toBe('page');
    expect(links[1].getAttribute('href')).toBe('/billing');
  });
});

describe('tab scroll arrows', () => {
  it('appear when the tabs overflow and scroll toward their end', async () => {
    const fixture = TestBed.createComponent(TabsHostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.ui-tabs__scroll')).toBeNull();

    // jsdom has no layout: give the list a size wider than its box.
    const list = root.querySelector<HTMLElement>('[role="tablist"]')!;
    Object.defineProperty(list, 'scrollWidth', { value: 500 });
    Object.defineProperty(list, 'clientWidth', { value: 100 });
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;
    list.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    const [start, end] = Array.from(
      root.querySelectorAll<HTMLButtonElement>('.ui-tabs__scroll'),
    );
    expect(start.getAttribute('aria-hidden')).toBe('true');
    expect(start.tabIndex).toBe(-1);
    expect(start.disabled).toBe(true);
    expect(end.disabled).toBe(false);
    end.click();
    expect(scrollBy).toHaveBeenCalledWith({ left: 80 });
  });
});
