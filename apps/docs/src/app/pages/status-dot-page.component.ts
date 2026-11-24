import { Component } from '@angular/core';
import { StatusDotComponent } from '@lamsa-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-status-dot-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    StatusDotComponent,
  ],
  template: `
    <app-page
      title="Status dot"
      lead="A small coloured dot before the word for a live state: online, busy, offline. The word is always there and carries the meaning; the dot lets the eye scan a long list."
      [usage]="usage"
    >
      <app-example title="Tones" [code]="tones">
        <div class="flex flex-wrap gap-6">
          <ui-status-dot tone="success">Online</ui-status-dot>
          <ui-status-dot tone="warning">Busy</ui-status-dot>
          <ui-status-dot tone="danger">Down</ui-status-dot>
          <ui-status-dot tone="info">Syncing</ui-status-dot>
          <ui-status-dot>Offline</ui-status-dot>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-status-dot tone="success">متصل</ui-status-dot>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class StatusDotPageComponent {
  protected readonly usage = {
    angular: `import { StatusDotComponent } from '@lamsa-ui/angular';`,
    react: `import { StatusDot } from '@lamsa-ui/react';`,
    vue: `import { StatusDot } from '@lamsa-ui/vue';`,
    html: `<span class="ui-status-dot ui-status-dot--success">Online</span>`,
  };

  protected readonly tones = {
    angular: `<ui-status-dot tone="success">Online</ui-status-dot>
<ui-status-dot tone="warning">Busy</ui-status-dot>
<ui-status-dot tone="danger">Down</ui-status-dot>
<ui-status-dot tone="info">Syncing</ui-status-dot>
<ui-status-dot>Offline</ui-status-dot>`,
    react: `<StatusDot tone="success">Online</StatusDot>
<StatusDot tone="warning">Busy</StatusDot>
<StatusDot tone="danger">Down</StatusDot>
<StatusDot tone="info">Syncing</StatusDot>
<StatusDot>Offline</StatusDot>`,
    vue: `<StatusDot tone="success">Online</StatusDot>
<StatusDot tone="warning">Busy</StatusDot>
<StatusDot tone="danger">Down</StatusDot>
<StatusDot tone="info">Syncing</StatusDot>
<StatusDot>Offline</StatusDot>`,
    html: `<span class="ui-status-dot ui-status-dot--success">Online</span>
<span class="ui-status-dot ui-status-dot--warning">Busy</span>
<span class="ui-status-dot ui-status-dot--danger">Down</span>
<span class="ui-status-dot ui-status-dot--info">Syncing</span>
<span class="ui-status-dot">Offline</span>`,
  };

  protected readonly arabic = {
    angular: `<ui-status-dot tone="success">متصل</ui-status-dot>`,
    react: `<StatusDot tone="success">متصل</StatusDot>`,
    vue: `<StatusDot tone="success">متصل</StatusDot>`,
    html: `<span class="ui-status-dot ui-status-dot--success">متصل</span>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A status that stands out in a table row, such as Paid',
      use: 'Badge',
      path: '/components/badge',
    },
    {
      need: 'A message about the status',
      use: 'Alert',
      path: '/components/alert',
    },
  ];

  private readonly tone = {
    name: 'tone',
    type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
    default: "'neutral'",
    description: 'Colour of the dot. The words still say the status.',
  };

  protected readonly api = {
    angular: [
      this.tone,
      {
        name: 'content',
        type: 'text',
        description: 'Required in practice: the word for the status.',
      },
    ],
    react: [
      this.tone,
      {
        name: 'children',
        type: 'ReactNode',
        description: 'The word for the status.',
      },
    ],
    vue: [
      this.tone,
      {
        name: '#default',
        type: 'slot',
        description: 'The word for the status.',
      },
    ],
    html: [
      {
        name: 'ui-status-dot',
        type: 'class',
        description:
          'On a span holding the word. Tones: --info, --success, --warning, --danger.',
      },
    ],
  };
}
