import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
// Correct import path for RouterExtensions
import { RouterExtensions } from '@nativescript/angular';

@Component({
    selector: 'ns-top-action-bar',
    templateUrl: './top-action-bar.component.html',
    schemas: [NO_ERRORS_SCHEMA],
    imports: [NativeScriptCommonModule],
    standalone: true,
})
export class TopActionBarComponent {
    @Input() title: string = 'Default Title';
    @Input() isBackButtonVisible: boolean = true;
    @Input() isVisible: boolean = true;

    constructor(private routerExtensions: RouterExtensions) {}

    onBack() {
        this.routerExtensions.back();
    }
}
