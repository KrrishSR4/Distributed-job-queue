import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes.js';

export const appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
