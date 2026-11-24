import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { Avatar, EmptyState, Stat, Tag, Timeline, initials } from './content';

function mount(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const container = document.createElement('div');
  const app = createApp(
    defineComponent({ setup: () => () => h(component, props, slots) }),
  );
  app.mount(container);
  return { container, unmount: () => app.unmount() };
}

describe('Vue content', () => {
  it('keeps Arabic initials apart', () => {
    expect(initials('Mona Adel')).toBe('M\u200cA');
    expect(initials('منى عادل')).toBe('م\u200cع');
  });

  it('names an avatar and falls back to initials when the photo fails', async () => {
    const view = mount(Avatar, { name: 'Mona Adel', src: '/missing.jpg' });
    const avatar = view.container.querySelector('.ui-avatar');
    expect(avatar?.getAttribute('role')).toBe('img');
    expect(avatar?.getAttribute('aria-label')).toBe('Mona Adel');
    avatar?.querySelector('img')?.dispatchEvent(new Event('error'));
    await nextTick();
    expect(avatar?.textContent).toBe('M\u200cA');
    view.unmount();
  });

  it('renders the empty state title at its level and the actions slot', () => {
    const view = mount(
      EmptyState,
      { title: 'No orders yet', level: 2 },
      { actions: () => h('button', 'Share') },
    );
    expect(view.container.querySelector('h2')?.textContent).toBe(
      'No orders yet',
    );
    expect(
      view.container.querySelector('.ui-empty-state__actions button'),
    ).not.toBeNull();
    view.unmount();
  });

  it('shows the stat change with its tone and a hidden arrow', () => {
    const view = mount(Stat, {
      label: 'Revenue',
      value: 'EGP 84,200',
      change: '+12%',
      trend: 'up',
      tone: 'positive',
    });
    const change = view.container.querySelector('.ui-stat__change--positive');
    expect(change?.textContent).toBe('+12%');
    expect(
      change?.querySelector('.ui-icon[aria-hidden="true"]'),
    ).not.toBeNull();
    view.unmount();
  });

  it('shows the remove button only with @remove and names it with the tag', () => {
    const onRemove = vi.fn();
    const view = mount(Tag, { onRemove }, { default: () => 'Angular' });
    const button = view.container.querySelector('button');
    const ids = button?.getAttribute('aria-labelledby')?.split(' ') ?? [];
    expect(
      ids.map(
        (id) =>
          view.container.querySelector(`[id="${id}"]`)?.textContent?.trim() ||
          'Remove',
      ),
    ).toEqual(['Remove', 'Angular']);
    button?.click();
    expect(onRemove).toHaveBeenCalledOnce();
    view.unmount();

    const plain = mount(Tag, {}, { default: () => 'Angular' });
    expect(plain.container.querySelector('button')).toBeNull();
    plain.unmount();
  });

  it('lists timeline entries with their status text', () => {
    const view = mount(Timeline, {
      label: 'Approval history',
      items: [{ title: 'Approved', date: '20 Nov', status: 'approved' }],
    });
    expect(view.container.querySelector('ol')?.getAttribute('aria-label')).toBe(
      'Approval history',
    );
    expect(
      view.container.querySelector('.ui-timeline__status--approved')
        ?.textContent,
    ).toBe('Approved');
    view.unmount();
  });
});
