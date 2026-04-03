import { Application, ApplicationSettings, Utils } from "@nativescript/core";
import { AppStateManager } from "./app-state.service";

@NativeClass()
@JavaProxy("com.tns.AppBlockerService")
export class AppBlockerService extends android.app.Service {
  private timerId: any = null;
  constructor() {
    super();
    return global.__native(this);
  }

  onStartCommand(
    intent: android.content.Intent,
    flags: number,
    startId: number,
  ): number {
    this.setupForegroundService();

    this.startMonitoring();

    return android.app.Service.START_STICKY;
  }

  private setupForegroundService() {
    const channelId = "BlockerChannel";
    const context = Utils.android.getApplicationContext();

    if (android.os.Build.VERSION.SDK_INT >= 26) {
      const channel = new android.app.NotificationChannel(
        channelId,
        "App Monitor",
        android.app.NotificationManager.IMPORTANCE_LOW,
      );
      const manager = context.getSystemService(
        android.content.Context.NOTIFICATION_SERVICE,
      );
      manager.createNotificationChannel(channel);
    }

    const builder = new androidx.core.app.NotificationCompat.Builder(
      context,
      channelId,
    )
      .setContentTitle("App Blocker Active")
      .setContentText("Monitoring your usage...")
      .setSmallIcon(
        context
          .getResources()
          .getIdentifier("ic_launcher", "mipmap", context.getPackageName()),
      );

    this.startForeground(1, builder.build());
  }

  private startMonitoring() {
    this.cleanupTimers(); 

    const context = Utils.android.getApplicationContext();
    const myPackageName = context.getPackageName();
    const usageStatsManager = context.getSystemService(
      android.content.Context.USAGE_STATS_SERVICE,
    );
    const state = AppStateManager.getInstance();

    state.isServiceRunning = true;

    // Save to the SHARED state so the Home Page can kill it too
    state.activeTimerId = global.setInterval(() => {
      const endTime = ApplicationSettings.getNumber("endTime", 0);
      const now = Date.now();
      const remaining = endTime - now;

      // 1. Check if time is up
      if (remaining <= 0) {
        console.log("Time up! Stopping service...");
        this.stopBlocker();
        return;
      }

      // 2. Update UI Timer
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      state.timeLeft = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

      console.log("Monitoring foreground apps...");

      // 3. App Blocking Logic
      const blockedAppsJson = ApplicationSettings.getString(
        "blockedApps",
        "[]",
      );
      const packages = JSON.parse(blockedAppsJson);

      const stats = usageStatsManager.queryUsageStats(
        android.app.usage.UsageStatsManager.INTERVAL_DAILY,
        now - 2000,
        now,
      );

      if (stats && stats.size() > 0) {
        let topApp = stats.get(0);
        for (let i = 0; i < stats.size(); i++) {
          if (stats.get(i).getLastTimeUsed() > topApp.getLastTimeUsed()) {
            topApp = stats.get(i);
          }
        }

        const currentPackage = topApp.getPackageName();
        const isBlocked = packages.includes(currentPackage);
        const isNotMe = currentPackage !== myPackageName;
        const isNotSystem =
          !currentPackage.includes("launcher") &&
          !currentPackage.includes("systemui");

        if (isBlocked && isNotMe && isNotSystem) {
          this.redirectToFocusScreen(context);
        }
      }
    }, 1000);
  }

  public stopBlocker() {
    console.log("Internal stopBlocker called (likely timer finished)...");
    this.cleanupAndStop();
    this.stopSelf();
  }

  private redirectToFocusScreen(context: any) {
    const intent = context
      .getPackageManager()
      .getLaunchIntentForPackage(context.getPackageName());
    if (intent) {
      intent.addFlags(
        android.content.Intent.FLAG_ACTIVITY_NEW_TASK |
          android.content.Intent.FLAG_ACTIVITY_REORDER_TO_FRONT,
      );
      context.startActivity(intent);
    }
  }

  private cleanupTimers() {
    if (this.timerId) {
      global.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private cleanupAndStop() {
    if (this.timerId) {
      global.clearInterval(this.timerId);
      this.timerId = null;
      console.log("TIMERS CLEARED ✅");
    }
    const state = AppStateManager.getInstance();
    state.isServiceRunning = false;
    state.timeLeft = "00:00";
    this.stopForeground(true);
  }

  onDestroy() {
    console.log(
      "AppBlockerService destroying (User stopped or system killed)...",
    );
    this.cleanupAndStop();
    super.onDestroy();
  }

  onBind(intent: android.content.Intent): android.os.IBinder {
    return null as any;
  }
}
