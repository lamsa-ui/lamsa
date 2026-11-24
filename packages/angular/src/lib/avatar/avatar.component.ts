import {
  booleanAttribute,
  Component,
  computed,
  input,
  linkedSignal,
} from '@angular/core';

/** Keeps two Arabic initials apart, so م and ع never join into the word «مع». Invisible in Latin. */
const ZWNJ = '\u200c';

/** First letter of the first and last word: "Mona Adel" → "MA", "منى عادل" → م and ع, kept apart. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = (word = '') => Array.from(word)[0] ?? '';
  const letters =
    words.length > 1
      ? first(words[0]) + ZWNJ + first(words[words.length - 1])
      : first(words[0]);
  return letters.toLocaleUpperCase();
}

/**
 * A person's photo, or their initials when there is no photo or it fails to load.
 * Screen readers hear the name. Set `decorative` when the name is written next to it,
 * so it is not read twice.
 *
 * ```html
 * <ui-avatar name="Mona Adel" src="/mona.jpg" />
 * ```
 */
@Component({
  selector: 'ui-avatar',
  host: {
    '[class]': 'classes()',
    '[attr.role]': 'decorative() ? null : "img"',
    '[attr.aria-label]': 'decorative() ? null : name()',
    '[attr.aria-hidden]': 'decorative() || null',
  },
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" alt="" (error)="failed.set(true)" />
    } @else {
      {{ letters() }}
    }
  `,
})
export class AvatarComponent {
  readonly name = input.required<string>();
  readonly src = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** The name is already on screen next to the avatar. */
  readonly decorative = input(false, { transform: booleanAttribute });

  /** Back to false whenever the photo changes, so a new photo gets its chance. */
  protected readonly failed = linkedSignal({
    source: this.src,
    computation: () => false,
  });
  protected readonly letters = computed(() => initials(this.name()));
  protected readonly classes = computed(() =>
    this.size() === 'md' ? 'ui-avatar' : `ui-avatar ui-avatar--${this.size()}`,
  );
}
