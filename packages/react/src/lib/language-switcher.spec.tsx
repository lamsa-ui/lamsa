import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { type Language, LanguageSwitcher } from './language-switcher.js';

const two: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'عربي' },
];
const three: Language[] = [...two, { code: 'fr', name: 'Français' }];

function Host({ languages }: { languages: Language[] }) {
  const [current, setCurrent] = useState('en');
  return (
    <>
      <LanguageSwitcher
        languages={languages}
        current={current}
        onChange={setCurrent}
      />
      <output>{current}</output>
    </>
  );
}

describe('LanguageSwitcher', () => {
  it('with two languages, names the other one in itself and switches to it', async () => {
    render(<Host languages={two} />);
    const button = screen.getByRole('button', { name: 'عربي' });
    expect(button.getAttribute('lang')).toBe('ar');

    await userEvent.click(button);
    expect(screen.getByRole('status').textContent).toBe('ar');
    expect(
      screen.getByRole('button', { name: 'English' }).getAttribute('lang'),
    ).toBe('en');
  });

  it('with three, opens a menu with the current one checked', async () => {
    render(<Host languages={three} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Language: English' }),
    );
    // React Aria names the menu after its button.
    screen.getByRole('menu', { name: 'Language: English' });
    const items = screen.getAllByRole('menuitemradio');
    expect(items.map((i) => i.getAttribute('aria-checked'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(items[2].getAttribute('lang')).toBe('fr');

    await userEvent.click(items[2]);
    expect(screen.getByRole('status').textContent).toBe('fr');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
