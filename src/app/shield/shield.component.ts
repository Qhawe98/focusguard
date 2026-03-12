import { Component, NO_ERRORS_SCHEMA } from '@angular/core'
import { Router } from '@angular/router';

@Component({
    selector: 'ns-shield',
    templateUrl: './shield.component.html',
    schemas: [NO_ERRORS_SCHEMA],
})

export class ShieldComponent {
    constructor(private router: Router) { }

    goToShield() {
        this.router.navigate(['/shield']);
    }
}