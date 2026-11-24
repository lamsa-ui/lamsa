import { createContext, useContext, type ReactNode } from 'react';
import { englishLabels, type UiLabels } from './ui-labels.js';

const LabelsContext = createContext<UiLabels>(englishLabels);

/**
 * Gives every component inside its words in one language; change `labels` to switch
 * language live. React Aria's own words (calendar, number field) follow its I18nProvider.
 *
 * ```tsx
 * <UiLabelsProvider labels={lang === 'ar' ? arabicLabels : englishLabels}>…</UiLabelsProvider>
 * ```
 */
export function UiLabelsProvider({
  labels,
  children,
}: {
  labels: UiLabels;
  children?: ReactNode;
}) {
  return (
    <LabelsContext.Provider value={labels}>{children}</LabelsContext.Provider>
  );
}

/** The words components fall back to when a label prop is not set. */
export function useUiLabels(): UiLabels {
  return useContext(LabelsContext);
}
