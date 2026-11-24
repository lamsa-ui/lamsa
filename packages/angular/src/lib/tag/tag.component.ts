import { booleanAttribute, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

let nextId = 0;

/**
 * A label the user added or can take away, such as an active filter. For a status
 * ("Paid") use a badge. With `removable`, the × button is read as "Remove Angular";
 * after `remove`, move focus to the next tag or the field that adds tags.
 *
 * ```html
 * <ui-tag removable (remove)="drop('angular')">Angular</ui-tag>
 * ```
 */
@Component({
  imports: [IconComponent],
  selector: 'ui-tag',
  host: { class: 'ui-tag' },
  template: `
    <span [id]="id"><ng-content /></span>
    @if (removable()) {
      <button
        type="button"
        class="ui-tag__remove"
        [id]="id + '-remove'"
        [attr.aria-label]="removeLabel()"
        [attr.aria-labelledby]="id + '-remove ' + id"
        (click)="remove.emit()"
      >
        <ui-icon name="x" />
      </button>
    }
  `,
})
export class TagComponent {
  readonly removable = input(false, { transform: booleanAttribute });
  /** First word of the remove button's name; the tag's text follows it. */
  readonly removeLabel = input('Remove');
  readonly remove = output<void>();

  protected readonly id = `ui-tag-${nextId++}`;
}
