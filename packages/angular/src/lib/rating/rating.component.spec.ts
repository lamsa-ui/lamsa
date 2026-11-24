import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingComponent } from './rating.component';

@Component({
  imports: [RatingComponent, ReactiveFormsModule],
  template: `
    <ui-rating label="Food" [formControl]="food" />
    <ui-rating [value]="3.6" readonly />
  `,
})
class HostComponent {
  readonly food = new FormControl<number | null>(2);
}

describe('RatingComponent', () => {
  it('picks with radios and shows a read-only score as one image', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const radios = Array.from(
      el.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );
    expect(radios).toHaveLength(5);
    expect(radios[1].checked).toBe(true);
    expect(el.querySelector('legend')!.textContent).toBe('Food');
    expect(radios[2].closest('label')!.textContent!.trim()).toBe('3 stars');

    radios[3].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.food.value).toBe(4);

    const score = el.querySelector('[role="img"]')!;
    expect(score.getAttribute('aria-label')).toBe('3.6 out of 5 stars');
    expect(score.querySelectorAll('.ui-rating__star--on')).toHaveLength(4);
  });
});
