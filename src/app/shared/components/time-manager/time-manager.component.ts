import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { TimePicker } from "@nativescript/core";

@Component({
  selector: "ns-time-manager",
  templateUrl: "./time-manager.component.html",
  imports: [NativeScriptCommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
})
export class TimeManagerComponent {
  isPremium: boolean = true;
  selectedMinutes: number = 60;
  showCustomPicker: boolean = true;

  constructor(private params: ModalDialogParams) {}

  selectQuickTime(mins: number) {
    if (mins > 30 && !this.isPremium) {
      alert("Premium required!");
      return;
    }
    if (this.params) {
      this.params.closeCallback({ action: "lock", duration: mins });
    }
  }

  onCustomTime() {
    if (!this.isPremium) {
      alert("Custom time is a Premium feature!");
      return;
    }
    this.showCustomPicker = !this.showCustomPicker;
  }

  confirmCustomTime(picker: TimePicker) {
    const totalMinutes = picker.hour * 60 + picker.minute;

    if (totalMinutes === 0) {
      alert("Please select a duration greater than 0.");
      return;
    }

    this.selectQuickTime(totalMinutes);
  }

  close() {
    this.params.closeCallback({ action: "cancel" });
  }
}
