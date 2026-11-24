import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PhoneFieldComponent } from '../phone-field/phone-field.component';
import { PinInputComponent } from '../pin-input/pin-input.component';
import { SearchFieldComponent } from '../search-field/search-field.component';
import { SegmentedControlComponent } from '../segmented-control/segmented-control.component';
import { NumberFieldComponent, parseNumber } from './number-field.component';

@Component({
  imports: [
    ReactiveFormsModule,
    SearchFieldComponent,
    NumberFieldComponent,
    PhoneFieldComponent,
    PinInputComponent,
    SegmentedControlComponent,
  ],
  template: `
    <ui-search-field
      label="Search orders"
      hideLabel
      testId="q"
      [formControl]="q"
      (submitted)="searched = $event"
    />
    <ui-number-field
      label="Guests"
      [min]="1"
      [max]="3"
      testId="guests"
      [formControl]="guests"
    />
    <ui-phone-field label="Mobile" testId="phone" [formControl]="phone" />
    <ui-pin-input
      label="Code"
      [length]="4"
      testId="pin"
      [formControl]="pin"
      (complete)="code = $event"
    />
    <ui-segmented-control
      label="View"
      testId="view"
      [options]="views"
      [formControl]="view"
    />
  `,
})
class HostComponent {
  readonly q = new FormControl('');
  readonly guests = new FormControl<number | null>(2);
  readonly phone = new FormControl<string | null>('+966501234567');
  readonly pin = new FormControl('');
  readonly view = new FormControl('list');
  readonly views = [
    { value: 'list', label: 'List', icon: 'list' as const },
    { value: 'grid', label: 'Grid', icon: 'layout-grid' as const },
  ];
  searched = '';
  code = '';
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const get = <T extends HTMLElement = HTMLInputElement>(id: string) =>
    root.querySelector<T>(`[data-testid="${id}"]`)!;
  const type = async (el: HTMLInputElement, text: string) => {
    el.value = text;
    el.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const key = async (el: HTMLElement, key: string) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, root, host: fixture.componentInstance, get, type, key };
}

describe('parseNumber', () => {
  it('reads Latin and Arabic digits, with separators', () => {
    expect(parseNumber('1,250.5')).toBe(1250.5);
    expect(parseNumber('١٬٢٥٠٫٥')).toBe(1250.5);
    expect(parseNumber('EGP 40')).toBe(40);
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
  });
});

describe('search field', () => {
  it('keeps a hidden label, clears with Escape and emits on Enter', async () => {
    const { root, host, get, type, key } = await setup();
    const input = get('q');
    expect(input.type).toBe('search');
    expect(root.querySelector(`label[for="${input.id}"]`)!.className).toContain(
      'ui-visually-hidden',
    );
    expect(root.querySelector('[aria-label="Clear search"]')).toBeNull();

    await type(input, 'order 1042');
    expect(host.q.value).toBe('order 1042');
    expect(root.querySelector('[aria-label="Clear search"]')).not.toBeNull();
    await key(input, 'Enter');
    expect(host.searched).toBe('order 1042');
    await key(input, 'Escape');
    expect(host.q.value).toBe('');
  });
});

describe('number field', () => {
  it('steps within min and max and writes a number', async () => {
    const { root, host, get, type, key } = await setup();
    const input = get('guests');
    expect(input.getAttribute('role')).toBe('spinbutton');
    expect(input.getAttribute('aria-valuenow')).toBe('2');

    await key(input, 'ArrowUp');
    expect(host.guests.value).toBe(3);
    const plus = root.querySelector<HTMLButtonElement>(
      '[aria-label="Increase"]',
    )!;
    expect(plus.disabled).toBe(true);
    expect(plus.tabIndex).toBe(-1);

    await type(input, '٩');
    expect(host.guests.value).toBe(9);
    await type(input, '');
    expect(host.guests.value).toBeNull();
  });

  it('keeps a typed number inside the limits on leaving', async () => {
    const { fixture, host, get, type } = await setup();
    const input = get('guests');
    await type(input, '40');
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.guests.value).toBe(3);
    expect(input.value).toBe('3');
  });
});

describe('phone field', () => {
  it('splits a stored number and writes E.164 from Arabic digits', async () => {
    const { fixture, host, get, type } = await setup();
    const country = get<HTMLButtonElement>('phone-country');
    const input = get('phone');
    expect(country.textContent).toContain('Saudi Arabia +966');
    expect(input.value).toBe('501234567');
    expect(input.getAttribute('autocomplete')).toBe('tel-national');

    country.click();
    await fixture.whenStable();
    const egyptOption = document.querySelector<HTMLElement>(
      '[data-testid="phone-country-option-0"]',
    );
    if (!egyptOption) throw new Error('Egypt option was not rendered');
    egyptOption.click();
    await fixture.whenStable();
    await type(input, '٠١٠ ١٢٣٤ ٥٦٧٨');
    expect(host.phone.value).toBe('+201012345678');
    await type(input, '');
    expect(host.phone.value).toBeNull();
  });
});

describe('PIN input', () => {
  it('moves on as digits are typed and fills every box from a paste', async () => {
    const { root, host, get, type, key } = await setup();
    const cells = [0, 1, 2, 3].map((i) => get(`pin-${i}`));
    expect(
      root.querySelector('[role="group"]')!.getAttribute('aria-labelledby'),
    ).toBeTruthy();
    expect(cells[0].getAttribute('autocomplete')).toBe('one-time-code');
    expect(cells[2].getAttribute('aria-label')).toBe('Digit 3 of 4');

    await type(cells[0], '4');
    expect(document.activeElement).toBe(cells[1]);
    await type(cells[1], 'x');
    expect(cells[1].value).toBe('');
    expect(host.pin.value).toBe('4');

    await type(cells[0], '٤٢٧١');
    expect(cells.map((c) => c.value).join('')).toBe('4271');
    expect(host.pin.value).toBe('4271');
    expect(host.code).toBe('4271');

    cells[3].value = '';
    await type(cells[3], '');
    await key(cells[3], 'Backspace');
    expect(document.activeElement).toBe(cells[2]);
    expect(host.pin.value).toBe('42');
  });
});

describe('segmented control', () => {
  it('is a named radio group that writes the picked value', async () => {
    const { root, host, get } = await setup();
    const group = root.querySelector('ui-segmented-control')!;
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('aria-label')).toBe('View');
    expect(get('view-0').checked).toBe(true);
    get('view-1').click();
    expect(host.view.value).toBe('grid');
  });
});
