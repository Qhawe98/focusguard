import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import {HomeComponent} from './home/home.component'
import {SettingsComponent} from './settings/settings.component'
import {ShieldComponent} from './shield/shield.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    ShieldComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
