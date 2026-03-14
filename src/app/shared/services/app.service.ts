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
  keywords: string[];
  apps: AppItem[];
  expanded: boolean;
  loading?: boolean;
}

declare var android: any;

@Injectable({ providedIn: "root" })
export class AppService {
  categories: Category[] = [
    {
      title: "Social",
      packages: ["com.twitter.android"],
      keywords: ["faceb", "insta", "twit", "tok", "snap", "linked", "whatsa"],
      apps: [],
      expanded: false,
    },
    {
      title: "Games",
      keywords: ["game", "roblox", "candy", "pubg", "fortnite"],
      apps: [],
      expanded: false,
    },
    { title: "Other", keywords: [], apps: [], expanded: false },
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
        const pkgName = appInfo.packageName.toLowerCase();

        let matched =
          this.categories.find(
            (cat) =>
              cat.packages?.some((p) => pkgName === p.toLowerCase()) ||
              cat.keywords.some((k) => appName.toLowerCase().includes(k)),
          ) || this.categories.find((c) => c.title === "Other");

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
