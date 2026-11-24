import { Component, inject, signal, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonComponent,
  DialogCloseDirective,
  DialogComponent,
  TextareaComponent,
  TextFieldComponent,
  UiDialog,
  type UiDialogConfig,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { DocsSettings } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

const terms = [
  'Orders placed before 2 pm are prepared the same day. Orders placed later are prepared the next working day.',
  'You can change or cancel an order until the kitchen starts preparing it. After that, the order stands.',
  'Delivery fees depend on the distance and are shown before you pay. They are never added after the order is placed.',
  'If an item is missing or wrong, tell us within 24 hours and we refund it or send it again, as you prefer.',
  'Payment is taken when the order is confirmed. Refunds go back to the same card within 14 days.',
  'We keep your address and phone number only to deliver your orders, and never share them for marketing.',
  'These terms may change. We show the new terms before your next order, and you accept them by ordering.',
];

@Component({
  selector: 'app-dialog-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    DialogComponent,
    DialogCloseDirective,
    TextareaComponent,
    TextFieldComponent,
    RouterLink,
  ],
  template: `
    <app-page
      title="Dialog"
      lead="A modal window for a task that needs the reader's full attention: a short form, details, terms. Focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click outside closes it."
      [usage]="usage"
    >
      <p class="doc-note">
        For a yes-or-no question, such as confirming a delete, use the
        <a routerLink="/components/alert-dialog">alert dialog</a>: it is built
        for answers.
      </p>

      <app-example
        title="A form in a dialog"
        description="The title names the dialog and the description is read with it. The actions stay at the bottom."
        [code]="form"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--primary ui-button--md"
            type="button"
            (click)="nativeForm.showModal()"
          >
            Edit address
          </button>
          <dialog
            #nativeForm
            class="ui-dialog"
            closedby="any"
            aria-labelledby="doc-address-title"
            aria-describedby="doc-address-description"
            (close)="answer.set(nativeForm.returnValue || 'cancel')"
          >
            <header class="ui-dialog__header">
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-address-title">
                  Edit address
                </h2>
                <p class="ui-dialog__description" id="doc-address-description">
                  We deliver your next orders here.
                </p>
              </div>
            </header>
            <form method="dialog">
              <div class="ui-dialog__body">
                <div class="ui-field">
                  <label class="ui-field__label" for="doc-street">Street</label>
                  <input class="ui-input" id="doc-street" />
                </div>
                <div class="ui-field">
                  <label class="ui-field__label" for="doc-building">
                    Building
                  </label>
                  <input class="ui-input" id="doc-building" />
                </div>
              </div>
              <div class="ui-dialog__actions">
                <button
                  class="ui-button ui-button--secondary ui-button--md"
                  value="cancel"
                >
                  Cancel
                </button>
                <button
                  class="ui-button ui-button--primary ui-button--md"
                  value="save"
                >
                  Save
                </button>
              </div>
            </form>
          </dialog>
        } @else {
          <button ui-button type="button" (click)="open(addressDialog)">
            Edit address
          </button>
        }
        @if (answer()) {
          <p class="doc-muted doc-flat" role="status">
            Closed with: {{ answer() }}
          </p>
        }
      </app-example>

      <app-example
        title="Long content"
        description="When the content is longer than the screen, only the body scrolls: the title and the buttons stay in view. The large size suits reading."
        [code]="long"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--secondary ui-button--md"
            type="button"
            (click)="nativeTerms.showModal()"
          >
            Read the terms
          </button>
          <dialog
            #nativeTerms
            class="ui-dialog ui-dialog--lg"
            closedby="any"
            aria-labelledby="doc-terms-title"
          >
            <header class="ui-dialog__header">
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-terms-title">
                  Terms of ordering
                </h2>
              </div>
            </header>
            <div class="ui-dialog__body" tabindex="0">
              @for (paragraph of terms; track $index) {
                <p>{{ paragraph }}</p>
                <p>{{ paragraph }}</p>
              }
            </div>
            <form method="dialog" class="ui-dialog__actions">
              <button class="ui-button ui-button--primary ui-button--md">
                Close
              </button>
            </form>
          </dialog>
        } @else {
          <button
            ui-button
            variant="secondary"
            type="button"
            (click)="open(termsDialog)"
          >
            Read the terms
          </button>
        }
      </app-example>

      <app-example
        title="Only its buttons close it"
        description="For a form that a stray click or key must not throw away: a click outside and Escape do nothing, and the close button is hidden, so Cancel and Save are the way out. Works the same on a drawer and a bottom sheet."
        [code]="backdrop"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--secondary ui-button--md"
            type="button"
            (click)="nativeLocked.showModal()"
          >
            Write a note
          </button>
          <dialog
            #nativeLocked
            class="ui-dialog"
            closedby="none"
            (cancel)="$event.preventDefault()"
            aria-labelledby="doc-note-title"
          >
            <header class="ui-dialog__header">
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-note-title">
                  Note for the driver
                </h2>
              </div>
            </header>
            <form method="dialog">
              <div class="ui-dialog__body">
                <div class="ui-field">
                  <label class="ui-field__label" for="doc-note">Note</label>
                  <textarea class="ui-input" id="doc-note" rows="3"></textarea>
                </div>
              </div>
              <div class="ui-dialog__actions">
                <button
                  class="ui-button ui-button--secondary ui-button--md"
                  value="cancel"
                >
                  Cancel
                </button>
                <button
                  class="ui-button ui-button--primary ui-button--md"
                  value="save"
                >
                  Save
                </button>
              </div>
            </form>
          </dialog>
        } @else {
          <button
            ui-button
            variant="secondary"
            type="button"
            (click)="open(noteDialog, { dismissable: false })"
          >
            Write a note
          </button>
        }
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>

    <ng-template #addressDialog>
      <ui-dialog
        title="Edit address"
        description="We deliver your next orders here."
      >
        <ui-text-field label="Street" />
        <ui-text-field label="Building" />
        <div ui-dialog-actions>
          <button ui-button variant="secondary" type="button" uiDialogClose>
            Cancel
          </button>
          <button ui-button type="button" [uiDialogClose]="'save'">Save</button>
        </div>
      </ui-dialog>
    </ng-template>

    <ng-template #noteDialog>
      <ui-dialog title="Note for the driver">
        <ui-textarea label="Note" />
        <div ui-dialog-actions>
          <button ui-button variant="secondary" type="button" uiDialogClose>
            Cancel
          </button>
          <button ui-button type="button" [uiDialogClose]="'save'">Save</button>
        </div>
      </ui-dialog>
    </ng-template>

    <ng-template #termsDialog>
      <ui-dialog title="Terms of ordering" size="lg">
        @for (paragraph of terms; track $index) {
          <p>{{ paragraph }}</p>
          <p>{{ paragraph }}</p>
        }
        <div ui-dialog-actions>
          <button ui-button type="button" uiDialogClose>Close</button>
        </div>
      </ui-dialog>
    </ng-template>
  `,
})
export class DialogPageComponent {
  private readonly settings = inject(DocsSettings);
  private readonly dialog = inject(UiDialog);
  protected readonly terms = terms;
  protected readonly answer = signal('');
  protected readonly html = () => this.settings.framework() === 'html';

