import { render, screen } from '@testing-library/react';
import { Timeline } from './timeline.js';

describe('Timeline', () => {
  it('shows approval events, status, actor, and semantic dates', () => {
    render(
      <Timeline
        label="Approval history"
        items={[
          {
            title: 'Manager review',
            actor: 'Mina Hassan',
            date: '20 Nov 2026, 14:30',
            dateTime: '2026-11-20T14:30:00Z',
            description: 'Budget and documents verified.',
            status: 'approved',
          },
          {
            title: 'Finance review',
            date: 'Awaiting review',
            status: 'pending',
            statusLabel: 'Waiting',
          },
        ]}
      />,
    );

    expect(screen.getByRole('list', { name: 'Approval history' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Manager review' }),
    ).toBeTruthy();
    expect(screen.getByText('Mina Hassan')).toBeTruthy();
    expect(screen.getByText('Budget and documents verified.')).toBeTruthy();
    expect(screen.getByText('Approved')).toBeTruthy();
    expect(screen.getByText('Waiting')).toBeTruthy();
    expect(
      screen.getByText('20 Nov 2026, 14:30').getAttribute('datetime'),
    ).toBe('2026-11-20T14:30:00Z');
    expect(screen.getByText('Awaiting review').getAttribute('datetime')).toBe(
      null,
    );
  });
});
