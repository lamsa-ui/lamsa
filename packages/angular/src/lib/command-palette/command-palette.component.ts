import type { DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { DialogComponent, UiDialog } from '../dialog/dialog';
import { UI_LABELS } from '../labels';

export interface Command {
  id: string;
  label: string;
  /** Other words that find it: ['invoice', 'bill'] for "New order". */
  keywords?: string[];
  /** A key combination shown at the end, such as "Ctrl N". Shown only; bind it yourself. */
  shortcut?: string;
}

let nextId = 0;

/**
 * A search over the app's actions, in a dialog: Ctrl+K or ⌘K opens it (set `shortcut` to
 * null to turn that off). Typing filters, arrow keys move, Enter runs. The dialog closes
 * and focus goes back where it was before `run` fires, so the command can move focus on.
 *
 * ```html
 * <ui-command-palette [commands]="commands" [(open)]="open" (run)="go($event)" />
 * ```
 */
@Component({
  selector: 'ui-command-palette',
  imports: [DialogComponent],
  host: { '(document:keydown)': 'shortcutKey($event)' },
  template: `
    <ng-template #palette>
      <ui-dialog [title]="titleText()" [closeLabel]="closeLabelText()">
        <div class="ui-command">
          <input
            class="ui-input"
            type="text"
            role="combobox"
            autocomplete="off"
            aria-autocomplete="list"
            aria-expanded="true"
            [attr.aria-label]="titleText()"
            [attr.aria-controls]="id + '-list'"
            [attr.aria-activedescendant]="activeId()"
            [placeholder]="placeholderText()"
            [value]="query()"
            (input)="type($event)"
            (keydown)="keydown($event)"
          />
          @if (matches().length) {
            <ul
              class="ui-command__list"
              role="listbox"
              [id]="id + '-list'"
              [attr.aria-label]="titleText()"
            >
              @for (command of matches(); track command.id; let i = $index) {
                <!-- Keyboard use goes through the field (aria-activedescendant); the click is for the pointer. -->
                <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
                <li
                  class="ui-option"
                  role="option"
                  [id]="id + '-' + i"
                  [class.ui-option--active]="i === active()"
                  [attr.aria-selected]="i === active()"
                  (mousedown)="$event.preventDefault()"
                  (click)="runAt(i)"
                  (mousemove)="active.set(i)"
                >
                  {{ command.label }}
                  @if (command.shortcut) {
                    <kbd class="ui-command__shortcut">{{
                      command.shortcut
                    }}</kbd>
                  }
                </li>
              }
            </ul>
          } @else {
            <p class="ui-command__empty" [id]="id + '-list'">
              {{ emptyLabelText() }}
            </p>
          }
          <span class="ui-visually-hidden" role="status">{{
            countLabelText()(matches().length)
          }}</span>
        </div>
      </ui-dialog>
    </ng-template>
  `,
})
export class CommandPaletteComponent {
  private readonly uiLabels = inject(UI_LABELS);
  readonly commands = input.required<Command[]>();
  readonly open = model(false);
  /** The letter that opens it with Ctrl or ⌘. null: no shortcut. */
  readonly shortcut = input<string | null>('k');
  readonly title = input<string>();
  protected readonly titleText = computed(
    () => this.title() ?? this.uiLabels().commands,
  );
  readonly placeholder = input<string>();
  protected readonly placeholderText = computed(
    () => this.placeholder() ?? this.uiLabels().typeCommand,
  );
  readonly emptyLabel = input<string>();
  protected readonly emptyLabelText = computed(
    () => this.emptyLabel() ?? this.uiLabels().noCommands,
  );
  readonly closeLabel = input<string>();
  protected readonly closeLabelText = computed(
    () => this.closeLabel() ?? this.uiLabels().close,
  );
  /** Announced as you type. Translate it. */
  readonly countLabel = input<(count: number) => string>();
  protected readonly countLabelText = computed(
    () => this.countLabel() ?? this.uiLabels().commandCount,
  );
  readonly run = output<Command>();

  protected readonly id = `ui-command-${nextId++}`;
  protected readonly query = signal('');
  protected readonly active = signal(0);
  protected readonly matches = computed(() => {
    const words = this.query().trim().toLocaleLowerCase().split(/\s+/);
    return this.commands().filter((command) => {
      const text = [command.label, ...(command.keywords ?? [])]
        .join(' ')
        .toLocaleLowerCase();
      return words.every((word) => text.includes(word));
    });
  });
  protected readonly activeId = computed(() =>
    this.matches().length ? `${this.id}-${this.active()}` : null,
  );

  private readonly dialog = inject(UiDialog);
  private readonly palette =
    viewChild.required<TemplateRef<unknown>>('palette');
  private ref: DialogRef | null = null;

  constructor() {
    effect(() => {
      const open = this.open();
      untracked(() => (open ? this.show() : this.ref?.close()));
    });
  }

  protected shortcutKey(event: KeyboardEvent): void {
    const key = this.shortcut();
    if (key && (event.ctrlKey || event.metaKey) && event.key === key) {
      event.preventDefault();
      this.open.set(true);
    }
  }

  protected type(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
  }

  protected keydown(event: KeyboardEvent): void {
    const count = this.matches().length;
    if (!count) return;
    const moves: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
    if (event.key in moves) {
      event.preventDefault();
      this.active.set((this.active() + moves[event.key] + count) % count);
      document.getElementById(`${this.id}-${this.active()}`)?.scrollIntoView({
        block: 'nearest',
      });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.runAt(this.active());
    }
  }

  protected runAt(index: number): void {
    const command = this.matches()[index];
    if (!command) return;
    this.ref?.closed.subscribe(() => this.run.emit(command));
    this.ref?.close();
  }

  private show(): void {
    if (this.ref) return;
    this.query.set('');
    this.active.set(0);
    this.ref = this.dialog.open(this.palette(), {
      initialFocus: '[role="combobox"]',
    });
    this.ref.closed.subscribe(() => {
      this.ref = null;
      this.open.set(false);
    });
  }
}
