import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import {
  NativeScriptCommonModule,
  NativeScriptFormsModule,
} from "@nativescript/angular";

interface BlockedSite {
  id: string;
  url: string;
}

@Component({
  selector: "ns-shield",
  imports: [NativeScriptCommonModule, NativeScriptFormsModule],
  standalone: true,
  templateUrl: "./shield.component.html",
  styleUrl: "./shield.component.css",
  schemas: [NO_ERRORS_SCHEMA],
})
export class ShieldComponent {
  siteValue: string = "";
  blockedSiteList: BlockedSite[] = [{ id: "1", url: "facebook.com" }];

  constructor(private router: Router) {}

  onAddSite() {
    if (!this.siteValue.trim()) return;

    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    this.blockedSiteList.push({
      id: uniqueId,
      url: this.siteValue,
    });

    this.siteValue = "";
  }

  onRemoveSite(id: string) {
    this.blockedSiteList = this.blockedSiteList.filter(
      (item) => item.id !== id,
    );
  }

  goToShield() {
    this.router.navigate(["/shield"]);
  }
}
