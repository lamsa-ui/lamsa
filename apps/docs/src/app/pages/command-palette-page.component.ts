import { Component, signal } from '@angular/core';
import {
  ButtonComponent,
  CommandPaletteComponent,
  type Command,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-command-palette-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    CommandPaletteComponent,
    ButtonComponent,
  ],
  template: `
    <app-page
      title="Command palette"
      lead="A search over the app's actions, in a dialog. Ctrl+K or ⌘K opens it from anywhere; typing filters, the arrow keys move and Enter runs. Screen readers hear how many commands match as you type. Keep a visible button for it too: a shortcut nobody knows about is no way in."
      [usage]="usage"
    >
      <app-example
        title="Commands"
        description="Press Ctrl+K (⌘K on a Mac) on this page, or the button. Try typing invoice: keywords find New order."
        [code]="basic"
      >
        <div class="grid gap-3">
          <button
            ui-button
            variant="secondary"
            type="button"
            class="w-fit"
            (click)="open.set(true)"
          >
            Commands
            <kbd class="ui-command__shortcut" aria-hidden="true">Ctrl K</kbd>
          </button>
          <p class="doc-flat" role="status">
            @if (ran()) {
              Last command: {{ ran() }}
            }
          </p>
        </div>
        <ui-command-palette
          [commands]="commands"
          [(open)]="open"
          (run)="ran.set($event.label)"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class CommandPalettePageComponent {
  protected readonly open = signal(false);
  protected readonly ran = signal('');
  protected readonly commands: Command[] = [
    {
      id: 'new',
      label: 'New order',
      keywords: ['invoice', 'bill'],
      shortcut: 'Ctrl N',
    },
    { id: 'find', label: 'Find a customer', keywords: ['search', 'client'] },
    { id: 'menu', label: 'Edit the menu', keywords: ['dishes', 'prices'] },
    { id: 'report', label: "Today's report", keywords: ['sales', 'totals'] },
    { id: 'theme', label: 'Switch to dark mode', keywords: ['theme'] },
    { id: 'out', label: 'Sign out', keywords: ['log out', 'exit'] },
  ];

  protected readonly usage = {
    angular: `import { CommandPaletteComponent, type Command } from '@lamsa-ui/angular';
// Built on the kit's dialog. Add @angular/cdk/overlay-prebuilt.css.`,
    react: `import { CommandPalette, type Command } from '@lamsa-ui/react';`,
    vue: `import { CommandPalette, type Command } from '@lamsa-ui/vue';`,
    html: `<!-- Filtering, keys and focus need script: use the Angular or React component.
     The classes are ui-command, ui-command__list, ui-option and ui-command__shortcut. -->`,
  };

  protected readonly basic = {
    angular: `<button ui-button variant="secondary" (click)="open.set(true)">Commands</button>
<ui-command-palette [commands]="commands" [(open)]="open" (run)="go($event)" />

commands: Command[] = [
  { id: 'new', label: 'New order', keywords: ['invoice', 'bill'], shortcut: 'Ctrl N' },
  { id: 'find', label: 'Find a customer', keywords: ['search', 'client'] },
  { id: 'out', label: 'Sign out' },
];`,
    react: `<Button variant="secondary" onClick={() => setOpen(true)}>Commands</Button>
<CommandPalette commands={commands} open={open} onOpenChange={setOpen} onRun={go} />`,
    vue: `<Button variant="secondary" @click="open = true">Commands</Button>
<CommandPalette v-model:open="open" :commands="commands" @run="go" />`,
    html: `<!-- Use the Angular or React component. -->`,
  };

  private readonly shared = [
    {
      name: 'commands',
      type: 'Command[]',
      description:
        'Required. { id, label, keywords?, shortcut? }. Keywords find a command by other words; shortcut is only shown.',
    },
    {
      name: 'shortcut',
      type: 'string | null',
      default: "'k'",
      description:
        'The letter that opens it with Ctrl or ⌘. null turns it off.',
    },
    {
      name: 'title | placeholder',
      type: 'string',
      default: "'Commands'",
      description: 'Names the dialog and the field; text in the empty field.',
    },
    {
      name: 'emptyLabel | closeLabel',
      type: 'string',
      description:
        'Shown when nothing matches; the close button. Translate them.',
    },
    {
      name: 'countLabel',
      type: '(count: number) => string',
      default: '`${n} commands`',
      description: 'Announced as you type. Translate it.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Pick a value inside a form',
      use: 'Combobox',
      path: '/components/combobox',
    },
    {
      need: 'Search the items of one list',
      use: 'Search field',
      path: '/components/search-field',
    },
    {
      need: 'A few actions on one thing',
      use: 'Menu',
      path: '/components/menu',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: '[(open)]',
        type: 'boolean',
        default: 'false',
        description: 'Open or closed; Ctrl+K and Escape change it.',
      },
      {
        name: '(run)',
        type: 'Command',
        description:
          'The command to run, after the dialog has closed and focus is back.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'open | onOpenChange',
        type: 'boolean | (open) => void',
        description: 'Open or closed; Ctrl+K and Escape call onOpenChange.',
      },
      {
        name: 'onRun',
        type: '(command: Command) => void',
        description:
          'The command to run, after the dialog has closed and focus is back.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model:open',
        type: 'boolean',
        description:
          'Required. Set to false by Escape, the backdrop or a run command.',
      },
      {
        name: '@run',
        type: 'event',
        description: 'Gets the chosen command, after the palette has closed.',
      },
    ],
    html: [
      {
        name: 'ui-command',
        type: 'class',
        description: 'The field and list inside a .ui-dialog.',
      },
      {
        name: 'ui-command__list | __empty | __shortcut',
        type: 'class',
        description:
          'The list of .ui-option items, the no-match text, a key hint.',
      },
    ],
  };
}
