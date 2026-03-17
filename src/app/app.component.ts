import { Component, NO_ERRORS_SCHEMA, Optional, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogService, PageRouterOutlet } from "@nativescript/angular";
import { Application } from "@nativescript/core";
import { TopActionBarComponent } from "./shared/components/top-action-bar/top-action-bar.component";
import { SharedService } from "./shared/services/shared.service";
import { Subscription } from "rxjs";
import {FocusModalComponent} from './focus-modal/focus-modal.component'

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
  standalone: true,
  templateUrl: "./app.component.html",
  imports: [PageRouterOutlet, TopActionBarComponent],
  schemas: [NO_ERRORS_SCHEMA],
})

export class AppComponent {
  activeButton: string = "home";
  currentTitle: string = "Home";
  private pageSub: Subscription;
  constructor(
    private router: Router,
    private sharedService: SharedService,
    @Optional() private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
  ) {}

  showFocusModal() {
    const options = {
      viewContainerRef: this.vcRef,
      context: {},
      fullscreen: false,
      animated: true,
    };

    this.modalService
      .showModal(FocusModalComponent, options)
      .then((result) => {
        console.log("Modal closed with:", result);
      });
  }

  ngOnInit() {
    this.pageSub = this.sharedService.currentPage.subscribe((page) => {
      this.activeButton = page;
    });
  }

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

  ngOnDestroy() {
    if (this.pageSub) {
      this.pageSub.unsubscribe();
    }
  }
}
