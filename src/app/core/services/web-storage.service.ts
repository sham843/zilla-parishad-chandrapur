import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class WebStorageService {
  // change theme
  numFormat:any;
  private theme = new BehaviorSubject('')
  constructor() {}
  getTheme() {
    return this.theme.asObservable()
  }
  setTheme(className: any) {
    this.theme.next(className)
  }

  // change language
  setLanguage = new BehaviorSubject('')

  checkUserIsLoggedIn() {
    // check user isLoggedIn or not
    let sessionData: any = sessionStorage.getItem('loggedIn')
    sessionData == null || sessionData == '' ? localStorage.clear() : ''
    if (localStorage.getItem('loggedInData') && sessionData == 'true')
      return true
    else return false
  }

  getLocalStorageData(){
    let localData:any=localStorage.getItem('loggedInData');
    var deData = CryptoJS.AES.decrypt(decodeURIComponent(localData), 'secret key 123');
    return JSON.parse(deData.toString(CryptoJS.enc.Utf8));
  }

getUserId(){
  let userId=this.getLocalStorageData();
  return JSON.parse(userId).responseData.userTypeId;
}
getLoginData(){
  let userId=this.getLocalStorageData();
  return JSON.parse(userId).responseData;
}
  getAllPageName(){
    if (this.checkUserIsLoggedIn() == true) {
      let getAllPageName = JSON.parse(this.getLocalStorageData());
      return getAllPageName.responseData.pageLstModels;
    }
  }
  numberTransformFunction(value: any){
    this.setLanguage.subscribe((res:any)=>{
      res=='Marathi'?this.numFormat='mr-IN':this.numFormat='en';
    })
    let number = new Intl.NumberFormat(this.numFormat).format(value);        
      return number
  }
}
