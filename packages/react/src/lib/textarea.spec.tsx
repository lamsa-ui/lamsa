import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Textarea } from './textarea.js';

describe('Textarea', () => {
  it('ties the label and hint to the textarea and passes native props', () => {
    render(
      <Textarea
        label="Delivery notes"
        hint="Gate code, floor"
        rows={4}
        maxLength={200}
      />,
    );
    const textarea =
      screen.getByLabelText<HTMLTextAreaElement>('Delivery notes');
    expect(textarea.rows).toBe(4);
    expect(textarea.maxLength).toBe(200);
    const hint = document.getElementById(
      textarea.getAttribute('aria-describedby')!,
    );
    expect(hint?.textContent).toBe('Gate code, floor');
  });

  it('marks the textarea invalid and announces the error', () => {
    render(<Textarea label="Notes" hint="Optional" error="Too long" />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Too long');
    expect(textarea.getAttribute('aria-describedby')?.split(' ')).toEqual([
      expect.stringContaining('-hint'),
      alert.id,
    ]);
  });

  it('works as a controlled textarea', async () => {
    function Host() {
      const [notes, setNotes] = useState('');
      return (
        <>
          <Textarea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <output>{notes.length}</output>
        </>
      );
    }
    render(<Host />);
    await userEvent.type(screen.getByLabelText('Notes'), 'Ring twice');
    expect(screen.getByRole('status').textContent).toBe('10');
  });
});
