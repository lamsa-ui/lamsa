'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Dialog,
  DialogTrigger,
  Focusable,
  Popover as AriaPopover,
  Pressable,
  Tooltip as AriaTooltip,
  TooltipTrigger,
} from 'react-aria-components';
import { cx } from './class-names.js';

// React Aria types the child as a bare DOM element, but a component that forwards its ref
// and spreads its props (Button) works the same at runtime.
type AriaChild = Parameters<typeof Pressable>[0]['children'];

/** Where the chevron sits: after the heading, before it (as in a tree), or not at all. */
export type AccordionIcon = 'end' | 'start' | 'none';

const AccordionContext = createContext<{
  icon: AccordionIcon;
  single?: boolean;
}>({ icon: 'end' });

let closings = 0;

/**
 * Closes a details after its closing motion has run, so Safari closes as smoothly as the
 * others (it would hide the content at once). Opening it again meanwhile keeps it open.
 */
function closeDetails(details: HTMLDetailsElement): void {
  if (!details.open || details.hasAttribute('data-closing')) return;
  const run = String(++closings);
  details.setAttribute('data-closing', run);
  const motion = details.getAnimations?.({ subtree: true }) ?? [];
  void Promise.allSettled(motion.map((a) => a.finished)).then(() => {
    if (details.getAttribute('data-closing') !== run) return;
    details.removeAttribute('data-closing');
    details.open = false;
  });
}

function showDetails(details: HTMLDetailsElement): void {
  details.removeAttribute('data-closing');
  details.open = true;
}

const sections = (group: HTMLElement) =>
  Array.from(group.querySelectorAll<HTMLDetailsElement>(':scope > details'));

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /** Keeps one section open at a time: opening one closes the others. */
  single?: boolean;
  /** The chevron of every section; one section can set its own. Defaults to end. */
  icon?: AccordionIcon;
}

/**
 * A stack of sections that open and close, such as questions and answers. Native
 * `<details>`, so it opens with Enter and Space, and find-in-page opens the section that
 * holds the match. Sections grow and shrink both ways. Up and Down move between the
 * headings, Home and End go to the first and last.
 *
 * ```tsx
 * <Accordion single>
 *   <AccordionItem heading="Can I change my order?">Yes, until it ships.</AccordionItem>
 *   <AccordionItem heading="Invoices" lazy><Invoices /></AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({
  single,
  icon = 'end',
  className,
  onKeyDown,
  ...div
}: AccordionProps) {
  const context = useMemo(() => ({ icon, single }), [icon, single]);
  return (
    <AccordionContext.Provider value={context}>
      <div
        {...div}
        className={cx('ui-accordion', className)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          const summaries = sections(event.currentTarget).map((d) =>
            d.querySelector('summary'),
          );
          const i = summaries.indexOf(event.target as HTMLElement);
          if (i < 0 || event.defaultPrevented) return;
          const last = summaries.length - 1;
          const next: number | undefined = {
            ArrowDown: i === last ? 0 : i + 1,
            ArrowUp: i === 0 ? last : i - 1,
            Home: 0,
            End: last,
          }[event.key];
          if (next === undefined) return;
          event.preventDefault();
          summaries[next]?.focus();
        }}
      />
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<
  ComponentPropsWithRef<'details'>,
  'open'
> {
  /** The summary that opens it: text, or richer content. */
  heading: ReactNode;
  /** A quieter line under the heading, such as a count or a status. */
  description?: ReactNode;
  /** Open or not. Without it, the reader opens and closes it. */
  open?: boolean;
  /** Open at first, when `open` is not given. */
  defaultOpen?: boolean;
  /** Seen, focusable and announced, but it does not open or close. */
  disabled?: boolean;
  /**
   * Mounts the children only when the section opens, such as a list that loads from an
   * API. They unmount once it has closed, and mount again on the next open, unless `keep`.
   */
  lazy?: boolean;
  /** Keeps lazy children once mounted, so opening again finds them as they were. */
  keep?: boolean;
  /** This section's chevron; by default the accordion's. */
  icon?: AccordionIcon;
}

