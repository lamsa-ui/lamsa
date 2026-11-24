import { Component } from '@angular/core';
import { ProgressComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-progress-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ProgressComponent,
  ],
  template: `
    <app-page
      title="Progress"
      lead="How far a long task has got, such as an upload. The native progress bar, named by its label, with the amount in words beside it. Without a value it shows a moving band: work is going on but its length is not known."
      [usage]="usage"
    >
      <app-example title="Known amount" [code]="known">
        <div class="doc-stack doc-field">
          <ui-progress label="Uploading invoice.pdf" [value]="64" />
          <ui-progress
            label="Importing contacts"
            [value]="3"
            [max]="5"
            valueText="3 of 5 files"
          />
        </div>
      </app-example>

      <app-example title="Unknown amount" [code]="unknown">
        <ui-progress label="Preparing the report" class="doc-field" />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-progress label="بنرفع الفاتورة" [value]="64" class="doc-field" />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ProgressPageComponent {
  protected readonly usage = {
    angular: `import { ProgressComponent } from '@lamsa-ui/angular';`,
    react: `import { Progress } from '@lamsa-ui/react';`,
    vue: `import { Progress } from '@lamsa-ui/vue';`,
    html: `<div class="ui-progress">
  <div class="ui-progress__head">
    <span class="ui-progress__label" id="upload">Uploading invoice.pdf</span>
    <span class="ui-progress__value" aria-hidden="true">64%</span>
  </div>
  <progress class="ui-progress__bar" aria-labelledby="upload" value="64" max="100"></progress>
</div>`,
  };

  protected readonly known = {
    angular: `<ui-progress label="Uploading invoice.pdf" [value]="sent()" />
<ui-progress label="Importing contacts" [value]="3" [max]="5" valueText="3 of 5 files" />`,
    react: `<Progress label="Uploading invoice.pdf" value={sent} />
<Progress label="Importing contacts" value={3} max={5} valueText="3 of 5 files" />`,
    vue: `<Progress label="Uploading invoice.pdf" :value="sent" />
<Progress label="Importing contacts" :value="3" :max="5" valueText="3 of 5 files" />`,
    html: `<progress class="ui-progress__bar" aria-labelledby="import" value="3" max="5"
          aria-valuetext="3 of 5 files"></progress>`,
  };

  protected readonly unknown = {
    angular: `<ui-progress label="Preparing the report" />`,
    react: `<Progress label="Preparing the report" />`,
    vue: `<Progress label="Preparing the report" />`,
    html: `<!-- No value attribute -->
<progress class="ui-progress__bar" aria-labelledby="prepare"></progress>`,
  };

  protected readonly arabic = {
    angular: `<ui-progress label="بنرفع الفاتورة" [value]="64" />`,
    react: `<Progress label="بنرفع الفاتورة" value={64} />`,
    vue: `<Progress label="بنرفع الفاتورة" :value="64" />`,
    html: `<!-- dir="rtl" on the page: the bar fills from the right -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A level that is not work being done, such as storage used',
      use: 'Meter',
      path: '/components/meter',
    },
    {
      need: 'Waiting with no idea how long',
      use: 'Spinner',
      path: '/components/spinner',
    },
    {
      need: 'Steps the reader goes through',
      use: 'Stepper',
      path: '/components/stepper',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the bar.',
      },
      {
        name: 'value',
        type: 'number | null',
        description: 'How much is done. Leave it out when unknown.',
      },
      {
        name: 'max',
        type: 'number',
        default: '100',
        description: 'The value when done.',
      },
      {
        name: 'valueText',
        type: 'string',
        description: 'The amount in words; defaults to a percentage.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the progress element.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the bar.',
      },
      {
        name: 'value',
        type: 'number | null',
        description: 'How much is done. Leave it out when unknown.',
      },
      {
        name: 'max',
        type: 'number',
        default: '100',
        description: 'The value when done.',
      },
      {
        name: 'valueText',
        type: 'string',
        description: 'The amount in words; defaults to a percentage.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the bar.',
      },
      {
        name: 'value',
        type: 'number | null',
        description: 'How much is done. Leave it out when unknown.',
      },
      {
        name: 'max',
        type: 'number',
        default: '100',
        description: 'The value when done.',
      },
      {
        name: 'valueText',
        type: 'string',
        description: 'The amount in words; defaults to a percentage.',
      },
    ],
    html: [
      {
        name: 'ui-progress',
        type: 'class',
        description: 'The wrapper: label, amount, bar.',
      },
      {
        name: 'ui-progress__bar',
        type: 'class',
        description: 'On the progress element, named with aria-labelledby.',
      },
      {
        name: 'ui-progress__label, __value',
        type: 'class',
        description: 'The words above it; hide the amount from screen readers.',
      },
    ],
  };
}
