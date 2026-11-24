import { render, screen } from '@testing-library/react';
import { Badge } from './badge.js';
import { Card } from './card.js';

describe('Badge', () => {
  it('shows its text with the variant class', () => {
    render(<Badge variant="warning">Late</Badge>);
    expect(screen.getByText('Late').className).toBe(
      'ui-badge ui-badge--warning',
    );
  });

  it('is neutral by default', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft').className).toBe(
      'ui-badge ui-badge--neutral',
    );
  });
});

describe('Card', () => {
  it('renders the title as a level 3 heading by default, then the content', () => {
    const { container } = render(
      <Card title="Recent orders">
        <p>Body</p>
      </Card>,
    );
    const card = container.firstElementChild!;
    expect(card.className).toBe('ui-card');
    expect(
      screen.getByRole('heading', { level: 3, name: 'Recent orders' })
        .className,
    ).toBe('ui-card__title');
    expect(screen.getByText('Body')).not.toBeNull();
  });

  it('uses the heading level and padding it is given', () => {
    const { container } = render(
      <Card title="Totals" level={2} padding="lg" />,
    );
    expect(screen.getByRole('heading', { level: 2 })).not.toBeNull();
    expect(container.firstElementChild!.className).toBe('ui-card ui-card--lg');
  });

  it('has no heading without a title', () => {
    render(<Card>Body</Card>);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
