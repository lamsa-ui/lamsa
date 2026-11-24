import { NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { FrameworkIconComponent } from './shared/framework-icon.component';
import { DialogRef } from '@angular/cdk/dialog';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  ButtonComponent,
  CommandPaletteComponent,
  DialogComponent,
  IconComponent,
  UiDialog,
  type IconName,
  type Command,
} from '@ghazal-ui/angular';
import { filter } from 'rxjs';
import {
  DocsSettings,
  FRAMEWORKS,
  THEMES,
  type Framework,
  type Theme,
} from './shared/docs-settings';
import { NAV } from './shared/nav';

@Component({
  selector: 'app-root',
  imports: [
    IconComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    ButtonComponent,
    CommandPaletteComponent,
    DialogComponent,
    FrameworkIconComponent,
  ],
  template: `
    <a class="doc-skip" href="#main">Skip to content</a>
    <header class="doc-header">
      <button
        ui-button
        variant="ghost"
        type="button"
        class="doc-header__button doc-menu-button"
        aria-haspopup="dialog"
        (click)="openNav()"
      >
        <ui-icon name="menu" size="22px" />
        <span class="ui-visually-hidden">Menu</span>
      </button>
      <a class="doc-brand" routerLink="/">
        <img class="doc-mark" src="mark.svg" alt="" />
        <span class="doc-brand__name">Ghazal</span>
        <span class="doc-brand__ar" lang="ar" dir="rtl">غزال</span>
      </a>
      <button
        ui-button
        variant="secondary"
        type="button"
        class="doc-search-trigger"
        aria-haspopup="dialog"
        (click)="searchOpen.set(true)"
      >
        <ui-icon name="search" size="18px" />
        <span class="doc-search-trigger__label">Search pages</span>
        @if (!onPalettePage()) {
          <kbd class="doc-search-trigger__shortcut" aria-hidden="true"
            >Ctrl K</kbd
          >
        }
      </button>
      <div class="doc-settings">
        <ng-container
          *ngTemplateOutlet="pickers; context: { $implicit: 'header' }"
        />
      </div>
      <!-- Small screens: one chip that shows the current choices and opens them in a sheet. -->
      <button
        ui-button
        variant="secondary"
        type="button"
        class="doc-header__button doc-settings-button"
        aria-haspopup="dialog"
        (click)="openSettings()"
      >
        <span class="doc-settings-button__icon" aria-hidden="true">
          <ng-container
            *ngTemplateOutlet="
              frameworkIcon;
              context: { $implicit: settings.framework(), where: 'chip' }
            "
          />
        </span>
        <span class="doc-settings-button__divider" aria-hidden="true"></span>
        <span class="doc-settings-button__icon" aria-hidden="true">
          <ng-container
            *ngTemplateOutlet="
              themeIcon;
              context: { $implicit: settings.theme() }
            "
          />
        </span>
        <span class="ui-visually-hidden"
          >Settings: {{ frameworkLabel() }} code, {{ themeLabel() }} theme</span
        >
      </button>
    </header>
    <!-- The home page is one full-width hero; every other page has the side bar. -->
    <div class="doc-layout" [class.doc-layout--home]="isHome()">
      @if (!isHome()) {
        <nav #sideNav class="doc-nav doc-nav--side" aria-label="Docs">
          <ng-container *ngTemplateOutlet="navLinks" />
        </nav>
      }
      <main class="doc-main" id="main" tabindex="-1">
        <router-outlet />
      </main>
    </div>
    <ui-command-palette
      [commands]="pageCommands"
      [(open)]="searchOpen"
      [shortcut]="onPalettePage() ? null : 'k'"
      title="Search pages"
      placeholder="Search components and pages..."
      emptyLabel="No pages match your search."
      [countLabel]="pageCountLabel"
      (run)="navigateToPage($event.id)"
    />

    <ng-template #navLinks>
      @for (group of nav; track group.title) {
        <h2 class="ui-label doc-nav__title" [attr.data-chapter]="group.title">
          {{ group.title }}
        </h2>
        <ul>
          @for (link of group.links; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                routerLinkActive
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
                >{{ link.label }}</a
              >
            </li>
          }
        </ul>
      }
    </ng-template>

    <!-- The side bar on small screens: the kit's own drawer, from the inline start. -->
    <ng-template #navDrawer>
      <ui-dialog
        title="Contents"
        variant="drawer"
        class="doc-nav-drawer"
        closeLabel="Close menu"
      >
        <nav class="doc-nav" aria-label="Docs">
          <ng-container *ngTemplateOutlet="navLinks" />
        </nav>
      </ui-dialog>
    </ng-template>

    <ng-template #settingsSheet>
      <ui-dialog
        title="Settings"
        description="Saved in this browser."
        variant="sheet"
        size="sm"
        class="doc-settings-sheet"
      >
        <ng-container
          *ngTemplateOutlet="pickers; context: { $implicit: 'sheet' }"
        />
      </ui-dialog>
    </ng-template>

    <!-- Framework and theme pickers: native radios under a segmented control.
         'where' keeps radio names and gradient ids unique to each copy. -->
    <ng-template #pickers let-where>
      <fieldset class="doc-picker">
        <legend
          class="ui-label doc-picker__legend"
          [class.ui-visually-hidden]="where === 'header'"
        >
          Framework for the code
        </legend>
        <div class="doc-segmented doc-segmented--framework">
          @for (f of frameworks; track f.id) {
            <label class="doc-segment" [attr.data-framework]="f.id">
              <input
                class="ui-visually-hidden"
                type="radio"
                [name]="'framework-' + where"
                [value]="f.id"
                [checked]="settings.framework() === f.id"
                (change)="setFramework(f.id)"
              />
              <span class="doc-segment__icon" aria-hidden="true">
                <ng-container
                  *ngTemplateOutlet="
                    frameworkIcon;
                    context: { $implicit: f.id, where: where }
                  "
                />
              </span>
              <span class="doc-segment__label">{{ f.label }}</span>
            </label>
          }
        </div>
      </fieldset>
      <fieldset class="doc-picker">
        <legend
          class="ui-label doc-picker__legend"
          [class.ui-visually-hidden]="where === 'header'"
        >
          Theme
        </legend>
        <div class="doc-segmented doc-segmented--theme">
          @for (t of themes; track t.id) {
            <label class="doc-segment">
              <input
                class="ui-visually-hidden"
                type="radio"
                [name]="'theme-' + where"
                [value]="t.id"
                [checked]="settings.theme() === t.id"
                (change)="setTheme(t.id)"
              />
              <span class="doc-segment__icon" aria-hidden="true">
                <ng-container
                  *ngTemplateOutlet="themeIcon; context: { $implicit: t.id }"
                />
              </span>
              <span class="doc-segment__label">{{ t.label }}</span>
            </label>
          }
        </div>
      </fieldset>
    </ng-template>

    <ng-template #frameworkIcon let-id let-where="where">
      <app-framework-icon [id]="id" [where]="where" />
    </ng-template>

    <ng-template #themeIcon let-id>
      <ui-icon [name]="themeIcons[id]" size="18px" />
    </ng-template>
  `,
})
export class AppComponent {
  protected readonly themeIcons: Record<string, IconName> = {
    system: 'monitor',
    light: 'sun',
    dark: 'moon',
  };
  protected readonly settings = inject(DocsSettings);
  protected readonly frameworks = FRAMEWORKS;
  protected readonly themes = THEMES;
  protected readonly frameworkLabel = computed(
    () => FRAMEWORKS.find((f) => f.id === this.settings.framework())?.label,
  );
  protected readonly themeLabel = computed(
    () => THEMES.find((t) => t.id === this.settings.theme())?.label,
  );
  private readonly dialog = inject(UiDialog);
  private readonly navDrawer =
    viewChild.required<TemplateRef<unknown>>('navDrawer');
  private readonly settingsSheet =
    viewChild.required<TemplateRef<unknown>>('settingsSheet');
  private navRef?: DialogRef;

