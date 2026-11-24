import { Component } from '@angular/core';
import { FileFieldComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-file-field-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    FileFieldComponent,
  ],
  template: `
    <app-page
      title="File field"
      lead="The browser's own file input, with a label, hint and error, in a zone that also takes files dropped on it. The native button and file names stay, so it works with the keyboard, screen readers and phone cameras as usual."
      [usage]="usage"
    >
      <app-example
        title="One file"
        description="accept limits what the picker offers. It cannot stop a drop, so check the type and size again on the server."
        [code]="basic"
      >
        <ui-file-field
          label="Invoice"
          accept=".pdf"
          hint="PDF, up to 5 MB."
          class="doc-field"
        />
      </app-example>

      <app-example title="Several files, with an error" [code]="error">
        <ui-file-field
          label="Photos of the damage"
          accept="image/*"
          [multiple]="true"
          dropText="Or drop photos here"
          error="Add at least one photo"
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-file-field
          label="الفاتورة"
          dropText="أو اسحب الملف هنا"
          class="doc-field"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class FileFieldPageComponent {
  protected readonly usage = {
    angular: `import { FileFieldComponent } from '@lamsa-ui/angular';
// The value is a File[]. Writing null or [] to the control clears the input.`,
    react: `import { FileField } from '@lamsa-ui/react';
// onFiles gets a File[] for a pick or a drop. Every other prop goes to the input.`,
    vue: `import { FileField } from '@lamsa-ui/vue';
// onFiles gets a File[] for a pick or a drop. Every other prop goes to the input.`,
    html: `<input class="ui-file" type="file" id="invoice" accept=".pdf" />`,
  };

  protected readonly basic = {
    angular: `<ui-file-field label="Invoice" accept=".pdf" hint="PDF, up to 5 MB." formControlName="invoice" />`,
    react: `<FileField label="Invoice" accept=".pdf" hint="PDF, up to 5 MB." onFiles={setFiles} />`,
    vue: `<FileField label="Invoice" accept=".pdf" hint="PDF, up to 5 MB." @files="files = $event" />`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="invoice">Invoice</label>
  <div class="ui-dropzone">
    <input class="ui-file" type="file" id="invoice" accept=".pdf" aria-describedby="invoice-hint" />
  </div>
  <p class="ui-field__hint" id="invoice-hint">PDF, up to 5 MB.</p>
</div>
<!-- Taking drops needs script: on drop, set input.files = event.dataTransfer.files -->`,
  };

  protected readonly error = {
    angular: `<ui-file-field
  label="Photos of the damage"
  accept="image/*"
  multiple
  dropText="Or drop photos here"
  formControlName="photos"
  [error]="form.controls.photos.invalid ? 'Add at least one photo' : undefined"
/>`,
    react: `<FileField
  label="Photos of the damage"
  accept="image/*"
  multiple
  dropText="Or drop photos here"
  onFiles={setPhotos}
  error={photos.length ? undefined : 'Add at least one photo'}
/>`,
    vue: `<FileField
  label="Photos of the damage"
  accept="image/*"
  multiple
  dropText="Or drop photos here"
  :error="photos.length ? undefined : 'Add at least one photo'"
  @files="photos = $event"
/>`,
    html: `<div class="ui-field ui-field--invalid">
  <label class="ui-field__label" for="photos">Photos of the damage</label>
  <div class="ui-dropzone">
    <input class="ui-file" type="file" id="photos" accept="image/*" multiple
           aria-invalid="true" aria-describedby="photos-error" />
    <p class="ui-dropzone__text">Or drop photos here</p>
  </div>
  <p class="ui-field__error" id="photos-error" role="alert">Add at least one photo</p>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-file-field label="الفاتورة" dropText="أو اسحب الملف هنا" formControlName="invoice" />`,
    react: `<FileField label="الفاتورة" dropText="أو اسحب الملف هنا" onFiles={setFiles} />`,
    vue: `<FileField label="الفاتورة" dropText="أو اسحب الملف هنا" @files="files = $event" />`,
    html: `<!-- dir="rtl" on the page; the browser writes its own button in the reader's language -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Typed text or a link to a file',
      use: 'Text field',
      path: '/components/text-field',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label, tied to the input.',
      },
      {
        name: 'accept',
        type: 'string',
        description: "File types the picker offers: '.pdf', 'image/*'.",
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: 'Allows more than one file.',
      },
      {
        name: 'hint, error',
        type: 'string',
        description: 'As for the text field.',
      },
      {
        name: 'dropText',
        type: 'string',
        default: "'Or drop a file here' from labels",
        description: 'The line under the button; pass the translated text.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input, for tests.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label.',
      },
      {
        name: 'onFiles',
        type: '(files: File[]) => void',
        description: 'Called after a pick or a drop.',
      },
      {
        name: 'hint, error, dropText',
        type: 'string',
        description: 'As in Angular.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input.',
      },
      {
        name: '...props',
        type: 'input props',
        description:
          'Every native input prop: accept, multiple, name, onChange, ref.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. The visible label.',
      },
      {
        name: '@files',
        type: 'event',
        description: 'Called after a pick or a drop.',
      },
      {
        name: 'hint, error, dropText',
        type: 'string',
        description: 'As in Angular.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input.',
      },
    ],
    html: [
      {
        name: 'ui-file',
        type: 'class',
        description: 'On the input type="file".',
      },
      {
        name: 'ui-dropzone',
        type: 'class',
        description: 'The dashed zone around it.',
      },
      {
        name: 'ui-dropzone--over',
        type: 'class',
        description: 'While a file is dragged over the zone.',
      },
      {
        name: 'ui-dropzone__text',
        type: 'class',
        description: 'The line under the button.',
      },
    ],
  };
}
