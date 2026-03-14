import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  NO_ERRORS_SCHEMA,
  OnInit,
} from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { Utils, ImageSource } from "@nativescript/core";
import { CommonModule } from "@angular/common";

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
  selector: "app-focus-modal",
  templateUrl: "./focus-modal.component.html",
  styleUrls: ["./focus-modal.component.css"],
  schemas: [NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [CommonModule],
})
export class FocusModalComponent implements OnInit {
  finishTime: string = "";
  durationMinutes: number = 25;
  isScheduled: boolean = false;
  selectedMinutes: number = 30;
  categories: Category[] = [];

  setDuration(mins: number) {
    this.selectedMinutes = mins;
  }

  constructor(
    private params: ModalDialogParams,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {
    this.categories = params.context.categories;
  }

  ngOnInit() {
    this.calculateFinishTime();
  }

  calculateFinishTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + this.durationMinutes);
    this.finishTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  get isAnyExpanded(): boolean {
    return this.categories.some((cat) => cat.expanded);
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

  onAppToggle(app: any, cat: any, args: any) {
    app.selected = args.value;
  }

  isAllSelected(cat: any): boolean {
    if (!cat.apps || cat.apps.length === 0) return false;
    return cat.apps.every((app) => app.selected);
  }

  onClose() {
    this.params.closeCallback({ action: "cancel" });
  }

  onBeginFocus() {}

  onStart() {
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + this.selectedMinutes);
    console.log("Focusing until:", endTime);

    this.onClose();
  }
}
