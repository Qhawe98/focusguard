import { Component, NO_ERRORS_SCHEMA } from '@angular/core'
import { Router } from '@angular/router';

@Component({
    selector: 'ns-settings',
    templateUrl: './settings.component.html',
    schemas: [NO_ERRORS_SCHEMA],
})

export class SettingsComponent {
    constructor(private router: Router) { }

    goToSettings() {
        this.router.navigate(['/settings']);
    }
}