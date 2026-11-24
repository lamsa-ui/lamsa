// Roles, names, states and keys of the components the other specs do not reach.
import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { ButtonGroup, Kbd, Property, PropertyList, StatusDot } from './actions';
import {
  Badge,
  Progress,
  RadioGroup,
  Skeleton,
  Switch,
  Textarea,
} from './components';
import { Breadcrumbs, Divider, Nav } from './content';
import { Dialog } from './dialog';
import { Tooltip } from './disclosure';
import { FileField } from './forms';
import { LanguageSwitcher, Pagination } from './paging';
import { ContextMenu } from './select';

function mount(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const container = document.createElement('div');
  document.body.append(container);
  const app = createApp(
    defineComponent({ setup: () => () => h(component, props, slots) }),
  );
  app.mount(container);
  return container;
}

const settle = async () => {
  for (let i = 0; i < 3; i++) {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
  }
};

afterEach(() => document.body.replaceChildren());

describe('Vue accessibility basics', () => {
  it('names a button group', () => {
    const root = mount(
      ButtonGroup,
      { label: 'Text alignment' },
      { default: () => [h('button', 'Start'), h('button', 'End')] },
    );
    const group = root.querySelector('[role="group"]')!;
    expect(group.getAttribute('aria-label')).toBe('Text alignment');
  });

  it('writes keys, statuses and badges in words', () => {
    const root = mount(
      defineComponent({
        setup: () => () => [
          h(Kbd, null, () => 'Ctrl'),
          h(StatusDot, { tone: 'success' }, () => 'Online'),
          h(Badge, { variant: 'success' }, () => 'Paid'),
        ],
      }),
    );
    expect(root.querySelector('kbd.ui-kbd')!.textContent).toBe('Ctrl');
    expect(root.querySelector('.ui-status-dot--success')!.textContent).toBe(
      'Online',
    );
    expect(root.querySelector('.ui-badge')!.textContent).toBe('Paid');
  });

  it('pairs each term with its value in a description list', () => {
    const root = mount(PropertyList, null as never, {
      default: () => h(Property, { term: 'Order' }, () => '#1042'),
    });
    const list = root.querySelector('dl')!;
    expect(list.querySelector('dt')!.textContent).toBe('Order');
    expect(list.querySelector('dd')!.textContent).toBe('#1042');
  });

  it('ties a textarea to its label, hint and error', () => {
    const root = mount(Textarea, {
      label: 'Note',
      hint: 'For the driver.',
      error: 'Too long',
    });
    const area = root.querySelector('textarea')!;
    expect(root.querySelector(`label[for="${area.id}"]`)!.textContent).toBe(
      'Note',
    );
    expect(area.getAttribute('aria-invalid')).toBe('true');
    expect(area.getAttribute('aria-describedby')).toBe(
      `${area.id}-hint ${area.id}-error`,
    );
    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'Too long',
    );
  });

  it('gives a switch the switch role inside its label', () => {
    const root = mount(Switch, { label: 'Dark mode', modelValue: true });
    const input = root.querySelector<HTMLInputElement>('input')!;
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.checked).toBe(true);
    expect(input.closest('label')!.textContent).toContain('Dark mode');
  });

  it('groups radios under one name, with the choice checked', () => {
    const root = mount(RadioGroup, {
      label: 'Delivery',
      modelValue: 'express',
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'express', label: 'Express' },
      ],
    });
    const group = root.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute('aria-label')).toBe('Delivery');
    const radios = group.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    );
    expect(radios).toHaveLength(2);
    expect(radios[0].name).toBe(radios[1].name);
    expect(radios[1].checked).toBe(true);
  });

  it('names a progress bar by its label and says the amount', () => {
    const root = mount(Progress, {
      label: 'Uploading',
      value: 3,
      max: 5,
      valueText: '3 of 5 files',
    });
    const bar = root.querySelector('progress')!;
    expect(
      document.getElementById(bar.getAttribute('aria-labelledby')!)!
        .textContent,
    ).toBe('Uploading');
    expect(bar.getAttribute('aria-valuetext')).toBe('3 of 5 files');
  });

  it('hides skeleton shapes from screen readers', () => {
    const root = mount(Skeleton, { lines: 3 });
    expect(
      root.querySelector('.ui-skeleton')!.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('reads a divider as a separator, or as its words', () => {
    const plain = mount(Divider, { orientation: 'vertical' });
    const line = plain.querySelector('[role="separator"]')!;
    expect(line.getAttribute('aria-orientation')).toBe('vertical');
    const worded = mount(Divider, { label: 'Or' });
    expect(worded.querySelector('[role="separator"]')).toBeNull();
    expect(worded.textContent).toBe('Or');
  });

  it('names breadcrumbs and nav as navigation landmarks', () => {
    const crumbs = mount(Breadcrumbs, {}, { default: () => h('li', 'Orders') });
    expect(crumbs.querySelector('nav')!.getAttribute('aria-label')).toBe(
      'Breadcrumb',
    );
    expect(crumbs.querySelector('nav > ol > li')).not.toBeNull();
    const nav = mount(
      Nav,
      { label: 'Main' },
      { default: () => h('a', 'Home') },
    );
    expect(nav.querySelector('nav')!.getAttribute('aria-label')).toBe('Main');
  });

  it('ties a file field to its label and hint', () => {
    const root = mount(FileField, { label: 'Invoice', hint: 'PDF only.' });
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    expect(root.querySelector(`label[for="${input.id}"]`)!.textContent).toBe(
      'Invoice',
    );
    expect(input.getAttribute('aria-describedby')).toContain('hint');
  });

  it('names pagination, its steps, and announces the shown rows', () => {
    const root = mount(Pagination, { page: 1, total: 42 });
    const nav = root.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
    const previous = nav.querySelector('[aria-label="Previous page"]')!;
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(nav.querySelector('[aria-label="Next page"]')).not.toBeNull();
    expect(nav.querySelector('[aria-current="page"]')).not.toBeNull();
    expect(nav.querySelector('[role="status"]')!.textContent).toMatch(
      /1.*10.*42/,
    );
  });

  it('names the other language in itself, with its lang', () => {
    const root = mount(LanguageSwitcher, {
      current: 'en',
      languages: [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'العربية' },
      ],
    });
    const button = root.querySelector('button')!;
    expect(button.getAttribute('lang')).toBe('ar');
    expect(button.textContent).toContain('العربية');
  });

  it.each(['drawer', 'sheet'] as const)(
    'keeps a %s a named dialog',
    async (variant) => {
      mount(Dialog, { open: true, title: 'Add building', variant });
      await settle();
      const dialog = document.querySelector(`.ui-dialog--${variant}`)!;
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(
        document.getElementById(dialog.getAttribute('aria-labelledby')!)!
          .textContent,
      ).toBe('Add building');
    },
  );

  it('opens a context menu from the keyboard and runs an action', async () => {
    const ran = vi.fn();
    const root = mount(
      ContextMenu,
      { items: [{ id: 'rename', label: 'Rename' }], onAction: ran },
      { default: () => h('div', { tabindex: 0 }, 'invoice.pdf') },
    );
    // Shift+F10 and the menu key fire contextmenu with no pointer position.
    root
      .querySelector('[tabindex="0"]')!
      .dispatchEvent(
        new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
      );
    await settle();
    const item = document.querySelector<HTMLElement>(
      '[role="menu"] [role="menuitem"]',
    )!;
    expect(item.textContent).toBe('Rename');
    item.click();
    await settle();
    expect(ran).toHaveBeenCalledWith('rename');
  });

  it('shows a tooltip on keyboard focus', async () => {
    const root = mount(
      Tooltip,
      { text: 'Copies the order link' },
      { default: () => h('button', { 'aria-label': 'Copy link' }, 'C') },
    );
    root.querySelector('button')!.focus();
    await settle();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain(
      'Copies the order link',
    );
  });
});
