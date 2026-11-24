import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './slider.component';

@Component({
  imports: [SliderComponent, ReactiveFormsModule],
  template: `<ui-slider
    label="Price limit"
    [max]="2000"
    [step]="50"
    [format]="egp"
    [formControl]="price"
  />`,
})
class HostComponent {
  readonly price = new FormControl(500);
  readonly egp = (v: number) => `EGP ${v}`;
}

describe('SliderComponent', () => {
  it('shows the formatted value, fills the track and writes to the form', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const range = el.querySelector<HTMLInputElement>('input[type="range"]')!;
    expect(range.value).toBe('500');
    expect(range.getAttribute('aria-valuetext')).toBe('EGP 500');
    expect(range.style.getPropertyValue('--ui-slider-fill')).toBe('25%');
    expect(el.querySelector('label')!.htmlFor).toBe(range.id);

    range.value = '1000';
    range.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.price.value).toBe(1000);
    expect(el.querySelector('output')!.textContent!.trim()).toBe('EGP 1000');
  });
});
