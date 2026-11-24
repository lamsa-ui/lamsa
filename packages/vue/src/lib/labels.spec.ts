import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { Tag } from './content';
import { provideUiLabels } from './labels';
import { Pagination } from './paging';
import { arabicLabels, englishLabels } from './ui-labels';

describe('provideUiLabels', () => {
  it('gives every component its words, switches live, and a set prop still wins', async () => {
    const lang = ref(arabicLabels);
    const container = document.createElement('div');
    document.body.append(container);
    const app = createApp(
      defineComponent({
        setup() {
          provideUiLabels(lang);
          return () => [
            h(Tag, { onRemove: () => undefined }, () => 'القاهرة'),
            h(
              Tag,
              { onRemove: () => undefined, removeLabel: 'Drop' },
              () => 'Giza',
            ),
            h(Pagination, { page: 1, total: 30 }),
          ];
        },
      }),
    );
    app.mount(container);
    const removes = () => container.querySelectorAll('.ui-tag__remove');
    const nav = () =>
      container.querySelector('nav')!.getAttribute('aria-label');

    expect(removes()[0].getAttribute('aria-label')).toBe('إزالة');
    expect(removes()[1].getAttribute('aria-label')).toBe('Drop');
    expect(nav()).toBe('التنقل بين الصفحات');

    lang.value = englishLabels;
    await nextTick();
    expect(removes()[0].getAttribute('aria-label')).toBe('Remove');
    expect(nav()).toBe('Pagination');
    app.unmount();
    container.remove();
  });
});
