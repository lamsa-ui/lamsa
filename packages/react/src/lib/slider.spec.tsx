import { fireEvent, render, screen } from '@testing-library/react';
import { Slider } from './slider.js';

describe('Slider', () => {
  it('shows the formatted value and fills the track as it moves', () => {
    const onChange = vi.fn();
    render(
      <Slider
        label="Price limit"
        max={2000}
        step={50}
        defaultValue={500}
        format={(v) => `EGP ${v}`}
        onChange={onChange}
      />,
    );
    const range = screen.getByRole('slider', { name: 'Price limit' });
    expect(range.getAttribute('aria-valuetext')).toBe('EGP 500');
    expect(range.style.getPropertyValue('--ui-slider-fill')).toBe('25%');

    fireEvent.change(range, { target: { value: '1000' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(range.getAttribute('aria-valuetext')).toBe('EGP 1000');
  });
});
