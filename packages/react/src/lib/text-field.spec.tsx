import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TextField } from './text-field.js';

describe('TextField', () => {
  it('ties the label and the hint to the input', () => {
    render(<TextField label="Email" type="email" hint="Order updates only" />);
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    const hint = document.getElementById(
      input.getAttribute('aria-describedby')!,
    );
    expect(hint?.textContent).toBe('Order updates only');
  });

  it('marks the input invalid and announces the error', () => {
    render(
      <TextField label="Name" hint="As on your ID" error="Enter your name" />,
    );
    const input = screen.getByLabelText('Name');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Enter your name');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(
      alert.id,
    );
    expect(input.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
  });

  it('works as a controlled input', async () => {
    function Host() {
      const [name, setName] = useState('');
      return (
        <>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <output>{name}</output>
        </>
      );
    }
    render(<Host />);
    await userEvent.type(screen.getByLabelText('Name'), 'Hatem');
    expect(screen.getByRole('status').textContent).toBe('Hatem');
  });
});
