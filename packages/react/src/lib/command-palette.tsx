'use client';

import { useEffect, useId, useState } from 'react';
import { Dialog } from './dialog.js';

export interface Command {
  id: string;
  label: string;
  /** Other words that find it: ['invoice', 'bill'] for "New order". */
  keywords?: string[];
  /** A key combination shown at the end, such as "Ctrl N". Shown only; bind it yourself. */
  shortcut?: string;
}

export interface CommandPaletteProps {
  commands: Command[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after the dialog has closed and focus is back, so the command can move it on. */
  onRun: (command: Command) => void;
  /** The letter that opens it with Ctrl or ⌘. null: no shortcut. */
  shortcut?: string | null;
  title?: string;
  placeholder?: string;
  emptyLabel?: string;
  closeLabel?: string;
  /** Announced as you type. Translate it. */
  countLabel?: (count: number) => string;
}

/**
 * A search over the app's actions, in a dialog: Ctrl+K or ⌘K opens it. Typing filters,
 * arrow keys move, Enter runs.
 *
 * ```tsx
 * <CommandPalette commands={commands} open={open} onOpenChange={setOpen} onRun={go} />
 * ```
 */
export function CommandPalette({
  commands,
  open,
  onOpenChange,
  onRun,
  shortcut = 'k',
  title = 'Commands',
  placeholder = 'Type a command',
  emptyLabel = 'No commands match.',
  closeLabel = 'Close',
  countLabel = (n) => (n === 1 ? '1 command' : `${n} commands`),
}: CommandPaletteProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === shortcut) {
        event.preventDefault();
        setQuery('');
        setActive(0);
        onOpenChange(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, onOpenChange]);

  const words = query.trim().toLocaleLowerCase().split(/\s+/);
  const matches = commands.filter((command) => {
    const text = [command.label, ...(command.keywords ?? [])]
      .join(' ')
      .toLocaleLowerCase();
    return words.every((word) => text.includes(word));
  });

  const run = (command: Command | undefined) => {
    if (!command) return;
    onOpenChange(false);
    // React Aria hands focus back as the dialog unmounts; run once that has happened.
    requestAnimationFrame(() => onRun(command));
  };

  return (
    <Dialog
      title={title}
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setQuery('');
          setActive(0);
        }
        onOpenChange(next);
      }}
      closeLabel={closeLabel}
    >
      <div className="ui-command">
        <input
          className="ui-input"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-label={title}
          aria-controls={`${id}-list`}
          aria-activedescendant={matches.length ? `${id}-${active}` : undefined}
          placeholder={placeholder}
          value={query}
          autoFocus
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            const count = matches.length;
            if (!count) return;
            const moves: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
            if (event.key in moves) {
              event.preventDefault();
              const next = (active + moves[event.key] + count) % count;
              setActive(next);
              document
                .getElementById(`${id}-${next}`)
                ?.scrollIntoView({ block: 'nearest' });
            } else if (event.key === 'Enter') {
              event.preventDefault();
              run(matches[active]);
            }
          }}
        />
        {matches.length ? (
          <ul
            className="ui-command__list"
            role="listbox"
            id={`${id}-list`}
            aria-label={title}
          >
            {matches.map((command, i) => (
              // Keyboard use goes through the field (aria-activedescendant); the click is for the pointer.
              <li
                key={command.id}
                id={`${id}-${i}`}
                role="option"
                className={
                  i === active ? 'ui-option ui-option--active' : 'ui-option'
                }
                aria-selected={i === active}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setActive(i)}
                onClick={() => run(command)}
              >
                {command.label}
                {command.shortcut && (
                  <kbd className="ui-command__shortcut">{command.shortcut}</kbd>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="ui-command__empty" id={`${id}-list`}>
            {emptyLabel}
          </p>
        )}
        <span className="ui-visually-hidden" role="status">
          {countLabel(matches.length)}
        </span>
      </div>
    </Dialog>
  );
}
