import {Injectable} from '@angular/core'
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SharedService {
  private pageSource = new BehaviorSubject<string>('home');
  currentPage = this.pageSource.asObservable();

  updateCurrentPage(currentPage: string) {
    this.pageSource.next(currentPage);
  }
}
