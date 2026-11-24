import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

/** Frameworks shown by the docs code switcher. */
export const FRAMEWORKS = [
  { id: 'angular', label: 'Angular' },
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'html', label: 'HTML + CSS' },
] as const;
export type Framework = (typeof FRAMEWORKS)[number]['id'];

export const THEMES = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
] as const;
export type Theme = (typeof THEMES)[number]['id'];

/** Code for each framework; a missing framework shows a "not yet" note. */
export type FrameworkCode = Partial<Record<Framework, string>>;

/** One markup snippet for every framework: React spells class as className. */
export function markup(html: string): FrameworkCode {
  return {
    angular: html,
    react: html.replace(/\bclass=/g, 'className='),
    html,
  };
}

/** One CSS snippet, the same in every framework. */
export function css(text: string): FrameworkCode {
  return { angular: text, react: text, html: text };
}

function read<T extends string>(
  key: string,
  allowed: readonly { id: T }[],
  fallback: T,
): T {
  try {
    const value = localStorage.getItem(key);
    return allowed.some((a) => a.id === value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private window): the choice lasts for this visit only.
  }
}

/** The reader's framework and theme, remembered in this browser. */
@Injectable({ providedIn: 'root' })
export class DocsSettings {
  readonly framework = signal<Framework>(
    read('ghazal:framework', FRAMEWORKS, 'angular'),
  );
  readonly theme = signal<Theme>(read('ghazal:theme', THEMES, 'system'));

  constructor() {
    const root = inject(DOCUMENT).documentElement;
    effect(() => write('ghazal:framework', this.framework()));
    effect(() => {
      const theme = this.theme();
      write('ghazal:theme', theme);
      if (theme === 'system') delete root.dataset['theme'];
      else root.dataset['theme'] = theme;
    });
  }
}
