import { Component, computed, inject, input } from '@angular/core';
import { DocsSettings, type Framework } from './docs-settings';

export interface ApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** The options of a component in the reader's framework: inputs for Angular, classes and attributes for HTML. */
@Component({
  selector: 'app-api-table',
  host: { class: 'doc-section' },
  template: `
    <h2 class="ui-heading doc-h2" id="api">{{ heading() }}</h2>
    <div
      class="doc-table-wrap"
      tabindex="0"
      role="region"
      [attr.aria-label]="heading()"
    >
      @if (current(); as rows) {
        <table class="doc-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">What it does</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.name) {
              <tr>
                <td>
                  <code>{{ row.name }}</code>
                </td>
                <td>
                  <code>{{ row.type }}</code>
                </td>
                <td>
                  @if (row.default) {
                    <code>{{ row.default }}</code>
                  } @else {
                    —
                  }
                </td>
                <td>{{ row.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="doc-note">Not documented for this framework yet.</p>
      }
    </div>
  `,
})
export class ApiTableComponent {
  readonly rows = input.required<Partial<Record<Framework, ApiRow[]>>>();

  private readonly settings = inject(DocsSettings);
  protected readonly current = computed(
    () => this.rows()[this.settings.framework()],
  );
  protected readonly heading = computed(
    () =>
      ({
        angular: 'Inputs',
        react: 'Props',
        vue: 'Props',
        html: 'Classes and attributes',
      })[this.settings.framework()],
  );
}
