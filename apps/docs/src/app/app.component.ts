import { NgTemplateOutlet } from '@angular/common';
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
} from '@lamsa-ui/angular';
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
        <span class="doc-brand__name">Lamsa</span>
        <span class="doc-brand__ar" lang="ar" dir="rtl">لمسة</span>
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
        <kbd class="doc-search-trigger__shortcut" aria-hidden="true"
          >Ctrl K</kbd
        >
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
      @switch (id) {
        @case ('angular') {
          <svg viewBox="0 0 24 24" width="18" height="18">
            <defs>
              <linearGradient
                [attr.id]="'doc-angular-' + where"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0" stop-color="#e40035" />
                <stop offset="0.24" stop-color="#f60a48" />
                <stop offset="0.49" stop-color="#dc087d" />
                <stop offset="0.74" stop-color="#9717e7" />
                <stop offset="1" stop-color="#6c00f5" />
              </linearGradient>
            </defs>
            <path
              [attr.fill]="'url(#doc-angular-' + where + ')'"
              d="M16.712 17.711H7.288l-1.204 2.916L12 24l5.916-3.373-1.204-2.916ZM14.692 0l7.832 16.855.814-12.856L14.692 0ZM9.308 0 .662 3.999l.814 12.856L9.308 0Zm-.405 13.93h6.198L12 6.396 8.903 13.93Z"
            />
          </svg>
        }
        @case ('react') {
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#58c4dc"
              d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
            />
          </svg>
        }
        @case ('vue') {
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#42b883" d="M2 4h5l5 8 5-8h5L12 21 2 4Z" />
            <path fill="#35495e" d="M7 4h5l5 8-2.5 4L7 4Z" />
          </svg>
        }
        @case ('html') {
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#e34f26"
              d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"
            />
          </svg>
          <svg
            class="doc-segment__second"
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
            <path
              fill="#1572b6"
              d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"
            />
          </svg>
        }
      }
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

  constructor() {
    // A link chosen in the drawer closes it.
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.isHome.set(e.urlAfterRedirects.split(/[?#]/)[0] === '/');
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