  protected readonly nav = NAV;
  protected readonly searchOpen = signal(false);
  protected readonly pageCommands: Command[] = [
    { id: '/', label: 'Home', keywords: ['start', 'homepage', 'demo'] },
    ...NAV.flatMap((group) =>
      group.links.map((link) => ({
        id: link.path,
        label: link.label,
        keywords: [group.title, link.path.replace(/[/-]/g, ' '), 'demo'],
      })),
    ),
  ];
  protected readonly pageCountLabel = (count: number) =>
    count === 1 ? '1 page' : `${count} pages`;

  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly sideNav = viewChild<ElementRef<HTMLElement>>('sideNav');
  protected readonly isHome = signal(false);
  /** The command palette page has its own Ctrl+K demo, so the site search gives the key up there. */
  protected readonly onPalettePage = signal(false);

  constructor() {
    // Angular's anchor jump ignores CSS scroll-padding, so land headings below the sticky header.
    inject(ViewportScroller).setOffset(() => [
      0,
      (document.querySelector('.doc-header')?.getBoundingClientRect().height ??
        0) + 16,
    ]);
    // A link chosen in the drawer closes it.
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        const path = e.urlAfterRedirects.split(/[?#]/)[0];
        this.isHome.set(path === '/');
        this.onPalettePage.set(path === '/components/command-palette');
        this.navRef?.close();
        afterNextRender(() => this.scrollActiveLinkIntoView(), {
          injector: this.injector,
        });
      });
    afterNextRender(() => this.scrollActiveLinkIntoView(), {
      injector: this.injector,
    });
  }

  private scrollActiveLinkIntoView(): void {
    const nav = this.sideNav()?.nativeElement;
    if (!nav?.clientHeight) return;

    // Matched by href: aria-current lands a microtask after render, so it is
    // still missing on first load and when the side bar was just created.
    const path = this.router.url.split(/[?#]/)[0];
    const link = nav.querySelector<HTMLElement>(`a[href$="${path}"]`);
    if (!link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const visibleTop = navRect.top + nav.clientTop;
    const visibleBottom = visibleTop + nav.clientHeight;

    // Already in view (you just clicked it): leave the list still.
    if (linkRect.top >= visibleTop && linkRect.bottom <= visibleBottom) return;

    // Otherwise bring it to the middle, so the links around it show too.
    nav.scrollTop +=
      linkRect.top - visibleTop - (nav.clientHeight - linkRect.height) / 2;
  }

  protected openNav(): void {
    // Start on the current page's link, scrolled into view. Matched by href, which is
    // set on render (aria-current comes a tick later); off the list, the heading.
    const path = this.router.url.split(/[?#]/)[0];
    const listed = this.nav.some((g) => g.links.some((l) => l.path === path));
    this.navRef = this.dialog.open(this.navDrawer(), {
      initialFocus: listed ? `.doc-nav a[href$="${path}"]` : undefined,
    });
  }

  protected openSettings(): void {
    this.dialog.open(this.settingsSheet(), {
      initialFocus: 'input:checked',
    });
  }

  protected navigateToPage(path: string): void {
    void this.router.navigateByUrl(path);
  }

  protected setFramework(id: Framework): void {
    this.settings.framework.set(id);
  }

  protected setTheme(id: Theme): void {
    this.settings.theme.set(id);
  }
}
