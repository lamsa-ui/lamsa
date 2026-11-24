import { DialogRef } from '@angular/cdk/dialog';
import {
  ApplicationRef,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../button/button.component';
import {
  DialogCloseDirective,
  DialogComponent,
  UiDialog,
  type DialogVariant,
} from './dialog';

@Component({
  imports: [DialogComponent, ButtonComponent, DialogCloseDirective],
  template: `
    <ui-dialog
      title="Edit address"
      description="Used for your next orders."
      size="lg"
    >
      <p>Body</p>
      <div ui-dialog-actions>
        <button
          ui-button
          variant="secondary"
          uiDialogClose
          data-testid="cancel"
        >
          Cancel
        </button>
        <button ui-button [uiDialogClose]="'saved'" data-testid="save">
          Save
        </button>
      </div>
    </ui-dialog>
  `,
})
class EditDialog {
  readonly ref = inject<DialogRef<string>>(DialogRef);
}

@Component({
  imports: [DialogComponent],
  template: `
    <ng-template #tpl let-name>
      <ui-dialog [title]="'Hello ' + name"><p>From a template</p></ui-dialog>
    </ng-template>
  `,
})
class TemplateHost {
  readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');
}

const stable = () => TestBed.inject(ApplicationRef).whenStable();
const escape = () =>
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }),
  );

describe('UiDialog', () => {
  async function open(config = {}) {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();

    const ref = TestBed.inject(UiDialog).open<string>(EditDialog, config);
    const results: (string | undefined)[] = [];
    ref.closed.subscribe((result) => results.push(result));
    await stable();

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    const get = (id: string) =>
      dialog.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!;
    return { ref, results, dialog, opener, get };
  }

  afterEach(() => document.body.replaceChildren());

  it('names and describes the dialog, focuses its heading, and hides the page', async () => {
    const { dialog, opener } = await open();
    const heading = dialog.querySelector('h2')!;
    const description = dialog.querySelector('.ui-dialog__description')!;

    // The CDK hides everything outside the dialog from screen readers instead of
    // setting aria-modal, so lists opened from inside the dialog stay readable.
    expect(opener.getAttribute('aria-hidden')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
    expect(document.activeElement).toBe(heading);
  });

  it('applies the size and keeps actions out of the scrolling body', async () => {
    const { dialog } = await open();
    expect(dialog.querySelector('ui-dialog')!.className).toBe(
      'ui-dialog ui-dialog--lg',
    );
    expect(dialog.querySelector('.ui-dialog__body p')).not.toBeNull();
    expect(
      dialog.querySelector('.ui-dialog__body [data-testid="save"]'),
    ).toBeNull();
    expect(
      dialog.querySelector('.ui-dialog__actions [data-testid="save"]'),
    ).not.toBeNull();
  });

  it('closes with the value of uiDialogClose, or none when it is bare', async () => {
    const first = await open();
    first.get('save').click();
    expect(first.results).toEqual(['saved']);

    const second = await open();
    second.get('cancel').click();
    expect(second.results).toEqual([undefined]);
  });

  it('closes from the close button and on Escape, returning focus without scrolling', async () => {
    const first = await open();
    const focus = vi.spyOn(first.opener, 'focus');
    first.get('ui-dialog-close').click();
    await stable();
    expect(first.results).toEqual([undefined]);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(document.activeElement).toBe(first.opener);

    const second = await open();
    escape();
    await stable();
    expect(second.results).toEqual([undefined]);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('stays open when not dismissable, without a close button', async () => {
    const { dialog, results } = await open({ dismissable: false });
    expect(dialog.querySelector('[data-testid="ui-dialog-close"]')).toBeNull();

    escape();
    document.querySelector<HTMLElement>('.cdk-overlay-backdrop')!.click();
    await stable();
    expect(results).toEqual([]);
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('opens a template, passing the data to it', async () => {
    const host = TestBed.createComponent(TemplateHost);
    await host.whenStable();
    TestBed.inject(UiDialog).open(host.componentInstance.tpl(), {
      data: 'Hatem',
    });
    await stable();

    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.querySelector('h2')?.textContent).toBe('Hello Hatem');
    expect(dialog.textContent).toContain('From a template');
  });

  it.each<DialogVariant>(['drawer', 'sheet'])(
    'docks to the edge as a %s, with the container covering the screen',
    async (variant) => {
      const host = TestBed.createComponent(DockedHost);
      host.componentInstance.variant = variant;
      await host.whenStable();
      TestBed.inject(UiDialog).open(host.componentInstance.tpl());
      await stable();

      const dialog = document.querySelector('[role="dialog"]')!;
      const { classList } = dialog.querySelector('ui-dialog')!;
      expect([...classList].sort()).toEqual(
        ['ui-dialog', `ui-dialog--${variant}`, 'ui-dialog--lg'].sort(),
      );
      expect(dialog.classList).toContain('ui-dialog-frame');
    },
  );

  it('leaves the container of a centred dialog alone', async () => {
    const { dialog } = await open();
    expect(dialog.classList).not.toContain('ui-dialog-frame');
  });
});

@Component({
  imports: [DialogComponent],
  template: `
    <ng-template #tpl>
      <ui-dialog title="Add building" size="lg" [variant]="variant">
        <p>Form</p>
      </ui-dialog>
    </ng-template>
  `,
})
class DockedHost {
  variant: DialogVariant = 'drawer';
  readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');
}
