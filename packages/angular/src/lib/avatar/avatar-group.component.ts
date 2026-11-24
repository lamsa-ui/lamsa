import { Component, computed, inject, input } from '@angular/core';
import { AvatarComponent } from './avatar.component';
import { UI_LABELS } from '../labels';

export interface AvatarPerson {
  name: string;
  src?: string;
}

/**
 * Several people in a small space: the first few avatars overlap, and "+3" stands for
 * the rest. Every avatar is still named, and the group has a name of its own.
 *
 * ```html
 * <ui-avatar-group label="Kitchen team" [people]="team" [max]="3" />
 * ```
 */
@Component({
  selector: 'ui-avatar-group',
  imports: [AvatarComponent],
  host: {
    class: 'ui-avatar-group',
    role: 'group',
    '[attr.aria-label]': 'label()',
  },
  template: `
    @for (person of shown(); track $index) {
      <ui-avatar [name]="person.name" [src]="person.src" [size]="size()" />
    }
    @if (rest(); as rest) {
      <span
        role="img"
        [class]="moreClasses()"
        [attr.aria-label]="moreLabelText()(rest)"
        >+{{ rest }}</span
      >
    }
  `,
})
export class AvatarGroupComponent {
  private readonly uiLabels = inject(UI_LABELS);
  /** Who the group is, for screen readers: "Kitchen team". */
  readonly label = input.required<string>();
  readonly people = input.required<readonly AvatarPerson[]>();
  /** How many avatars to show before "+n". */
  readonly max = input(4);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** The name of "+n", translated: (n) => `${n} more`. */
  readonly moreLabel = input<(count: number) => string>();
  protected readonly moreLabelText = computed(
    () => this.moreLabel() ?? this.uiLabels().more,
  );

  protected readonly shown = computed(() => this.people().slice(0, this.max()));
  protected readonly rest = computed(() =>
    Math.max(this.people().length - this.max(), 0),
  );
  protected readonly moreClasses = computed(
    () =>
      'ui-avatar ui-avatar-group__more' +
      (this.size() === 'md' ? '' : ` ui-avatar--${this.size()}`),
  );
}
