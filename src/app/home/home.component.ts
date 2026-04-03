import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
  ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedService } from "../shared/services/shared.service";
import {
  ModalDialogService,
  NativeScriptCommonModule,
} from "@nativescript/angular";
import { FocusModalComponent } from "../focus-modal/focus-modal.component";
import { AppService } from "../shared/services/app.service";
import { ScheduleModalComponent } from "../schedule-modal/schedule-modal.component";
import { ApplicationSettings, Utils } from "@nativescript/core";
import { AppBlockerService } from "../shared/services/app-blocker.service.android";
import { confirm } from "@nativescript/core/ui/dialogs";
import { AppStateManager } from "../shared/services/app-state.service";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, NativeScriptCommonModule],
  standalone: true,
})
export class HomeComponent {
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
    private appService: AppService,
    private cd: ChangeDetectorRef,
  ) {}
  isProtected: boolean = false;

  stats: { title: string; count: number; icon: string }[] = [
    {
      title: "Apps Locked",
      count: 5,
      icon: "\uf023",
    },
    {
      title: "Block Count",
      count: 42,
      icon: "\uf05e",
    },
    {
      title: "Hours Saved",
      count: 13,
      icon: "\uf017",
    },
  ];

  ngOnInit() {
    // 1. Initial check when page opens
    this.updateShieldStatus();

    // 2. Refresh status whenever this page becomes active
    // (In case the timer ran out while the app was in background)
    this.updateShieldStatus();

    setTimeout(() => {
      this.appService.loadApps();
    }, 500);
  }

  private updateShieldStatus() {
    // This matches the "isServiceRunning" key we set in the AppStateManager/Service
    this.isProtected = ApplicationSettings.getBoolean(
      "isServiceRunning",
      false,
    );
  }

  showFocusModal() {
    const options = {
      viewContainerRef: this.vcRef,
      context: {
        categories: this.appService.categories,
      },
      fullscreen: false,
      animated: true,
    };

    this.modalService.showModal(FocusModalComponent, options).then((result) => {
      console.log("Focus Modal closed with:", result);

      if (result && result.action === "started") {
        setTimeout(() => {
          this.isProtected = true;
          this.cd.detectChanges();
        }, 0);
      }
    });
  }

  onShieldTap = async () => {
    if (this.isProtected) {
      const options = {
        title: "Stop Protection",
        message: "Are you sure you want to stop the app blocker?",
        okButtonText: "Stop",
        cancelButtonText: "Cancel",
      };

      const result = await confirm(options);

      if (result === true) {
        console.log("User confirmed. Stopping service...");
        this.stopProtectionService();
      } else {
        console.log("User cancelled. Protection remains ON.");
      }
    } else {
      this.showFocusModal();
    }
  };

  private stopProtectionService() {
    const state = AppStateManager.getInstance();

    if (state.activeTimerId) {
      console.log("Forcing JS Timer to STOP 🛑");
      global.clearInterval(state.activeTimerId);
      state.activeTimerId = null;
    }

    const context = Utils.android.getApplicationContext();
    const intent = new android.content.Intent();
    intent.setClassName(context, "com.tns.AppBlockerService");
    context.stopService(intent);

    this.isProtected = false;
    state.isServiceRunning = false;
    ApplicationSettings.setBoolean("isServiceRunning", false);
    this.cd.detectChanges();
  }

  showScheduleModal() {
    const options = {
      viewContainerRef: this.vcRef,
      context: {
        categories: this.appService.categories,
      },
      fullscreen: false,
      animated: true,
    };

    this.modalService
      .showModal(ScheduleModalComponent, options)
      .then((result) => {
        console.log("Schedule Modal closed with:", result);
      });
  }

  goToHome() {
    this.router.navigate(["/home"]);
  }

  configureShieldProtection() {
    this.sharedService.updateCurrentPage("shield");
    this.router.navigate(["/shield"]);
  }
}
