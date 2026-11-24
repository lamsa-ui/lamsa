import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  type Signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface StripState {
  /** There are tabs hidden toward the start. */
  start: boolean;
  /** There are tabs hidden toward the end. */
  end: boolean;
}

/**
 * Keeps a scrolling tab list in order: the current tab (aria-selected or aria-current)
 * scrolls to the middle when it changes, and `onState` hears which ends hide tabs.
 * Only the list scrolls, never the page. Returns the clean-up.
 */
export function watchTabStrip(
  list: HTMLElement,
  onState: (state: StripState) => void,
): () => void {
  const update = () => {
    // scrollLeft runs negative right to left; the distance from the start is the same.
    const travel = Math.abs(list.scrollLeft);
    const max = list.scrollWidth - list.clientWidth;
    onState({ start: travel > 1, end: travel < max - 1 });
  };
  const center = () => {
    const tab = list.querySelector(
      '[aria-selected="true"], [aria-current="page"]',
    );
    if (!tab) return;
    const t = tab.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    // Smooth or not comes from the CSS scroll-behavior, which honours reduced motion.
    list.scrollBy?.({ left: t.left + t.width / 2 - (l.left + l.width / 2) });
  };
  const resize =
    typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
  const observeSizes = () => {
    resize?.observe(list);
    for (const child of Array.from(list.children)) resize?.observe(child);
  };
  const mutations = new MutationObserver((records) => {
    if (records.some((r) => r.type === 'childList')) observeSizes();
    if (records.some((r) => r.type === 'attributes')) center();
    update();
  });
  mutations.observe(list, {
    childList: true,
    subtree: true,
    attributeFilter: ['aria-selected', 'aria-current'],
  });
  list.addEventListener('scroll', update, { passive: true });
  observeSizes();
  center();
  update();
  return () => {
    resize?.disconnect();
    mutations.disconnect();
    list.removeEventListener('scroll', update);
  };
}

/** Scrolls the list most of its width toward the start (-1) or the end (1). */
export function scrollStrip(list: HTMLElement, toward: -1 | 1): void {
  const rtl = getComputedStyle(list).direction === 'rtl';
  list.scrollBy({ left: toward * (rtl ? -1 : 1) * list.clientWidth * 0.8 });
}

/** Watches `list` once it renders, for the component that owns it. */
export function tabStrip(list: Signal<ElementRef<HTMLElement>>) {
  const state = signal<StripState>({ start: false, end: false });
  const destroyRef = inject(DestroyRef);
  afterNextRender(() => {
    const stop = watchTabStrip(list().nativeElement, (next) => {
      const now = state();
      if (now.start !== next.start || now.end !== next.end) state.set(next);
    });
    destroyRef.onDestroy(stop);
  });
  return {
    state,
    scroll: (toward: -1 | 1) => scrollStrip(list().nativeElement, toward),
  };
}

/**
 * An arrow at one end of a scrolling tab list, for a mouse with no sideways scroll.
 * Hidden from the keyboard and screen readers: they move by tab, and the list follows.
 */
@Component({
  imports: [IconComponent],
  selector: 'ui-tab-scroll',
  host: { style: 'display: contents' },
  template: `
    <button
      type="button"
      class="ui-tabs__scroll"
      tabindex="-1"
      aria-hidden="true"
      [disabled]="disabled()"
    >
      <ui-icon
        [name]="toward() === 'start' ? 'chevron-left' : 'chevron-right'"
      />
    </button>
  `,
})
export class TabScrollButtonComponent {
  readonly toward = input.required<'start' | 'end'>();
  readonly disabled = input(false);
}
