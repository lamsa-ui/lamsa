import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SegmentedControlComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-segmented-control-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    SegmentedControlComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Segmented control"
      lead="One choice from two to five short options, side by side: a view, a period, a size. Radio buttons underneath, so Tab reaches the group and the arrow keys move the choice. The chosen one is lifted onto a tile with an edge, not just coloured."
      [usage]="usage"
    >
      <app-example title="A period" [code]="basic">
        <ui-segmented-control
          label="Period"
          [options]="periods"
          [formControl]="period"
        />
      </app-example>

      <app-example
        title="Icons only"
        description="The words stay for screen readers. Keep icons that everyone reads the same way."
        [code]="icons"
      >
        <ui-segmented-control
          label="View"
          iconOnly
          [options]="views"
          [formControl]="view"
        />
      </app-example>

      <app-example
        title="Full width"
        description="block shares the width equally, as in a narrow panel or on a phone."
        [code]="block"
      >
        <ui-segmented-control
          label="Delivery"
          block
          class="doc-field"
          [options]="delivery"
          [formControl]="speed"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-segmented-control
          label="الفترة"
          [options]="periodsArabic"
          [formControl]="periodArabic"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SegmentedControlPageComponent {
  protected readonly periods = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];
  protected readonly views = [
    { value: 'list', label: 'List', icon: 'list' as const },
    { value: 'grid', label: 'Grid', icon: 'layout-grid' as const },
  ];
  protected readonly delivery = [
    { value: 'standard', label: 'Standard' },
    { value: 'express', label: 'Express' },
  ];
  protected readonly periodsArabic = [
    { value: 'day', label: 'يوم' },
    { value: 'week', label: 'أسبوع' },
    { value: 'month', label: 'شهر' },
  ];
  protected readonly period = new FormControl('week');
  protected readonly view = new FormControl('list');
  protected readonly speed = new FormControl('standard');
  protected readonly periodArabic = new FormControl('day');

  protected readonly usage = {
    angular: `import { SegmentedControlComponent } from '@ghazal-ui/angular';
// Works with formControlName, [formControl] and ngModel.`,
    react: `import { SegmentedControl } from '@ghazal-ui/react';`,
    vue: `import { SegmentedControl } from '@ghazal-ui/vue';`,
    html: `<div class="ui-segmented" role="radiogroup" aria-label="Period">...</div>`,
  };

  protected readonly basic = {
    angular: `<ui-segmented-control label="Period" [options]="periods" formControlName="period" />

periods = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];`,
    react: `<SegmentedControl label="Period" options={periods} value={period} onChange={setPeriod} />`,
    vue: `<SegmentedControl label="Period" :options="periods" v-model="period" />`,
    html: `<div class="ui-segmented" role="radiogroup" aria-label="Period">
  <label class="ui-segmented__option"><input type="radio" name="period" value="day" />Day</label>
  <label class="ui-segmented__option"><input type="radio" name="period" value="week" checked />Week</label>
  <label class="ui-segmented__option"><input type="radio" name="period" value="month" />Month</label>
</div>`,
  };

  protected readonly icons = {
    angular: `<ui-segmented-control label="View" iconOnly [options]="views" formControlName="view" />

views = [
  { value: 'list', label: 'List', icon: 'list' },
  { value: 'grid', label: 'Grid', icon: 'layout-grid' },
];`,
    react: `<SegmentedControl label="View" iconOnly options={views} value={view} onChange={setView} />`,
    vue: `<SegmentedControl label="View" iconOnly :options="views" v-model="view" />`,
    html: `<label class="ui-segmented__option">
  <input type="radio" name="view" value="list" checked />
  <i class="ui-icon ui-icon-list" aria-hidden="true"></i>
  <span class="ui-visually-hidden">List</span>
</label>`,
  };

  protected readonly block = {
    angular: `<ui-segmented-control label="Delivery" block [options]="delivery" formControlName="speed" />`,
    react: `<SegmentedControl label="Delivery" block options={delivery} value={speed} onChange={setSpeed} />`,
    vue: `<SegmentedControl label="Delivery" block :options="delivery" v-model="speed" />`,
    html: `<div class="ui-segmented ui-segmented--block" role="radiogroup" aria-label="Delivery">…</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-segmented-control label="الفترة" [options]="periods" formControlName="period" />`,
    react: `<SegmentedControl label="الفترة" options={periods} value={period} onChange={setPeriod} />`,
    vue: `<SegmentedControl label="الفترة" :options="periods" v-model="period" />`,
    html: `<!-- dir="rtl": the first segment sits on the right. -->`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Names the group for screen readers.',
    },
    {
      name: 'options',
      type: '{ value, label, icon?, disabled? }[]',
      description: 'Two to five short options.',
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: 'false',
      description: 'Shows only the icons; the words are still read.',
    },
    {
      name: 'block',
      type: 'boolean',
      default: 'false',
      description: 'Fills the width, segments sharing it.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Show different panels of content',
      use: 'Tabs',
      path: '/components/tabs',
    },
    {
      need: 'A choice sent with a form',
      use: 'Radio group',
      path: '/components/radio-group',
    },
    {
      need: 'One option that is on or off',
      use: 'Toggle',
      path: '/components/toggle',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue | onChange',
        type: 'string',
        description: 'Controlled or starting choice.',
      },
      {
        name: 'disabled | name',
        type: 'boolean | string',
        description: 'Passed to the radios.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'string',
        description: 'The picked value.',
      },
      {
        name: 'disabled | name',
        type: 'boolean | string',
        description: 'For the radios underneath.',
      },
    ],
    html: [
      {
        name: 'ui-segmented',
        type: 'class',
        description: 'The track, with role="radiogroup" and a name.',
      },
      {
        name: 'ui-segmented__option',
        type: 'class',
        description: 'One label around a radio; the radio fills it, unseen.',
      },
      {
        name: 'ui-segmented--block',
        type: 'class',
        description: 'Full width.',
      },
    ],
  };
}
