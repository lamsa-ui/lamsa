import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started.component').then(
        (m) => m.GettingStartedComponent,
      ),
  },
  {
    path: 'integrations/angular',
    loadComponent: () =>
      import('./pages/angular-integrations.component').then(
        (m) => m.AngularIntegrationsPageComponent,
      ),
  },
  {
    path: 'integrations/react',
    loadComponent: () =>
      import('./pages/react-integrations.component').then(
        (m) => m.ReactIntegrationsPageComponent,
      ),
  },
  {
    path: 'integrations/vue',
    loadComponent: () =>
      import('./pages/vue-integrations.component').then(
        (m) => m.VueIntegrationsPageComponent,
      ),
  },
  {
    path: 'foundations/colour',
    loadComponent: () =>
      import('./pages/colour.component').then((m) => m.ColourComponent),
  },
  {
    path: 'foundations/typography',
    loadComponent: () =>
      import('./pages/typography.component').then((m) => m.TypographyComponent),
  },
  {
    path: 'foundations/space',
    loadComponent: () =>
      import('./pages/space.component').then((m) => m.SpaceComponent),
  },
  {
    path: 'foundations/shadow',
    loadComponent: () =>
      import('./pages/shadow.component').then((m) => m.ShadowComponent),
  },
  {
    path: 'foundations/z-index',
    loadComponent: () =>
      import('./pages/z-index.component').then((m) => m.ZIndexComponent),
  },
  {
    path: 'foundations/motion',
    loadComponent: () =>
      import('./pages/motion.component').then((m) => m.MotionComponent),
  },
  {
    path: 'foundations/focus',
    loadComponent: () =>
      import('./pages/focus.component').then((m) => m.FocusComponent),
  },
  {
    path: 'foundations/layout',
    loadComponent: () =>
      import('./pages/layout.component').then((m) => m.LayoutComponent),
  },
  {
    path: 'foundations/theme',
    loadComponent: () =>
      import('./pages/theme-builder.component').then(
        (m) => m.ThemeBuilderComponent,
      ),
  },
  {
    path: 'foundations/direction',
    loadComponent: () =>
      import('./pages/direction.component').then((m) => m.DirectionComponent),
  },
  {
    path: 'components/button',
    loadComponent: () =>
      import('./pages/button-page.component').then(
        (m) => m.ButtonPageComponent,
      ),
  },
  {
    path: 'components/text-field',
    loadComponent: () =>
      import('./pages/text-field-page.component').then(
        (m) => m.TextFieldPageComponent,
      ),
  },
  {
    path: 'components/select',
    loadComponent: () =>
      import('./pages/select-page.component').then(
        (m) => m.SelectPageComponent,
      ),
  },
  {
    path: 'components/dialog',
    loadComponent: () =>
      import('./pages/dialog-page.component').then(
        (m) => m.DialogPageComponent,
      ),
  },
  {
    path: 'components/bottom-sheet',
    loadComponent: () =>
      import('./pages/bottom-sheet-page.component').then(
        (m) => m.BottomSheetPageComponent,
      ),
  },
  {
    path: 'components/drawer',
    loadComponent: () =>
      import('./pages/drawer-page.component').then(
        (m) => m.DrawerPageComponent,
      ),
  },
  {
    path: 'components/avatar',
    loadComponent: () =>
      import('./pages/avatar-page.component').then(
        (m) => m.AvatarPageComponent,
      ),
  },
  {
    path: 'components/button-group',
    loadComponent: () =>
      import('./pages/button-group-page.component').then(
        (m) => m.ButtonGroupPageComponent,
      ),
  },
  {
    path: 'components/toggle',
    loadComponent: () =>
      import('./pages/toggle-page.component').then(
        (m) => m.TogglePageComponent,
      ),
  },
  {
    path: 'components/toolbar',
    loadComponent: () =>
      import('./pages/toolbar-page.component').then(
        (m) => m.ToolbarPageComponent,
      ),
  },
  {
    path: 'components/context-menu',
    loadComponent: () =>
      import('./pages/context-menu-page.component').then(
        (m) => m.ContextMenuPageComponent,
      ),
  },
  {
    path: 'components/kbd',
    loadComponent: () =>
      import('./pages/kbd-page.component').then((m) => m.KbdPageComponent),
  },
  {
    path: 'components/meter',
    loadComponent: () =>
      import('./pages/meter-page.component').then((m) => m.MeterPageComponent),
  },
  {
    path: 'components/status-dot',
    loadComponent: () =>
      import('./pages/status-dot-page.component').then(
        (m) => m.StatusDotPageComponent,
      ),
  },
  {
    path: 'components/property-list',
    loadComponent: () =>
      import('./pages/property-list-page.component').then(
        (m) => m.PropertyListPageComponent,
      ),
  },
  {
    path: 'components/avatar-group',
    loadComponent: () =>
      import('./pages/avatar-group-page.component').then(
        (m) => m.AvatarGroupPageComponent,
      ),
  },
  {
    path: 'components/input-group',
    loadComponent: () =>
      import('./pages/input-group-page.component').then(
        (m) => m.InputGroupPageComponent,
      ),
  },
  {
    path: 'components/divider',
    loadComponent: () =>
      import('./pages/divider-page.component').then(
        (m) => m.DividerPageComponent,
      ),
  },
  {
    path: 'components/empty-state',
    loadComponent: () =>
      import('./pages/empty-state-page.component').then(
        (m) => m.EmptyStatePageComponent,
      ),
  },
  {
    path: 'components/stat',
    loadComponent: () =>
      import('./pages/stat-page.component').then((m) => m.StatPageComponent),
  },
  {
    path: 'components/tag',
    loadComponent: () =>
      import('./pages/tag-page.component').then((m) => m.TagPageComponent),
  },
  {
    path: 'components/slider',
    loadComponent: () =>
      import('./pages/slider-page.component').then(
        (m) => m.SliderPageComponent,
      ),
  },
  {
    path: 'components/rating',
    loadComponent: () =>
      import('./pages/rating-page.component').then(
        (m) => m.RatingPageComponent,
      ),
  },
  {
    path: 'components/stepper',
    loadComponent: () =>
      import('./pages/stepper-page.component').then(
        (m) => m.StepperPageComponent,
      ),
  },
  {
    path: 'components/timeline',
    loadComponent: () =>
      import('./pages/timeline-page.component').then(
        (m) => m.TimelinePageComponent,
      ),
  },
  {
    path: 'components/chip-input',
    loadComponent: () =>
      import('./pages/chip-input-page.component').then(
        (m) => m.ChipInputPageComponent,
      ),
  },
  {
    path: 'components/command-palette',
    loadComponent: () =>
      import('./pages/command-palette-page.component').then(
        (m) => m.CommandPalettePageComponent,
      ),
  },
  {
    path: 'components/calendar',
    loadComponent: () =>
      import('./pages/calendar-page.component').then(
        (m) => m.CalendarPageComponent,
      ),
  },
  {
    path: 'components/tree',
    loadComponent: () =>
      import('./pages/tree-page.component').then((m) => m.TreePageComponent),
  },
  {
    path: 'foundations/icons',
    loadComponent: () =>
      import('./pages/icons-page.component').then((m) => m.IconsPageComponent),
  },
  {
    path: 'components/badge',
    loadComponent: () =>
      import('./pages/badge-page.component').then((m) => m.BadgePageComponent),
  },
  {
    path: 'components/card',
    loadComponent: () =>
      import('./pages/card-page.component').then((m) => m.CardPageComponent),
  },
  {
    path: 'components/textarea',
    loadComponent: () =>
      import('./pages/textarea-page.component').then(
        (m) => m.TextareaPageComponent,
      ),
  },
  {
    path: 'components/alert-dialog',
    loadComponent: () =>
      import('./pages/alert-dialog-page.component').then(
        (m) => m.AlertDialogPageComponent,
      ),
  },
  {
    path: 'components/data-table',
    loadComponent: () =>
      import('./pages/data-table-page.component').then(
        (m) => m.DataTablePageComponent,
      ),
  },
  {
    path: 'components/pagination',
    loadComponent: () =>
      import('./pages/pagination-page.component').then(
        (m) => m.PaginationPageComponent,
      ),
  },
  {
    path: 'components/checkbox',
    loadComponent: () =>
      import('./pages/checkbox-page.component').then(
        (m) => m.CheckboxPageComponent,
      ),
  },
  {
    path: 'components/radio-group',
    loadComponent: () =>
      import('./pages/radio-group-page.component').then(
        (m) => m.RadioGroupPageComponent,
      ),
  },
  {
    path: 'components/switch',
    loadComponent: () =>
      import('./pages/switch-page.component').then(
        (m) => m.SwitchPageComponent,
      ),
  },
  {
    path: 'components/fieldset',
    loadComponent: () =>
      import('./pages/fieldset-page.component').then(
        (m) => m.FieldsetPageComponent,
      ),
  },
  {
    path: 'components/combobox',
    loadComponent: () =>
      import('./pages/combobox-page.component').then(
        (m) => m.ComboboxPageComponent,
      ),
  },
  {
    path: 'components/date-field',
    redirectTo: 'components/date-picker',
    pathMatch: 'full',
  },
  {
    path: 'components/file-field',
    loadComponent: () =>
      import('./pages/file-field-page.component').then(
        (m) => m.FileFieldPageComponent,
      ),
  },
  {
    path: 'components/alert',
    loadComponent: () =>
      import('./pages/alert-page.component').then((m) => m.AlertPageComponent),
  },
  {
    path: 'components/toast',
    loadComponent: () =>
      import('./pages/toast-page.component').then((m) => m.ToastPageComponent),
  },
  {
    path: 'components/spinner',
    loadComponent: () =>
      import('./pages/spinner-page.component').then(
        (m) => m.SpinnerPageComponent,
      ),
  },
  {
    path: 'components/progress',
    loadComponent: () =>
      import('./pages/progress-page.component').then(
        (m) => m.ProgressPageComponent,
      ),
  },
  {
    path: 'components/skeleton',
    loadComponent: () =>
      import('./pages/skeleton-page.component').then(
        (m) => m.SkeletonPageComponent,
      ),
  },
  {
    path: 'components/tabs',
    loadComponent: () =>
      import('./pages/tabs-page.component').then((m) => m.TabsPageComponent),
    loadChildren: () =>
      import('./pages/tabs-page.component').then((m) => m.tabRoutes),
  },
  {
    path: 'components/breadcrumbs',
    loadComponent: () =>
      import('./pages/breadcrumbs-page.component').then(
        (m) => m.BreadcrumbsPageComponent,
      ),
  },
  {
    path: 'components/menu',
    loadComponent: () =>
      import('./pages/menu-page.component').then((m) => m.MenuPageComponent),
  },
  {
    path: 'components/nav',
    loadComponent: () =>
      import('./pages/nav-page.component').then((m) => m.NavPageComponent),
  },
  {
    path: 'components/accordion',
    loadComponent: () =>
      import('./pages/accordion-page.component').then(
        (m) => m.AccordionPageComponent,
      ),
  },
  {
    path: 'components/tooltip',
    loadComponent: () =>
      import('./pages/tooltip-page.component').then(
        (m) => m.TooltipPageComponent,
      ),
  },
  {
    path: 'components/popover',
    loadComponent: () =>
      import('./pages/popover-page.component').then(
        (m) => m.PopoverPageComponent,
      ),
  },
  {
    path: 'components/language-switcher',
    loadComponent: () =>
      import('./pages/language-switcher-page.component').then(
        (m) => m.LanguageSwitcherPageComponent,
      ),
  },
  {
    path: 'components/date-picker',
    loadComponent: () =>
      import('./pages/date-picker-page.component').then(
        (m) => m.DatePickerPageComponent,
      ),
  },
  {
    path: 'components/number-field',
    loadComponent: () =>
      import('./pages/number-field-page.component').then(
        (m) => m.NumberFieldPageComponent,
      ),
  },
  {
    path: 'components/phone-field',
    loadComponent: () =>
      import('./pages/phone-field-page.component').then(
        (m) => m.PhoneFieldPageComponent,
      ),
  },
  {
    path: 'components/pin-input',
    loadComponent: () =>
      import('./pages/pin-input-page.component').then(
        (m) => m.PinInputPageComponent,
      ),
  },
  {
    path: 'components/search-field',
    loadComponent: () =>
      import('./pages/search-field-page.component').then(
        (m) => m.SearchFieldPageComponent,
      ),
  },
  {
    path: 'components/segmented-control',
    loadComponent: () =>
      import('./pages/segmented-control-page.component').then(
        (m) => m.SegmentedControlPageComponent,
      ),
  },
  {
    path: 'components/app-shell',
    loadComponent: () =>
      import('./pages/app-shell-page.component').then(
        (m) => m.AppShellPageComponent,
      ),
  },
  {
    path: 'ai',
    loadComponent: () =>
      import('./pages/ai-guide.component').then((m) => m.AiGuideComponent),
  },
  {
    path: 'accessibility',
    loadComponent: () =>
      import('./pages/accessibility.component').then(
        (m) => m.AccessibilityComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
