import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  provideRouter,
  RouteReuseStrategy,
  RouterOutlet,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { KeepRouteStrategy } from './keep-route-strategy';

/** Each page counts how often it is made. */
const made: Record<string, number> = {};
@Component({ selector: 'ui-page-probe', template: `page` })
class PageComponent {
  constructor() {
    const name =
      '/' +
      inject(ActivatedRoute)
        .snapshot.pathFromRoot.flatMap((r) => r.url.map((s) => s.path))
        .join('/');
    made[name] = (made[name] ?? 0) + 1;
  }
}

@Component({
  selector: 'ui-section-probe',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
class SectionComponent {}

describe('KeepRouteStrategy', () => {
  it('keeps a marked tab page between tabs, and drops it on leaving the section', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'account',
            component: SectionComponent,
            children: [
              { path: 'kept', component: PageComponent, data: { keep: true } },
              { path: 'other', component: PageComponent },
            ],
          },
          { path: 'home', component: PageComponent },
        ]),
        { provide: RouteReuseStrategy, useClass: KeepRouteStrategy },
      ],
    });
    const harness = await RouterTestingHarness.create();
    for (const url of [
      '/account/kept',
      '/account/other',
      '/account/kept',
      '/account/other',
    ])
      await harness.navigateByUrl(url);
    expect(made['/account/kept']).toBe(1);
    // Not marked: made again on each visit.
    expect(made['/account/other']).toBe(2);

    await harness.navigateByUrl('/home');
    await harness.navigateByUrl('/account/kept');
    expect(made['/account/kept']).toBe(2);
  });
});
