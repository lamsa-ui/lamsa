import { Component, inject, signal, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonComponent,
  DialogCloseDirective,
  DialogComponent,
  TextFieldComponent,
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
  selector: 'app-drawer-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    DialogComponent,
    DialogCloseDirective,
    TextFieldComponent,
    RouterLink,
  ],
  template: `
    <app-page
      title="Drawer"
      lead="A side panel that slides in from the edge, for a form or the details of a row, while the list stays in sight. It is a dialog docked to the side: focus moves into it and stays there, the page behind stops scrolling, only the body scrolls, and Escape, the close button or a click outside closes it."
      [usage]="usage"
    >
      <p class="doc-note">
        A drawer is the <a routerLink="/components/dialog">dialog</a> with the
        drawer variant, so everything on that page applies here. It opens from
        the inline end: the right in English, the left in Arabic.
      </p>

      <app-example
        title="A form in a drawer"
        description="Header and actions stay at the top and bottom of the screen; the fields scroll between them."
        [code]="form"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--primary ui-button--md"
            type="button"
            (click)="nativeForm.showModal()"
          >
            Add building
          </button>
          <dialog
            #nativeForm
            class="ui-dialog ui-dialog--drawer"
            closedby="any"
            aria-labelledby="doc-building-title"
            aria-describedby="doc-building-description"
            (close)="answer.set(nativeForm.returnValue || 'cancel')"
          >
            <header class="ui-dialog__header">
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-building-title">
                  Add building
                </h2>
                <p class="ui-dialog__description" id="doc-building-description">
                  It shows in the list once saved.
                </p>
              </div>
            </header>
            <form method="dialog">
              <div class="ui-dialog__body">
                <div class="ui-field">
                  <label class="ui-field__label" for="doc-building-name">
                    Name
                  </label>
                  <input class="ui-input" id="doc-building-name" />
                </div>
                <div class="ui-field">
                  <label class="ui-field__label" for="doc-building-address">
                    Address
                  </label>
                  <input class="ui-input" id="doc-building-address" />
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
          <button ui-button type="button" (click)="open(buildingDrawer)">
            Add building
          </button>
        }
        @if (answer()) {
          <p class="doc-muted doc-flat" role="status">
            Closed with: {{ answer() }}
          </p>
        }
      </app-example>

      <app-example
        title="In Arabic"
        description='With dir="rtl" on the page (here on the drawer itself), it opens from the left and slides in from the left.'
        [code]="arabic"
      >
        @if (html()) {
          <button
            class="ui-button ui-button--secondary ui-button--md"
            type="button"
            (click)="nativeArabic.showModal()"
          >
            Add building in Arabic
          </button>
          <dialog
            #nativeArabic
            class="ui-dialog ui-dialog--drawer"
            closedby="any"
            dir="rtl"
            lang="ar"
            aria-labelledby="doc-building-ar-title"
          >
            <header class="ui-dialog__header">
              <div class="ui-dialog__heading">
                <h2 class="ui-dialog__title" id="doc-building-ar-title">
                  إضافة مبنى
                </h2>
              </div>
            </header>
            <form method="dialog">
              <div class="ui-dialog__body">
                <div class="ui-field">
                  <label class="ui-field__label" for="doc-building-ar-name">
                    اسم المبنى
                  </label>
                  <input class="ui-input" id="doc-building-ar-name" />
                </div>
              </div>
              <div class="ui-dialog__actions">
                <button class="ui-button ui-button--secondary ui-button--md">
                  إلغاء
                </button>
                <button class="ui-button ui-button--primary ui-button--md">
                  حفظ
                </button>
              </div>
            </form>
          </dialog>
        } @else {
          <button
            ui-button
            variant="secondary"
            type="button"
            (click)="open(arabicDrawer)"
          >
            Add building in Arabic
          </button>
        }
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>

    <ng-template #buildingDrawer>
      <ui-dialog
        title="Add building"
        description="It shows in the list once saved."
        variant="drawer"
      >
        <ui-text-field label="Name" />
        <ui-text-field label="Address" />
        <div ui-dialog-actions>
          <button ui-button variant="secondary" type="button" uiDialogClose>
            Cancel
          </button>
          <button ui-button type="button" [uiDialogClose]="'save'">Save</button>
        </div>
      </ui-dialog>
    </ng-template>

    <ng-template #arabicDrawer>
      <ui-dialog
        title="إضافة مبنى"
        variant="drawer"
        closeLabel="إغلاق"
        dir="rtl"
        lang="ar"
      >
        <ui-text-field label="اسم المبنى" />
        <div ui-dialog-actions>
          <button ui-button variant="secondary" type="button" uiDialogClose>
            إلغاء
          </button>
          <button ui-button type="button" uiDialogClose>حفظ</button>
        </div>
      </ui-dialog>
    </ng-template>
  `,
})
export class DrawerPageComponent {
  private readonly settings = inject(DocsSettings);
  private readonly dialog = inject(UiDialog);
  protected readonly answer = signal('');
  protected readonly html = () => this.settings.framework() === 'html';

