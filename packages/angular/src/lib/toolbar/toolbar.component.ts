import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';

const FOCUSABLE =
  'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled)';

/**
 * A row of controls that is one tab stop: Tab enters and leaves it, the arrow keys move
 * inside it (flipped in right-to-left pages), Home and End jump to the ends.
 *
 * ```html
 * <ui-toolbar label="Order actions">
 *   <button ui-button variant="ghost">Print</button>
 *   <button ui-button variant="ghost">Refund</button>
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: 'ui-toolbar',
  host: {
    class: 'ui-toolbar',
    role: 'toolbar',
    '[attr.aria-label]': 'label()',
    '[attr.aria-orientation]': 'orientation()',
    '(keydown)': 'move($event)',
    '(focusin)': 'remember($event)',
  },
  template: `<ng-content />`,
})
export class ToolbarComponent {
  /** What the controls act on, for screen readers: "Order actions". */
  readonly label = input.required<string>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    afterNextRender(() => this.focusable(this.items()[0]));
  }

  private items(): HTMLElement[] {
    return [...this.host.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.closest('.ui-toolbar') === this.host,
    );
  }

  /** Roving tab stop: only the last focused control is in the tab order. */
  private focusable(current?: HTMLElement): void {
    for (const item of this.items()) item.tabIndex = item === current ? 0 : -1;
  }

  protected remember(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (this.items().includes(target)) this.focusable(target);
  }

  protected move(event: KeyboardEvent): void {
    const items = this.items();
    const at = items.indexOf(event.target as HTMLElement);
    if (at < 0) return;
    const next = toolbarStep(
      event.key,
      at,
      items.length,
      this.orientation(),
      getComputedStyle(this.host).direction === 'rtl',
    );
    if (next == null) return;
    event.preventDefault();
    this.focusable(items[next]);
    items[next].focus();
  }
}

/** Where an arrow, Home or End key moves focus in a toolbar, wrapping at the ends; null for any other key. */
export function toolbarStep(
  key: string,
  at: number,
  count: number,
  orientation: 'horizontal' | 'vertical',
  rtl: boolean,
): number | null {
  const step: Record<string, number> =
    orientation === 'vertical'
      ? { ArrowDown: 1, ArrowUp: -1 }
      : { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
  if (key in step) return (at + step[key] + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

/** A thin line between groups of controls in a toolbar. */
@Component({
  selector: 'ui-toolbar-separator',
  host: { class: 'ui-toolbar__separator', role: 'separator' },
  template: '',
})
export class ToolbarSeparatorComponent {}
