import { Component, inject, signal } from '@angular/core';
import {
  ButtonComponent,
  UiAlertDialog,
  IconComponent,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { DocsSettings } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-alert-dialog-page',
  imports: [
    IconComponent,
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Alert dialog"
      lead="A short message that needs an answer before the reader goes on: confirm a delete, keep or discard changes. Only its buttons answer: Escape and a click outside do nothing, because the reader has to choose. Focus starts on the safest button."
      [usage]="usage"
    >
      <app-example
        title="Confirm a destructive action"
        description="The danger tone shows an icon, and the title says it in words. Focus starts on Cancel, so pressing Enter by habit deletes nothing."
        [code]="confirm"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--danger ui-button--md"
            type="button"
            (click)="nativeConfirm.showModal()"
          >
            Delete file
          </button>
          <dialog
            #nativeConfirm
            class="ui-dialog ui-dialog--sm ui-dialog--alert"
            role="alertdialog"
            closedby="none"
            (cancel)="$event.preventDefault()"
            aria-labelledby="doc-delete-title"
            aria-describedby="doc-delete-message"
            (close)="answer.set(nativeConfirm.returnValue)"
          >
            <header class="ui-dialog__header">
              <span
                class="ui-dialog__icon ui-dialog__icon--danger"
                aria-hidden="true"
              >
                <ui-icon name="circle-x" />
              </span>
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-delete-title">
                  Delete report.pdf?
                </h2>
                <p class="ui-dialog__description" id="doc-delete-message">
                  It is removed for everyone. This cannot be undone.
                </p>
              </div>
            </header>
            <form method="dialog" class="ui-dialog__actions">
              <button
                class="ui-button ui-button--secondary ui-button--md"
                value="cancel"
              >
                Cancel
              </button>
              <button
                class="ui-button ui-button--danger ui-button--md"
                value="delete"
              >
                Delete
              </button>
            </form>
          </dialog>
        } @else {
          <button
            ui-button
            variant="danger"
            type="button"
            (click)="confirmDelete()"
          >
            Delete file
          </button>
        }
        @if (answer()) {
          <p class="doc-muted doc-flat" role="status">Answer: {{ answer() }}</p>
        }
      </app-example>

      <app-example
        title="More than two answers"
        description="Up to three actions, in reading order. Mark the one focus should start on."
        [code]="choices"
      >
        <button
          ui-button
          variant="secondary"
          type="button"
          (click)="unsavedChanges()"
        >
          Leave the page
        </button>
      </app-example>

      <app-example
        title="Tell, then move on"
        description="One action for news the reader should not miss. Keep these rare: most news belongs in the page, not in a dialog."
        [code]="single"
      >
        <button ui-button variant="secondary" type="button" (click)="paid()">
          Pay the order
        </button>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class AlertDialogPageComponent {
  private readonly settings = inject(DocsSettings);
  private readonly alerts = inject(UiAlertDialog);
  protected readonly answer = signal('');
  protected readonly html = () => this.settings.framework() === 'html';

  protected async confirmDelete(): Promise<void> {
    const confirmed = await this.alerts.confirm({
      title: 'Delete report.pdf?',
      message: 'It is removed for everyone. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    this.answer.set(confirmed ? 'delete' : 'cancel');
  }

  protected async unsavedChanges(): Promise<void> {
    const choice = await this.alerts.alert({
      title: 'Unsaved changes',
      message: 'You changed the delivery address. Save it before you leave?',
      tone: 'warning',
      actions: [
        { label: 'Discard', value: 'discard', variant: 'danger' },
        { label: 'Keep editing', value: 'stay' },
        {
          label: 'Save',
          value: 'save',
          variant: 'primary',
          initialFocus: true,
        },
      ],
    });
    this.answer.set(choice ?? 'no answer');
  }

  protected async paid(): Promise<void> {
    await this.alerts.alert({
      title: 'Order paid',
      message: 'Order #1042 is paid. The kitchen starts preparing it now.',
      tone: 'success',
      actions: [{ label: 'OK', value: true, variant: 'primary' }],
    });
  }

  protected readonly usage = {
    angular: `import { UiAlertDialog } from '@lamsa-ui/angular';

private readonly alerts = inject(UiAlertDialog);`,
    react: `import { useAlertDialog } from '@lamsa-ui/react';

const { alert, confirm, dialog } = useAlertDialog();
// render {dialog} once in the component, then await alert() or confirm()`,
    vue: `import { useAlertDialog } from '@lamsa-ui/vue';

const { alert, confirm, dialog } = useAlertDialog();
// render <component :is="dialog" /> once in the template, then await alert() or confirm()`,
    html: `<dialog class="ui-dialog ui-dialog--sm ui-dialog--alert" role="alertdialog"
  closedby="none" oncancel="event.preventDefault()"
  aria-labelledby="title" aria-describedby="message">...</dialog>`,
  };

  protected readonly confirm = {
    angular: `async remove() {
  const confirmed = await this.alerts.confirm({
    title: 'Delete report.pdf?',
    message: 'It is removed for everyone. This cannot be undone.',
    confirmLabel: 'Delete',
    danger: true,
  });
  if (confirmed) { /* delete */ }
}`,
    react: `const { confirm, dialog } = useAlertDialog();

async function remove() {
  const confirmed = await confirm({
    title: 'Delete report.pdf?',
    message: 'It is removed for everyone. This cannot be undone.',
    confirmLabel: 'Delete',
    danger: true,
  });
  if (confirmed) { /* delete */ }
}

return (
  <>
    {dialog}
    <Button variant="danger" onClick={remove}>Delete file</Button>
  </>
);`,
    vue: `<script setup lang="ts">
import { Button, useAlertDialog } from '@lamsa-ui/vue';

const { confirm, dialog } = useAlertDialog();

async function remove() {
  const confirmed = await confirm({
    title: 'Delete report.pdf?',
    message: 'It is removed for everyone. This cannot be undone.',
    confirmLabel: 'Delete',
    danger: true,
  });
  if (confirmed) { /* delete */ }
}
</script>

<template>
  <component :is="dialog" />
  <Button variant="danger" @click="remove">Delete file</Button>
</template>`,
    html: `<dialog class="ui-dialog ui-dialog--sm ui-dialog--alert" id="delete-file" role="alertdialog"
  closedby="none" oncancel="event.preventDefault()"
  aria-labelledby="delete-title" aria-describedby="delete-message">
  <header class="ui-dialog__header">
    <span class="ui-dialog__icon ui-dialog__icon--danger" aria-hidden="true"><i class="ui-icon ui-icon-circle-x"></i></span>
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="delete-title">Delete report.pdf?</h2>
      <p class="ui-dialog__description" id="delete-message">It is removed for everyone. This cannot be undone.</p>
    </div>
  </header>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--secondary ui-button--md" value="cancel" autofocus>Cancel</button>
    <button class="ui-button ui-button--danger ui-button--md" value="delete">Delete</button>
  </form>
</dialog>
<!-- returnValue is "delete" or "cancel". closedby="none" turns Escape off; oncancel covers browsers without closedby. -->`,
  };

  protected readonly choices = {
    angular: `const choice = await this.alerts.alert({
  title: 'Unsaved changes',
  message: 'You changed the delivery address. Save it before you leave?',
  tone: 'warning',
  actions: [
    { label: 'Discard', value: 'discard', variant: 'danger' },
    { label: 'Keep editing', value: 'stay' },
    { label: 'Save', value: 'save', variant: 'primary', initialFocus: true },
  ],
});
// 'discard' | 'stay' | 'save'`,
    react: `const choice = await alert({
  title: 'Unsaved changes',
  message: 'You changed the delivery address. Save it before you leave?',
  tone: 'warning',
  actions: [
    { label: 'Discard', value: 'discard', variant: 'danger' },
    { label: 'Keep editing', value: 'stay' },
    { label: 'Save', value: 'save', variant: 'primary', initialFocus: true },
  ],
});
// 'discard' | 'stay' | 'save'`,
    vue: `const choice = await alert({
  title: 'Unsaved changes',
  message: 'You changed the delivery address. Save it before you leave?',
  tone: 'warning',
  actions: [
    { label: 'Discard', value: 'discard', variant: 'danger' },
    { label: 'Keep editing', value: 'stay' },
    { label: 'Save', value: 'save', variant: 'primary', initialFocus: true },
  ],
});
// 'discard' | 'stay' | 'save'`,
    html: `<form method="dialog" class="ui-dialog__actions">
  <button class="ui-button ui-button--danger ui-button--md" value="discard">Discard</button>
  <button class="ui-button ui-button--secondary ui-button--md" value="stay">Keep editing</button>
  <button class="ui-button ui-button--primary ui-button--md" value="save" autofocus>Save</button>
</form>`,
  };

  protected readonly single = {
    angular: `await this.alerts.alert({
  title: 'Order paid',
  message: 'Order #1042 is paid. The kitchen starts preparing it now.',
  tone: 'success',
  actions: [{ label: 'OK', value: true, variant: 'primary' }],
});`,
    react: `await alert({
  title: 'Order paid',
  message: 'Order #1042 is paid. The kitchen starts preparing it now.',
  tone: 'success',
  actions: [{ label: 'OK', value: true, variant: 'primary' }],
});`,
    vue: `await alert({
  title: 'Order paid',
  message: 'Order #1042 is paid. The kitchen starts preparing it now.',
  tone: 'success',
  actions: [{ label: 'OK', value: true, variant: 'primary' }],
});`,
    html: `<span class="ui-dialog__icon ui-dialog__icon--success" aria-hidden="true"><i class="ui-icon ui-icon-circle-check"></i></span>
...
<form method="dialog" class="ui-dialog__actions">
  <button class="ui-button ui-button--primary ui-button--md">OK</button>
</form>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Ask for more than a yes or no, such as a form',
      use: 'Dialog',
      path: '/components/dialog',
    },
    {
      need: 'Confirm something that can be undone',
      use: 'Toast with an Undo action',
      path: '/components/toast',
    },
    {
      need: 'Warn about something on the page without stopping the reader',
      use: 'Alert',
      path: '/components/alert',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'alert(options)',
        type: 'Promise<R | undefined>',
        description: 'The value of the pressed action.',
      },
      {
        name: 'confirm(options)',
        type: 'Promise<boolean>',
        description: 'true only when the confirm button is pressed.',
      },
      {
        name: 'options.title / message',
        type: 'string',
        description:
          'Required. The question, and what happens. Plain text, never HTML.',
      },
      {
        name: 'options.tone',
        type: "'info' | 'success' | 'warning' | 'danger'",
        description: 'Shown as an icon; say it in the title too.',
      },
      {
        name: 'options.actions',
        type: '{ label, value, variant?, initialFocus? }[]',
        description:
          'One to three buttons. Focus starts on the marked one, else the first that is not danger.',
      },
      {
        name: 'confirm: confirmLabel / cancelLabel',
        type: 'string',
        default: "cancel: 'Cancel'",
        description: 'The translated button texts.',
      },
      {
        name: 'confirm: danger',
        type: 'boolean',
        default: 'false',
        description: 'Danger tone and button, and focus starts on Cancel.',
      },
    ],
    react: [
      {
        name: 'useAlertDialog()',
        type: '{ alert, confirm, dialog }',
        description:
          'Render dialog once; alert() and confirm() return promises.',
      },
      {
        name: 'alert(options)',
        type: 'Promise<R | undefined>',
        description: 'The value of the pressed action.',
      },
      {
        name: 'confirm(options)',
        type: 'Promise<boolean>',
        description: 'true only when the confirm button is pressed.',
      },
      {
        name: 'options',
        type: 'as in Angular',
        description:
          'title, message, tone and actions; confirmLabel, cancelLabel and danger for confirm.',
      },
      {
        name: '<AlertDialog>',
        type: 'component',
        description:
          'The same dialog, controlled: open, the options, and onAction(value).',
      },
    ],
    vue: [
      {
        name: 'useAlertDialog()',
        type: '{ alert, confirm, dialog }',
        description:
          'Render dialog once; alert() and confirm() return promises.',
      },
      {
        name: 'alert(options)',
        type: 'Promise<R | undefined>',
        description: 'The value of the pressed action.',
      },
      {
        name: 'confirm(options)',
        type: 'Promise<boolean>',
        description: 'true only when the confirm button is pressed.',
      },
      {
        name: 'options',
        type: 'as in Angular',
        description:
          'title, message, tone and actions; confirmLabel, cancelLabel and danger for confirm.',
      },
      {
        name: '<AlertDialog>',
        type: 'component',
        description:
          'The same dialog, controlled: open, the options, and onAction(value).',
      },
    ],
    html: [
      {
        name: 'role="alertdialog"',
        type: 'attribute',
        description:
          'On the dialog. Name and describe it with aria-labelledby and aria-describedby.',
      },
      {
        name: 'ui-dialog--alert',
        type: 'class',
        description: 'Centres the icon, heading and actions.',
      },
      {
        name: 'ui-dialog__icon--info | --success | --warning | --danger',
        type: 'class',
        description: 'The tone icon, with aria-hidden="true".',
      },
      {
        name: 'autofocus',
        type: 'attribute',
        description: 'On the safest button, so focus starts there.',
      },
    ],
  };
}
