import { Component, signal } from '@angular/core';
import {
  ButtonComponent,
  MenuComponent,
  MenuItemComponent,
  MenuTriggerDirective,
} from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-menu-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ButtonComponent,
    MenuComponent,
    MenuItemComponent,
    MenuTriggerDirective,
  ],
  template: `
    <app-page
      title="Menu"
      lead="A short list of actions that opens from a button, such as the actions on a row. Enter, Space or the down arrow open it, the arrow keys and typing move through it, and Escape closes it and puts focus back on the button. For choosing a value, use a select."
      [usage]="usage"
    >
      <app-example title="Row actions" [code]="basic">
        <button ui-button variant="secondary" [uiMenuTrigger]="actions">
          Actions
        </button>
        <ng-template #actions>
          <ui-menu>
            <button ui-menu-item (triggered)="last.set('Edit')">Edit</button>
            <button ui-menu-item (triggered)="last.set('Duplicate')">
              Duplicate
            </button>
            <button ui-menu-item disabled>Archive</button>
            <div class="ui-menu__separator" role="separator"></div>
            <button ui-menu-item danger (triggered)="last.set('Delete')">
              Delete
            </button>
          </ui-menu>
        </ng-template>
        <p class="doc-flat doc-muted" role="status">
          {{ last() ? 'Chose: ' + last() : '' }}
        </p>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <button ui-button variant="secondary" [uiMenuTrigger]="arabicMenu">
          إجراءات
        </button>
        <ng-template #arabicMenu>
          <ui-menu dir="rtl" lang="ar">
            <button ui-menu-item>تعديل</button>
            <button ui-menu-item danger>حذف</button>
          </ui-menu>
        </ng-template>
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class MenuPageComponent {
  protected readonly last = signal('');

  protected readonly usage = {
    angular: `import { MenuComponent, MenuItemComponent, MenuTriggerDirective } from '@ghazal-ui/angular';
// On the Angular CDK menu. Add @angular/cdk/overlay-prebuilt.css.`,
    react: `import { Menu } from '@ghazal-ui/react';`,
    vue: `import { Menu } from '@ghazal-ui/vue';`,
    html: `<!-- A menu needs script for the keyboard. Follow the WAI-ARIA menu button pattern with these classes: -->
<button class="ui-button ui-button--secondary" aria-haspopup="menu" aria-expanded="true">Actions</button>
<div class="ui-menu" role="menu">
  <button class="ui-menu__item" role="menuitem" tabindex="-1">Edit</button>
  <button class="ui-menu__item ui-menu__item--danger" role="menuitem" tabindex="-1">Delete</button>
</div>`,
  };

  protected readonly basic = {
    angular: `<button ui-button variant="secondary" [uiMenuTrigger]="actions">Actions</button>
<ng-template #actions>
  <ui-menu>
    <button ui-menu-item (triggered)="edit()">Edit</button>
    <button ui-menu-item (triggered)="duplicate()">Duplicate</button>
    <button ui-menu-item disabled>Archive</button>
    <div class="ui-menu__separator" role="separator"></div>
    <button ui-menu-item danger (triggered)="remove()">Delete</button>
  </ui-menu>
</ng-template>`,
    react: `<Menu
  label="Actions"
  items={[
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive', disabled: true },
    { id: 'delete', label: 'Delete', danger: true },
  ]}
  onAction={(id) => run(id)}
/>`,
    vue: `<Menu
  label="Actions"
  :items="[
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive', disabled: true },
    { id: 'delete', label: 'Delete', danger: true },
  ]"
  @action="(id) => run(id)"
/>`,
    html: `<!-- See "Use it" -->`,
  };

  protected readonly arabic = {
    angular: `<button ui-button variant="secondary" [uiMenuTrigger]="menu">إجراءات</button>
<ng-template #menu>
  <ui-menu>
    <button ui-menu-item>تعديل</button>
    <button ui-menu-item danger>حذف</button>
  </ui-menu>
</ng-template>`,
    react: `<Menu label="إجراءات" items={[{ id: 'edit', label: 'تعديل' }]} onAction={run} />`,
    vue: `<Menu label="إجراءات" :items="[{ id: 'edit', label: 'تعديل' }]" @action="run" />`,
    html: `<!-- dir="rtl" on the page; the markup is the same -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'The same actions on right-click or a long press',
      use: 'Context menu',
      path: '/components/context-menu',
    },
    {
      need: 'Pick a value that a form sends',
      use: 'Select',
      path: '/components/select',
    },
    {
      need: 'Links that go to other pages',
      use: 'Navigation',
      path: '/components/nav',
    },
    {
      need: 'Two or three actions that fit on screen',
      use: 'Button group',
      path: '/components/button-group',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: '[uiMenuTrigger]',
        type: 'TemplateRef',
        description: 'On the button; the template holding the ui-menu.',
      },
      {
        name: 'ui-menu',
        type: 'component',
        description: 'The list, inside that template.',
      },
      {
        name: 'button[ui-menu-item]',
        type: 'component',
        description: 'One action.',
      },
      {
        name: '(triggered)',
        type: 'void',
        description: 'The action was chosen by click, Enter or Space.',
      },
      {
        name: 'danger',
        type: 'boolean',
        default: 'false',
        description: 'Red text, for an action that destroys something.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Shown, but cannot be chosen.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'ReactNode',
        description: "Required. The button's content.",
      },
      {
        name: 'aria-label',
        type: 'string',
        description: "The button's name, when its content is an icon.",
      },
      {
        name: 'items',
        type: 'MenuAction[]',
        description: 'Required. { id, label, danger?, disabled? }.',
      },
      {
        name: 'onAction',
        type: '(id: string) => void',
        description: "Required. Called with the chosen action's id.",
      },
      {
        name: 'variant',
        type: 'ButtonVariant',
        default: "'secondary'",
        description: "The button's look.",
      },
    ],
    vue: [
      {
        name: '#label',
        type: 'slot',
        description: "Required. The button's content.",
      },
      {
        name: 'aria-label',
        type: 'string',
        description: "The button's name, when its content is an icon.",
      },
      {
        name: 'items',
        type: 'MenuAction[]',
        description: 'Required. { id, label, danger?, disabled? }.',
      },
      {
        name: '@action',
        type: 'event',
        description: "Required. Called with the chosen action's id.",
      },
      {
        name: 'variant',
        type: 'ButtonVariant',
        default: "'secondary'",
        description: "The button's look.",
      },
    ],
    html: [
      {
        name: 'ui-menu',
        type: 'class',
        description: 'On the element with role="menu".',
      },
      {
        name: 'ui-menu__item',
        type: 'class',
        description: 'On each role="menuitem".',
      },
      {
        name: 'ui-menu__item--danger',
        type: 'class',
        description: 'Red text, for a destructive action.',
      },
      {
        name: 'ui-menu__separator',
        type: 'class',
        description: 'A line between groups, with role="separator".',
      },
    ],
  };
}
