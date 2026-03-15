import { Component, NO_ERRORS_SCHEMA, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedService } from "../shared/services/shared.service";
import {
  ModalDialogService,
  NativeScriptCommonModule,
} from "@nativescript/angular";
import { FocusModalComponent } from "../shared/components/focus-modal/focus-modal.component";
import { AppService } from "../shared/services/app.service";
import { ScheduleModalComponent } from "../shared/components/schedule-modal/schedule-modal.component";

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
  ) {}
  isProtected: boolean = true;

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
    setTimeout(() => {
      this.appService.loadApps();
    }, 500);
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
    });
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
