import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule],
  standalone: true,
})
export class HomeComponent {
  constructor(private router: Router) {}
  isProtected: boolean = false;

  stats: { title: string; count: number }[] = [
    {
      title: "URLs Blocked",
      count: 1240,
    },
    {
      title: "App Access Denied",
      count: 42,
    },
    {
      title: "lockdown Counter",
      count: 3,
    },
  ];

  goToHome() {
    this.router.navigate(["/home"]);
  }

  toggleProtection() {
    this.isProtected = !this.isProtected;
  }

  activateEmergencyLockdown() {
    this.isProtected = !this.isProtected;
  }
}
