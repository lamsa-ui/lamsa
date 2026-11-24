import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Meter, meterRatio, StatusDot, Toggle } from './actions.js';
import { AvatarGroup } from './content.js';
import { TextField } from './text-field.js';

describe('new components', () => {
  it('toggles on its own, and follows a controlled value', () => {
    render(<Toggle>Pin</Toggle>);
    const own = screen.getByRole('button', { name: 'Pin' });
    expect(own.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(own);
    expect(own.getAttribute('aria-pressed')).toBe('true');

    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <Toggle pressed={on} onPressedChange={setOn}>
          Star
        </Toggle>
      );
    }
    render(<Controlled />);
    const star = screen.getByRole('button', { name: 'Star' });
    fireEvent.click(star);
    expect(star.getAttribute('aria-pressed')).toBe('false');
  });

  it('names a meter by its label and clamps the value', () => {
    expect(meterRatio(15, 0, 10)).toBe(1);
    render(
      <Meter label="Storage" value={7.2} max={10} valueText="7.2 of 10 GB" />,
    );
    const meter = screen.getByRole('meter', { name: 'Storage' });
    expect(meter.getAttribute('aria-valuetext')).toBe('7.2 of 10 GB');
  });

  it('shows the first avatars and names the rest', () => {
    render(
      <AvatarGroup
        label="Team"
        max={1}
        people={[{ name: 'A B' }, { name: 'C D' }, { name: 'E F' }]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Team' })).toBeTruthy();
    expect(screen.getByRole('img', { name: '2 more' }).textContent).toBe('+2');
  });

  it('reads a prefix with the field and keeps the status words', () => {
    render(<TextField label="Price" prefix="EGP" />);
    const input = screen.getByLabelText('Price');
    expect(input.className).toBe('ui-input-group__input');
    expect(input.getAttribute('aria-describedby')).toContain('-prefix');

    render(<StatusDot tone="success">Online</StatusDot>);
    expect(screen.getByText('Online').className).toBe(
      'ui-status-dot ui-status-dot--success',
    );
  });
});
