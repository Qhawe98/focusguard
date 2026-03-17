import { importProvidersFrom, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { HomeComponent } from "./home/home.component";
import { SettingsComponent } from "./settings/settings.component";
import { ShieldComponent } from "./shield/shield.component";
import { registerElement } from "@nativescript/angular";
import { CheckBox } from "@nativescript-community/ui-checkbox";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";

registerElement("CheckBox", () => CheckBox);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    ShieldComponent,
  ],
  imports: [BrowserModule, SharedModule, TNSFontIconModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
