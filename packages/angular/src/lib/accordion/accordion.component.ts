import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
} from '@angular/core';

/** Where the chevron sits: after the heading, before it (as in a tree), or not at all. */
export type AccordionIcon = 'end' | 'start' | 'none';

let closings = 0;

/**
 * Closes a details after its closing motion has run, so Safari closes as smoothly as the
 * others (it would hide the content at once). Opening it again meanwhile keeps it open.
 */
function closeDetails(details: HTMLDetailsElement): void {
  if (!details.open || details.hasAttribute('data-closing')) return;
  const run = String(++closings);
  details.setAttribute('data-closing', run);
  const motion = details.getAnimations?.({ subtree: true }) ?? [];
  void Promise.allSettled(motion.map((a) => a.finished)).then(() => {
    if (details.getAttribute('data-closing') !== run) return;
    details.removeAttribute('data-closing');
    details.open = false;
  });
}

/**
 * A stack of sections that open and close, such as questions and answers. Native
 * `<details>`, so it opens with Enter and Space, and find-in-page opens the section that
 * holds the match. Sections grow and shrink both ways. Up and Down move between the
 * headings, Home and End go to the first and last.
 *
 * ```html
 * <ui-accordion single>
 *   <details ui-accordion-item heading="Can I change my order?">…</details>
 *   <details ui-accordion-item heading="Invoices">
 *     <ng-template uiAccordionContent><app-invoices /></ng-template>
 *   </details>
 * </ui-accordion>
 * ```
 */
@Component({
  selector: 'ui-accordion',
  host: { class: 'ui-accordion', '(keydown)': 'keydown($event)' },
  template: `<ng-content />`,
})
export class AccordionComponent {
  /** Keeps one section open at a time: opening one closes the others. */
  readonly single = input(false, { transform: booleanAttribute });
  /** The chevron of every section; one section can set its own. */
  readonly icon = input<AccordionIcon>('end');

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  /** Called by a section that has opened. */
  opened(details: HTMLDetailsElement): void {
    if (!this.single()) return;
    for (const other of this.sections())
      if (other !== details) closeDetails(other);
  }

  protected keydown(event: KeyboardEvent): void {
    const summaries = this.sections().map((d) => d.querySelector('summary'));
    const i = summaries.indexOf(event.target as HTMLElement);
    if (i < 0) return;
    const last = summaries.length - 1;
    const next: number | undefined = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    summaries[next]?.focus();
  }

  private sections(): HTMLDetailsElement[] {
    return Array.from(
      this.host.querySelectorAll<HTMLDetailsElement>(':scope > details'),
    );
  }
}

/**
 * Marks a section's content to be created only when the section opens, such as a list
 * that loads from an API. It goes once the section has closed, and loads again on the
 * next open, unless the section has `keep`.
 *
 * ```html
 * <details ui-accordion-item heading="Invoices" keep>
 *   <ng-template uiAccordionContent><app-invoices /></ng-template>
 * </details>
 * ```
 */
@Directive({ selector: 'ng-template[uiAccordionContent]' })
export class AccordionContentDirective {
  readonly template = inject(TemplateRef);
}

/**
 * One section of an accordion: a native `<details>` with its heading. For a richer
 * heading than text, put an element with `uiAccordionHeading` inside instead.
 */
@Component({
  selector: 'details[ui-accordion-item]',
  imports: [NgTemplateOutlet],
  host: {
    class: 'ui-accordion__item',
    '[class.ui-accordion__item--icon-start]': 'iconAt() === "start"',
    '[class.ui-accordion__item--no-icon]': 'iconAt() === "none"',
    '(toggle)': 'toggled()',
  },
  template: `
    <summary
      [attr.aria-disabled]="disabled() || null"
      (click)="summaryClick($event)"
    >
      <span class="ui-accordion__heading">
        <ng-content select="[uiAccordionHeading]">{{ heading() }}</ng-content>
        @if (description()) {
          <span class="ui-accordion__description">{{ description() }}</span>
        }
      </span>
    </summary>
    <div class="ui-accordion__content">
      <ng-content />
      @if (lazy() && rendered()) {
        <ng-container [ngTemplateOutlet]="lazy()!.template" />
      }
    </div>
  `,
})
export class AccordionItemComponent {
  /** The text of the summary that opens it. */
  readonly heading = input('');
  /** A quieter line under the heading, such as a count or a status. */
  readonly description = input('');
  /** Open or not: a bare `open` attribute, `[open]`, or two-way `[(open)]`. */
  readonly open = input(false, { transform: booleanAttribute });
  /** Seen, focusable and announced, but it does not open or close. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** This section's chevron; by default the accordion's. */
  readonly icon = input<AccordionIcon>();
  /**
   * Keeps lazy content once it has been shown, so opening again finds it as it was.
   * Off, it is created again, and loads again, each time the section opens.
   */
  readonly keep = input(false, { transform: booleanAttribute });
  readonly openChange = output<boolean>();

  private readonly group = inject(AccordionComponent, { optional: true });
  private readonly host: HTMLDetailsElement = inject(ElementRef).nativeElement;
  protected readonly lazy = contentChild(AccordionContentDirective);
  protected readonly iconAt = computed(
    () => this.icon() ?? this.group?.icon() ?? 'end',
  );
  /** Lazy content is in the page: from opening until closed, or for good with keep. */
  protected readonly rendered = signal(false);

  constructor() {
    effect(() => {
      const open = this.open();
      untracked(() => (open ? this.show() : closeDetails(this.host)));
    });
  }

  protected summaryClick(event: MouseEvent): void {
    if (this.disabled()) event.preventDefault();
    else if (this.host.hasAttribute('data-closing')) {
      event.preventDefault();
      this.show();
    } else if (this.host.open) {
      event.preventDefault();
      closeDetails(this.host);
    }
  }

  protected toggled(): void {
    const open = this.host.open;
    if (open) {
      this.rendered.set(true);
      this.group?.opened(this.host);
    } else if (!this.keep()) this.rendered.set(false);
    this.openChange.emit(open);
  }

  private show(): void {
    this.host.removeAttribute('data-closing');
    this.host.open = true;
  }
}
