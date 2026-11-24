import { Component, signal } from '@angular/core';
import { ButtonComponent, IconComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-button-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    IconComponent,
  ],
  template: `
    <app-page
      title="Button"
      lead="Styles the native button, so it keeps everything the browser gives a button: focus, Enter and Space, form submit. Nine variants, three sizes, icons, and hover, press and focus feedback."
      [usage]="usage"
    >
      <app-example
        title="Variants"
        description="One primary action per screen. Danger is for actions that destroy something."
        [code]="variants"
      >
        <button ui-button>Save</button>
        <button ui-button variant="secondary">Cancel</button>
        <button ui-button variant="ghost">Skip</button>
        <button ui-button variant="danger">Delete</button>
        <button ui-button variant="success">Approve</button>
        <button ui-button variant="warning">Review</button>
        <button ui-button variant="outline">Edit</button>
        <button ui-button variant="soft">Details</button>
        <button ui-button variant="link">Learn more</button>
      </app-example>

      <app-example
        title="Icons"
        description="Icons before or after the label are hidden from screen readers. An icon-only button needs an aria-label."
        [code]="icons"
      >
        <button ui-button>
          <ui-icon ui-button-start name="plus" />
          New file
        </button>
        <button ui-button variant="secondary">
          Next
          <ui-icon ui-button-end name="arrow-right" />
        </button>
        <button ui-button variant="outline" iconOnly aria-label="Search">
          <ui-icon name="search" />
        </button>
      </app-example>

      <app-example
        title="Sizes"
        description="Even the small size stays 44 pixels high, the smallest comfortable touch target."
        [code]="sizes"
      >
        <button ui-button size="sm">Small</button>
        <button ui-button>Medium</button>
        <button ui-button size="lg">Large</button>
      </app-example>

      <app-example
        title="Loading"
        description="Disables the button, marks it busy for screen readers and shows a spinner."
        [code]="loading"
      >
        <button ui-button [loading]="saving()" (click)="save()">
          Save changes
        </button>
      </app-example>

      <app-example title="Disabled" [code]="disabled">
        <button ui-button disabled>Save</button>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <button ui-button>حفظ</button>
        <button ui-button variant="secondary">إلغاء</button>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ButtonPageComponent {
  protected readonly saving = signal(false);

  protected save(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }

  protected readonly usage = {
    react: `import { Button } from '@ghazal-ui/react';`,
    vue: `import { Button } from '@ghazal-ui/vue';`,
    angular: `import { ButtonComponent } from '@ghazal-ui/angular';`,
    html: `<button class="ui-button ui-button--primary ui-button--md">Save</button>`,
  };

  protected readonly variants = {
    react: `<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Approve</Button>
<Button variant="warning">Review</Button>
<Button variant="outline">Edit</Button>
<Button variant="soft">Details</Button>
<Button variant="link">Learn more</Button>`,
    vue: `<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Approve</Button>
<Button variant="warning">Review</Button>
<Button variant="outline">Edit</Button>
<Button variant="soft">Details</Button>
<Button variant="link">Learn more</Button>`,
    angular: `<button ui-button>Save</button>
<button ui-button variant="secondary">Cancel</button>
<button ui-button variant="ghost">Skip</button>
<button ui-button variant="danger">Delete</button>
<button ui-button variant="success">Approve</button>
<button ui-button variant="warning">Review</button>
<button ui-button variant="outline">Edit</button>
<button ui-button variant="soft">Details</button>
<button ui-button variant="link">Learn more</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md">Save</button>
<button class="ui-button ui-button--secondary ui-button--md">Cancel</button>
<button class="ui-button ui-button--ghost ui-button--md">Skip</button>
<button class="ui-button ui-button--danger ui-button--md">Delete</button>
<button class="ui-button ui-button--success ui-button--md">Approve</button>
<button class="ui-button ui-button--warning ui-button--md">Review</button>
<button class="ui-button ui-button--outline ui-button--md">Edit</button>
<button class="ui-button ui-button--soft ui-button--md">Details</button>
<button class="ui-button ui-button--link ui-button--md">Learn more</button>`,
  };

  protected readonly icons = {
    react: `<Button startIcon={<Icon name="plus" />}>New file</Button>
<Button variant="secondary" endIcon={<Icon name="arrow-right" />}>Next</Button>
<Button variant="outline" iconOnly aria-label="Search">
  <Icon name="search" />
</Button>`,
    vue: `<Button>
  <template #startIcon><Icon name="plus" /></template>
  New file
</Button>
<Button variant="secondary">
  Next
  <template #endIcon><Icon name="arrow-right" /></template>
</Button>
<Button variant="outline" iconOnly aria-label="Search">
  <Icon name="search" />
</Button>`,
    angular: `<button ui-button>
  <ui-icon ui-button-start name="plus" />
  New file
</button>
<button ui-button variant="secondary">
  Next
  <ui-icon ui-button-end name="arrow-right" />
</button>
<button ui-button variant="outline" iconOnly aria-label="Search">
  <ui-icon name="search" />
