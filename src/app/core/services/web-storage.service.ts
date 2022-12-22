import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class WebStorageService {
  // change theme
  private theme = new BehaviorSubject('')
  constructor() {}
  getTheme() {
    return this.theme.asObservable()
  }
  setTheme(className: any) {
    this.theme.next(className)
  }

  // change language
  private langName = new BehaviorSubject('')
  langNameOnChange = this.langName.asObservable();

  sendlangType(type: string) {
    this.langName.next(type)
  }

  checkUserIsLoggedIn() { // check user isLoggedIn or not
    let sessionData: any = sessionStorage.getItem('loggedIn');
    sessionData == null || sessionData == '' ? localStorage.clear() : '';
    if (localStorage.getItem('loggedInData') && sessionData == 'true') return true;
    else return false;
  }
}
