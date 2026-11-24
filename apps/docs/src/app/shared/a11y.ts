/**
 * The "Keyboard and screen readers" section of each component page, keyed by the page's
 * last path segment. PageComponent renders it; tools/llms.mjs copies it into the Markdown.
 *
 * keys: [the keys, any one of which does it; what happens]. Write a chord as 'Shift + F10';
 * the words in KEY_WORDS are shown as text, not key caps.
 * script: in plain HTML these keys need the reader's own script (the native element does not
 * bring them).
 */
export interface A11yNotes {
  keys?: [string[], string][];
  notes: string[];
  script?: boolean;
}

const DIALOG_KEYS: [string[], string][] = [
  [
    ['Tab', 'Shift + Tab'],
    'Move between the controls inside; focus stays inside.',
  ],
  [['Escape'], 'Close, and put focus back on the button that opened it.'],
];
const RADIO_KEYS: [string[], string][] = [
  [['Tab'], 'Reach the group, on the chosen option.'],
  [['Arrow keys'], 'Move the choice to the next or previous option.'],
];

/** Key names that are a kind of key, not one to press: shown as plain text. */
export const KEY_WORDS = ['Arrow keys', 'Letters', 'A digit'];

export const A11Y: Record<string, A11yNotes> = {
  button: {
    keys: [[['Enter', 'Space'], 'Press the button.']],
    notes: [
      'A native button, so its role, focus and form submit come from the browser.',
      'A button with only an icon needs a label in words for screen readers.',
    ],
  },
  'button-group': {
    keys: [[['Tab'], 'Move from button to button.']],
    notes: ['A named group, read before its buttons.'],
  },
  toggle: {
    keys: [[['Enter', 'Space'], 'Press it, or let it go.']],
    notes: [
      'Read as a toggle button, pressed or not pressed; the label never changes.',
    ],
  },
  toolbar: {
    script: true,
    keys: [
      [['Tab'], 'Enter the toolbar, and Tab again leaves it.'],
      [
        ['Left', 'Right'],
        'Move to the previous or next control, wrapping round. Flipped in Arabic.',
      ],
      [['Up', 'Down'], 'The same, in a vertical toolbar.'],
      [['Home', 'End'], 'Go to the first or last control.'],
    ],
    notes: ['Read as a toolbar with its name and orientation.'],
  },
  calendar: {
    script: true,
    keys: [
      [['Tab'], 'Reach the grid, on the chosen or focused day.'],
      [['Left', 'Right'], 'Move by a day. Flipped in Arabic.'],
      [['Up', 'Down'], 'Move by a week.'],
      [['Home', 'End'], 'Go to the start or end of the week.'],
      [['Page Up', 'Page Down'], 'Go to the previous or next month.'],
      [
        ['Shift + Page Up', 'Shift + Page Down'],
        'Go to the previous or next year.',
      ],
      [['Enter', 'Space'], 'Pick the day.'],
    ],
    notes: [
      'Each day is read in full, such as Thursday, 19 November 2026.',
      'Today is underlined and picked days are filled, so neither depends on colour.',
    ],
  },
  checkbox: {
    keys: [[['Space'], 'Tick or untick it.']],
    notes: [
      'The native checkbox, named by its label; the whole label is the hit area.',
    ],
  },
  'chip-input': {
    script: true,
    keys: [
      [['Enter', ','], 'Add what is typed as a tag.'],
      [
        ['Backspace'],
        'In an empty field, move to the last tag’s remove button.',
      ],
      [['Enter', 'Space'], 'On a remove button, remove that tag.'],
    ],
    notes: [
      'Each tag has its own remove button, named after its value.',
      'Adding and removing are announced, and focus moves to the next tag or back to the field.',
    ],
  },
  combobox: {
    script: true,
    keys: [
      [
        ['Up', 'Down'],
        'Open the list and move through the matches, wrapping round.',
      ],
      [['Enter'], 'Pick the highlighted match.'],
      [['Escape'], 'Close the list.'],
    ],
    notes: [
      'Focus stays in the field; the highlighted match is read as it moves.',
    ],
  },
  'date-picker': {
    script: true,
    keys: [
      [['Alt + Down'], 'Open the calendar from the field.'],
      [['Escape'], 'Close the calendar, and put focus back on the field.'],
    ],
    notes: [
      'The fields take dates typed in the reader’s own order; the calendar keys are listed on the Calendar page.',
    ],
  },
  fieldset: {
    notes: [
      'The legend is read when focus enters the group, so each field is heard as part of it.',
    ],
  },
  'file-field': {
    keys: [[['Enter', 'Space'], 'Open the file chooser.']],
    notes: [
      'The browser’s own file input: the button and the chosen file names are read as usual.',
      'Dropping files is a shortcut; the button always works.',
    ],
  },
  'input-group': {
    notes: [
      'The text before or after the value is read with the field, such as Price, EGP, but is never part of the value.',
    ],
  },
  'number-field': {
    script: true,
    keys: [
      [['Up', 'Down'], 'Step up or down by one step.'],
      [['Page Up', 'Page Down'], 'Step by ten steps.'],
      [
        ['Home', 'End'],
        'Go to the lowest or highest value, when there is one.',
      ],
      [['Enter'], 'Keep the value inside its limits and write it out.'],
    ],
    notes: [
      'Latin and Arabic digits are both taken; the − and + buttons are named.',
    ],
  },
  'phone-field': {
    script: true,
    keys: [
      [['Up', 'Down'], 'On the country button, open the list of countries.'],
      [
        ['Up', 'Down', 'Home', 'End'],
        'In the list, move through the countries.',
      ],
      [['Enter', 'Space'], 'Pick the country.'],
      [['Escape', 'Tab'], 'Close the list.'],
    ],
    notes: [
      'The country button is read with the country and its code; the number reads left to right in every language.',
    ],
  },
  'pin-input': {
    script: true,
    keys: [
      [['A digit'], 'Fill the box and move to the next one.'],
      [['Backspace'], 'In an empty box, go back to the one before.'],
      [['Left', 'Right'], 'Move to the box before or after.'],
      [['Home', 'End'], 'Go to the first or last box.'],
    ],
    notes: [
      'Pasting the code fills every box, and phones offer the code from the message.',
    ],
  },
  'radio-group': {
    keys: RADIO_KEYS,
    notes: ['Native radios in a named group, so the group name is read first.'],
  },
  rating: {
    keys: RADIO_KEYS,
    notes: [
      'Real radio buttons, read as 3 stars, 3 of 5.',
      'Filled stars are solid and empty ones an outline, so shape tells them apart.',
    ],
  },
  'search-field': {
    keys: [
      [['Enter'], 'Search.'],
      [['Escape'], 'Clear the text.'],
    ],
    notes: ['A real search input, read as search; the clear button is named.'],
  },
  'segmented-control': {
    keys: RADIO_KEYS,
    notes: [
      'Radio buttons underneath; the chosen option is lifted onto a tile with an edge, not only coloured.',
    ],
  },
  select: {
    script: true,
    keys: [
      [['Enter', 'Space', 'Up', 'Down'], 'Open the list.'],
      [['Up', 'Down', 'Home', 'End'], 'Move through the options.'],
      [['Letters'], 'Jump to the option that starts with them.'],
      [['Enter', 'Space'], 'Pick the option.'],
      [['Escape', 'Tab'], 'Close the list, and put focus back on the button.'],
    ],
    notes: [
      'Read as a list box, with the chosen option and the field’s label.',
    ],
  },
  slider: {
    keys: [
      [['Left', 'Right', 'Up', 'Down'], 'Move by one step.'],
      [['Page Up', 'Page Down'], 'Move by a bigger step.'],
      [['Home', 'End'], 'Go to the lowest or highest value.'],
    ],
    notes: [
      'The browser’s own range input, named by its label; the value is also written beside it.',
    ],
  },
  switch: {
    keys: [[['Space'], 'Turn it on or off.']],
    notes: [
      'A checkbox with the switch role, so screen readers say on and off.',
    ],
  },
  'text-field': {
    notes: [
      'The label, hint and error are tied to the input, so all three are read.',
      'An error is announced when it appears.',
    ],
  },
  textarea: {
    notes: [
      'The same label, hint and error as the text field, all read with it.',
    ],
  },
  alert: {
    notes: [
      'The title says what it is in words; the icon and the colour only repeat it.',
    ],
  },
  badge: {
    notes: ['The words carry the status; the colour only repeats them.'],
  },
  'empty-state': {
    notes: [
      'Its title is a heading, at the level you set so it fits the page outline.',
    ],
  },
  meter: {
    notes: [
      'The native meter, named by its label, with the value in words beside it.',
    ],
  },
  progress: {
    notes: [
      'The native progress bar, named by its label, with the amount in words beside it.',
      'Without a value it shows a moving band: work is going on but its length is not known.',
    ],
  },
  skeleton: {
    notes: [
      'Screen readers skip the shapes: mark the area busy and say it is loading in words.',
      'With reduced motion the shapes stop pulsing.',
    ],
  },
  spinner: {
    notes: [
      'Says what is loading, in words, to screen readers.',
      'With reduced motion it stops turning and stays as a faint ring.',
    ],
  },
  'status-dot': {
    notes: [
      'The word is always there and carries the meaning; the dot is not read.',
    ],
  },
  toast: {
    script: true,
    keys: [[['Tab'], 'Reach the action or the close button inside a toast.']],
    notes: [
      'Toasts sit in a named live region, so each one is read as it comes.',
      'The timer waits while the pointer or focus is on a toast, and never runs on one with an action.',
    ],
  },
  'app-shell': {
    script: true,
    keys: [
      [
        ['Enter', 'Space'],
        'On the menu button, open the side bar on a narrow screen.',
      ],
      [['Escape'], 'Close the side bar.'],
    ],
    notes: [
      'The header, the side bar and the page are landmarks, so screen readers can jump between them.',
    ],
  },
  breadcrumbs: {
    notes: [
      'A named navigation landmark around an ordered list; the last item is marked as the current page.',
      'The slashes are drawn, not read out.',
    ],
  },
  'language-switcher': {
    script: true,
    keys: [
      [['Enter', 'Space', 'Down'], 'Open the list of languages.'],
      [['Up', 'Down'], 'Move through the languages.'],
      [['Escape'], 'Close it, and put focus back on the button.'],
    ],
    notes: [
      'Each language is named in itself and carries its lang, so it is read in the right voice.',
    ],
  },
  nav: {
    notes: [
      'A named navigation landmark; the current page is marked for screen readers and with a bar and bold text.',
    ],
  },
  pagination: {
    keys: [[['Tab'], 'Move between the page buttons.']],
    notes: [
      'A named navigation landmark; each button says its page number, and the current page is marked.',
      'The line of shown rows is announced when it changes.',
    ],
  },
  stepper: {
    keys: [[['Tab'], 'Reach the step names, Back and Next.']],
    notes: [
      'Done steps are read as Done and the current one as the current step.',
      'Focus moves to the new step’s content after each change.',
    ],
  },
  tabs: {
    script: true,
    keys: [
      [['Tab'], 'Reach the chosen tab, and Tab again moves into its panel.'],
      [
        ['Left', 'Right'],
        'Move to the previous or next tab and show it. Flipped in Arabic.',
      ],
      [['Home', 'End'], 'Go to the first or last tab.'],
    ],
    notes: ['Read as tabs, with how many there are and which is chosen.'],
  },
  'alert-dialog': {
    keys: [
      [['Tab', 'Shift + Tab'], 'Move between its buttons; focus stays inside.'],
    ],
    notes: [
      'Escape and a click outside do nothing: only its buttons answer.',
      'Focus starts on the safest button, and the title and message are read when it opens.',
    ],
  },
  'bottom-sheet': {
    keys: DIALOG_KEYS,
    notes: [
      'A dialog docked to the bottom, named by its title; the page behind stops scrolling.',
    ],
  },
  'command-palette': {
    script: true,
    keys: [
      [['Ctrl + K', '⌘ + K'], 'Open it from anywhere.'],
      [['Up', 'Down'], 'Move through the matching commands, wrapping round.'],
      [['Enter'], 'Run the highlighted command.'],
      [['Escape'], 'Close it.'],
    ],
    notes: [
      'How many commands match is announced as you type.',
      'Keep a visible button for it too: a shortcut nobody knows about is no way in.',
    ],
  },
  'context-menu': {
    script: true,
    keys: [
      [['Shift + F10', 'Menu'], 'Open the menu on the focused item.'],
      [['Up', 'Down'], 'Move through the actions.'],
      [['Enter', 'Space'], 'Run the action.'],
      [['Escape'], 'Close it.'],
    ],
    notes: [
      'It is a shortcut: the same actions must also be somewhere visible.',
    ],
  },
  dialog: {
    keys: DIALOG_KEYS,
    notes: [
      'Named by its title; the page behind stops scrolling and cannot be reached.',
    ],
  },
  drawer: {
    keys: DIALOG_KEYS,
    notes: [
      'A dialog docked to the side, named by its title; the page behind stops scrolling.',
    ],
  },
  menu: {
    script: true,
    keys: [
      [['Enter', 'Space', 'Down'], 'Open the menu from its button.'],
      [['Up', 'Down'], 'Move through the actions.'],
      [['Letters'], 'Jump to the action that starts with them.'],
      [['Enter', 'Space'], 'Run the action.'],
      [['Escape'], 'Close it, and put focus back on the button.'],
    ],
    notes: ['Read as a menu of items; the button says it opens a menu.'],
  },
  popover: {
    script: true,
    keys: [
      [['Enter', 'Space'], 'Open it from its button; focus moves in.'],
      [['Escape'], 'Close it, and put focus back on the button.'],
    ],
    notes: [
      'Named after its button. It is not modal, so the page stays reachable.',
    ],
  },
  tooltip: {
    script: true,
    keys: [
      [['Tab'], 'Focus the control, and its tooltip shows.'],
      [['Escape'], 'Hide the tooltip.'],
    ],
    notes: [
      'Read as the control’s description; the pointer can move onto it.',
      'Touch screens never show tooltips, so nothing needed may live only in one.',
    ],
  },
  accordion: {
    script: true,
    keys: [
      [['Enter', 'Space'], 'Open or close the section.'],
      [['Up', 'Down'], 'Move to the previous or next heading, wrapping round.'],
      [['Home', 'End'], 'Go to the first or last heading.'],
    ],
    notes: [
      'Native details elements: they open without script, and find in page opens the section that holds the match.',
      'In plain HTML only the Up, Down, Home and End keys need script.',
    ],
  },
  card: {
    notes: [
      'A card with a heading reads as its own part of the page; give it one when it stands alone.',
    ],
  },
  divider: {
    notes: [
      'Read as a separator; a divider with words in the middle is read as those words instead.',
    ],
  },
  kbd: {
    notes: [
      'The native kbd element, so screen readers and search engines know it is a key.',
    ],
  },
  timeline: {
    notes: [
      'An ordered list, so screen readers say how many events there are; each date is a time element.',
    ],
  },
  avatar: {
    notes: ['Screen readers hear the person’s name, never the file name.'],
  },
  'avatar-group': {
    notes: [
      'The group has a name, every avatar is still named, and +3 is read as 3 more.',
    ],
  },
  'data-table': {
    script: true,
    keys: [[['Enter', 'Space'], 'On a column heading, sort by it.']],
    notes: [
      'A real table named by its caption, so the row and column of every cell are read.',
      'The sorted column is marked, and the new order is announced.',
    ],
  },
  'property-list': {
    notes: [
      'The native description list, so each label is paired with its value.',
    ],
  },
  stat: {
    notes: [
      'The change is written out, with its sign or in words; the arrow and colour only repeat it.',
    ],
  },
  tag: {
    keys: [[['Enter', 'Space'], 'On the remove button, take the tag away.']],
    notes: [
      'The remove button is named after the tag, such as Remove Angular.',
    ],
  },
  tree: {
    script: true,
    keys: [
      [['Tab'], 'Reach the tree; it is one Tab stop.'],
      [['Up', 'Down'], 'Move to the previous or next item.'],
      [['Right'], 'Open a branch, or move into it.'],
      [['Left'], 'Close a branch, or move to its parent.'],
      [['Letters'], 'Jump to the item that starts with them.'],
      [['Enter', 'Space'], 'Select the item.'],
    ],
    notes: [
      'Read as a tree: each item says its level, whether it is open, and whether it is selected.',
    ],
  },
};
