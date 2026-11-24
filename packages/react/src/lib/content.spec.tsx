import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar, Divider, EmptyState, initials, Stat, Tag } from './content.js';

describe('Avatar', () => {
  it('takes the first letters of the first and last word', () => {
    expect(initials('mona  adel  hassan')).toBe('M\u200cH');
    expect(initials('منى')).toBe('م');
  });

  it('is an image named after the person, and falls back to initials', () => {
    const { container } = render(<Avatar name="Mona Adel" src="/x.jpg" />);
    const avatar = screen.getByRole('img', { name: 'Mona Adel' });
    fireEvent.error(container.querySelector('img')!);
    expect(avatar.textContent).toBe('M\u200cA');
  });

  it('is hidden when decorative', () => {
    const { container } = render(<Avatar name="Mona" size="lg" decorative />);
    const avatar = container.firstElementChild!;
    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(avatar.className).toBe('ui-avatar ui-avatar--lg');
  });
});

describe('Divider', () => {
  it('is a separator, or text when labelled', () => {
    render(
      <>
        <Divider orientation="vertical" />
        <Divider label="or" />
      </>,
    );
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe(
      'vertical',
    );
    expect(screen.getByText('or').className).toBe(
      'ui-divider ui-divider--label',
    );
  });
});

describe('EmptyState', () => {
  it('has a heading and its actions', () => {
    render(
      <EmptyState title="No orders" level={2} actions={<button>Add</button>}>
        <p>Soon.</p>
      </EmptyState>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'No orders' }));
    expect(screen.getByRole('button', { name: 'Add' }));
  });
});

describe('Stat', () => {
  it('colours the change by tone, not by trend', () => {
    render(
      <Stat
        label="Costs"
        value="9,000"
        change="+4%"
        trend="up"
        tone="negative"
      />,
    );
    expect(screen.getByText('+4%').className).toBe(
      'ui-stat__change ui-stat__change--negative',
    );
  });
});

describe('Tag', () => {
  it('names the remove button after the tag', () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Angular</Tag>);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Angular' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('has no button when it cannot be removed', () => {
    render(<Tag>Plain</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
