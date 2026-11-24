import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent, initials } from './avatar.component';

@Component({
  imports: [AvatarComponent],
  template: `<ui-avatar name="Mona Adel" [src]="src()" />
    <ui-avatar name="Mona Adel" size="sm" decorative />`,
})
class HostComponent {
  readonly src = signal<string | undefined>('/missing.jpg');
}

describe('AvatarComponent', () => {
  it('takes the first letters of the first and last word', () => {
    expect(initials('mona  adel  hassan')).toBe('M\u200cH');
    expect(initials('منى')).toBe('م');
    expect(initials(' ')).toBe('');
  });

  it('is an image named after the person, and falls back to initials', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const [named, decorative]: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('ui-avatar'),
    );
    expect(named.getAttribute('role')).toBe('img');
    expect(named.getAttribute('aria-label')).toBe('Mona Adel');
    const img = named.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe('');

    img.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(named.querySelector('img')).toBeNull();
    expect(named.textContent?.trim()).toBe('M\u200cA');

    fixture.componentInstance.src.set('/new.jpg');
    await fixture.whenStable();
    expect(named.querySelector('img')).not.toBeNull();

    expect(decorative.className).toBe('ui-avatar ui-avatar--sm');
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
    expect(decorative.getAttribute('role')).toBeNull();
  });
});
