import { render, screen } from '@testing-library/react';
import { Tag } from './content.js';
import { UiLabelsProvider } from './labels.js';
import { Pagination } from './pagination.js';
import { arabicLabels, englishLabels } from './ui-labels.js';

describe('UiLabelsProvider', () => {
  it('gives every component its words, switches live, and a set prop still wins', () => {
    const tree = (labels = arabicLabels) => (
      <UiLabelsProvider labels={labels}>
        <Tag onRemove={() => undefined}>القاهرة</Tag>
        <Tag onRemove={() => undefined} removeLabel="Drop">
          Giza
        </Tag>
        <Pagination page={1} onPageChange={() => undefined} total={30} />
      </UiLabelsProvider>
    );
    const { rerender, container } = render(tree());
    const removes = container.querySelectorAll('.ui-tag__remove');
    expect(removes[0].getAttribute('aria-label')).toBe('إزالة');
    expect(removes[1].getAttribute('aria-label')).toBe('Drop');
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe(
      'التنقل بين الصفحات',
    );

    rerender(tree(englishLabels));
    expect(removes[0].getAttribute('aria-label')).toBe('Remove');
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe(
      'Pagination',
    );
  });
});
