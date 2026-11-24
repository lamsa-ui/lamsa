'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from './class-names.js';
import { Icon } from './icon.js';
import { useUiLabels } from './labels.js';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface AppShellProps {
  /** The app's name or logo, at the start of the header. */
  brand?: ReactNode;
  /** Header actions at the end, such as a language switcher or an account menu. */
  actions?: ReactNode;
  /** The main links, such as a Nav. */
  sidebar: ReactNode;
  /** The page. */
  children?: ReactNode;
  /** Names the menu button that opens the side bar on a narrow screen. */
  menuLabel?: string;
  /** The id of the page area, for a "Skip to content" link. */
  mainId?: string;
  /**
   * Makes the header the banner and the page the main landmark. Turn it off when the shell
   * sits inside a page that already has them, as in a preview.
   */
  landmarks?: boolean;
  className?: string;
}

/**
 * The frame of an app: a header across the top, the main links in a side bar, the page beside
 * them. Below 64rem of its own width the side bar folds behind a menu button in the header and
 * opens over the page; Escape, the shade or following a link closes it again.
 *
 * ```tsx
 * <AppShell brand={<a className="ui-shell__brand" href="/">Ghazal</a>} sidebar={<Nav label="Main">…</Nav>}>
 *   <Outlet />
 * </AppShell>
 * ```
 */
export function AppShell({
  brand,
  actions,
  sidebar,
  children,
  menuLabel,
  mainId = 'main',
  landmarks = true,
  className,
}: AppShellProps) {
  const t = useUiLabels();
  menuLabel ??= t.menu;
  const id = useId();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const side = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) side.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [open]);

  // Escape anywhere in the shell closes the folded side bar; the shade is a pointer-only shortcut.
  return (
    <div
      className={cx('ui-shell', open && 'ui-shell--open', className)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          menu.current?.focus();
        }
      }}
    >
      <div className="ui-shell__header" role={landmarks ? 'banner' : undefined}>
        <button
          ref={menu}
          type="button"
          className="ui-button ui-button--ghost ui-button--icon ui-shell__menu"
          aria-label={menuLabel}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
        {brand}
        {actions}
      </div>
      <div className="ui-shell__body">
        {open && (
          <div
            className="ui-shell__scrim"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
        )}
        {/* Following a link in the folded side bar closes it, as the page changes. */}
        <div
          ref={side}
          id={id}
          className="ui-shell__sidebar"
          onClick={(e) => {
            if ((e.target as Element).closest('a[href]')) setOpen(false);
          }}
        >
          {sidebar}
        </div>
        <div
          id={mainId}
          className="ui-shell__main"
          tabIndex={-1}
          role={landmarks ? 'main' : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
