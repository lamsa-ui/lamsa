import { Component, signal } from '@angular/core';
import { TreeComponent, type TreeNode } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-tree-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    TreeComponent,
  ],
  template: `
    <app-page
      title="Tree"
      lead="Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead."
      [usage]="usage"
    >
      <app-example
        title="Menu categories"
        description="The selected item is bold as well as highlighted, so it never depends on colour."
        [code]="basic"
      >
        <div class="grid w-full max-w-sm gap-3">
          <ui-tree
            label="Menu"
            [nodes]="menu"
            [expanded]="['mains']"
            [(selected)]="selected"
          />
          <p class="doc-flat text-text-muted" role="status">
            Selected: {{ selected() ?? 'nothing yet' }}
          </p>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-tree
          class="w-full max-w-sm"
          label="القائمة"
          [nodes]="menuArabic"
          [expanded]="['mains']"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class TreePageComponent {
  protected readonly selected = signal<string | null>('pasta');
  protected readonly menu: TreeNode[] = [
    {
      id: 'mains',
      label: 'Mains',
      children: [
        {
          id: 'grill',
          label: 'Grill',
          children: [
            { id: 'kofta', label: 'Kofta' },
            { id: 'chicken', label: 'Chicken' },
          ],
        },
        { id: 'pasta', label: 'Pasta' },
      ],
    },
    {
      id: 'drinks',
      label: 'Drinks',
      children: [
        { id: 'tea', label: 'Tea' },
        { id: 'juice', label: 'Juice' },
      ],
    },
    { id: 'desserts', label: 'Desserts' },
  ];
  protected readonly menuArabic: TreeNode[] = [
    {
      id: 'mains',
      label: 'الأطباق الرئيسية',
      children: [
        { id: 'grill', label: 'مشويات' },
        { id: 'pasta', label: 'مكرونة' },
      ],
    },
    { id: 'drinks', label: 'مشروبات', children: [{ id: 'tea', label: 'شاي' }] },
  ];

  protected readonly usage = {
    angular: `import { TreeComponent, type TreeNode } from '@ghazal-ui/angular';
// On the Angular CDK tree.`,
    react: `import { Tree, type TreeNode } from '@ghazal-ui/react';
// On the React Aria tree.`,
    vue: `import { Tree, type TreeNode } from '@ghazal-ui/vue';
// On the React Aria tree.`,
    html: `<!-- Keys, focus and opening need script: use the Angular or React component.
     The classes are ui-tree, ui-tree__item, ui-tree__chevron and --ui-tree-level. -->`,
  };

  protected readonly basic = {
    angular: `<ui-tree label="Menu" [nodes]="menu" [expanded]="['mains']" [(selected)]="selected" />

menu: TreeNode[] = [
  { id: 'mains', label: 'Mains', children: [
    { id: 'grill', label: 'Grill', children: [{ id: 'kofta', label: 'Kofta' }] },
    { id: 'pasta', label: 'Pasta' },
  ] },
  { id: 'desserts', label: 'Desserts' },
];`,
    react: `<Tree
  label="Menu"
  nodes={menu}
  defaultExpanded={['mains']}
  selected={selected}
  onSelectedChange={setSelected}
/>`,
    vue: `<Tree
  v-model:selected="selected"
  label="Menu"
  :nodes="menu"
  :defaultExpanded="['mains']"
/>`,
    html: `<!-- Use the Angular or React component. -->`,
  };

  protected readonly arabic = {
    angular: `<ui-tree label="القائمة" [nodes]="menu" [expanded]="['mains']" />`,
    react: `<Tree label="القائمة" nodes={menu} defaultExpanded={['mains']} />`,
    vue: `<Tree label="القائمة" :nodes="menu" :defaultExpanded="['mains']" />`,
    html: `<!-- dir="rtl" on the page: levels indent from the right and the chevrons flip -->`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Required. Names the tree: "Menu", "Files".',
    },
    {
      name: 'nodes',
      type: 'TreeNode[]',
      description:
        'Required. { id, label, children? }, nested as deep as needed.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A flat list with columns',
      use: 'Data table',
      path: '/components/data-table',
    },
    {
      need: 'Sections that open and close',
      use: 'Accordion',
      path: '/components/accordion',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: 'expanded',
        type: 'string[]',
        default: '[]',
        description: 'Ids of the branches open at the start.',
      },
      {
        name: '[(selected)]',
        type: 'string | null',
        default: 'null',
        description: 'Id of the selected item.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'defaultExpanded',
        type: 'string[]',
        description: 'Ids of the branches open at the start.',
      },
      {
        name: 'selected | onSelectedChange',
        type: 'string | (id) => void',
        description: 'Id of the selected item, and the change.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'defaultExpanded',
        type: 'string[]',
        description: 'Ids of the branches open at first.',
      },
      {
        name: 'v-model:selected',
        type: 'string',
        description: "The selected node's id.",
      },
    ],
    html: [
      {
        name: 'ui-tree | ui-tree__item',
        type: 'class',
        description:
          'The tree and each row. Set --ui-tree-level on a row to indent it.',
      },
      {
        name: 'ui-tree__item--selected | --expanded',
        type: 'class',
        description: 'Selected row; open branch (turns its chevron).',
      },
    ],
  };
}
