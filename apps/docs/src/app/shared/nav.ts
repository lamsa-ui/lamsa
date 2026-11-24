/** The side bar, in reading order. The home page counts its components from here. */
export const NAV = [
  {
    title: 'Start',
    links: [
      { path: '/getting-started', label: 'Getting started' },
      { path: '/ai', label: 'Build with AI' },
      { path: '/accessibility', label: 'Accessibility' },
    ],
  },
  {
    title: 'Foundations',
    links: [
      { path: '/foundations/colour', label: 'Colour' },
      { path: '/foundations/typography', label: 'Typography' },
      { path: '/foundations/space', label: 'Space' },
      { path: '/foundations/shadow', label: 'Shadow' },
      { path: '/foundations/icons', label: 'Icons' },
      { path: '/foundations/z-index', label: 'Z-index' },
      { path: '/foundations/motion', label: 'Motion' },
      { path: '/foundations/focus', label: 'Focus' },
      { path: '/foundations/layout', label: 'Layout' },
      { path: '/foundations/direction', label: 'Right to left' },
      { path: '/foundations/theme', label: 'Theme builder' },
    ],
  },
  {
    title: 'Actions',
    links: [
      { path: '/components/button', label: 'Button' },
      { path: '/components/button-group', label: 'Button group' },
      { path: '/components/toggle', label: 'Toggle' },
      { path: '/components/toolbar', label: 'Toolbar' },
    ],
  },
  {
    title: 'Forms',
    links: [
      { path: '/components/calendar', label: 'Calendar' },
      { path: '/components/checkbox', label: 'Checkbox' },
      { path: '/components/chip-input', label: 'Chip input' },
      { path: '/components/combobox', label: 'Combobox' },
      { path: '/components/date-picker', label: 'Date picker' },
      { path: '/components/fieldset', label: 'Fieldset' },
      { path: '/components/file-field', label: 'File field' },
      { path: '/components/input-group', label: 'Input group' },
      { path: '/components/number-field', label: 'Number field' },
      { path: '/components/phone-field', label: 'Phone field' },
      { path: '/components/pin-input', label: 'PIN input' },
      { path: '/components/radio-group', label: 'Radio group' },
      { path: '/components/rating', label: 'Rating' },
      { path: '/components/search-field', label: 'Search field' },
      { path: '/components/segmented-control', label: 'Segmented control' },
      { path: '/components/select', label: 'Select' },
      { path: '/components/slider', label: 'Slider' },
      { path: '/components/switch', label: 'Switch' },
      { path: '/components/text-field', label: 'Text field' },
      { path: '/components/textarea', label: 'Textarea' },
    ],
  },
  {
    title: 'Feedback',
    links: [
      { path: '/components/alert', label: 'Alert' },
      { path: '/components/badge', label: 'Badge' },
      { path: '/components/empty-state', label: 'Empty state' },
      { path: '/components/meter', label: 'Meter' },
      { path: '/components/progress', label: 'Progress' },
      { path: '/components/skeleton', label: 'Skeleton' },
      { path: '/components/spinner', label: 'Spinner' },
      { path: '/components/status-dot', label: 'Status dot' },
      { path: '/components/toast', label: 'Toast' },
    ],
  },
  {
    title: 'Navigation',
    links: [
      { path: '/components/app-shell', label: 'App shell' },
      { path: '/components/breadcrumbs', label: 'Breadcrumbs' },
      { path: '/components/language-switcher', label: 'Language switcher' },
      { path: '/components/nav', label: 'Navigation' },
      { path: '/components/pagination', label: 'Pagination' },
      { path: '/components/stepper', label: 'Stepper' },
      { path: '/components/tabs', label: 'Tabs' },
    ],
  },
  {
    title: 'Overlays',
    links: [
      { path: '/components/alert-dialog', label: 'Alert dialog' },
      { path: '/components/bottom-sheet', label: 'Bottom sheet' },
      { path: '/components/command-palette', label: 'Command palette' },
      { path: '/components/context-menu', label: 'Context menu' },
      { path: '/components/dialog', label: 'Dialog' },
      { path: '/components/drawer', label: 'Drawer' },
      { path: '/components/menu', label: 'Menu' },
      { path: '/components/popover', label: 'Popover' },
      { path: '/components/tooltip', label: 'Tooltip' },
    ],
  },
  {
    title: 'Content',
    links: [
      { path: '/components/accordion', label: 'Accordion' },
      { path: '/components/card', label: 'Card' },
      { path: '/components/divider', label: 'Divider' },
      { path: '/components/kbd', label: 'Keyboard key' },
      { path: '/components/timeline', label: 'Timeline' },
    ],
  },
  {
    title: 'Data',
    links: [
      { path: '/components/avatar', label: 'Avatar' },
      { path: '/components/avatar-group', label: 'Avatar group' },
      { path: '/components/data-table', label: 'Data table' },
      { path: '/components/property-list', label: 'Property list' },
      { path: '/components/stat', label: 'Stat' },
      { path: '/components/tag', label: 'Tag' },
      { path: '/components/tree', label: 'Tree' },
    ],
  },
  {
    title: 'Integrations',
    links: [
      { path: '/integrations/angular', label: 'Angular' },
      { path: '/integrations/react', label: 'React' },
      { path: '/integrations/vue', label: 'Vue' },
    ],
  },
];

/** Every component page, in side-bar order: the groups that are not Start, Foundations or Integrations. */
export const COMPONENTS = NAV.filter(
  (g) => !['Start', 'Foundations', 'Integrations'].includes(g.title),
).flatMap((g) => g.links);
