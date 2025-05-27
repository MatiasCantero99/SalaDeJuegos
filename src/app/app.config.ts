import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  importProvidersFrom(BrowserAnimationsModule),
  provideToastr({
    positionClass: 'toast-bottom-right',
    timeOut: 4000,
    progressBar: true,                     
    closeButton: true,}),
  provideHttpClient()]
};
