import { Component, inject } from '@angular/core';
import { ButtonComponent, UiToast } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-toast-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Toast"
      lead="A short note after an action, such as Saved, at the bottom end of the screen. Screen readers hear it as it comes. It closes by itself after 6 seconds, but never while the pointer or focus is on it, and never when it holds an action, so nobody loses the Undo to a timer."
      [usage]="usage"
    >
      <app-example
        title="Tones"
        description="Danger is announced at once; the others wait for the screen reader to finish."
        [code]="tones"
      >
        <button ui-button variant="secondary" (click)="saved()">
          Save address
        </button>
        <button ui-button variant="secondary" (click)="failed()">Pay</button>
      </app-example>

      <app-example
        title="With an action"
        description="It stays until it is closed or its button is pressed."
        [code]="action"
      >
        <button ui-button variant="danger" (click)="deleted()">
          Delete order
        </button>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <button ui-button variant="secondary" (click)="arabicSaved()">
          احفظ العنوان
        </button>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ToastPageComponent {
  private readonly toast = inject(UiToast);

  protected saved(): void {
    this.toast.show('Address saved', { tone: 'success' });
  }

  protected failed(): void {
    this.toast.show('The card was declined. Try another card.', {
      tone: 'danger',
      title: 'Payment failed',
    });
  }

  protected deleted(): void {
    this.toast.show('Order 1042 deleted', {
      action: {
        label: 'Undo',
        run: () => this.toast.show('Order 1042 is back'),
      },
    });
  }

  protected arabicSaved(): void {
    this.toast.show('العنوان اتحفظ', { tone: 'success' });
  }

  protected readonly usage = {
    angular: `import { UiToast } from '@ghazal-ui/angular';

const toast = inject(UiToast);
// The region and close buttons take their words from provideUiLabels.`,
    react: `import { ToastProvider, useToast } from '@ghazal-ui/react';

// Once, around the app:
<ToastProvider>{app}</ToastProvider>`,
    vue: `import { ToastProvider, useToast } from '@ghazal-ui/vue';

<!-- Once, around the app (App.vue): -->
<ToastProvider><RouterView /></ToastProvider>`,
    html: `<!-- Toasts need script to come and go. The markup they use: -->
<section aria-label="Notifications">
  <ol class="ui-toast-region">
    <li class="ui-alert ui-alert--success ui-toast">…as an alert</li>
  </ol>
</section>
<!-- Announce each one through a live region that is already on the page. -->`,
  };

  protected readonly tones = {
    angular: `toast.show('Address saved', { tone: 'success' });
toast.show('The card was declined. Try another card.', { tone: 'danger', title: 'Payment failed' });`,
    react: `const toast = useToast();
toast.show('Address saved', { tone: 'success' });
toast.show('The card was declined. Try another card.', { tone: 'danger', title: 'Payment failed' });`,
    vue: `const toast = useToast();
toast.show('Address saved', { tone: 'success' });
toast.show('The card was declined. Try another card.', { tone: 'danger', title: 'Payment failed' });`,
    html: `<li class="ui-alert ui-alert--danger ui-toast">
  <i class="ui-icon ui-icon-circle-x ui-alert__icon" aria-hidden="true"></i>
  <div class="ui-alert__body">
    <p class="ui-alert__title">Payment failed</p>
    <p>The card was declined. Try another card.</p>
  </div>
  <button class="ui-button ui-button--ghost ui-alert__close" aria-label="Dismiss">✕</button>
</li>`,
  };

  protected readonly action = {
    angular: `toast.show('Order 1042 deleted', {
  action: { label: 'Undo', run: () => restore(order) },
});`,
    react: `toast.show('Order 1042 deleted', {
  action: { label: 'Undo', run: () => restore(order) },
});`,
    vue: `toast.show('Order 1042 deleted', {
  action: { label: 'Undo', run: () => restore(order) },
});`,
    html: `<div class="ui-alert__actions">
  <button class="ui-button ui-button--secondary ui-button--sm">Undo</button>
</div>`,
  };

  protected readonly arabic = {
    angular: `// providers: [provideUiLabels(arabicLabels)] names the region and close buttons
toast.show('العنوان اتحفظ', { tone: 'success' });`,
    react: `<UiLabelsProvider labels={arabicLabels}>
  <ToastProvider>…</ToastProvider>
</UiLabelsProvider>`,
    vue: `// provideUiLabels(arabicLabels) in App.vue names the region and close buttons
<ToastProvider>…</ToastProvider>`,
    html: `<!-- dir="rtl" on the page: toasts sit at the bottom left -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A message that must stay until it is fixed',
      use: 'Alert',
      path: '/components/alert',
    },
    {
      need: 'A decision the reader must make now',
      use: 'Alert dialog',
      path: '/components/alert-dialog',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'show(message, options?)',
        type: 'number',
        description: 'Shows a toast and returns its id.',
      },
      {
        name: 'options.tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        default: "'info'",
        description: 'Icon and colour. Danger is announced at once.',
      },
      {
        name: 'options.title',
        type: 'string',
        description: 'A few words in bold before the message.',
      },
      {
        name: 'options.duration',
        type: 'number',
        default: '6000',
        description:
          'Milliseconds; 0 keeps it. With an action it defaults to 0.',
      },
      {
        name: 'options.action',
        type: '{ label, run }',
        description: 'One button; pressing it closes the toast.',
      },
      { name: 'dismiss(id)', type: 'void', description: 'Closes a toast.' },
      {
        name: 'labels',
        type: 'signal',
        default: 'from provideUiLabels',
        description:
          'The region name and close button name. Set only to differ from provideUiLabels.',
      },
    ],
    react: [
      {
        name: '<ToastProvider>',
        type: 'component',
        description:
          'Once around the app. Takes label and closeLabel; they default to UiLabelsProvider.',
      },
      {
        name: 'useToast().show(message, options?)',
        type: 'number',
        description: 'As in Angular.',
      },
      {
        name: 'useToast().dismiss(id)',
        type: 'void',
        description: 'Closes a toast.',
      },
    ],
    vue: [
      {
        name: '<ToastProvider>',
        type: 'component',
        description:
          'Once, around the app. label names the region; closeLabel names each × button.',
      },
      {
        name: 'useToast().show(message, options?)',
        type: 'number',
        description:
          'Shows a toast and returns its id. options: tone, title, duration (ms, 0 keeps it), action { label, run }.',
      },
      {
        name: 'useToast().dismiss(id)',
        type: 'void',
        description: 'Removes a toast early.',
      },
    ],
    html: [
      {
        name: 'ui-toast-region',
        type: 'class',
        description: 'The list at the bottom end of the screen.',
      },
      {
        name: 'ui-toast',
        type: 'class',
        description: 'On each ui-alert in it: shadow and entry motion.',
      },
    ],
  };
}
