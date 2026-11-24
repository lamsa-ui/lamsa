import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  RouteReuseStrategy,
  withInMemoryScrolling,
} from '@angular/router';
import { KeepRouteStrategy } from '@ghazal-ui/angular';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        // New page: top. Back/forward: where you were. #fragment: that heading.
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    // The tabs page keeps its Security tab between visits.
    { provide: RouteReuseStrategy, useClass: KeepRouteStrategy },
  ],
};
