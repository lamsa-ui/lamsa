import { Component, inject, signal, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonComponent,
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
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
  selector: 'app-bottom-sheet-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    DialogComponent,
    DialogCloseDirective,
    RouterLink,
  ],
  template: `
    <app-page
      title="Bottom sheet"
      lead="A panel that slides up from the bottom of the screen, for a short choice or the details of an item, mostly on phones. It is a dialog docked to the bottom: focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click above it closes it."
      [usage]="usage"
    >
      <p class="doc-note">
        A bottom sheet is the
        <a routerLink="/components/dialog">dialog</a> with the sheet variant, so
        everything on that page applies here. It is as tall as its content, up
        to 85% of the screen; past that the body scrolls. On a wide screen it
        stays at the dialog size, centred. For a long form, use the
        <a routerLink="/components/drawer">drawer</a>.
      </p>

      <app-example
        title="Order details"
        description="The title and the actions stay in view; the details sit between them."
        [code]="order"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--primary ui-button--md"
            type="button"
            (click)="nativeSheet.showModal()"
          >
            Order 1042
          </button>
          <dialog
            #nativeSheet
            class="ui-dialog ui-dialog--sheet"
            closedby="any"
            aria-labelledby="doc-order-title"
            aria-describedby="doc-order-description"
            (close)="answer.set(nativeSheet.returnValue || 'close')"
          >
            <header class="ui-dialog__header">
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-order-title">
                  Order 1042
                </h2>
                <p class="ui-dialog__description" id="doc-order-description">
                  Delivered today at 2:40 pm.
                </p>
              </div>
            </header>
            <div class="ui-dialog__body">
              <p>2 × Chicken shawarma, 1 × Lentil soup</p>
              <p>Paid by card: 310 EGP</p>
            </div>
            <form method="dialog" class="ui-dialog__actions">
              <button
                class="ui-button ui-button--secondary ui-button--md"
                value="close"
              >
                Close
              </button>
              <button
                class="ui-button ui-button--primary ui-button--md"
                value="reorder"
              >
                Order again
              </button>
            </form>
          </dialog>
        } @else {
          <button ui-button type="button" (click)="open(orderSheet)">
            Order 1042
          </button>
        }
        @if (answer()) {
          <p class="doc-muted doc-flat" role="status">
            Closed with: {{ answer() }}
          </p>
        }
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>

    <ng-template #orderSheet>
      <ui-dialog
        title="Order 1042"
        description="Delivered today at 2:40 pm."
        variant="sheet"
      >
        <p>2 × Chicken shawarma, 1 × Lentil soup</p>
        <p>Paid by card: 310 EGP</p>
        <div ui-dialog-actions>
          <button ui-button variant="secondary" type="button" uiDialogClose>
            Close
          </button>
          <button ui-button type="button" [uiDialogClose]="'reorder'">
            Order again
          </button>
        </div>
      </ui-dialog>
    </ng-template>
  `,
})
export class BottomSheetPageComponent {
  private readonly settings = inject(DocsSettings);
  private readonly dialog = inject(UiDialog);
  protected readonly answer = signal('');
  protected readonly html = () => this.settings.framework() === 'html';

  protected open(content: TemplateRef<unknown>): void {
    this.dialog
      .open<string>(content)
      .closed.subscribe((result) => this.answer.set(result ?? 'close'));
  }

  protected readonly usage = {
    angular: `import {
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
} from '@lamsa-ui/angular';`,
    react: `import { Dialog } from '@lamsa-ui/react';`,
    vue: `import { Dialog } from '@lamsa-ui/vue';`,
    html: `<dialog class="ui-dialog ui-dialog--sheet" closedby="any" aria-labelledby="title">...</dialog>
<!-- open it with dialog.showModal(), never show() -->`,
  };

