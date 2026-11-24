import { render, screen } from '@testing-library/react';
import { Button } from './button.js';

describe('Button', () => {
  it('renders a native button with the variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toBe('ui-button ui-button--danger ui-button--lg');
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('disables the button, marks it busy and shows a spinner while loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveProperty('disabled', true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(
      button.querySelector('.ui-spinner[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it('supports the extra variants', () => {
    render(<Button variant="outline">Edit</Button>);
    expect(screen.getByRole('button').className).toContain(
      'ui-button--outline',
    );
  });

  it('renders start and end icons hidden from screen readers', () => {
    render(
      <Button
        startIcon={<svg data-testid="start" />}
        endIcon={<svg data-testid="end" />}
      >
        Next
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Next' });
    const icons = button.querySelectorAll(
      '.ui-button__icon[aria-hidden="true"]',
    );
    expect(icons).toHaveLength(2);
    expect(screen.getByTestId('start')).not.toBeNull();
    expect(screen.getByTestId('end')).not.toBeNull();
  });

  it('swaps the start icon for the spinner while loading', () => {
    render(
      <Button loading startIcon={<svg data-testid="start" />}>
        Save
      </Button>,
    );
    expect(screen.queryByTestId('start')).toBeNull();
    expect(
      screen.getByRole('button').querySelector('.ui-spinner'),
    ).not.toBeNull();
  });

  it('adds the square icon-only class', () => {
    render(
      <Button iconOnly aria-label="Close">
        <svg />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Close' }).className).toContain(
      'ui-button--icon',
    );
  });
});
