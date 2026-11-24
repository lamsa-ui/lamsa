import { Component, computed, inject, input } from '@angular/core';
import { UI_LABELS } from '../labels';
import { IconComponent } from '../icon/icon.component';

export type TimelineStatus = 'approved' | 'pending' | 'rejected';

export interface TimelineItem {
  title: string;
  date: string;
  /** Machine-readable date, such as "2026-11-20T14:30:00Z". */
  dateTime?: string;
  actor?: string;
  description?: string;
  status?: TimelineStatus;
  /** Overrides the status text shown to users, including for translation. */
  statusLabel?: string;
}

/**
 * A read-only, chronological record of decisions, such as a case's approval history.
 *
 * ```html
 * <ui-timeline label="Approval history" [items]="approvals" />
 * ```
 */
@Component({
  selector: 'ui-timeline',
  imports: [IconComponent],
  host: { class: 'ui-timeline-host' },
  template: `
    <ol class="ui-timeline" [attr.aria-label]="label()">
      @for (item of items(); track $index) {
        <li class="ui-timeline__item">
          <span
            class="ui-timeline__marker"
            [class.ui-timeline__marker--approved]="item.status === 'approved'"
            [class.ui-timeline__marker--pending]="item.status === 'pending'"
            [class.ui-timeline__marker--rejected]="item.status === 'rejected'"
            aria-hidden="true"
          >
            @if (item.status === 'approved') {
              <ui-icon name="check" />
            } @else if (item.status === 'pending') {
              <ui-icon name="clock" />
            } @else if (item.status === 'rejected') {
              <ui-icon name="x" />
            }
          </span>
          <article class="ui-timeline__content">
            <div class="ui-timeline__heading">
              <h3 class="ui-timeline__title">{{ item.title }}</h3>
              @if (item.status) {
                <span
                  class="ui-timeline__status"
                  [class.ui-timeline__status--approved]="
                    item.status === 'approved'
                  "
                  [class.ui-timeline__status--pending]="
                    item.status === 'pending'
                  "
                  [class.ui-timeline__status--rejected]="
                    item.status === 'rejected'
                  "
                >
                  {{ item.statusLabel || statusLabels()[item.status] }}
                </span>
              }
            </div>
            <p class="ui-timeline__meta">
              @if (item.actor) {
                <span>{{ item.actor }}</span>
              }
              <time [attr.datetime]="item.dateTime || null">{{
                item.date
              }}</time>
            </p>
            @if (item.description) {
              <p class="ui-timeline__description">{{ item.description }}</p>
            }
          </article>
        </li>
      }
    </ol>
  `,
})
export class TimelineComponent {
  /** Names the history list: "Approval history". */
  readonly label = input.required<string>();
  readonly items = input.required<readonly TimelineItem[]>();

  private readonly uiLabels = inject(UI_LABELS);
  protected readonly statusLabels = computed(() => this.uiLabels().timeline);
}