</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md">
  <span class="ui-button__icon" aria-hidden="true"><i class="ui-icon ui-icon-plus"></i></span>
  New file
</button>
<button class="ui-button ui-button--outline ui-button--md ui-button--icon" aria-label="Search">
  <i class="ui-icon ui-icon-search" aria-hidden="true"></i>
</button>`,
  };

  protected readonly sizes = {
    react: `<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>`,
    vue: `<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>`,
    angular: `<button ui-button size="sm">Small</button>
<button ui-button>Medium</button>
<button ui-button size="lg">Large</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--sm">Small</button>
<button class="ui-button ui-button--primary ui-button--md">Medium</button>
<button class="ui-button ui-button--primary ui-button--lg">Large</button>`,
  };

  protected readonly loading = {
    react: `<Button loading={saving} onClick={save}>
  Save changes
</Button>`,
    vue: `<Button :loading="saving" @click="save">
  Save changes
</Button>`,
    angular: `<button ui-button [loading]="saving()" (click)="save()">Save changes</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md" disabled aria-busy="true">
  <span class="ui-spinner" aria-hidden="true"></span>
  Save changes
</button>`,
  };

  protected readonly disabled = {
    react: `<Button disabled>Save</Button>`,
    vue: `<Button disabled>Save</Button>`,
    angular: `<button ui-button disabled>Save</button>`,
    html: `<button class="ui-button ui-button--primary ui-button--md" disabled>Save</button>`,
  };

  protected readonly arabic = {
    react: `{/* dir="rtl" on the page or any ancestor */}
<Button>حفظ</Button>
<Button variant="secondary">إلغاء</Button>`,
    vue: `<!-- dir="rtl" on the page or any ancestor -->
<Button>حفظ</Button>
<Button variant="secondary">إلغاء</Button>`,
    angular: `<!-- dir="rtl" on the page or any ancestor -->
<button ui-button>حفظ</button>
<button ui-button variant="secondary">إلغاء</button>`,
    html: `<!-- dir="rtl" on the page or any ancestor -->
<button class="ui-button ui-button--primary ui-button--md">حفظ</button>
<button class="ui-button ui-button--secondary ui-button--md">إلغاء</button>`,
  };

  protected readonly alternatives: Alternative[] = [
    { need: 'Go to another page', use: 'A link (a href)' },
    {
      need: 'A state that stays on or off, such as bold',
      use: 'Toggle',
      path: '/components/toggle',
    },
    {
      need: 'Several actions that belong together',
      use: 'Button group',
      path: '/components/button-group',
    },
    {
      need: 'More actions than fit, behind one button',
      use: 'Menu',
      path: '/components/menu',
    },
  ];

  protected readonly api = {
    react: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft' | 'link' | 'success' | 'warning'",
        default: "'primary'",
        description: 'How much the button stands out.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Padding and text size. Height never drops under 44 pixels.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button, sets aria-busy and shows a spinner.',
      },
      {
        name: 'startIcon / endIcon',
        type: 'ReactNode',
        description:
          'Icon before or after the label. The spinner replaces startIcon while loading.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Square button for a lone icon. Add an aria-label.',
      },
      {
        name: '...props',
        type: 'button props',
        description:
          'Every native button prop: type, onClick, disabled, form, ref.',
      },
    ],
    vue: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft' | 'link' | 'success' | 'warning'",
        default: "'primary'",
        description: 'How much the button stands out.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Padding and text size. Height never drops under 44 pixels.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button, sets aria-busy and shows a spinner.',
      },
      {
        name: '#startIcon / endIcon',
        type: 'slot',
        description:
          'Icon before or after the label. The spinner replaces startIcon while loading.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Square button for a lone icon. Add an aria-label.',
      },
    ],
    angular: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'soft' | 'link' | 'success' | 'warning'",
        default: "'primary'",
        description: 'How much the button stands out.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description:
          'Padding and text size. Height never drops under 44 pixels.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button, sets aria-busy and shows a spinner.',
      },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Square button for a lone icon. Add an aria-label.',
      },
      {
        name: '[ui-button-start] / [ui-button-end]',
        type: 'content slot',
        description:
          'Put an icon before or after the label. Hidden while loading (start).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the button.',
      },
    ],
    html: [
      {
        name: 'ui-button',
        type: 'class',
        description: 'Required on every button.',
      },
      {
        name: 'ui-button--primary | --secondary | --ghost | --danger | --outline | --soft | --link | --success | --warning',
        type: 'class',
        description: 'The variant. Use exactly one.',
      },
      {
        name: 'ui-button--sm | --md | --lg',
        type: 'class',
        description: 'The size. Use exactly one.',
      },
      {
        name: 'ui-button--icon, ui-button__icon',
        type: 'class',
        description:
          'Square icon-only button; wrapper span (aria-hidden) for an icon beside a label.',
      },
      {
        name: 'aria-busy="true" + disabled',
        type: 'attribute',
        description:
          'Loading state; add a span.ui-spinner with aria-hidden="true" before the label.',
      },
    ],
  };
}
