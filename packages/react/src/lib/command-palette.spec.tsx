import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { CommandPalette, type Command } from './command-palette.js';

const commands: Command[] = [
  { id: 'new', label: 'New order', keywords: ['invoice'] },
  { id: 'find', label: 'Find customer' },
  { id: 'out', label: 'Sign out' },
];

function Host({ onRun }: { onRun: (c: Command) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <CommandPalette
      commands={commands}
      open={open}
      onOpenChange={setOpen}
      onRun={onRun}
    />
  );
}

describe('CommandPalette', () => {
  // jsdom has no layout, so no scrollIntoView.
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('opens on Ctrl+K, filters by label and keywords, runs on Enter', async () => {
    const onRun = vi.fn();
    render(<Host onRun={onRun} />);
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    const field = await screen.findByRole('combobox', { name: 'Commands' });
    expect(screen.getAllByRole('option')).toHaveLength(3);

    fireEvent.change(field, { target: { value: 'invoice' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('status').textContent).toBe('1 command');

    fireEvent.change(field, { target: { value: '' } });
    fireEvent.keyDown(field, { key: 'ArrowDown' });
    const second = screen.getAllByRole('option')[1];
    expect(field.getAttribute('aria-activedescendant')).toBe(second.id);
    fireEvent.keyDown(field, { key: 'Enter' });
    await vi.waitFor(() => expect(onRun).toHaveBeenCalledWith(commands[1]));
  });
});
