import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS, MIRRORED_ICONS, type IconName } from '@ghazal-ui/icons';

/** sm, md and lg, or any CSS length ('3rem'), or a number of pixels. */
export type IconSize = 'sm' | 'md' | 'lg' | number | (string & {});

const PRESETS = ['sm', 'md', 'lg'];

/**
 * An icon that follows the text colour and the font size. Arrows and chevrons flip
 * in right-to-left pages. Without a `label` the icon is decoration and hidden from
 * screen readers, so put the meaning in nearby text or give it a label.
 *
 * ```html
 * <ui-icon name="search" label="Search" />
 * <ui-icon name="search" size="3rem" />
 * ```
 */
@Component({
  selector: 'ui-icon',
  host: {
    '[class]': 'classes()',
    '[style.--ui-icon-size]': 'customSize()',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    [innerHTML]="shapes()"
  ></svg>`,
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<IconName>();
  readonly size = input<IconSize>('md');
  /** What the icon means, for screen readers. Leave it out for a decorative icon. */
  readonly label = input<string>();

  protected readonly classes = computed(() => {
    const mirror = MIRRORED_ICONS.includes(this.name())
      ? ' ui-icon--mirror'
      : '';
    const size = this.size();
    const preset =
      size === 'md' || !PRESETS.includes(String(size))
        ? ''
        : ` ui-icon--${size}`;
    return `ui-icon${preset}${mirror}`;
  });

  protected readonly customSize = computed(() => {
    const size = this.size();
    if (typeof size === 'number') return `${size}px`;
    return PRESETS.includes(size) ? null : size;
  });

  // The markup comes from our own build-time constants, never from user input, so it is safe to trust.
  protected readonly shapes = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()]),
  );
}
