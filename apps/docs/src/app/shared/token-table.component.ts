import { Component, input } from '@angular/core';

export interface TokenRow {
  token: string;
  value: string;
  use: string;
  /** The Tailwind class that reads this token, from @lamsa-ui/css/tailwind.css. */
  tw?: string;
  /** Styles for a small live sample of the token, e.g. `{ background: 'var(--ui-primary)' }`. */
  preview?: Record<string, string>;
  /** A class for the sample instead of, or as well as, the styles. */
  previewClass?: string;
  /** Text inside the sample, for type and colour pairs. */
  previewText?: string;
}

/** The token table every Foundations section uses: name, value, what it is for, and a live sample. */
@Component({
  selector: 'app-token-table',
  template: `
    <div
      class="doc-table-wrap"
      tabindex="0"
      role="region"
      [attr.aria-label]="label()"
    >
      <table class="doc-table doc-token-table">
        <thead>
          <tr>
            <th scope="col">{{ tokenHeading() }}</th>
            <th scope="col">{{ valueHeading() }}</th>
            @if (hasTw()) {
              <th scope="col">Tailwind</th>
            }
            <th scope="col">{{ useHeading() }}</th>
            @if (hasPreview()) {
              <th scope="col">
                <span class="ui-visually-hidden">Sample</span>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.token) {
            <tr>
              <td>
                <code>{{ row.token }}</code>
              </td>
              <td>
                <code>{{ row.value }}</code>
              </td>
              @if (hasTw()) {
                <td>
                  @if (row.tw) {
                    <code>{{ row.tw }}</code>
                  } @else {
                    —
                  }
                </td>
              }
              <td>{{ row.use }}</td>
              @if (hasPreview()) {
                <td class="doc-token__cell">
                  @if (row.preview || row.previewClass) {
                    <span
                      class="doc-token__preview"
                      [class]="row.previewClass ?? ''"
                      [style]="row.preview ?? {}"
                      aria-hidden="true"
                      >{{ row.previewText }}</span
                    >
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TokenTableComponent {
  readonly rows = input.required<TokenRow[]>();
  readonly label = input.required<string>();
  readonly tokenHeading = input('Token');
  readonly valueHeading = input('Value');
  readonly useHeading = input('For');
  protected hasTw(): boolean {
    return this.rows().some((r) => r.tw);
  }
  protected hasPreview(): boolean {
    return this.rows().some((r) => r.preview || r.previewClass);
  }
}
