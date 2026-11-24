import {
  InjectionToken,
  isSignal,
  signal,
  type Provider,
  type Signal,
} from '@angular/core';
import { englishLabels, type UiLabels } from './ui-labels';

/** The words every component falls back to when its own label input is not set. */
export const UI_LABELS = new InjectionToken<Signal<UiLabels>>('UI_LABELS', {
  providedIn: 'root',
  factory: () => signal(englishLabels),
});

/**
 * Gives every component its words in one language. Pass a signal to switch language live:
 *
 * ```ts
 * providers: [provideUiLabels(computed(() => (lang() === 'ar' ? arabicLabels : englishLabels)))]
 * ```
 */
export function provideUiLabels(labels: UiLabels | Signal<UiLabels>): Provider {
  return {
    provide: UI_LABELS,
    useValue: isSignal(labels) ? labels : signal(labels),
  };
}
