import { Component } from '@angular/core';
import { TextFieldComponent } from '@ghazal-ui/angular';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ApiTableComponent } from '../shared/api-table.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-input-group-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TextFieldComponent,
  ],
  template: `
    <app-page
      title="Input group"
      lead="A text field with fixed text inside its box, before or after the value: a currency, a unit, a domain. The text is read with the field, so 'Price, EGP' is heard, but it is never part of the value."
      [usage]="usage"
    >
      <app-example
        title="Before and after"
        description="Set prefix or suffix on a text field."
        [code]="affixes"
      >
        <div class="grid w-full max-w-sm gap-4">
          <ui-text-field label="Price" type="number" prefix="EGP" />
          <ui-text-field label="Weight" type="number" suffix="kg" />
          <ui-text-field
            label="Shop address"
            prefix="https://"
            suffix=".ghazal.shop"
          />
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <div class="grid w-full max-w-sm gap-4">
          <ui-text-field label="السعر" type="number" suffix="جنيه" />
        </div>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class InputGroupPageComponent {
  protected readonly usage = {
    angular: `import { TextFieldComponent } from '@ghazal-ui/angular';`,
    react: `import { TextField } from '@ghazal-ui/react';`,
    vue: `import { TextField } from '@ghazal-ui/vue';`,
    html: `<div class="ui-input-group">…<input class="ui-input-group__input" />…</div>`,
  };

  protected readonly affixes = {
    angular: `<ui-text-field label="Price" type="number" prefix="EGP" />
<ui-text-field label="Weight" type="number" suffix="kg" />
<ui-text-field label="Shop address" prefix="https://" suffix=".ghazal.shop" />`,
    react: `<TextField label="Price" type="number" prefix="EGP" />
<TextField label="Weight" type="number" suffix="kg" />
<TextField label="Shop address" prefix="https://" suffix=".ghazal.shop" />`,
    vue: `<TextField v-model="price" label="Price" type="number" prefix="EGP" />
<TextField v-model="weight" label="Weight" type="number" suffix="kg" />
<TextField v-model="shop" label="Shop address" prefix="https://" suffix=".ghazal.shop" />`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="price">Price</label>
  <div class="ui-input-group">
    <span class="ui-input-group__addon" id="price-prefix">EGP</span>
    <input class="ui-input-group__input" id="price" type="number" aria-describedby="price-prefix" />
  </div>
</div>
<div class="ui-field">
  <label class="ui-field__label" for="weight">Weight</label>
  <div class="ui-input-group">
    <input class="ui-input-group__input" id="weight" type="number" aria-describedby="weight-suffix" />
    <span class="ui-input-group__addon ui-input-group__addon--end" id="weight-suffix">kg</span>
  </div>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-text-field label="السعر" type="number" suffix="جنيه" />`,
    react: `<TextField label="السعر" type="number" suffix="جنيه" />`,
    vue: `<TextField v-model="price" label="السعر" type="number" suffix="جنيه" />`,
    html: `<div class="ui-input-group">
  <input class="ui-input-group__input" id="price" type="number" aria-describedby="price-suffix" />
  <span class="ui-input-group__addon ui-input-group__addon--end" id="price-suffix">جنيه</span>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A number with − and + buttons',
      use: 'Number field',
      path: '/components/number-field',
    },
    {
      need: 'A phone number with its country code',
      use: 'Phone field',
      path: '/components/phone-field',
    },
    {
      need: 'A search box with a clear button',
      use: 'Search field',
      path: '/components/search-field',
    },
  ];

  private readonly shared = [
    {
      name: 'prefix',
      type: 'string',
      description:
        'Text before the value, such as "EGP". Read after the label.',
    },
    {
      name: 'suffix',
      type: 'string',
      description: 'Text after the value, such as "kg" or ".com".',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Required. Every other Text field option works too: see Text field.',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: this.shared,
    vue: this.shared,
    html: [
      {
        name: 'ui-input-group',
        type: 'class',
        description: 'The box around the input and its text.',
      },
      {
        name: 'ui-input-group__input',
        type: 'class',
        description:
          'The input. aria-describedby points at the addons so they are read.',
      },
      {
        name: 'ui-input-group__addon',
        type: 'class',
        description: 'Text before the input; add --end for text after it.',
      },
    ],
  };
}
