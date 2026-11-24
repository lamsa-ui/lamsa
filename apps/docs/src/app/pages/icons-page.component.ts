import {
  Component,
  computed,
  type ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@lamsa-ui/angular';
import { ICONS, ICON_TAGS, type IconName } from '@lamsa-ui/icons';
import { CodeBlockComponent } from '../shared/code-block.component';
import { PageComponent } from '../shared/page.component';

const NAMES = (Object.keys(ICONS) as IconName[]).sort();

const TONES = [
  { label: 'Text', class: '', swatch: 'bg-text' },
  { label: 'Muted', class: 'text-text-muted', swatch: 'bg-text-muted' },
  { label: 'Primary', class: 'text-primary', swatch: 'bg-primary' },
  { label: 'Success', class: 'text-success', swatch: 'bg-success' },
  { label: 'Warning', class: 'text-warning', swatch: 'bg-warning' },
  { label: 'Danger', class: 'text-danger', swatch: 'bg-danger' },
] as const;

const SIZES = [
  { label: '32', px: 32 },
  { label: '48', px: 48 },
  { label: '64', px: 64 },
] as const;

interface Match {
  name: IconName;
  via?: string;
}

function search(query: string, pool: readonly IconName[]): Match[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool.map((name) => ({ name }));
  const found: (Match & { rank: number })[] = [];
  for (const name of pool) {
    if (name === q) found.push({ name, rank: 0 });
    else if (name.startsWith(q)) found.push({ name, rank: 1 });
    else if (name.includes(q)) found.push({ name, rank: 2 });
    else {
      const tags = ICON_TAGS[name];
      const exact = tags.find((tag) => tag === q);
      const near = exact ?? tags.find((tag) => tag.startsWith(q));
      const any = near ?? tags.find((tag) => tag.includes(q));
      if (any) found.push({ name, via: any, rank: exact ? 3 : near ? 4 : 5 });
    }
  }
  return found.sort((a, b) => a.rank - b.rank);
}

@Component({
  selector: 'app-icons-page',
  imports: [
    PageComponent,
    CodeBlockComponent,
    IconComponent,
    ReactiveFormsModule,
  ],
  host: {
    '(document:keydown)': 'focusFinder($event)',
    '(document:click)': 'closeOnOutsideClick($event)',
  },
  template: `
    <app-page
      title="Icons"
      lead="A small set of sharp, adaptable marks. Find one by name or meaning, then shape it to fit."
    >
      <section class="doc-card" aria-label="Icon studio">
        <div class="mb-6 flex items-center justify-between gap-4">
          <p class="ui-label m-0 text-primary">ICON STUDIO</p>
          <span class="text-sm text-text-muted">{{ iconCount }} icons</span>
        </div>

        <div #searchArea class="relative" (focusout)="closeResults($event)">
          <label for="icon-find" class="doc-visually-hidden"
            >Search icons by name or meaning</label
          >
          <div
            class="flex min-h-16 items-center gap-4 rounded-xl border-2 border-border bg-surface px-5 shadow-sm transition-colors focus-within:border-primary"
          >
            <ui-icon name="search" size="lg" class="shrink-0 text-primary" />
            <input
              #finder
              id="icon-find"
              class="min-w-0 flex-1 border-0 bg-transparent py-4 text-xl outline-none"
              type="search"
              autocomplete="off"
              [placeholder]="
                'Search ' + iconCount + ' icons by name or meaning'
              "
              [formControl]="find"
              [attr.aria-controls]="
                searchOpen() && query().trim() ? 'icon-search-results' : null
              "
              (focus)="searchOpen.set(true)"
              (input)="searchOpen.set(true)"
              (keydown.enter)="pickFirst()"
              (keydown.escape)="searchOpen.set(false)"
            />
            <kbd
              class="hidden rounded-sm border border-border px-2 text-sm text-text-muted sm:block"
              aria-hidden="true"
              >/</kbd
            >
          </div>

          @if (query().trim() && searchOpen()) {
            <div
              id="icon-search-results"
              class="absolute inset-x-0 top-full z-10 mt-2 rounded-xl border border-border bg-surface p-3 shadow-lg"
              role="group"
              aria-label="Matching icons"
            >
              @if (searchMatches().length) {
                <p class="ui-label mb-2 mt-1 text-text-muted">
                  {{ matchCount() }}
                  {{ matchCount() === 1 ? 'MATCH' : 'MATCHES' }}
                  @if (matchCount() > searchMatches().length) {
                    <span> · KEEP TYPING TO REFINE</span>
                  }
                </p>
                <div
                  class="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4"
                >
                  @for (match of searchMatches(); track match.name) {
                    <button
                      type="button"
                      class="flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-start hover:bg-highlight focus-visible:focus-ring"
                      [attr.aria-pressed]="match.name === selected()"
                      (click)="selectIcon(match.name)"
                    >
                      <ui-icon
                        [name]="match.name"
                        size="md"
                        class="shrink-0 text-text-muted"
                      />
                      <span class="min-w-0 truncate text-sm" dir="ltr">
                        {{ match.name }}
                      </span>
                    </button>
                  }
                </div>
              } @else {
                <p class="m-2 text-sm text-text-muted">
                  No icon matches “{{ query().trim() }}”.
                </p>
              }
            </div>
          }
        </div>

        <div
          class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]"
        >
          <div
            class="doc-icon-canvas relative grid min-h-[20rem] place-items-center overflow-hidden rounded-xl border border-border sm:min-h-[25rem]"
          >
            <ui-icon
              [name]="selected()"
              [size]="size() + 'px'"
              [class]="tone().class"
              [label]="selected()"
            />
            <span
              class="absolute bottom-4 start-4 rounded-full bg-surface px-4 py-2 text-sm text-text"
              dir="ltr"
              >{{ selected() }}</span
            >
            <span
              class="absolute bottom-4 end-4 rounded-full bg-surface px-4 py-2 text-xs text-text-muted"
              >{{ size() }} px</span
            >
          </div>

          <aside
            class="flex flex-col justify-center gap-6"
            aria-label="Variants"
          >
            <fieldset class="m-0 border-0 p-0">
              <legend class="ui-label mb-2">SIZE</legend>
              <div class="flex gap-2" role="group" aria-label="Icon size">
                @for (option of sizes; track option.px) {
                  <button
                    type="button"
                    class="ui-button ui-button--sm"
                    [class.ui-button--primary]="size() === option.px"
                    [class.ui-button--secondary]="size() !== option.px"
                    [attr.aria-pressed]="size() === option.px"
                    (click)="pickSize.setValue(option.px)"
                  >
                    {{ option.label }} px
                  </button>
                }
              </div>
            </fieldset>

            <fieldset class="m-0 border-0 p-0">
              <legend class="ui-label mb-2">TONE</legend>
              <div class="flex gap-3" role="group" aria-label="Icon tone">
                @for (option of tones; let i = $index; track option.label) {
                  <button
                    type="button"
                    class="grid size-9 cursor-pointer place-items-center rounded-full border border-border aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary"
                    [attr.aria-label]="option.label"
                    [attr.aria-pressed]="option === tone()"
                    (click)="pickTone.setValue(i)"
                  >
                    <span
                      class="size-3 rounded-full"
                      [class]="option.swatch"
                    ></span>
                  </button>
                }
              </div>
            </fieldset>

            <app-code-block [code]="pickedCode()" />
          </aside>
        </div>
      </section>

      <section class="doc-card" aria-labelledby="icon-library-title">
        <div class="mb-5 flex items-baseline justify-between gap-4">
          <h2 id="icon-library-title" class="doc-card__title">Icon library</h2>
          <span class="text-sm text-text-muted">
            {{ listedIcons().length }} icons
          </span>
        </div>
        <ul
          class="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8"
          aria-label="All icons"
        >
          @for (icon of listedIcons(); track icon.name) {
            <li>
              <button
                type="button"
                class="flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface p-3 text-center transition-colors hover:border-primary hover:bg-highlight focus-visible:focus-ring aria-pressed:border-primary aria-pressed:bg-highlight"
                [attr.aria-pressed]="icon.name === selected()"
                (click)="selected.set(icon.name)"
              >
                <ui-icon
                  [name]="icon.name"
                  size="md"
                  [class]="
                    icon.name === selected() ? tone().class : 'text-text-muted'
                  "
                />
                <span class="max-w-full break-all text-xs" dir="ltr">
                  {{ icon.name }}
                </span>
              </button>
            </li>
          }
        </ul>
      </section>
    </app-page>
  `,
})
export class IconsPageComponent {
  protected readonly iconCount = NAMES.length;
  protected readonly sizes = SIZES;
  protected readonly tones = TONES;

  private readonly finder = viewChild<ElementRef<HTMLInputElement>>('finder');
  private readonly searchArea =
    viewChild<ElementRef<HTMLElement>>('searchArea');

  protected readonly find = new FormControl('', { nonNullable: true });
  protected readonly pickSize = new FormControl(64, { nonNullable: true });
  protected readonly pickTone = new FormControl(2, { nonNullable: true });
  protected readonly selected = signal<IconName>('sparkles');
  protected readonly searchOpen = signal(false);

  protected readonly query = toSignal(this.find.valueChanges, {
    initialValue: '',
  });
  protected readonly size = toSignal(this.pickSize.valueChanges, {
    initialValue: this.pickSize.value,
  });
  private readonly toneIndex = toSignal(this.pickTone.valueChanges, {
    initialValue: this.pickTone.value,
  });
  protected readonly tone = computed(() => TONES[this.toneIndex()]);
  protected readonly searchResults = computed(() =>
    search(this.query(), NAMES),
  );
  protected readonly searchMatches = computed(() =>
    this.searchResults().slice(0, 8),
  );
  protected readonly listedIcons = computed(() => this.searchResults());
  protected readonly matchCount = computed(() => this.searchResults().length);

  protected focusFinder(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing =
      target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
    if (event.key !== '/' || typing) return;
    event.preventDefault();
    this.finder()?.nativeElement.focus();
  }

  protected pickFirst(): void {
    const first = this.searchResults()[0];
    if (first) this.selectIcon(first.name);
  }

  protected selectIcon(name: IconName): void {
    this.selected.set(name);
    this.searchOpen.set(false);
    this.finder()?.nativeElement.focus();
  }

  protected closeResults(event: FocusEvent): void {
    const current = event.currentTarget as HTMLElement;
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !current.contains(next))
      this.searchOpen.set(false);
  }

  protected closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target;
    if (
      !(target instanceof Node) ||
      !this.searchArea()?.nativeElement.contains(target)
    ) {
      this.searchOpen.set(false);
    }
  }

  protected readonly pickedCode = computed(() => {
    const name = this.selected();
    const px = this.size();
    const colour = this.tone().class;
    const angular = `<ui-icon name="${name}" [size]="${px}"${colour ? ` class="${colour}"` : ''} />`;
    const react = `<Icon name="${name}" size={${px}}${colour ? ` className="${colour}"` : ''} />`;
    const vue = `<Icon name="${name}" :size="${px}"${colour ? ` class="${colour}"` : ''} />`;
    const html = `<i class="ui-icon ui-icon-${name}${colour ? ` ${colour}` : ''}" style="--ui-icon-size: ${px}px" aria-hidden="true"></i>`;

    return {
      angular,
      react,
      vue,
      html,
    };
  });
}
