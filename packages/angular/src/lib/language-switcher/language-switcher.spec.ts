import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type Language, LanguageSwitcherComponent } from './language-switcher';

const two: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'عربي' },
];
const three: Language[] = [...two, { code: 'fr', name: 'Français' }];

@Component({
  imports: [LanguageSwitcherComponent],
  template: `<ui-language-switcher
    [languages]="languages()"
    [(current)]="current"
  />`,
})
class HostComponent {
  readonly languages = signal(two);
  readonly current = signal('en');
}

describe('language switcher', () => {
  async function setup(languages: Language[]) {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.languages.set(languages);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    )!;
    return { fixture, button, host: fixture.componentInstance };
  }

  it('with two languages, names the other one in itself and switches to it', async () => {
    const { fixture, button, host } = await setup(two);
    expect(button.textContent?.trim()).toBe('عربي');
    expect(button.lang).toBe('ar');
    expect(button.getAttribute('aria-haspopup')).toBeNull();

    button.click();
    await fixture.whenStable();
    expect(host.current()).toBe('ar');
    expect(button.textContent?.trim()).toBe('English');
    expect(button.lang).toBe('en');
  });

  it('with three, opens a menu with the current one checked', async () => {
    const { fixture, button, host } = await setup(three);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Language: English',
    );

    button.click();
    await fixture.whenStable();
    const menu = document.querySelector('[role="menu"]')!;
    expect(menu.getAttribute('aria-label')).toBe('Language');
    const items = menu.querySelectorAll<HTMLButtonElement>(
      '[role="menuitemradio"]',
    );
    expect([...items].map((i) => i.getAttribute('aria-checked'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(items[2].lang).toBe('fr');

    items[2].click();
    await fixture.whenStable();
    expect(host.current()).toBe('fr');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });
});
