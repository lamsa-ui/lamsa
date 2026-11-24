import {
  inject,
  isRef,
  provide,
  ref,
  type InjectionKey,
  type MaybeRef,
  type Ref,
} from 'vue';
import { englishLabels, type UiLabels } from './ui-labels';

/** For `app.provide(uiLabelsKey, ref(arabicLabels))` at the app root. */
export const uiLabelsKey: InjectionKey<Readonly<Ref<UiLabels>>> =
  Symbol('ui-labels');

/**
 * Gives every component below its words in one language. Call it in a setup function;
 * pass a ref or computed to switch language live:
 *
 * ```ts
 * provideUiLabels(computed(() => (lang.value === 'ar' ? arabicLabels : englishLabels)));
 * ```
 */
export function provideUiLabels(labels: MaybeRef<UiLabels>): void {
  provide(uiLabelsKey, isRef(labels) ? labels : ref(labels));
}

/** The words components fall back to when a label prop is not set. */
export function useUiLabels(): Readonly<Ref<UiLabels>> {
  return inject(uiLabelsKey, ref(englishLabels));
}
