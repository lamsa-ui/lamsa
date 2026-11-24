import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `
    <ui-card [title]="title()" [level]="level()" [padding]="padding()">
      <p>Body</p>
    </ui-card>
  `,
})
class HostComponent {
  readonly title = signal<string | undefined>('Recent orders');
  readonly level = signal<2 | 3 | 4>(3);
  readonly padding = signal<'md' | 'lg'>('md');
}

describe('CardComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const card: HTMLElement = fixture.nativeElement.querySelector('ui-card');
    return { fixture, card };
  }

  it('renders the title as a level 3 heading by default, then the content', async () => {
    const { card } = await setup();
    const heading = card.querySelector('h3.ui-card__title');
    expect(heading?.textContent).toBe('Recent orders');
    expect(card.querySelector('p')?.textContent).toBe('Body');
    expect(card.className).toBe('ui-card');
  });

  it('uses the heading level and padding it is given', async () => {
    const { fixture, card } = await setup();
    fixture.componentInstance.level.set(2);
    fixture.componentInstance.padding.set('lg');
    await fixture.whenStable();
    expect(card.querySelector('h2.ui-card__title')).not.toBeNull();
    expect(card.className).toBe('ui-card ui-card--lg');
  });

  it('has no heading without a title', async () => {
    const { fixture, card } = await setup();
    fixture.componentInstance.title.set(undefined);
    await fixture.whenStable();
    expect(card.querySelector('.ui-card__title')).toBeNull();
  });
});
