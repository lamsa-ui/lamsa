import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideUiLabels } from './labels';
import { PaginationComponent } from './pagination/pagination.component';
import { TagComponent } from './tag/tag.component';
import { arabicLabels, englishLabels } from './ui-labels';

@Component({
  imports: [TagComponent, PaginationComponent],
  template: `
    <ui-tag removable>القاهرة</ui-tag>
    <ui-tag removable removeLabel="Drop">Giza</ui-tag>
    <ui-pagination [page]="1" [total]="30" />
  `,
})
class HostComponent {}

describe('provideUiLabels', () => {
  it('gives every component its words, switches live, and a set input still wins', async () => {
    const lang = signal(arabicLabels);
    TestBed.configureTestingModule({ providers: [provideUiLabels(lang)] });
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const removes = root.querySelectorAll('.ui-tag__remove');
    const nav = () => root.querySelector('nav')!.getAttribute('aria-label');

    expect(removes[0].getAttribute('aria-label')).toBe('إزالة');
    expect(removes[1].getAttribute('aria-label')).toBe('Drop');
    expect(nav()).toBe('التنقل بين الصفحات');

    lang.set(englishLabels);
    await fixture.whenStable();
    expect(removes[0].getAttribute('aria-label')).toBe('Remove');
    expect(nav()).toBe('Pagination');
  });

  it('counts in Arabic', () => {
    expect([1, 2, 3, 11].map(arabicLabels.star)).toEqual([
      'نجمة واحدة',
      'نجمتان',
      '3 نجوم',
      '11 نجمة',
    ]);
  });
});
