import {
  ChangeDetectorRef,
  Component,
  NgZone,
  NO_ERRORS_SCHEMA,
  OnInit,
} from "@angular/core";
import { ModalDialogParams } from "@nativescript/angular";
import { Utils, ImageSource, Device } from "@nativescript/core";
import { CommonModule } from "@angular/common";
import { ApplicationSettings } from "@nativescript/core";
import { AppBlockerService } from "../shared/services/app-blocker.service.android";

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
      cat.apps.forEach((app: AppItem) => (app.selected = isChecked));
    }

    this.cdr.markForCheck();
  }

  onAppToggle(app: any, cat: any, args: any) {
    app.selected = args.value;
    this.cdr.markForCheck();
  }

  get canStartFocus(): boolean {
    const selected = this.categories.some((cat) =>
      cat.apps.some((app) => app.selected),
    );
    console.log("Checking selection status:", selected);
    return selected;
  }

  isAllSelected(cat: any): boolean {
    if (!cat.apps || cat.apps.length === 0) return false;
    return cat.apps.every((app: AppItem) => app.selected);
  }

  onClose() {
    this.params.closeCallback({ action: "cancel" });
  }

  private checkUsagePermission() {
    const context = Utils.android.getApplicationContext();
    const appOps = context.getSystemService(
      android.content.Context.APP_OPS_SERVICE,
    ) as android.app.AppOpsManager;
    const mode = appOps.checkOpNoThrow(
      "android:get_usage_stats",
      android.os.Process.myUid(),
      context.getPackageName(),
    );

    if (mode !== android.app.AppOpsManager.MODE_ALLOWED) {
      console.log("Permission NOT granted. Opening settings...");
      const intent = new android.content.Intent(
        android.provider.Settings.ACTION_USAGE_ACCESS_SETTINGS,
      );
      intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);
      return false;
    }
    return true;
  }

  private serviceRunning = false;

  onStart() {
    if (this.serviceRunning) return;
    if (!this.checkUsagePermission() || !this.checkOverlayPermission()) return;

    const selectedPackages: string[] = this.categories
      .flatMap((cat) => cat.apps)
      .filter((app) => app.selected && typeof app.packageName === "string")
      .map((app) => app.packageName as string);

    if (selectedPackages.length === 0) {
      alert("Please select at least one app to block.");
      return;
    }

    // 1. Save data so the Service can read it
    ApplicationSettings.setString(
      "blockedApps",
      JSON.stringify(selectedPackages),
    );
    ApplicationSettings.setNumber(
      "endTime",
      Date.now() + this.selectedMinutes * 60000,
    );

    const context = Utils.android.getApplicationContext();

    const intent = new android.content.Intent(
      context,
      (AppBlockerService as any).class,
    );

    if (android.os.Build.VERSION.SDK_INT >= 26) {
      context.startForegroundService(intent);
    } else {
      context.startService(intent);
    }

    this.serviceRunning = true;
    this.params.closeCallback({ action: "started" });
  }

  private checkOverlayPermission() {
    const context = Utils.android.getApplicationContext();
    // Settings.canDrawOverlays is available on API 23+
    if (android.os.Build.VERSION.SDK_INT >= 23) {
      if (!android.provider.Settings.canDrawOverlays(context)) {
        console.log("Overlay permission NOT granted. Opening settings...");
        const intent = new android.content.Intent(
          android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
          android.net.Uri.parse("package:" + context.getPackageName()),
        );
        intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
        return false;
      }
    }
    return true;
  }

  onStopFocus() {
    const context = Utils.android.getApplicationContext();
    const intent = new android.content.Intent(
      context,
      (AppBlockerService as any).class,
    );

    context.stopService(intent);
  }
}
