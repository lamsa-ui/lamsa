import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox.js';
import { Combobox } from './combobox.js';
import { Fieldset } from './fieldset.js';
import { FileField } from './file-field.js';
import { RadioGroup } from './radio-group.js';
import { Switch } from './switch.js';
import { TextField } from './text-field.js';

const speeds = [
  { value: 'std', label: 'Standard' },
  { value: 'exp', label: 'Express' },
  { value: 'same', label: 'Same day', disabled: true },
];

const countries = [
  { value: 'eg', label: 'Egypt' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'gb', label: 'United Kingdom' },
];

describe('Checkbox and Switch', () => {
  it('names the controls by their labels and reports changes', async () => {
    const onChange = vi.fn();
    render(
      <>
        <Checkbox label="I accept the terms" onChange={onChange} />
        <Switch
          label="Notifications"
          hint="Sent to your phone"
          defaultChecked
        />
      </>,
    );
    const terms = screen.getByRole('checkbox', { name: 'I accept the terms' });
    await userEvent.click(terms);
    expect(onChange).toHaveBeenCalledTimes(1);

    const notify = screen.getByRole('switch', { name: 'Notifications' });
    expect((notify as HTMLInputElement).checked).toBe(true);
    expect(
      document.getElementById(notify.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('Sent to your phone');
  });

  it('marks the checkbox invalid, announces the error and sets indeterminate', () => {
    render(<Checkbox label="All files" error="Required" indeterminate />);
    const box = screen.getByRole<HTMLInputElement>('checkbox');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.indeterminate).toBe(true);
    expect(screen.getByRole('alert').textContent).toBe('Required');
  });
});

describe('RadioGroup and Fieldset', () => {
  it('is a named group with one choice', async () => {
    const onChange = vi.fn();
    render(
      <Fieldset legend="Preferences" hint="Change them any time.">
        <RadioGroup
          label="Delivery"
          options={speeds}
          defaultValue="std"
          onChange={onChange}
          testId="speed"
        />
      </Fieldset>,
    );
    expect(screen.getByRole('group', { name: 'Preferences' })).toBeTruthy();
    const group = screen.getByRole('radiogroup', { name: 'Delivery' });
    expect(group).toBeTruthy();
    expect(
      screen.getByRole<HTMLInputElement>('radio', { name: 'Standard' }).checked,
    ).toBe(true);
    expect(
      screen.getByRole<HTMLInputElement>('radio', { name: 'Same day' })
        .disabled,
    ).toBe(true);

    await userEvent.click(screen.getByRole('radio', { name: 'Express' }));
    expect(onChange).toHaveBeenCalledWith('exp');
    expect(
      screen.getByRole<HTMLInputElement>('radio', { name: 'Express' }).checked,
    ).toBe(true);
  });

  it('marks the group invalid and announces the error', () => {
    render(<RadioGroup label="Delivery" options={speeds} error="Pick one" />);
    expect(screen.getByRole('radiogroup').getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(screen.getByRole('alert').textContent).toBe('Pick one');
  });
});

describe('Combobox', () => {
  it('filters as you type and picks with the keyboard', async () => {
    const onChange = vi.fn();
    render(
      <Combobox
        label="Country"
        options={countries}
        onChange={onChange}
        testId="country"
      />,
    );
    const field = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.type(field, 'unit');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'United Arab Emirates',
      'United Kingdom',
    ]);

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('ae');
    expect((field as HTMLInputElement).value).toBe('United Arab Emirates');
  });

  it('says when nothing matches', async () => {
    render(
      <Combobox label="Country" options={countries} emptyText="No country" />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'zz');
    expect(screen.getByRole('status').textContent).toBe('No country');
  });
});

describe('FileField and typed TextField', () => {
  it('labels the file input and reports dropped files', () => {
    const onFiles = vi.fn();
    render(
      <FileField
        label="Invoice"
        accept=".pdf"
        hint="PDF, up to 5 MB"
        onFiles={onFiles}
        testId="invoice"
      />,
    );
    const input = screen.getByLabelText<HTMLInputElement>('Invoice');
    expect(input.type).toBe('file');
    expect(input.accept).toBe('.pdf');

    // jsdom has no settable input.files, so the input gets a stand-in.
    let picked: unknown = [];
    Object.defineProperty(input, 'files', {
      configurable: true,
      get: () => picked,
      set: (files) => (picked = files),
    });
    const file = new File(['%PDF'], 'invoice.pdf', { type: 'application/pdf' });
    const zone = input.closest('.ui-dropzone')!;
    if (typeof DataTransfer === 'undefined') {
      // jsdom has no DataTransfer: a stand-in with the files.
      fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    } else {
      // A real browser: a real drop.
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      act(() => {
        zone.dispatchEvent(
          new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer,
          }),
        );
      });
    }
    // A browser hands back its own File objects, so compare by name.
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual([
      'invoice.pdf',
    ]);
  });

  it('passes date and number types with their limits', () => {
    render(
      <>
        <TextField label="Move-in date" type="date" min="2026-01-01" />
        <TextField label="Rooms" type="number" min={1} />
      </>,
    );
    expect(screen.getByLabelText<HTMLInputElement>('Move-in date').type).toBe(
      'date',
    );
    expect(screen.getByLabelText<HTMLInputElement>('Rooms').min).toBe('1');
  });
});
