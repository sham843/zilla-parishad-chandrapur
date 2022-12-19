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
  langNameOnChange = this.langName.asObservable()
  sendlangType(type: string) {
    this.langName.next(type)
  }
}
