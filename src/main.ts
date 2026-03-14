import {
  bootstrapApplication,
  provideNativeScriptHttpClient,
  provideNativeScriptRouter,
  runNativeScriptAngularApp,
} from "@nativescript/angular";

import { ModalDialogService } from '@nativescript/angular'

import { provideZonelessChangeDetection,importProvidersFrom } from "@angular/core";
import { withInterceptorsFromDi } from "@angular/common/http";

import { routes } from "./app/app.routes";
import { AppComponent } from "./app/app.component";

import { FontIcon, fonticon } from "@nativescript-community/fonticon";
import { Application } from "@nativescript/core";

import { TNSFontIconModule, USE_STORE } from "nativescript-ngx-fonticon";
import { registerElement } from '@nativescript/angular';
import { CheckBox } from '@nativescript-community/ui-checkbox';

registerElement('CheckBox', () => CheckBox);

FontIcon.paths = {
  fa: "assets/font-awesome.css",
};

FontIcon.loadCss();

Application.setResources({
  fonticon,
});

runNativeScriptAngularApp({
  appModuleBootstrap: () => {
    return bootstrapApplication(AppComponent, {
      providers: [
        provideNativeScriptHttpClient(withInterceptorsFromDi()),
        provideNativeScriptRouter(routes),
        provideZonelessChangeDetection(),
        ModalDialogService,
        importProvidersFrom(
          TNSFontIconModule.forRoot({
            fa: "./assets/font-awesome.css",
          }),
        ),
        { provide: USE_STORE, useValue: { fa: "./assets/font-awesome.css" } },
      ],
    });
  },
});
