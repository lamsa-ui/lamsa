import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldComponent } from '../text-field/text-field.component';
import { FileFieldComponent } from './file-field.component';

@Component({
  imports: [FileFieldComponent, TextFieldComponent, ReactiveFormsModule],
  template: `
    <ui-file-field
      label="Invoice"
      accept=".pdf"
      hint="PDF, up to 5 MB"
      [formControl]="invoice"
      testId="invoice"
    />
    <ui-text-field
      label="Rooms"
      type="number"
      [min]="1"
      [formControl]="rooms"
      testId="rooms"
    />
    <ui-text-field
      label="Move-in date"
      type="date"
      min="2026-01-01"
      [formControl]="date"
      testId="date"
    />
  `,
})
class HostComponent {
  readonly invoice = new FormControl<File[]>([], { nonNullable: true });
  readonly rooms = new FormControl<number | null>(2);
  readonly date = new FormControl('2026-12-01', { nonNullable: true });
}

describe('file field and typed text fields', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const get = (id: string) =>
      root.querySelector<HTMLInputElement>(`[data-testid="${id}"]`)!;
    return { fixture, root, get, host: fixture.componentInstance };
  }

  it('labels the file input and passes accept', async () => {
    const { root, get } = await setup();
    const input = get('invoice');
    expect(input.type).toBe('file');
    expect(input.accept).toBe('.pdf');
    expect(root.querySelector(`label[for="${input.id}"]`)?.textContent).toBe(
      'Invoice',
    );
    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-hint`);
  });

  it('writes dropped files to the form control', async () => {
    const { root, host } = await setup();
    const file = new File(['%PDF'], 'invoice.pdf', {
      type: 'application/pdf',
    });
    const zone = root.querySelector('.ui-dropzone')!;
    // jsdom has no DataTransfer and no settable input.files, so the event carries a stand-in.
    const input = root.querySelector<HTMLInputElement>('.ui-file')!;
    let picked: File[] = [];
    Object.defineProperty(input, 'files', {
      configurable: true,
      get: () => picked,
      set: (files: File[]) => (picked = files),
    });
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.assign(drop, { dataTransfer: { files: [file] } });
    zone.dispatchEvent(drop);

    expect(drop.defaultPrevented).toBe(true);
    expect(host.invoice.value).toEqual([file]);
  });

  it('writes numbers from a number field and passes min', async () => {
    const { get, host } = await setup();
    const rooms = get('rooms');
    expect(rooms.type).toBe('number');
    expect(rooms.value).toBe('2');
    expect(rooms.min).toBe('1');

    rooms.value = '4';
    rooms.dispatchEvent(new Event('input'));
    expect(host.rooms.value).toBe(4);

    rooms.value = '';
    rooms.dispatchEvent(new Event('input'));
    expect(host.rooms.value).toBeNull();
  });

  it('keeps dates as ISO strings', async () => {
    const { get, host } = await setup();
    const date = get('date');
    expect(date.type).toBe('date');
    expect(date.value).toBe('2026-12-01');
    date.value = '2027-01-15';
    date.dispatchEvent(new Event('input'));
    expect(host.date.value).toBe('2027-01-15');
  });
});
