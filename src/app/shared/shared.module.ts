import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { TopActionBarComponent } from "./components/top-action-bar/top-action-bar.component";
import { TimeManagerComponent } from "./components/time-manager/time-manager.component";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { CheckBoxModule } from "@nativescript-community/ui-checkbox/angular";
import { TNSCheckBoxModule } from "@nstudio/nativescript-checkbox/angular";
import { FontIconModule } from "nativescript-fonticon/angular";

@NgModule({
  declarations: [TopActionBarComponent, TimeManagerComponent],
  imports: [
    NativeScriptCommonModule,
    TNSFontIconModule,
    CheckBoxModule,
    TNSCheckBoxModule,
    FontIconModule.forRoot({
      fa: require("~/assets/all.css"),
    }),
  ],
  exports: [
    TopActionBarComponent,
    TimeManagerComponent,
    NativeScriptCommonModule,
    TNSFontIconModule,
    CheckBoxModule,
    FontIconModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
