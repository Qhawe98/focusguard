import {
  Component,
  NO_ERRORS_SCHEMA,
  Optional,
  ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { TimeManagerComponent } from "../shared/components/time-manager/time-manager.component";
import {
  ModalDialogService,
  NativeScriptCommonModule,
} from "@nativescript/angular";

@Component({
  selector: "ns-shield",
  imports: [NativeScriptCommonModule],
  standalone: true,
  templateUrl: "./shield.component.html",
  schemas: [NO_ERRORS_SCHEMA],
})
export class ShieldComponent {
  constructor(
    private router: Router,
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
  ) {}

  showTimeModal() {
    if (!this.modalService) {
      console.warn("Modal service not available");
      return;
    }
    const options = {
      viewContainerRef: this.vcRef,
      context: {},
      fullscreen: false,
      animated: true,
    };

    this.modalService
      .showModal(TimeManagerComponent, options)
      .then((result) => {
        console.log("Modal closed with:", result);
      });
  }

  categories = [
    { title: "Social Media", apps: [], isLocked: false },
    { title: "Adult Content", apps: [], isLocked: false },
    { title: "Gambling", apps: [], isLocked: false },
    { title: "Gaming", apps: [], isLocked: false },
    { title: "Banking", apps: [], isLocked: false },
  ];

  onToggle(item, event: boolean) {
    item.isLocked = event;
    this.showTimeModal();
  }

  goToShield() {
    this.router.navigate(["/shield"]);
  }
}
