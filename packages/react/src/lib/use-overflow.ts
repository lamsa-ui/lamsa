'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * True while the element's content overflows it along `axis`. A scrolling area
 * with no focusable content inside must take focus itself, or the keyboard cannot
 * scroll it; give it `tabIndex={overflows ? 0 : undefined}`.
 */
export function useOverflow<E extends HTMLElement>(
  axis: 'x' | 'y',
  active = true,
) {
  const ref = useRef<E>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!active || !element) return;
    const check = () =>
      setOverflows(
        axis === 'x'
          ? element.scrollWidth > element.clientWidth + 1
          : element.scrollHeight > element.clientHeight + 1,
      );
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [axis, active]);
  return [ref, overflows] as const;
}
