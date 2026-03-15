import {
  ChangeDetectorRef,
  Component,
  NgZone,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalDialogParams } from "@nativescript/angular";
import { TimePickerComponent } from "../time-picker/time-picker.component";
import { ImageSource, Utils } from "@nativescript/core";
import { Page, Color } from "@nativescript/core";

interface AppItem {
  name: string;
  icon: any;
  selected: boolean;
  packageName?: string;
  nativeInfo?: any;
}

interface Category {
  title: string;
  packages?: string[];
  keywords: string[];
  apps: AppItem[];
  expanded: boolean;
  loading?: boolean;
}

@Component({
  selector: "app-schedule-modal",
  templateUrl: "./schedule-modal.component.html",
  styleUrl: "./schedule-modal.component.css",
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [CommonModule, TimePickerComponent],
})
export class ScheduleModalComponent {
  isWeekly: boolean = false;
  categories: Category[] = [];

  days: boolean[] = [false, false, true, true, true, false, false];
  constructor(
    private params: ModalDialogParams,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private page: Page,
  ) {
    this.categories = params.context.categories;
    this.page.on("loaded", (args) => {
      (<Page>args.object).backgroundColor = new Color("#00000000");
    });
  }

  toggleExpand(cat: Category) {
    if (cat.expanded) {
      cat.expanded = false;
      return;
    }

    cat.expanded = true;

    const needsLoading =
      cat.apps.length > 0 && cat.apps.some((app) => !app.icon);

    if (needsLoading) {
      cat.loading = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.zone.run(() => {
          const pm = Utils.android.getApplicationContext().getPackageManager();

          cat.apps.forEach((app) => {
            if (app.nativeInfo && !app.icon) {
              try {
                const nativeIcon = app.nativeInfo.loadIcon(pm);
                const iconSource = new ImageSource();
                iconSource.setNativeSource(nativeIcon);
                app.icon = iconSource;
                app.nativeInfo = null;
              } catch (e) {
                console.error("Icon error", e);
              }
            }
          });

          cat.loading = false;
          cat.expanded = true;
          this.cdr.detectChanges();
        });
      }, 100);
    }
  }

  toggleAll(cat: any, args: any) {
    const isChecked = args.value;

    if (this.isAllSelected(cat) !== isChecked) {
      cat.apps.forEach((app) => (app.selected = isChecked));
    }
  }

  get isAnyExpanded(): boolean {
    return this.categories.some((cat) => cat.expanded);
  }

  toggleDay(index: number) {
    this.days[index] = !this.days[index];
  }

  isAllSelected(cat: any): boolean {
    if (!cat.apps || cat.apps.length === 0) return false;
    return cat.apps.every((app) => app.selected);
  }

  onAppToggle(app: any, cat: any, args: any) {
    app.selected = args.value;
  }

  onClose() {
    this.params.closeCallback({ action: "cancel" });
  }

  onSchedule() {}
}
