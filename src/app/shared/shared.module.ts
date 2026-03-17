import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

import { TopActionBarComponent } from "./components/top-action-bar/top-action-bar.component";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { CheckBoxModule } from "@nativescript-community/ui-checkbox/angular";
import { TNSCheckBoxModule } from "@nstudio/nativescript-checkbox/angular";
import { FontIconModule } from "nativescript-fonticon/angular";
import { ScheduleModalComponent } from "../schedule-modal/schedule-modal.component";
import {NativeScriptDateTimePickerModule} from '@nativescript/datetimepicker/angular'
import { TimePickerComponent } from "./components/time-picker/time-picker.component";

@NgModule({
  declarations: [
    TopActionBarComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    TNSFontIconModule,
    CheckBoxModule,
    TNSCheckBoxModule,
    FontIconModule.forRoot({
      fa: require("~/assets/all.css"),
    }),
    NativeScriptDateTimePickerModule
  ],
  exports: [
    TopActionBarComponent,
    NativeScriptCommonModule,
    TNSFontIconModule,
    CheckBoxModule,
    FontIconModule,
    ScheduleModalComponent,
    TimePickerComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
