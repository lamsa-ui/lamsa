import { Component, computed, input } from '@angular/core';

/**
 * Grey shapes in place of content that is loading, so the page does not jump when it
 * arrives. Hidden from screen readers: mark the area `aria-busy="true"` and put a
 * `ui-spinner` or a status message with it.
 *
 * ```html
 * <ui-skeleton shape="circle" /> <ui-skeleton [lines]="3" />
 * ```
 */
@Component({
  selector: 'ui-skeleton',
  host: {
    'aria-hidden': 'true',
    '[class]': "'ui-skeleton ui-skeleton--' + shape()",
  },
  template: `
    @for (line of shapes(); track $index) {
      <span class="ui-skeleton__shape"></span>
    }
  `,
})
export class SkeletonComponent {
  /** `text`: lines of text; `circle`: an avatar; `block`: an image or card. */
  readonly shape = input<'text' | 'circle' | 'block'>('text');
  /** Lines of text; the last one is shorter. */
  readonly lines = input(1);

  protected readonly shapes = computed(() =>
    Array.from({ length: this.shape() === 'text' ? this.lines() : 1 }),
  );
}