  protected open(
    content: TemplateRef<unknown>,
    config: UiDialogConfig = {},
  ): void {
    this.dialog
      .open<string>(content, config)
      .closed.subscribe((result) => this.answer.set(result ?? 'cancel'));
  }

  protected readonly usage = {
    angular: `import {
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
} from '@lamsa-ui/angular';`,
    react: `import { Dialog } from '@lamsa-ui/react';`,
    vue: `import { Dialog } from '@lamsa-ui/vue';`,
    html: `<dialog class="ui-dialog" closedby="any" aria-labelledby="title">...</dialog>
<!-- open it with dialog.showModal(), never show() -->`,
  };

  protected readonly form = {
    angular: `<!-- A template (or a component) holds the content -->
<ng-template #editAddress>
  <ui-dialog title="Edit address" description="We deliver your next orders here.">
    <ui-text-field label="Street" [formControl]="street" />
    <ui-text-field label="Building" [formControl]="building" />
    <div ui-dialog-actions>
      <button ui-button variant="secondary" uiDialogClose>Cancel</button>
      <button ui-button [uiDialogClose]="'save'">Save</button>
    </div>
  </ui-dialog>
</ng-template>

<button ui-button (click)="edit(editAddress)">Edit address</button>

// In the class
private readonly dialog = inject(UiDialog);

edit(content: TemplateRef<unknown>) {
  this.dialog.open<string>(content).closed.subscribe((result) => {
    if (result === 'save') { /* ... */ }
  });
}`,
    react: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Edit address</Button>
<Dialog
  title="Edit address"
  description="We deliver your next orders here."
  open={open}
  onOpenChange={setOpen}
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <TextField label="Street" name="street" />
  <TextField label="Building" name="building" />
</Dialog>`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">Edit address</Button>
  <Dialog v-model:open="open"
    title="Edit address"
    description="We deliver your next orders here."
  >
    <TextField label="Street" name="street" />
    <TextField label="Building" name="building" />
    <template #actions>
      <Button variant="secondary" @click="open = false">Cancel</Button>
      <Button @click="save">Save</Button>
    </template>
  </Dialog>
</template>`,
    html: `<button class="ui-button ui-button--primary ui-button--md" type="button"
  onclick="document.getElementById('edit-address').showModal()">Edit address</button>

<dialog class="ui-dialog" closedby="any" id="edit-address"
  aria-labelledby="address-title" aria-describedby="address-description">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="address-title">Edit address</h2>
      <p class="ui-dialog__description" id="address-description">We deliver your next orders here.</p>
    </div>
  </header>
  <form method="dialog">
    <div class="ui-dialog__body">
      <div class="ui-field">
        <label class="ui-field__label" for="street">Street</label>
        <input class="ui-input" id="street" name="street" />
      </div>
    </div>
    <div class="ui-dialog__actions">
      <button class="ui-button ui-button--secondary ui-button--md" value="cancel">Cancel</button>
      <button class="ui-button ui-button--primary ui-button--md" value="save">Save</button>
    </div>
  </form>
</dialog>
<!-- after it closes, dialog.returnValue is "save", "cancel", or "" (Escape) -->`,
  };

