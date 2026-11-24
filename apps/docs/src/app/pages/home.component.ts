import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HomePinsComponent } from './home-pins.component';
import { FRAMEWORKS } from '../shared/docs-settings';
import { COMPONENTS, NAV } from '../shared/nav';

const foundationCount =
  NAV.find((g) => g.title === 'Foundations')?.links.length ?? 0;

/** The landing page: one first screen, the pitch beside a pin board you press. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, HomePinsComponent],
  host: { class: 'doc-home' },
  template: `
    <section class="doc-home__hero" aria-labelledby="home-title">
      <div class="doc-home__intro">
        <h1 id="home-title" class="ui-head-3xl doc-home__title">
          <span class="ui-visually-hidden">One look. Every frontend.</span>
          <span aria-hidden="true">
            One look.<br /><span class="doc-home__accent"
              >Every
              <span class="doc-home__underlined">
                @for (w of [word()]; track w) {
                  <span class="doc-swap">{{ w }}</span>
                }
                <svg
                  class="doc-home__scribble"
                  viewBox="0 0 300 20"
                  preserveAspectRatio="none"
                >
                  <path
                    class="doc-draw"
                    pathLength="1"
                    d="M4 14 C 60 4, 120 4, 170 10 S 260 18, 296 6"
                  /></svg></span
            ></span>
          </span>
        </h1>
        <p class="ui-body-lg doc-home__lead">
          Lamsa, <span lang="ar">لمسة</span>, means a touch. Accessible
          components for Angular, React, Vue and plain HTML, drawn from one
          stylesheet, in Arabic and English, light and dark.
        </p>
        <div class="doc-home__actions">
          <a
            class="ui-button ui-button--primary ui-button--lg"
            routerLink="/getting-started"
            >Get started</a
          >
          <a
            class="ui-button ui-button--secondary ui-button--lg"
            [routerLink]="firstComponent"
            >Browse components</a
          >
        </div>
        <dl class="doc-home__counts">
          @for (c of counts; track c.label) {
            <div class="doc-home__count">
              <dt>{{ c.label }}</dt>
              <dd class="ui-head-xl">{{ c.value }}</dd>
            </div>
          }
        </dl>
      </div>

      <app-home-pins />
    </section>
  `,
})
export class HomeComponent {
  protected readonly firstComponent = COMPONENTS[0].path;
  protected readonly counts = [
    { label: 'Components', value: COMPONENTS.length },
    { label: 'Foundations', value: foundationCount },
    { label: 'Frameworks', value: FRAMEWORKS.length },
  ];

  /** Rotating last word of the title; still for reduced motion. */
  private static readonly WORDS = [
    'frontend',
    'framework',
    'language',
    'screen',
    'theme',
  ];
  private readonly wordAt = signal(0);
  protected readonly word = computed(
    () => HomeComponent.WORDS[this.wordAt() % HomeComponent.WORDS.length],
  );

  constructor() {
    inject(Title).setTitle('Lamsa · One look, every frontend');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const words = setInterval(() => this.wordAt.update((n) => n + 1), 2600);
      inject(DestroyRef).onDestroy(() => clearInterval(words));
    }
  }
}
