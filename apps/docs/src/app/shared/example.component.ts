import { Component, input } from '@angular/core';
import { CodeBlockComponent } from './code-block.component';
import type { FrameworkCode } from './docs-settings';

/** One example: a title, a live preview, and its code in the reader's framework. */
@Component({
  selector: 'app-example',
  imports: [CodeBlockComponent],
  // Enter on a link fires click too, so this one listener covers the keyboard.
  host: { class: 'doc-card', '(click)': 'stayOnPage($event)' },
  template: `
    <h2 class="doc-card__title" [attr.id]="anchor()">{{ title() }}</h2>
    @if (description()) {
      <p class="doc-card__text">{{ description() }}</p>
    }
    <div
      class="doc-preview"
      [attr.dir]="rtl() ? 'rtl' : null"
      [attr.lang]="rtl() ? 'ar' : null"
    >
      <ng-content />
    </div>
    <app-code-block [code]="code()" [text]="text()" />
  `,
})
export class ExampleComponent {
  /** Links in a demo show the look only: following one would leave the docs page. Router links in a demo stay in the page. */
  protected stayOnPage(event: MouseEvent): void {
    if (
      (event.target as Element).closest(
        '.doc-preview a[href]:not([routerlinkactive])',
      )
    )
      event.preventDefault();
  }

  readonly title = input.required<string>();
  readonly anchor = input<string>();
  readonly description = input<string>();
  readonly code = input<FrameworkCode>({});
  readonly text = input<string>();
  /** Shows the preview in Arabic, right to left. */
  readonly rtl = input(false);
}
