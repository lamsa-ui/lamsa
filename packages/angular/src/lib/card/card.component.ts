import { Component, computed, input } from '@angular/core';

/**
 * A surface that groups related content, with an optional title.
 * Set `level` so the title fits the page's heading outline.
 *
 * ```html
 * <ui-card title="Recent orders" [level]="2">...</ui-card>
 * ```
 */
@Component({
  selector: 'ui-card',
  host: { '[class]': 'classes()' },
  template: `
    @if (title()) {
      @switch (level()) {
        @case (2) {
          <h2 class="ui-card__title">{{ title() }}</h2>
        }
        @case (4) {
          <h4 class="ui-card__title">{{ title() }}</h4>
        }
        @default {
          <h3 class="ui-card__title">{{ title() }}</h3>
        }
      }
    }
    <ng-content />
  `,
})
export class CardComponent {
  readonly title = input<string>();
  /** Heading level of the title. */
  readonly level = input<2 | 3 | 4>(3);
  readonly padding = input<'md' | 'lg'>('md');

  protected readonly classes = computed(() =>
    this.padding() === 'lg' ? 'ui-card ui-card--lg' : 'ui-card',
  );
}
