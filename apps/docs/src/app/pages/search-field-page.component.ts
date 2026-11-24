import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-search-field-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    SearchFieldComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Search field"
      lead="A box to search with: a magnifier, the text, and a × to clear it. Escape clears it too, and Enter searches. A real search input, so phones show a Search key and screen readers say search."
      [usage]="usage"
    >
      <app-example
        title="Search a list"
        description="The label can be hidden where the page already says what is searched, as in a header. Screen readers still read it."
        [code]="basic"
      >
        <ui-search-field
          label="Search orders"
          hideLabel
          placeholder="Order number or customer"
          class="doc-field"
          [formControl]="query"
          (submitted)="searched.set($event)"
        />
        <p class="text-text-muted" aria-live="polite">
          {{ searched() ? 'Searched for “' + searched() + '”' : '' }}
        </p>
      </app-example>

      <app-example
        title="With a visible label"
        description="In a form or a filter panel, keep the label in view."
        [code]="visible"
      >
        <ui-search-field
          label="Find a branch"
          hint="Type a city or a street."
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-search-field
          label="ابحث في الطلبات"
          clearLabel="مسح البحث"
          placeholder="رقم الطلب أو اسم العميل"
          class="doc-field"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SearchFieldPageComponent {
  protected readonly query = new FormControl('');
  protected readonly searched = signal('');

  protected readonly usage = {
    angular: `import { SearchFieldComponent } from '@lamsa-ui/angular';
// The value is the text. Works with formControlName, [formControl] and ngModel.`,
    react: `import { SearchField } from '@lamsa-ui/react';`,
    vue: `import { SearchField } from '@lamsa-ui/vue';`,
    html: `<div class="ui-field">
  <label class="ui-field__label ui-visually-hidden" for="q">Search orders</label>
  <div class="ui-input-group">...</div>
</div>`,
  };

  protected readonly basic = {
    angular: `<ui-search-field
  label="Search orders"
  hideLabel
  placeholder="Order number or customer"
  formControlName="q"
  (submitted)="find($event)"
/>`,
    react: `<SearchField
  label="Search orders"
  hideLabel
  placeholder="Order number or customer"
  value={q}
  onChange={setQ}
  onSearch={find}
/>`,
    vue: `<SearchField
  label="Search orders"
  hideLabel
  placeholder="Order number or customer"
  v-model="q"
  @search="find"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label ui-visually-hidden" for="q">Search orders</label>
  <div class="ui-input-group">
    <span class="ui-input-group__addon" aria-hidden="true"><i class="ui-icon ui-icon-search"></i></span>
    <input class="ui-input-group__input" id="q" type="search" enterkeyhint="search"
      placeholder="Order number or customer" />
    <!-- Shown once there is text. Escape clears it from the keyboard. -->
    <button type="button" class="ui-input-group__button" tabindex="-1" aria-label="Clear search">
      <i class="ui-icon ui-icon-x"></i>
    </button>
  </div>
</div>`,
  };

  protected readonly visible = {
    angular: `<ui-search-field label="Find a branch" hint="Type a city or a street." />`,
    react: `<SearchField label="Find a branch" hint="Type a city or a street." />`,
    vue: `<SearchField label="Find a branch" hint="Type a city or a street." />`,
    html: `<label class="ui-field__label" for="branch">Find a branch</label>`,
  };

  protected readonly arabic = {
    angular: `<ui-search-field label="ابحث في الطلبات" clearLabel="مسح البحث" placeholder="رقم الطلب أو اسم العميل" />`,
    react: `<!-- React Aria translates the × button's name from the I18nProvider locale. -->
<SearchField label="ابحث في الطلبات" placeholder="رقم الطلب أو اسم العميل" />`,
    vue: `<!-- React Aria translates the × button's name from the I18nProvider locale. -->
<SearchField label="ابحث في الطلبات" placeholder="رقم الطلب أو اسم العميل" />`,
    html: `<!-- dir="rtl" on the page: the magnifier moves to the right on its own. -->`,
  };

  private readonly shared = [
    { name: 'label', type: 'string', description: 'Names the field.' },
    {
      name: 'hideLabel',
      type: 'boolean',
      default: 'false',
      description: 'Keeps the label for screen readers only.',
    },
    {
      name: 'placeholder | hint',
      type: 'string',
      description: 'An example inside the box; help text under it.',
    },
    {
      name: 'clearLabel',
      type: 'string',
      default: 'Clear search',
      description: 'Names the × button. Translate it.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Search the whole app and run commands',
      use: 'Command palette',
      path: '/components/command-palette',
    },
    {
      need: 'Pick one value from a list as you type',
      use: 'Combobox',
      path: '/components/combobox',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: '(submitted)',
        type: 'string',
        description: 'Enter was pressed: the text to search for.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue | onChange',
        type: 'string',
        description: 'Controlled or starting text.',
      },
      {
        name: 'onSearch',
        type: '(value: string) => void',
        description: 'Enter was pressed.',
      },
      {
        name: 'disabled | name',
        type: 'boolean | string',
        description: 'Passed to the input.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'string',
        description: 'The text typed so far.',
      },
      {
        name: '@search',
        type: 'event',
        description: 'Enter was pressed; gets the text.',
      },
      {
        name: 'disabled | name',
        type: 'boolean | string',
        description: 'As on any input.',
      },
    ],
    html: [
      {
        name: 'ui-input-group',
        type: 'class',
        description:
          'The box around the input, icon and button. Rings while the input has focus.',
      },
      {
        name: 'ui-input-group__addon | __input | __button',
        type: 'class',
        description: 'The magnifier, the input and the × button.',
      },
    ],
  };
}
