import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NativeScriptDateTimePickerModule } from "@nativescript/datetimepicker/angular";

@Component({
  selector: "ns-time-picker-modal",
  templateUrl: "./time-picker.component.html",
  styleUrl: "./time-picker.component.css",
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [CommonModule, NativeScriptDateTimePickerModule],
})
export class TimePickerComponent {
  constructor() {}
}
