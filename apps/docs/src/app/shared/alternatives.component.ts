import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** One row: what the reader needs, and the component (or plain HTML) that fits it better. */
export interface Alternative {
  need: string;
  use: string;
  /** The docs page of `use`; leave it out for plain HTML such as a link. */
  path?: string;
}

/** "When to use something else": stops a component being used for a job another one does better. */
@Component({
  selector: 'app-alternatives',
  imports: [RouterLink],
  host: { class: 'doc-section' },
  template: `
    <h2 class="ui-heading doc-h2" id="alternatives">
      When to use something else
    </h2>
    <div
      class="doc-table-wrap"
      tabindex="0"
      role="region"
      aria-label="When to use something else"
    >
      <table class="doc-table">
        <thead>
          <tr>
            <th scope="col">If you need</th>
            <th scope="col">Use</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.need) {
            <tr>
              <td>{{ row.need }}</td>
              <td>
                @if (row.path) {
                  <a [routerLink]="row.path">{{ row.use }}</a>
                } @else {
                  {{ row.use }}
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AlternativesComponent {
  readonly rows = input.required<Alternative[]>();
}
