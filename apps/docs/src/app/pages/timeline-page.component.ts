import { Component } from '@angular/core';
import { TimelineComponent, type TimelineItem } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-timeline-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TimelineComponent,
  ],
  template: `
    <app-page
      title="Timeline"
      lead="A chronological record of decisions and updates. Each event can show who acted, when it happened, and the outcome, so a case's approval history is easy to scan."
      [usage]="usage"
    >
      <app-example
        title="Case approval history"
        description="A manager approved the request, finance is reviewing it, and the owner is notified once the final decision is made."
        [code]="approval"
      >
        <ui-timeline
          label="Approval history for case 1042"
          [items]="approvals"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-timeline label="سجل الموافقات" [items]="arabicApprovals" />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TimelinePageComponent {
  protected readonly approvals: TimelineItem[] = [
    {
      title: 'Request submitted',
      actor: 'Nour El-Sayed',
      date: '18 Nov 2026, 09:14',
      dateTime: '2026-11-18T09:14:00+02:00',
      description: 'Travel expense reimbursement for the Cairo client visit.',
    },
    {
      title: 'Manager approval',
      actor: 'Omar Farouk',
      date: '18 Nov 2026, 11:42',
      dateTime: '2026-11-18T11:42:00+02:00',
      description: 'Approved within the department travel budget.',
      status: 'approved',
    },
    {
      title: 'Finance review',
      actor: 'Finance team',
      date: 'In progress',
      status: 'pending',
    },
  ];

  protected readonly arabicApprovals: TimelineItem[] = [
    {
      title: 'تم تقديم الطلب',
      actor: 'نور السيد',
      date: '١٨ نوفمبر ٢٠٢٦، ٠٩:١٤',
      dateTime: '2026-11-18T09:14:00+02:00',
    },
    {
      title: 'موافقة المدير',
      actor: 'عمر فاروق',
      date: '١٨ نوفمبر ٢٠٢٦، ١١:٤٢',
      dateTime: '2026-11-18T11:42:00+02:00',
      status: 'approved',
      statusLabel: 'تمت الموافقة',
    },
    {
      title: 'مراجعة الشؤون المالية',
      actor: 'الفريق المالي',
      date: 'قيد المراجعة',
      status: 'pending',
      statusLabel: 'قيد الانتظار',
    },
  ];

  protected readonly usage = {
    angular: `import { TimelineComponent } from '@lamsa-ui/angular';`,
    react: `import { Timeline } from '@lamsa-ui/react';`,
    vue: `import { Timeline } from '@lamsa-ui/vue';`,
    html: `<ol class="ui-timeline" aria-label="Approval history">...</ol>`,
  };

  protected readonly approval = {
    angular: `<ui-timeline label="Approval history for case 1042" [items]="approvals" />

