// Roles, names and keys of the components the other specs do not reach.
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { KbdComponent } from './kbd/kbd.component';
import {
  ContextMenuTriggerDirective,
  MenuComponent,
  MenuItemComponent,
} from './menu/menu';
import {
  PropertyComponent,
  PropertyListComponent,
} from './property-list/property-list.component';
import { StatusDotComponent } from './status-dot/status-dot.component';
import { TooltipDirective } from './tooltip/tooltip';

@Component({
  imports: [
    ButtonGroupComponent,
    KbdComponent,
    PropertyListComponent,
    PropertyComponent,
    StatusDotComponent,
    TooltipDirective,
    ContextMenuTriggerDirective,
    MenuComponent,
    MenuItemComponent,
  ],
  template: `
    <ui-button-group label="Text alignment">
      <button type="button">Start</button>
      <button type="button">End</button>
    </ui-button-group>
    <kbd ui-kbd>Ctrl</kbd>
    <dl ui-property-list>
      <div ui-property term="Order">#1042</div>
    </dl>
    <ui-status-dot tone="success">Online</ui-status-dot>
    <button
      type="button"
      aria-label="Copy link"
      uiTooltip="Copies the order link"
    >
      C
    </button>
    <div tabindex="0" data-testid="file" [uiContextMenu]="actions">
      invoice.pdf
    </div>
    <ng-template #actions>
      <ui-menu>
        <button ui-menu-item (triggered)="ran.set('rename')">Rename</button>
      </ui-menu>
    </ng-template>
  `,
})
class HostComponent {
  readonly ran = signal('');
}

describe('accessibility basics', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  afterEach(() => document.body.replaceChildren());

  it('names a button group', async () => {
    const { root } = await setup();
    const group = root.querySelector('ui-button-group')!;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Text alignment');
  });

  it('writes a key on the native kbd element', async () => {
    const { root } = await setup();
    expect(root.querySelector('kbd')!.className).toBe('ui-kbd');
  });

  it('pairs each term with its value in a description list', async () => {
    const { root } = await setup();
    const list = root.querySelector('dl')!;
    expect(list.querySelector('dt')!.textContent).toBe('Order');
    expect(list.querySelector('dd')!.textContent).toContain('#1042');
  });

  it('keeps the status word, with the dot only repeating it', async () => {
    const { root } = await setup();
    const dot = root.querySelector('ui-status-dot')!;
    expect(dot.textContent!.trim()).toBe('Online');
    expect(dot.className).toBe('ui-status-dot ui-status-dot--success');
  });

  it('describes its control with the tooltip, shows it on focus and hides on Escape', async () => {
    const { fixture, root } = await setup();
    const button = root.querySelector<HTMLButtonElement>(
      '[aria-label="Copy link"]',
    )!;
    const described = document.getElementById(
      button.getAttribute('aria-describedby')!,
    );
    expect(described?.textContent).toBe('Copies the order link');

    button.dispatchEvent(new FocusEvent('focus'));
    await fixture.whenStable();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain(
      'Copies the order link',
    );
    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('opens a context menu from the keyboard and runs an action', async () => {
    const { fixture, root } = await setup();
    const file = root.querySelector<HTMLElement>('[data-testid="file"]')!;
    // Shift+F10 and the menu key fire contextmenu with no pointer position.
    file.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    const item = document.querySelector<HTMLButtonElement>(
      '[role="menu"] [role="menuitem"]',
    )!;
    expect(item.textContent).toContain('Rename');
    item.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ran()).toBe('rename');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });
});
