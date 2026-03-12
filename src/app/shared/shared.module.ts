import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { TopActionBarComponent } from './top-action-bar/top-action-bar.component';

@NgModule({
  declarations: [TopActionBarComponent],
  imports: [
    NativeScriptCommonModule
  ],
  exports: [
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }
