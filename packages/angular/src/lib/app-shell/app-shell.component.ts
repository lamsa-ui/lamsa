import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { UI_LABELS } from '../labels';

let nextId = 0;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The frame of an app: a header across the top, the main links in a side bar, the page beside
 * them. Below 64rem of its own width the side bar folds behind a menu button in the header and
 * opens over the page; Escape, the shade or following a link closes it again. Put the brand in
 * `[uiShellBrand]`, header actions in `[uiShellActions]` and the links (a `ui-nav`) in
 * `[uiShellSidebar]`; everything else is the page.
 *
 * ```html
 * <ui-app-shell>
 *   <a uiShellBrand class="ui-shell__brand" routerLink="/">Lamsa</a>
 *   <ui-language-switcher uiShellActions … />
 *   <ui-nav uiShellSidebar label="Main">…</ui-nav>
 *   <router-outlet />
 * </ui-app-shell>
 * ```
 */
@Component({
  selector: 'ui-app-shell',
  imports: [IconComponent],
  host: {
    class: 'ui-shell',
    '[class.ui-shell--open]': 'open()',
    '(keydown.escape)': 'close(true)',
    '(click)': 'clicked($event)',
  },
  template: `
    <div class="ui-shell__header" [attr.role]="landmarks() ? 'banner' : null">
      <button
        #menu
        type="button"
        class="ui-button ui-button--ghost ui-button--icon ui-shell__menu"
        [attr.aria-label]="menuLabelText()"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="id"
        (click)="open() ? close(false) : show()"
      >
        <ui-icon [name]="open() ? 'x' : 'menu'" />
      </button>
      <ng-content select="[uiShellBrand]" />
      <ng-content select="[uiShellActions]" />
    </div>
    <div class="ui-shell__body">
      @if (open()) {
        <div class="ui-shell__scrim" aria-hidden="true"></div>
      }
      <div #sidebar class="ui-shell__sidebar" [id]="id">
        <ng-content select="[uiShellSidebar]" />
      </div>
      <div
        class="ui-shell__main"
        tabindex="-1"
        [id]="mainId()"
        [attr.role]="landmarks() ? 'main' : null"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class AppShellComponent {
  private readonly uiLabels = inject(UI_LABELS);
  /** Names the menu button that opens the side bar on a narrow screen. */
  readonly menuLabel = input<string>();
  protected readonly menuLabelText = computed(
    () => this.menuLabel() ?? this.uiLabels().menu,
  );
  /** The id of the page area, for a "Skip to content" link. */
  readonly mainId = input('main');
  /**
   * Makes the header the banner and the page the main landmark. Turn it off when the shell
   * sits inside a page that already has them, as in a preview.
   */
  readonly landmarks = input(true, { transform: booleanAttribute });

  protected readonly id = `ui-shell-sidebar-${nextId++}`;
  protected readonly open = signal(false);
  private readonly menu =
    viewChild.required<ElementRef<HTMLButtonElement>>('menu');
  private readonly sidebar =
    viewChild.required<ElementRef<HTMLElement>>('sidebar');
  private readonly injector = inject(Injector);

  show(): void {
    this.open.set(true);
    afterNextRender(
      () =>
        this.sidebar()
          .nativeElement.querySelector<HTMLElement>(FOCUSABLE)
          ?.focus(),
      { injector: this.injector },
    );
  }

  close(returnFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (returnFocus) this.menu().nativeElement.focus();
  }

  /** The shade, or a link in the folded side bar (the page changes), closes it. */
  protected clicked(event: MouseEvent): void {
    const target = event.target as Element;
    if (
      target.classList.contains('ui-shell__scrim') ||
      (target.closest('a[href]') &&
        this.sidebar().nativeElement.contains(target))
    )
      this.close();
  }
}