  protected open(content: TemplateRef<unknown>): void {
    this.dialog
      .open<string>(content)
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
    html: `<dialog class="ui-dialog ui-dialog--drawer" closedby="any" aria-labelledby="title">...</dialog>
<!-- open it with dialog.showModal(), never show() -->`,
  };

  protected readonly form = {
    angular: `<ng-template #addBuilding>
  <ui-dialog title="Add building" description="It shows in the list once saved." variant="drawer">
    <ui-text-field label="Name" [formControl]="name" />
    <ui-text-field label="Address" [formControl]="address" />
    <div ui-dialog-actions>
      <button ui-button variant="secondary" uiDialogClose>Cancel</button>
      <button ui-button [uiDialogClose]="'save'">Save</button>
    </div>
  </ui-dialog>
</ng-template>

<button ui-button (click)="add(addBuilding)">Add building</button>

// In the class
private readonly dialog = inject(UiDialog);

add(content: TemplateRef<unknown>) {
  this.dialog.open<string>(content).closed.subscribe((result) => {
    if (result === 'save') { /* ... */ }
  });
}`,
    react: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Add building</Button>
<Dialog
  variant="drawer"
  title="Add building"
  description="It shows in the list once saved."
  open={open}
  onOpenChange={setOpen}
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <TextField label="Name" name="name" />
  <TextField label="Address" name="address" />
</Dialog>`,
    vue: `<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">Add building</Button>
  <Dialog v-model:open="open"
    variant="drawer"
    title="Add building"
    description="It shows in the list once saved."
  >
    <TextField label="Name" name="name" />
    <TextField label="Address" name="address" />
    <template #actions>
      <Button variant="secondary" @click="open = false">Cancel</Button>
      <Button @click="save">Save</Button>
    </template>
  </Dialog>
</template>`,
    html: `<dialog class="ui-dialog ui-dialog--drawer" closedby="any" id="add-building"
  aria-labelledby="building-title" aria-describedby="building-description">
  <header class="ui-dialog__header">
    <div class="ui-dialog__heading">
      <h2 class="ui-dialog__title" id="building-title">Add building</h2>
      <p class="ui-dialog__description" id="building-description">It shows in the list once saved.</p>
    </div>
  </header>
  <form method="dialog">
    <div class="ui-dialog__body">
      <div class="ui-field">
        <label class="ui-field__label" for="name">Name</label>
        <input class="ui-input" id="name" name="name" />
      </div>
    </div>
    <div class="ui-dialog__actions">
      <button class="ui-button ui-button--secondary ui-button--md" value="cancel">Cancel</button>
      <button class="ui-button ui-button--primary ui-button--md" value="save">Save</button>
    </div>
  </form>
</dialog>`,
  };

  protected readonly arabic = {
    angular: `<!-- <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer -->
<ui-dialog title="إضافة مبنى" variant="drawer" closeLabel="إغلاق">
  <ui-text-field label="اسم المبنى" />
  ...
</ui-dialog>`,
    react: `{/* <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer */}
<Dialog variant="drawer" title="إضافة مبنى" closeLabel="إغلاق" open={open} onOpenChange={setOpen}>
  <TextField label="اسم المبنى" />
</Dialog>`,
    vue: `<!-- <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer -->
<Dialog v-model:open="open" variant="drawer" title="إضافة مبنى" closeLabel="إغلاق">
  <TextField label="اسم المبنى" />
</Dialog>`,
    html: `<!-- <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer -->
<dialog class="ui-dialog ui-dialog--drawer" closedby="any" aria-labelledby="building-title">...</dialog>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A focused task in the middle of the screen',
      use: 'Dialog',
      path: '/components/dialog',
    },
    {
      need: 'A panel on a phone',
      use: 'Bottom sheet',
      path: '/components/bottom-sheet',
    },
    {
      need: 'The main links of the app on a phone',
      use: 'App shell',
      path: '/components/app-shell',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'variant',
        type: "'default' | 'alert' | 'drawer'",
        default: "'default'",
        description:
          "'drawer': full height on the inline end. Open it with UiDialog.open() as any dialog.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 48rem wide; the full width on a phone.',
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
        type: "'default' | 'alert' | 'drawer'",
        default: "'default'",
        description: "'drawer': full height on the inline end.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 48rem wide; the full width on a phone.',
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
        type: "'default' | 'alert' | 'drawer'",
        default: "'default'",
        description: "'drawer': full height on the inline end.",
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: '24, 32 or 48rem wide; the full width on a phone.',
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
        name: 'dialog.ui-dialog.ui-dialog--drawer',
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
        name: 'everything else',
        type: '',
        description: 'The same markup and classes as the dialog.',
      },
    ],
  };
}
