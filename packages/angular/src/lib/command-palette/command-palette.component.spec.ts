import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CommandPaletteComponent,
  type Command,
} from './command-palette.component';

@Component({
  imports: [CommandPaletteComponent],
  template: `<ui-command-palette
    [commands]="commands"
    [(open)]="open"
    (run)="ran.set($event.id)"
  />`,
})
class HostComponent {
  readonly commands: Command[] = [
    { id: 'new', label: 'New order', keywords: ['invoice'] },
    { id: 'find', label: 'Find customer' },
    { id: 'out', label: 'Sign out' },
  ];
  readonly open = signal(false);
  readonly ran = signal('');
}

describe('CommandPaletteComponent', () => {
  it('opens on Ctrl+K, filters by label and keywords, runs on Enter', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }),
    );
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(true);
    const field = document.querySelector<HTMLInputElement>(
      '.ui-command [role="combobox"]',
    )!;
    const options = () =>
      document.querySelectorAll('.ui-command [role="option"]');
    expect(options()).toHaveLength(3);

    field.value = 'invoice';
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(options()).toHaveLength(1);
    expect(
      document
        .querySelector('.ui-command [role="status"]')!
        .textContent!.trim(),
    ).toBe('1 command');

    field.value = '';
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await fixture.whenStable();
    expect(field.getAttribute('aria-activedescendant')).toBe(options()[1].id);
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await vi.waitFor(() =>
      expect(fixture.componentInstance.ran()).toBe('find'),
    );
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
