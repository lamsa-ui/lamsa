'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './icon.js';

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
function watchTabStrip(
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

/** A ref for the tab list, which ends hide tabs, and a scroll toward the start (-1) or end (1). */
export function useTabStrip<E extends HTMLElement>() {
  const ref = useRef<E>(null);
  const [state, setState] = useState<StripState>({ start: false, end: false });
  useEffect(() => {
    if (!ref.current) return;
    return watchTabStrip(ref.current, (next) =>
      setState((now) =>
        now.start === next.start && now.end === next.end ? now : next,
      ),
    );
  }, []);
  const scroll = (toward: -1 | 1) => {
    const list = ref.current;
    if (!list) return;
    const rtl = getComputedStyle(list).direction === 'rtl';
    list.scrollBy({ left: toward * (rtl ? -1 : 1) * list.clientWidth * 0.8 });
  };
  return { ref, state, scroll };
}

/**
 * The arrows at both ends of a scrolling tab list, for a mouse with no sideways scroll,
 * shown only while the tabs are wider. Hidden from the keyboard and screen readers:
 * they move by tab, and the list follows.
 */
export function TabScrollButton({
  toward,
  state,
  onScroll,
}: {
  toward: 'start' | 'end';
  state: StripState;
  onScroll: (toward: -1 | 1) => void;
}) {
  if (!state.start && !state.end) return null;
  return (
    <button
      type="button"
      className="ui-tabs__scroll"
      tabIndex={-1}
      aria-hidden="true"
      disabled={!state[toward]}
      onClick={() => onScroll(toward === 'start' ? -1 : 1)}
    >
      <Icon name={toward === 'start' ? 'chevron-left' : 'chevron-right'} />
    </button>
  );
}
