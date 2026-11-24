import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ChipInputComponent } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-chip-input-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ChipInputComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  template: `
    <app-page
      title="Chip input"
      lead="A text field that collects several short values, such as toppings, email addresses or skills. Each value becomes a tag with its own named remove button. Screen readers hear each value being added and removed, and focus never falls off the field."
      [usage]="usage"
    >
      <app-example
        title="Toppings"
        description="Type, then Enter or a comma. Backspace in the empty field moves to the last tag; Enter on its × removes it and moves focus to the next."
        [code]="basic"
      >
        <ui-chip-input
          class="doc-field"
          label="Toppings"
          hint="Press Enter after each one."
          [formControl]="toppings"
        />
        <p class="doc-flat w-full text-text-muted">
          Value: {{ toppings.value | json }}
        </p>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-chip-input
          class="doc-field"
          label="الإضافات"
          removeLabel="إزالة"
          [addedLabel]="addedArabic"
          [removedLabel]="removedArabic"
          [formControl]="toppingsArabic"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ChipInputPageComponent {
  protected readonly toppings = new FormControl(['Cheese', 'Olives'], {
    nonNullable: true,
  });
  protected readonly toppingsArabic = new FormControl(['جبنة'], {
    nonNullable: true,
  });
  protected readonly addedArabic = (c: string) => `تمت إضافة ${c}`;
  protected readonly removedArabic = (c: string) => `تمت إزالة ${c}`;

  protected readonly usage = {
    angular: `import { ChipInputComponent } from '@lamsa-ui/angular';
// The value is a string[]. Works with formControlName, [formControl] and ngModel.`,
    react: `import { ChipInput } from '@lamsa-ui/react';`,
    vue: `import { ChipInput } from '@lamsa-ui/vue';`,
    html: `<div class="ui-chips">...</div>
<!-- Adding, removing, focus and announcements need script: use the Angular or React component. -->`,
  };

  protected readonly basic = {
    angular: `<ui-chip-input
  label="Toppings"
  hint="Press Enter after each one."
  formControlName="toppings"
/>`,
    react: `<ChipInput
  label="Toppings"
  hint="Press Enter after each one."
  value={toppings}
  onChange={setToppings}
/>`,
    vue: `<ChipInput
  label="Toppings"
  hint="Press Enter after each one."
  v-model="toppings"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="toppings">Toppings</label>
  <div class="ui-chips">
    <ul class="ui-chips__list" aria-label="Toppings">
      <li><span class="ui-tag">…tag with its × button…</span></li>
    </ul>
    <input class="ui-chips__input" id="toppings" aria-describedby="toppings-hint" />
  </div>
  <p class="ui-field__hint" id="toppings-hint">Press Enter after each one.</p>
  <span class="ui-visually-hidden" aria-live="polite"><!-- "Olives added" --></span>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-chip-input label="الإضافات" removeLabel="إزالة"
  [addedLabel]="added" [removedLabel]="removed" formControlName="toppings" />

added = (c: string) => \`تمت إضافة \${c}\`;
removed = (c: string) => \`تمت إزالة \${c}\`;`,
    react: `<ChipInput label="الإضافات" removeLabel="إزالة"
  addedLabel={(c) => \`تمت إضافة \${c}\`}
  removedLabel={(c) => \`تمت إزالة \${c}\`}
  value={toppings} onChange={setToppings} />`,
    vue: `<ChipInput label="الإضافات" removeLabel="إزالة"
  :addedLabel="(c) => \`تمت إضافة \${c}\`"
  :removedLabel="(c) => \`تمت إزالة \${c}\`"
  v-model="toppings" />`,
    html: `<!-- dir="rtl" on the page: tags and text run from the right -->`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Names the field and the list of tags.',
    },
    {
      name: 'hint | placeholder',
      type: 'string',
      description: 'Help under the field; text in the empty field.',
    },
    {
      name: 'removeLabel',
      type: 'string',
      default: "'Remove'",
      description: "First word of each × button's name. Translate it.",
    },
    {
      name: 'addedLabel | removedLabel',
      type: '(chip: string) => string',
      default: '`${c} added`',
      description: 'What screen readers hear after a change. Translate them.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'One value from a known list',
      use: 'Combobox',
      path: '/components/combobox',
    },
    {
      need: 'A few choices that fit on screen',
      use: 'Checkbox',
      path: '/components/checkbox',
    },
    {
      need: 'Show labels the user cannot type',
      use: 'Tag',
      path: '/components/tag',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue',
        type: 'string[]',
        description: 'Controlled or starting tags.',
      },
      {
        name: 'onChange',
        type: '(value: string[]) => void',
        description: 'Called after each add and remove.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'No typing, no removing.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'string[]',
        description: 'The chips, in the order they were added.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Locks the field and hides the × buttons.',
      },
    ],
    html: [
      {
        name: 'ui-chips',
        type: 'class',
        description: 'The box that looks like a text field.',
      },
      {
        name: 'ui-chips__list | __input',
        type: 'class',
        description: 'The list of tags and the text field.',
      },
    ],
  };
}
