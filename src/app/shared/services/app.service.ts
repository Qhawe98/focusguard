import { Injectable } from "@angular/core";
import { Utils } from "@nativescript/core";

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
  apps: AppItem[];
  expanded: boolean;
  loading?: boolean;
  nativeCategory?: number;
}

declare var android: any;

@Injectable({ providedIn: "root" })
export class AppService {
  categories: Category[] = [
    { title: "Games", nativeCategory: 0, apps: [], expanded: false },
    { title: "Social", nativeCategory: 4, apps: [], expanded: false },
    { title: "Productivity", nativeCategory: 7, apps: [], expanded: false },
    { title: "Entertainment", nativeCategory: 3, apps: [], expanded: false },
    { title: "Other", nativeCategory: -1, apps: [], expanded: false },
  ];

  loadApps() {
    if (!global.isAndroid) return;

    const context = Utils.android.getApplicationContext();
    const pm = context.getPackageManager();
    const apps = pm.getInstalledApplications(
      android.content.pm.PackageManager.GET_META_DATA,
    );

    this.categories.forEach((c) => (c.apps = []));

    for (let i = 0; i < apps.size(); i++) {
      const appInfo = apps.get(i);

      if (pm.getLaunchIntentForPackage(appInfo.packageName)) {
        const appName = appInfo.loadLabel(pm).toString();

        let appCategory = -1;
        if (android.os.Build.VERSION.SDK_INT >= 26) {
          appCategory = appInfo.category;
        } else if (
          (appInfo.flags & android.content.pm.ApplicationInfo.FLAG_IS_GAME) !==
          0
        ) {
          appCategory = 0;
        }

        let matched =
          this.categories.find((c) => c.nativeCategory === appCategory) ||
          this.categories.find((c) => c.title === "Other");

        if (matched) {
          matched.apps.push({
            name: appName,
            packageName: appInfo.packageName,
            selected: false,
            icon: null,
            nativeInfo: appInfo,
          });
        }
      }
    }
  }
}
