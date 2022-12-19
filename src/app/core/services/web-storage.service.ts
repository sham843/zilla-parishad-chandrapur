import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
private theme=new BehaviorSubject('');
  constructor() { }

  getTheme(){
    return this.theme.asObservable();
  }
  setTheme(className:any){
    this.theme.next(className);
  }
}
