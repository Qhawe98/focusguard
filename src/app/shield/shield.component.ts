import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { NativeScriptCommonModule } from "@nativescript/angular";

@Component({
  selector: "ns-shield",
  imports: [NativeScriptCommonModule],
  standalone: true,
  templateUrl: "./shield.component.html",
  schemas: [NO_ERRORS_SCHEMA],
})
export class ShieldComponent {
  constructor(private router: Router) {}

  goToShield() {
    this.router.navigate(["/shield"]);
  }
}
