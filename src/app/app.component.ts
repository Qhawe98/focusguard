import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { PageRouterOutlet } from "@nativescript/angular";
import { Application } from "@nativescript/core";
import { TopActionBarComponent } from "./shared/top-action-bar/top-action-bar.component";

if (Application.android) {
  Application.android.on("activityCreated", (args) => {
    const activity = args.activity;
    const window = activity.getWindow();
    window.setStatusBarColor(0x00000000);
    window.setNavigationBarColor(0x00000000);
  });
}

@Component({
  selector: "ns-app",
  templateUrl: "./app.component.html",
  imports: [PageRouterOutlet, TopActionBarComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent {
  activeButton: string = "home";
  currentTitle: string = "Home";
  constructor(private router: Router) {}

  setActive(buttonName: string) {
    this.activeButton = buttonName;
  }

  setCurrentTitle(titleName) {
    this.currentTitle = titleName;
  }

  onHomeClick = () => {
    this.setActive("home");
    this.setCurrentTitle("Home");
    this.router.navigate(["/home"]);
  };

  onSettingsClick = () => {
    this.setActive("settings");
    this.setCurrentTitle("Settings");
    this.router.navigate(["/settings"]);
  };

  onShieldClick = () => {
    this.setActive("shield");
    this.setCurrentTitle("Shield");
    this.router.navigate(["/shield"]);
  };
}
