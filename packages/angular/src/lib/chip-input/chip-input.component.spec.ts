import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChipInputComponent } from './chip-input.component';

@Component({
  imports: [ChipInputComponent, ReactiveFormsModule],
  template: `<ui-chip-input label="Toppings" [formControl]="toppings" />`,
})
class HostComponent {
  readonly toppings = new FormControl<string[]>(['Cheese']);
}

describe('ChipInputComponent', () => {
  it('adds on Enter, skips duplicates, removes and moves focus', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    document.body.append(fixture.nativeElement);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const field = el.querySelector<HTMLInputElement>('.ui-chips__input')!;
    const press = (key: string) =>
      field.dispatchEvent(new KeyboardEvent('keydown', { key }));

    field.value = ' Olives ';
    press('Enter');
    field.value = 'Cheese';
    press(',');
    await fixture.whenStable();
    expect(fixture.componentInstance.toppings.value).toEqual([
      'Cheese',
      'Olives',
    ]);
    expect(el.querySelector('[aria-live]')!.textContent).toBe('Olives added');

    field.value = '';
    press('Backspace');
    const last = el.querySelectorAll<HTMLElement>('.ui-tag__remove')[1];
    expect(document.activeElement).toBe(last);

    last.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.toppings.value).toEqual(['Cheese']);
    expect(el.querySelector('[aria-live]')!.textContent).toBe('Olives removed');
    expect(document.activeElement).toBe(el.querySelector('.ui-tag__remove'));
    fixture.nativeElement.remove();
  });
});
