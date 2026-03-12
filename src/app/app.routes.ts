import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ShieldComponent } from './shield/shield.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: 'settings', component: SettingsComponent},
    {path: 'shield', component: ShieldComponent}
];
