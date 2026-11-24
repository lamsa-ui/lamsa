import { render } from '@testing-library/react';
import { ICONS } from '@ghazal-ui/icons';
import { Icon } from './icon.js';

describe('Icon', () => {
  it('draws the named icon', () => {
    const { container } = render(<Icon name="search" />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML).toContain(ICONS.search.slice(0, 20));
  });

  it('is hidden from screen readers unless it has a label', () => {
    const { container, rerender } = render(<Icon name="search" />);
    const icon = container.querySelector('.ui-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.hasAttribute('role')).toBe(false);

    rerender(<Icon name="search" label="Search" />);
    expect(icon?.hasAttribute('aria-hidden')).toBe(false);
    expect(icon?.getAttribute('role')).toBe('img');
    expect(icon?.getAttribute('aria-label')).toBe('Search');
  });

  it('sets the size class, keeps the caller class and mirrors direction icons', () => {
    const { container } = render(
      <Icon name="arrow-right" size="lg" className="mine" />,
    );
    expect(container.querySelector('.ui-icon')?.className).toBe(
      'ui-icon ui-icon--lg ui-icon--mirror mine',
    );
  });

  it('takes any CSS length or a number of pixels as the size', () => {
    const { container, rerender } = render(<Icon name="search" size="3rem" />);
    const icon = container.querySelector<HTMLElement>('.ui-icon');
    expect(icon?.style.getPropertyValue('--ui-icon-size')).toBe('3rem');
    expect(icon?.className).toBe('ui-icon');

    rerender(<Icon name="search" size={48} style={{ opacity: 0.5 }} />);
    expect(icon?.style.getPropertyValue('--ui-icon-size')).toBe('48px');
    expect(icon?.style.opacity).toBe('0.5');
  });
});
