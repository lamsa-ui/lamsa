import { Component } from '@angular/core';
import { SkeletonComponent, SpinnerComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-skeleton-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    SkeletonComponent,
    SpinnerComponent,
  ],
  template: `
    <app-page
      title="Skeleton"
      lead="Grey shapes where content is loading, so the page does not jump when it arrives. Screen readers skip the shapes: mark the area busy and say it is loading with a spinner or a status message. With reduced motion the shapes stop pulsing."
      [usage]="usage"
    >
      <app-example title="A loading card" [code]="card">
        <div class="doc-card doc-field" aria-busy="true">
          <ui-spinner label="Loading the profile" />
          <div class="doc-row">
            <ui-skeleton shape="circle" />
            <ui-skeleton [lines]="2" class="doc-grow" />
          </div>
          <ui-skeleton shape="block" />
          <ui-skeleton [lines]="3" />
        </div>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SkeletonPageComponent {
  protected readonly usage = {
    angular: `import { SkeletonComponent } from '@lamsa-ui/angular';`,
    react: `import { Skeleton } from '@lamsa-ui/react';`,
    vue: `import { Skeleton } from '@lamsa-ui/vue';`,
    html: `<div class="ui-skeleton ui-skeleton--text" aria-hidden="true">
  <span class="ui-skeleton__shape"></span>
  <span class="ui-skeleton__shape"></span>
</div>`,
  };

  protected readonly card = {
    angular: `<div class="ui-card" aria-busy="true">
  <ui-spinner label="Loading the profile" />
  <ui-skeleton shape="circle" />
  <ui-skeleton [lines]="2" />
  <ui-skeleton shape="block" />
  <ui-skeleton [lines]="3" />
</div>`,
    react: `<Card aria-busy>
  <Spinner label="Loading the profile" />
  <Skeleton shape="circle" />
  <Skeleton lines={2} />
  <Skeleton shape="block" />
  <Skeleton lines={3} />
</Card>`,
    vue: `<Card aria-busy>
  <Spinner label="Loading the profile" />
  <Skeleton shape="circle" />
  <Skeleton :lines="2" />
  <Skeleton shape="block" />
  <Skeleton :lines="3" />
</Card>`,
    html: `<div class="ui-card" aria-busy="true">
  <span class="ui-loading" role="status">…Loading the profile</span>
  <div class="ui-skeleton ui-skeleton--circle" aria-hidden="true"><span class="ui-skeleton__shape"></span></div>
  <div class="ui-skeleton ui-skeleton--block" aria-hidden="true"><span class="ui-skeleton__shape"></span></div>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Work with a known length',
      use: 'Progress',
      path: '/components/progress',
    },
    {
      need: 'A short wait inside a button',
      use: 'Spinner',
      path: '/components/spinner',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'shape',
        type: "'text' | 'circle' | 'block'",
        default: "'text'",
        description: 'Lines, an avatar, or an image or card.',
      },
      {
        name: 'lines',
        type: 'number',
        default: '1',
        description: 'Lines of text; the last one is shorter.',
      },
    ],
    react: [
      {
        name: 'shape',
        type: "'text' | 'circle' | 'block'",
        default: "'text'",
        description: 'Lines, an avatar, or an image or card.',
      },
      {
        name: 'lines',
        type: 'number',
        default: '1',
        description: 'Lines of text; the last one is shorter.',
      },
    ],
    vue: [
      {
        name: 'shape',
        type: "'text' | 'circle' | 'block'",
        default: "'text'",
        description: 'Lines, an avatar, or an image or card.',
      },
      {
        name: 'lines',
        type: 'number',
        default: '1',
        description: 'Lines of text; the last one is shorter.',
      },
    ],
    html: [
      {
        name: 'ui-skeleton',
        type: 'class',
        description: 'The wrapper, with aria-hidden="true".',
      },
      {
        name: 'ui-skeleton--text | --circle | --block',
        type: 'class',
        description: 'The shape.',
      },
      {
        name: 'ui-skeleton__shape',
        type: 'class',
        description: 'One grey shape; one per line of text.',
      },
    ],
  };
}