approvals = [
  { title: 'Request submitted', actor: 'Nour El-Sayed', date: '18 Nov 2026, 09:14' },
  { title: 'Manager approval', actor: 'Omar Farouk', date: '18 Nov 2026, 11:42',
    status: 'approved', description: 'Approved within the department travel budget.' },
  { title: 'Finance review', actor: 'Finance team', date: 'In progress', status: 'pending' },
];`,
    react: `<Timeline label="Approval history for case 1042" items={[
  { title: 'Request submitted', actor: 'Nour El-Sayed', date: '18 Nov 2026, 09:14' },
  { title: 'Manager approval', actor: 'Omar Farouk', date: '18 Nov 2026, 11:42',
    status: 'approved', description: 'Approved within the department travel budget.' },
  { title: 'Finance review', actor: 'Finance team', date: 'In progress', status: 'pending' },
]} />`,
    vue: `<Timeline label="Approval history for case 1042" :items="[
  { title: 'Request submitted', actor: 'Nour El-Sayed', date: '18 Nov 2026, 09:14' },
  { title: 'Manager approval', actor: 'Omar Farouk', date: '18 Nov 2026, 11:42',
    status: 'approved', description: 'Approved within the department travel budget.' },
  { title: 'Finance review', actor: 'Finance team', date: 'In progress', status: 'pending' },
]" />`,
    html: `<ol class="ui-timeline" aria-label="Approval history">
  <li class="ui-timeline__item">
    <span class="ui-timeline__marker ui-timeline__marker--approved" aria-hidden="true">
      <i class="ui-icon ui-icon-check"></i>
    </span>
    <article class="ui-timeline__content">
      <div class="ui-timeline__heading">
        <h3 class="ui-timeline__title">Manager approval</h3>
        <span class="ui-timeline__status ui-timeline__status--approved">Approved</span>
      </div>
      <p class="ui-timeline__meta">
        <span>Omar Farouk</span><time datetime="2026-11-18T11:42:00+02:00">18 Nov 2026, 11:42</time>
      </p>
      <p class="ui-timeline__description">Approved within the department travel budget.</p>
    </article>
  </li>
  <!-- Repeat for each event in chronological order. -->
</ol>`,
  };

  protected readonly arabic = {
    angular: `<ui-timeline label="سجل الموافقات" [items]="arabicApprovals" />

{ title: 'موافقة المدير', date: '١٨ نوفمبر ٢٠٢٦، ١١:٤٢',
  status: 'approved', statusLabel: 'تمت الموافقة' }`,
    react: `<Timeline label="سجل الموافقات" items={[
  { title: 'موافقة المدير', date: '١٨ نوفمبر ٢٠٢٦، ١١:٤٢',
    status: 'approved', statusLabel: 'تمت الموافقة' },
]} />`,
    vue: `<Timeline label="سجل الموافقات" :items="[
  { title: 'موافقة المدير', date: '١٨ نوفمبر ٢٠٢٦، ١١:٤٢',
    status: 'approved', statusLabel: 'تمت الموافقة' },
]" />`,
    html: `<!-- Set dir="rtl" on the page. Inline-start/end mirror the connector automatically. -->
<ol class="ui-timeline" aria-label="سجل الموافقات">...</ol>`,
  };

  protected readonly alternatives: Alternative[] = [
    { need: 'Steps still to do', use: 'Stepper', path: '/components/stepper' },
    {
      need: 'Many records to sort and filter',
      use: 'Data table',
      path: '/components/data-table',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the ordered history list.',
      },
      {
        name: 'items',
        type: 'TimelineItem[]',
        description: 'Required. Events in chronological order.',
      },
      {
        name: 'TimelineItem',
        type: '{ title, date, dateTime?, actor?, description?, status?, statusLabel? }',
        description:
          'Event details. dateTime is a machine-readable value for the semantic time element.',
      },
      {
        name: 'status',
        type: "'approved' | 'pending' | 'rejected'",
        description: 'Adds a status icon and tone label to the event.',
      },
      {
        name: 'statusLabel',
        type: 'string',
        description:
          'Overrides the default status text, including for translation.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the ordered history list.',
      },
      {
        name: 'items',
        type: 'TimelineItem[]',
        description: 'Required. Events in chronological order.',
      },
      {
        name: 'TimelineItem',
        type: '{ title, date, dateTime?, actor?, description?, status?, statusLabel? }',
        description:
          'Event details. dateTime is a machine-readable value for the semantic time element.',
      },
      {
        name: 'status',
        type: "'approved' | 'pending' | 'rejected'",
        description: 'Adds a status icon and tone label to the event.',
      },
      {
        name: 'statusLabel',
        type: 'string',
        description:
          'Overrides the default status text, including for translation.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Added to the ordered list.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the ordered history list.',
      },
      {
        name: 'items',
        type: 'TimelineItem[]',
        description: 'Required. Events in chronological order.',
      },
      {
        name: 'TimelineItem',
        type: '{ title, date, dateTime?, actor?, description?, status?, statusLabel? }',
        description:
          'Event details. dateTime is a machine-readable value for the semantic time element.',
      },
      {
        name: 'TimelineItem.status',
        type: "'approved' | 'pending' | 'rejected'",
        description: 'Adds a status icon and tone label to the event.',
      },
      {
        name: 'TimelineItem.statusLabel',
        type: 'string',
        description:
          'Overrides the default status text, including for translation.',
      },
    ],
    html: [
      {
        name: 'ui-timeline',
        type: 'class',
        description: 'On the ordered list. Set an accessible aria-label.',
      },
      {
        name: 'ui-timeline__item',
        type: 'class',
        description: 'On each list item, in chronological order.',
      },
      {
        name: 'ui-timeline__marker--approved | --pending | --rejected',
        type: 'class',
        description: 'Colors and styles the status marker.',
      },
      {
        name: 'ui-timeline__status--approved | --pending | --rejected',
        type: 'class',
        description: 'Styles the visible status label.',
      },
    ],
  };
}
