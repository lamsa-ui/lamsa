'use client';

import { useRef, useState, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import type { ButtonVariant } from './button.js';
import { cx } from './class-names.js';

export interface MenuAction {
  id: string;
  label: string;
  /** For an action that destroys something: brand red text. */
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  /** The button's content. */
  label: ReactNode;
  /** The button's name when its content is only an icon. */
  'aria-label'?: string;
  items: readonly MenuAction[];
  /** Called with the chosen action's id; the menu then closes. */
  onAction: (id: string) => void;
  variant?: ButtonVariant;
  /** data-testid on the button. */
  testId?: string;
  /** Match the menu panel's width to its trigger. */
  matchTriggerWidth?: boolean;
}

/**
 * A list of actions that opens from a button, on React Aria: Enter, Space or the down
 * arrow open it, arrow keys and typing move through it, Escape closes it and focus returns
 * to the button.
 *
 * ```tsx
 * <Menu label="Actions" items={[{ id: 'edit', label: 'Edit' }]} onAction={run} />
 * ```
 */
export function Menu({
  label,
  'aria-label': ariaLabel,
  items,
  onAction,
  variant = 'secondary',
  testId,
  matchTriggerWidth,
}: MenuProps) {
  return (
    <MenuTrigger>
      <AriaButton
        className={cx('ui-button', `ui-button--${variant}`, 'ui-button--md')}
        aria-label={ariaLabel}
        data-testid={testId}
      >
        {label}
      </AriaButton>
      <Popover
        placement="bottom start"
        offset={0}
        style={{
          inlineSize: matchTriggerWidth ? 'var(--trigger-width)' : undefined,
          zIndex: 'var(--ui-layer-popover)',
        }}
      >
        <AriaMenu
          className={cx(
            'ui-menu',
            matchTriggerWidth && 'ui-menu--trigger-width',
          )}
          onAction={(key) => onAction(String(key))}
          disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
        >
          {items.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              className={cx(
                'ui-menu__item',
                item.danger && 'ui-menu__item--danger',
              )}
            >
              {item.label}
            </MenuItem>
          ))}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  );
}

export interface ContextMenuProps {
  items: readonly MenuAction[];
  /** Called with the chosen action's id; the menu then closes. */
  onAction: (id: string) => void;
  /** The area that opens the menu. Make it focusable so Shift+F10 reaches it. */
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Opens a menu where the reader right-clicks or long-presses, or presses Shift+F10 or the
 * menu key on a focused element inside. Put the same actions somewhere visible too:
 * touch and keyboard users rarely look for a context menu.
 *
 * ```tsx
 * <ContextMenu items={[{ id: 'rename', label: 'Rename' }]} onAction={run}>
 *   <div tabIndex={0}>invoice.pdf</div>
 * </ContextMenu>
 * ```
 */
export function ContextMenu({
  items,
  onAction,
  children,
  disabled,
  className,
}: ContextMenuProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState({ x: 0, y: 0 });
  return (
    <div
      className={className}
      onContextMenu={(event) => {
        if (disabled) return;
        event.preventDefault();
        let { clientX: x, clientY: y } = event;
        // From the keyboard there is no pointer: open under the focused element.
        if (!x && !y) {
          const box = (event.target as Element).getBoundingClientRect();
          x = box.left;
          y = box.bottom;
        }
        setAt({ x, y });
        setOpen(true);
      }}
    >
      {children}
      <span
        ref={anchor}
        aria-hidden="true"
        style={{ position: 'fixed', left: at.x, top: at.y }}
      />
      <Popover
        triggerRef={anchor}
        isOpen={open}
        onOpenChange={setOpen}
        placement="bottom start"
        offset={0}
        style={{ zIndex: 'var(--ui-layer-popover)' }}
      >
        <AriaMenu
          className="ui-menu"
          autoFocus="first"
          onAction={(key) => {
            setOpen(false);
            onAction(String(key));
          }}
          disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
        >
          {items.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              className={cx(
                'ui-menu__item',
                item.danger && 'ui-menu__item--danger',
              )}
            >
              {item.label}
            </MenuItem>
          ))}
        </AriaMenu>
      </Popover>
    </div>
  );
}