  protected readonly backdrop = {
    angular: `this.dialog.open(content, { dismissable: false });
// a drawer or sheet too: the variant lives on <ui-dialog>, the option on open()`,
    react: `<Dialog dismissable={false} title="Note for the driver" open={open} onOpenChange={setOpen}>
  ...
</Dialog>`,
    vue: `<Dialog v-model:open="open" :dismissable="false" title="Note for the driver">
  ...
</Dialog>`,
    html: `<!-- closedby="none" turns Escape off; the cancel handler covers browsers without closedby -->
<dialog class="ui-dialog" closedby="none" oncancel="event.preventDefault()" aria-labelledby="note-title">...</dialog>`,
  };

  protected readonly long = {
    angular: `<ui-dialog title="Terms of ordering" size="lg">
  <p>...</p>
  <div ui-dialog-actions>
    <button ui-button uiDialogClose>Close</button>
  </div>
</ui-dialog>`,
    react: `<Dialog
  title="Terms of ordering"
  size="lg"
  open={open}
  onOpenChange={setOpen}
  actions={<Button onClick={() => setOpen(false)}>Close</Button>}
>
  <p>...</p>
</Dialog>`,
    vue: `<Dialog v-model:open="open" title="Terms of ordering" size="lg">
  <p>...</p>
  <template #actions>
    <Button @click="open = false">Close</Button>
  </template>
</Dialog>`,
    html: `<dialog class="ui-dialog ui-dialog--lg" closedby="any" aria-labelledby="terms-title">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="terms-title">Terms of ordering</h2>
    </div>
  </header>
  <!-- tabindex="0": text-only content that scrolls must take focus, so the keyboard can scroll it -->
  <div class="ui-dialog__body" tabindex="0">
    <p>...</p>
  </div>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--primary ui-button--md">Close</button>
  </form>
</dialog>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A yes or no question that must be answered',
      use: 'Alert dialog',
      path: '/components/alert-dialog',
    },
    {
      need: 'Content beside the page, such as filters',
      use: 'Drawer',
      path: '/components/drawer',
    },
    {
      need: 'A short note next to the button',
      use: 'Popover',
      path: '/components/popover',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'UiDialog.open(content, config?)',
        type: 'DialogRef<R>',
        description:
          'Opens a component or a template. closed emits the result once.',
      },
      {
        name: 'config.data',
        type: 'D',
        description:
          'Read it with inject(DIALOG_DATA) in a component, or let-data in a template.',
      },
      {
        name: 'config.dismissable',
        type: 'boolean',
        default: 'true',
        description:
          'false: only your own buttons close it. Escape and a click outside do nothing, and the close button is hidden.',
      },
      {
        name: 'config.initialFocus',
        type: 'CSS selector',
        default: 'the heading',
        description: 'The element to focus first.',
      },
      {
        name: '<ui-dialog> title',
        type: 'string',
        description: 'Required. The heading; it names the dialog.',
      },
      {
        name: '<ui-dialog> description',
        type: 'string',
        description: 'A sentence under the title, read with it.',
      },
      {
        name: '<ui-dialog> size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 48rem wide, never wider than the screen.',
      },
      {
        name: '<ui-dialog> closeLabel',
        type: 'string',
        default: "'Close' from labels",
        description:
          'Accessible name of the close button; pass the translated text.',
      },
      {
        name: '[ui-dialog-actions]',
        type: 'content slot',
        description: 'The buttons; they line up at the end and stay in view.',
      },
      {
        name: 'uiDialogClose',
        type: 'directive',
        description:
          'On a button: closes the dialog with its value, or none when bare.',
      },
    ],
    react: [
      {
        name: 'title',
        type: 'string',
        description: 'Required. The heading; it names the dialog.',
      },
      {
        name: 'open / onOpenChange',
        type: 'boolean / (open) => void',
        description:
          'Required. onOpenChange(false) comes from Escape, the backdrop or the close button.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'A sentence under the title, read with it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 48rem wide, never wider than the screen.',
      },
      {
        name: 'actions',
        type: 'ReactNode',
        description: 'The buttons; they line up at the end and stay in view.',
      },
      {
        name: 'dismissable',
        type: 'boolean',
        default: 'true',
        description:
          'false: only your own buttons close it. Escape and a click outside do nothing, and the close button is hidden.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Close' from labels",
        description:
          'Accessible name of the close button; pass the translated text.',
      },
    ],
    vue: [
      {
        name: 'title',
        type: 'string',
        description: 'Required. The heading; it names the dialog.',
      },
      {
        name: 'v-model:open',
        type: 'boolean',
        description:
          'Required. Set to false by Escape, the backdrop or the close button.',
      },
      {
        name: 'description',
        type: 'string',
        description: 'A sentence under the title, read with it.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 48rem wide, never wider than the screen.',
      },
      {
        name: '#actions',
        type: 'slot',
        description: 'The buttons; they line up at the end and stay in view.',
      },
      {
        name: 'dismissable',
        type: 'boolean',
        default: 'true',
        description:
          'false: only your own buttons close it. Escape and a click outside do nothing, and the close button is hidden.',
      },
      {
        name: 'closeLabel',
        type: 'string',
        default: "'Close' from labels",
        description:
          'Accessible name of the close button; pass the translated text.',
      },
    ],
    html: [
      {
        name: 'dialog.ui-dialog',
        type: 'element + class',
        description:
          'Open it with showModal(), never show(), so focus is trapped and the page is inert.',
      },
      {
        name: 'ui-dialog--sm | --lg',
        type: 'class',
        description: '24 or 48rem wide; 32rem without it.',
      },
      {
        name: 'closedby="any"',
        type: 'attribute',
        description:
          'A click outside closes it too, in browsers that support it; Escape always does. closedby="none" plus oncancel="event.preventDefault()": only your buttons close it.',
      },
      {
        name: 'aria-labelledby / aria-describedby',
        type: 'attribute',
        description: 'Point at the title and the description ids.',
      },
      {
        name: 'ui-dialog__header, __heading, __title, __description',
        type: 'class',
        description: 'The heading area.',
      },
      {
        name: 'ui-dialog__body',
        type: 'class',
        description: 'The content; it scrolls when it is long.',
      },
      {
        name: 'form[method="dialog"] + ui-dialog__actions',
        type: 'element + class',
        description:
          'Buttons inside close the dialog and set returnValue to their value.',
      },
    ],
  };
}
