import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICONS, type IconName } from '@ghazal-ui/icons';
import { IconComponent, type IconSize } from './icon.component';

@Component({
  imports: [IconComponent],
  template: `<ui-icon [name]="name()" [size]="size()" [label]="label()" />`,
})
class HostComponent {
  readonly name = signal<IconName>('search');
  readonly size = signal<IconSize>('md');
  readonly label = signal<string | undefined>(undefined);
}

describe('IconComponent', () => {
  const setup = async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('ui-icon');
    return { fixture, icon, host: fixture.componentInstance };
  };

  it('draws the named icon and follows changes', async () => {
    const { icon, host, fixture } = await setup();
    expect(icon.querySelector('svg')?.innerHTML).toContain(
      ICONS.search.slice(0, 20),
    );
    host.name.set('check');
    await fixture.whenStable();
    expect(icon.querySelector('svg')?.innerHTML).toContain(
      ICONS.check.slice(0, 20),
    );
  });

  it('is hidden from screen readers unless it has a label', async () => {
    const { icon, host, fixture } = await setup();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('role')).toBeNull();

    host.label.set('Search');
    await fixture.whenStable();
    expect(icon.getAttribute('aria-hidden')).toBeNull();
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Search');
  });

  it('sets the size class and mirrors direction icons', async () => {
    const { icon, host, fixture } = await setup();
    expect(icon.className).toBe('ui-icon');

    host.size.set('lg');
    host.name.set('arrow-right');
    await fixture.whenStable();
    expect(icon.className).toBe('ui-icon ui-icon--lg ui-icon--mirror');
  });

  it('takes any CSS length or a number of pixels as the size', async () => {
    const { icon, host, fixture } = await setup();
    host.size.set('3rem');
    await fixture.whenStable();
    expect(icon.style.getPropertyValue('--ui-icon-size')).toBe('3rem');
    expect(icon.className).toBe('ui-icon');

    host.size.set(48);
    await fixture.whenStable();
    expect(icon.style.getPropertyValue('--ui-icon-size')).toBe('48px');

    host.size.set('sm');
    await fixture.whenStable();
    expect(icon.style.getPropertyValue('--ui-icon-size')).toBe('');
    expect(icon.className).toBe('ui-icon ui-icon--sm');
  });
});
