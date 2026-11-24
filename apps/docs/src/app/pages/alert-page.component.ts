import { Component, signal } from '@angular/core';
import { AlertComponent, ButtonComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-alert-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    AlertComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Alert"
      lead="A message in the page, such as a problem with the whole form or a notice about the account. The title says what it is in words; the icon's shape and the colour repeat it. For a note after an action, use a toast; for a question that needs an answer, an alert dialog."
      [usage]="usage"
    >
      <app-example
        title="Tones"
        description="Body text passes 7:1 on every tone, in both themes."
        [code]="tones"
      >
        <div class="doc-stack doc-wide">
          <ui-alert title="New: export to PDF">
            Reports can now be saved as PDF from the menu.
          </ui-alert>
          <ui-alert tone="success" title="Payment received">
            Invoice 1042 is paid.
          </ui-alert>
          <ui-alert tone="warning" title="Your plan ends on 1 December">
            Renew it to keep your reports.
          </ui-alert>
          <ui-alert tone="danger" title="The form has 2 problems">
            Fix the fields marked below, then send it again.
          </ui-alert>
        </div>
      </app-example>

      <app-example
        title="With actions, and closable"
        description="Close removes it from the page; the button's name says what it does."
        [code]="actions"
      >
        @if (shown()) {
          <ui-alert
            tone="warning"
            title="Your plan ends on 1 December"
            [dismissible]="true"
            (dismiss)="shown.set(false)"
            class="doc-wide"
          >
            Renew it to keep your reports.
            <div ui-alert-actions>
              <button ui-button size="sm">Renew</button>
              <button ui-button size="sm" variant="secondary">See plans</button>
            </div>
          </ui-alert>
        } @else {
          <button ui-button variant="secondary" (click)="shown.set(true)">
            Show the alert again
          </button>
        }
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-alert tone="success" title="الدفع وصل" class="doc-wide">
          الفاتورة ١٠٤٢ اتدفعت.
        </ui-alert>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AlertPageComponent {
  protected readonly shown = signal(true);

  protected readonly usage = {
    angular: `import { AlertComponent } from '@lamsa-ui/angular';
// Not announced on page load. Shown after an action? Add role="alert" or role="status".`,
    react: `import { Alert } from '@lamsa-ui/react';`,
    vue: `import { Alert } from '@lamsa-ui/vue';`,
    html: `<div class="ui-alert ui-alert--success">
  <i class="ui-icon ui-icon-circle-check ui-alert__icon" aria-hidden="true"></i>
  <div class="ui-alert__body">
    <p class="ui-alert__title">Payment received</p>
    <p>Invoice 1042 is paid.</p>
  </div>
</div>`,
  };

  protected readonly tones = {
    angular: `<ui-alert title="New: export to PDF">Reports can now be saved as PDF from the menu.</ui-alert>
<ui-alert tone="success" title="Payment received">Invoice 1042 is paid.</ui-alert>
<ui-alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</ui-alert>
<ui-alert tone="danger" title="The form has 2 problems">Fix the fields marked below.</ui-alert>`,
    react: `<Alert title="New: export to PDF">Reports can now be saved as PDF from the menu.</Alert>
<Alert tone="success" title="Payment received">Invoice 1042 is paid.</Alert>
<Alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</Alert>
<Alert tone="danger" title="The form has 2 problems">Fix the fields marked below.</Alert>`,
    vue: `<Alert title="New: export to PDF">Reports can now be saved as PDF from the menu.</Alert>
<Alert tone="success" title="Payment received">Invoice 1042 is paid.</Alert>
<Alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</Alert>
<Alert tone="danger" title="The form has 2 problems">Fix the fields marked below.</Alert>`,
    html: `<div class="ui-alert">…</div>                 <!-- info -->
<div class="ui-alert ui-alert--success">…</div>
<div class="ui-alert ui-alert--warning">…</div>
<div class="ui-alert ui-alert--danger">…</div>`,
  };

  protected readonly actions = {
    angular: `<ui-alert
  tone="warning"
  title="Your plan ends on 1 December"
  [dismissible]="true"
  closeLabel="Dismiss"
  (dismiss)="shown.set(false)"
>
  Renew it to keep your reports.
  <div ui-alert-actions>
    <button ui-button size="sm">Renew</button>
    <button ui-button size="sm" variant="secondary">See plans</button>
  </div>
</ui-alert>`,
    react: `<Alert
  tone="warning"
  title="Your plan ends on 1 December"
  onDismiss={() => setShown(false)}
  actions={<Button size="sm">Renew</Button>}
>
  Renew it to keep your reports.
</Alert>`,
    vue: `<Alert
  v-if="shown"
  tone="warning"
  title="Your plan ends on 1 December"
  @dismiss="shown = false"
>
  Renew it to keep your reports.
  <template #actions><Button size="sm">Renew</Button></template>
</Alert>`,
    html: `<div class="ui-alert ui-alert--warning">
  <i class="ui-icon ui-icon-triangle-alert ui-alert__icon" aria-hidden="true"></i>
  <div class="ui-alert__body">
    <p class="ui-alert__title">Your plan ends on 1 December</p>
    <p>Renew it to keep your reports.</p>
    <div class="ui-alert__actions"><button class="ui-button ui-button--primary ui-button--sm">Renew</button></div>
  </div>
  <button class="ui-button ui-button--ghost ui-alert__close" aria-label="Dismiss">✕</button>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-alert tone="success" title="الدفع وصل" closeLabel="إخفاء">الفاتورة ١٠٤٢ اتدفعت.</ui-alert>`,
    react: `<Alert tone="success" title="الدفع وصل">الفاتورة ١٠٤٢ اتدفعت.</Alert>`,
    vue: `<Alert tone="success" title="الدفع وصل">الفاتورة ١٠٤٢ اتدفعت.</Alert>`,
    html: `<!-- dir="rtl" on the page: the coloured edge moves to the right -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Confirm an action that just finished',
      use: 'Toast',
      path: '/components/toast',
    },
    {
      need: 'Stop the reader until they decide',
      use: 'Alert dialog',
      path: '/components/alert-dialog',
    },
    {
      need: 'Show a status in a row or a card',
      use: 'Badge',
      path: '/components/badge',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
        description: 'Icon and colour. The title must say it too.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'A few words in bold that say what it is.',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        default: 'false',
        description: 'Shows a close button.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Dismiss'",
        description: 'Its accessible name, translated.',
      },
      {
        name: '(dismiss)',
        type: 'void',
        description: 'The close button was pressed: remove the alert.',
      },
      {
        name: '[ui-alert-actions]',
        type: 'slot',
        description: 'An element holding buttons, under the message.',
      },
    ],
    react: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
        description: 'Icon and colour. The title must say it too.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'A few words in bold that say what it is.',
      },
      {
        name: 'actions',
        type: 'ReactNode',
        description: 'Buttons under the message.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        description: 'Shows a close button that calls it.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Dismiss'",
        description: 'Its accessible name, translated.',
      },
      {
        name: '...props',
        type: 'div props',
        description: 'Every native div prop, such as role.',
      },
    ],
    vue: [
      {
        name: 'tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
        description: 'Icon and colour. The title must say it too.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'A few words in bold that say what it is.',
      },
      {
        name: '#actions',
        type: 'slot',
        description: 'Buttons under the message.',
      },
      {
        name: '@dismiss',
        type: 'event',
        description:
          'Listening shows a close button; remove the alert when it fires.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Dismiss'",
        description: 'Its accessible name, translated.',
      },
    ],
    html: [
      {
        name: 'ui-alert',
        type: 'class',
        description: 'On its own it is the info tone.',
      },
      {
        name: 'ui-alert--success | --warning | --danger',
        type: 'class',
        description: 'The tone.',
      },
      {
        name: 'ui-alert__icon, __body, __title, __actions, __close',
        type: 'class',
        description: 'The parts. Hide the icon from screen readers.',
      },
    ],
  };
}