/** One section of an accordion. Every other prop goes to the `<details>`, such as onToggle. */
export function AccordionItem({
  heading,
  description,
  open,
  defaultOpen,
  disabled,
  lazy,
  keep,
  icon,
  className,
  children,
  onToggle,
  ref,
  ...details
}: AccordionItemProps) {
  const group = useContext(AccordionContext);
  const own = useRef<HTMLDetailsElement | null>(null);
  // Only the first value goes to the DOM; later changes close it with its motion.
  const [initial] = useState(open ?? defaultOpen ?? false);
  const [rendered, setRendered] = useState(initial);
  const iconAt = icon ?? group.icon;

  useEffect(() => {
    const el = own.current;
    if (!el || open === undefined) return;
    if (open) showDetails(el);
    else closeDetails(el);
  }, [open]);

  return (
    <details
      {...details}
      open={initial}
      ref={(el) => {
        own.current = el;
        if (typeof ref === 'function') return ref(el);
        if (ref) ref.current = el;
      }}
      className={cx(
        'ui-accordion__item',
        iconAt === 'start' && 'ui-accordion__item--icon-start',
        iconAt === 'none' && 'ui-accordion__item--no-icon',
        className,
      )}
      onToggle={(event) => {
        const el = event.currentTarget;
        if (!el.open) {
          if (!keep) setRendered(false);
        } else {
          setRendered(true);
          if (group.single && el.parentElement)
            for (const other of sections(el.parentElement))
              if (other !== el) closeDetails(other);
        }
        onToggle?.(event);
      }}
    >
      <summary
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          const el = event.currentTarget.parentElement as HTMLDetailsElement;
          if (disabled) event.preventDefault();
          else if (el.hasAttribute('data-closing')) {
            event.preventDefault();
            showDetails(el);
          } else if (el.open) {
            event.preventDefault();
            closeDetails(el);
          }
        }}
      >
        <span className="ui-accordion__heading">
          {heading}
          {description && (
            <span className="ui-accordion__description">{description}</span>
          )}
        </span>
      </summary>
      <div className="ui-accordion__content">
        {!lazy || rendered ? children : null}
      </div>
    </details>
  );
}

export interface TooltipProps {
  /** The short label. */
  text: string;
  /** One focusable element that takes a ref and spreads its props, such as Button. */
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'start' | 'end';
}

/**
 * A short label for a control, shown on hover and keyboard focus and read as its
 * description, on React Aria. Touch screens never show it, so never hide something needed
 * in a tooltip; an icon-only button still needs its own `aria-label`.
 *
 * ```tsx
 * <Tooltip text="Copy link"><Button variant="ghost" aria-label="Copy link">…</Button></Tooltip>
 * ```
 */
export function Tooltip({ text, children, placement = 'top' }: TooltipProps) {
  return (
    <TooltipTrigger delay={300}>
      <Focusable>{children as AriaChild}</Focusable>
      <AriaTooltip
        className="ui-tooltip"
        placement={placement}
        offset={8}
        style={{ zIndex: 'var(--ui-layer-tooltip)' }}
      >
        {text}
      </AriaTooltip>
    </TooltipTrigger>
  );
}

export interface PopoverProps {
  /** One pressable element that takes a ref and spreads its props, such as Button. */
  trigger: ReactElement;
  children?: ReactNode;
  placement?: 'bottom start' | 'top start' | 'bottom end' | 'top end';
}

/**
 * A small panel next to its button, for a few details or settings, on React Aria. Not
 * modal: focus moves into it, Escape or a click outside closes it and focus returns to the
 * button. The panel is named after the button.
 *
 * ```tsx
 * <Popover trigger={<Button variant="secondary">Delivery fee</Button>}>
 *   <p>Free over EGP 500.</p>
 * </Popover>
 * ```
 */
export function Popover({
  trigger,
  children,
  placement = 'bottom start',
}: PopoverProps) {
  return (
    <DialogTrigger>
      <Pressable>{trigger as AriaChild}</Pressable>
      <AriaPopover
        placement={placement}
        offset={8}
        style={{ zIndex: 'var(--ui-layer-popover)' }}
      >
        <Dialog className="ui-popover">{children}</Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