  protected readonly order = {
    angular: `<ng-template #order>
  <ui-dialog title="Order 1042" description="Delivered today at 2:40 pm." variant="sheet">
    <p>2 × Chicken shawarma, 1 × Lentil soup</p>
    <div ui-dialog-actions>
      <button ui-button variant="secondary" uiDialogClose>Close</button>
      <button ui-button [uiDialogClose]="'reorder'">Order again</button>
    </div>
  </ui-dialog>
</ng-template>

<button ui-button (click)="show(order)">Order 1042</button>

// In the class
private readonly dialog = inject(UiDialog);

show(content: TemplateRef<unknown>) {
  this.dialog.open<string>(content).closed.subscribe((result) => {
    if (result === 'reorder') { /* ... */ }
  });
}`,
    react: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Order 1042</Button>
<Dialog
  variant="sheet"
  title="Order 1042"
  description="Delivered today at 2:40 pm."
  open={open}
  onOpenChange={setOpen}
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      <Button onClick={reorder}>Order again</Button>
    </>
  }
>
  <p>2 × Chicken shawarma, 1 × Lentil soup</p>
</Dialog>`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">Order 1042</Button>
  <Dialog v-model:open="open"
    variant="sheet"
    title="Order 1042"
    description="Delivered today at 2:40 pm."
  >
    <p>2 × Chicken shawarma, 1 × Lentil soup</p>
    <template #actions>
      <Button variant="secondary" @click="open = false">Close</Button>
      <Button @click="reorder">Order again</Button>
    </template>
  </Dialog>
</template>`,
    html: `<dialog class="ui-dialog ui-dialog--sheet" closedby="any" id="order"
  aria-labelledby="order-title" aria-describedby="order-description">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="order-title">Order 1042</h2>
      <p class="ui-dialog__description" id="order-description">Delivered today at 2:40 pm.</p>
    </div>
  </header>
  <div class="ui-dialog__body">
    <p>2 × Chicken shawarma, 1 × Lentil soup</p>
  </div>
  <form method="dialog" class="ui-dialog__actions">
    <button class="ui-button ui-button--secondary ui-button--md" value="close">Close</button>
    <button class="ui-button ui-button--primary ui-button--md" value="reorder">Order again</button>
  </form>
</dialog>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A task on a wide screen',
      use: 'Dialog',
      path: '/components/dialog',
    },
    {
      need: 'Navigation or filters that slide in from the side',
      use: 'Drawer',
      path: '/components/drawer',
    },
    { need: 'A short list of actions', use: 'Menu', path: '/components/menu' },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'variant',
        type: "'default' | 'alert' | 'drawer' | 'sheet'",
        default: "'default'",
        description:
          "'sheet': docked to the bottom. Open it with UiDialog.open() as any dialog.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Its width on a wide screen: 24, 32 or 48rem. The full width on a phone.',
      },
      {
        name: 'everything else',
        type: 'Dialog API',
        description:
          'title, description, closeLabel, [ui-dialog-actions], uiDialogClose and the open() config work as in the dialog.',
      },
    ],
    react: [
      {
        name: 'variant',
        type: "'default' | 'alert' | 'drawer' | 'sheet'",
        default: "'default'",
        description: "'sheet': docked to the bottom.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Its width on a wide screen: 24, 32 or 48rem. The full width on a phone.',
      },
      {
        name: 'everything else',
        type: 'Dialog API',
        description:
          'title, description, open, onOpenChange, actions, dismissable and closeLabel work as in the dialog.',
      },
    ],
    vue: [
      {
        name: 'variant',
        type: "'default' | 'alert' | 'drawer' | 'sheet'",
        default: "'default'",
        description: "'sheet': docked to the bottom.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Its width on a wide screen: 24, 32 or 48rem. The full width on a phone.',
      },
      {
        name: 'everything else',
        type: 'Dialog API',
        description:
          'title, description, open, onOpenChange, actions, dismissable and closeLabel work as in the dialog.',
      },
    ],
    html: [
      {
        name: 'dialog.ui-dialog.ui-dialog--sheet',
        type: 'element + class',
        description:
          'Open it with showModal(), never show(), so focus is trapped and the page is inert.',
      },
      {
        name: 'ui-dialog--sm | --lg',
        type: 'class',
        description:
          'Its width on a wide screen: 24 or 48rem; 32rem without it.',
      },
      {
        name: 'everything else',
        type: '',
        description: 'The same markup and classes as the dialog.',
      },
    ],
  };
}
