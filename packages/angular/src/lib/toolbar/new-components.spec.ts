import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AvatarGroupComponent } from '../avatar/avatar-group.component';
import { meterRatio, MeterComponent } from '../meter/meter.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { ToggleComponent } from '../toggle/toggle.component';
import { ToolbarComponent, toolbarStep } from './toolbar.component';

@Component({
  imports: [
    ToolbarComponent,
    ToggleComponent,
    MeterComponent,
    AvatarGroupComponent,
    TextFieldComponent,
  ],
  template: `
    <ui-toolbar label="Note">
      <button type="button">Undo</button>
      <button type="button">Redo</button>
      <button ui-toggle [(pressed)]="pinned">Pin</button>
    </ui-toolbar>
    <ui-meter label="Storage" [value]="15" [max]="10" />
    <ui-avatar-group label="Team" [people]="people" [max]="2" />
    <ui-text-field label="Price" prefix="EGP" />
  `,
})
class HostComponent {
  readonly pinned = signal(false);
  readonly people = [{ name: 'A B' }, { name: 'C D' }, { name: 'E F' }];
}

describe('new components', () => {
  it('moves through a toolbar with arrows, flipped right to left, and wraps', () => {
    expect(toolbarStep('ArrowRight', 0, 3, 'horizontal', false)).toBe(1);
    expect(toolbarStep('ArrowRight', 0, 3, 'horizontal', true)).toBe(2);
    expect(toolbarStep('ArrowLeft', 0, 3, 'horizontal', false)).toBe(2);
    expect(toolbarStep('ArrowDown', 2, 3, 'vertical', false)).toBe(0);
    expect(toolbarStep('ArrowDown', 0, 3, 'horizontal', false)).toBeNull();
    expect(toolbarStep('End', 0, 3, 'horizontal', false)).toBe(2);
  });

  it('clamps a meter value into its range', () => {
    expect(meterRatio(15, 0, 10)).toBe(1);
    expect(meterRatio(-1, 0, 10)).toBe(0);
    expect(meterRatio(5, 5, 5)).toBe(0);
  });

  it('renders the new parts with their roles and states', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const buttons = [
      ...el.querySelectorAll('ui-toolbar button'),
    ] as HTMLElement[];
    expect(buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1]);
    buttons[0].focus();
    buttons[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(document.activeElement).toBe(buttons[1]);
    expect(buttons.map((b) => b.tabIndex)).toEqual([-1, 0, -1]);

    const toggle = buttons[2];
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.componentInstance.pinned()).toBe(true);

    const meter = el.querySelector('[role="meter"]')!;
    expect(meter.getAttribute('aria-valuetext')).toBe('100%');

    const more = el.querySelector('.ui-avatar-group__more')!;
    expect(more.textContent?.trim()).toBe('+1');
    expect(more.getAttribute('aria-label')).toBe('1 more');

    const input = el.querySelector('ui-text-field input')!;
    expect(input.className).toBe('ui-input-group__input');
    expect(input.getAttribute('aria-describedby')).toContain('-prefix');
  });
});
