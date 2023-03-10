import { Injectable } from '@angular/core';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { WebStorageService } from './web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {
  codecareerPage: any;
  constructor(private SnackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private webStorage: WebStorageService) { }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this.SnackBar.open(data, " ", {
      duration: 2000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  sanckBarHide() {
    this.SnackBar.dismiss();
  }

  checkEmptyData(data: any) {
    let value: any;
    if (data == "" || data == null || data == "null" || data == undefined || data == "undefined" || data == 'string' || data == null || data == 0) {
      value = false;
    } else {
      value = true;
    }
    return value;
  }

  routerLinkRedirect(path: any) {
    this.router.navigate([path], { relativeTo: this.activatedRoute })
  }

  isEmptyArray(array: any) {
    if (array == null || array == undefined || array.length <= 0) {
      return true;
    } else {
      return false;
    }
  }

  getLanguageFlag() {
    let language;
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? language = 'mr-IN' : language = 'en';
    })
    return language;
  }

  createCaptchaCarrerPage() {
    //clear the contents of captcha div first
    let id: any = document.getElementById('captcha');
    id.innerHTML = "";
    // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";

    var charsArray = "0123456789";
    var lengthOtp = 4;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length + 0); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha1";
    canv.width = 120;
    canv.height = 28;
    //var ctx:any = canv.getContext("2d");
    var ctx: any = canv.getContext("2d");
    ctx.font = "26px Arial";
    ctx.fillText(captcha.join(""), 40, 28);
    // ctx.strokeText(captcha.join(""), 0, 30);
    //storing captcha so that can validate you can save it somewhere else according to your specific requirements
    this.codecareerPage = captcha.join("");
    let appendChild: any = document.getElementById("captcha");
    appendChild.appendChild(canv); // adds the canvas to the body element

  }

  checkvalidateCaptcha() {
    return this.codecareerPage;
  }

  getUserName() {
    let username = JSON.parse(this.webStorage.getLocalStorageData())
    return username.responseData.mobileNo;
    ;
  }

  mapRegions() {
    let regions_m = '';
    return regions_m;
  }
  getUserID() {
    let userTypeId = JSON.parse(this.webStorage.getLocalStorageData())
    return userTypeId.responseData.id;
  }
  //search in filter method
  filterInDropdown(value: string,filterArray:any){
    const filterValue = value.toLowerCase();
    return filterArray.filter((value:any) => value.schoolName.toLowerCase().includes(filterValue));
  }

  redToNextPageWithPar(id: any, link: string, label: string) {
    this.router.navigate([link + encodeURIComponent(CryptoJS.AES.encrypt(id.toString(), label).toString())]);
  }

  recParToUrl(id: any, label:string){
     let res =  CryptoJS.AES.decrypt(decodeURIComponent(id), label).toString(CryptoJS.enc.Utf8);
     return res;
  }
/*  private _filterStates(value: string): any {
    const filterValue = value.toLowerCase();
    return this.desigantionLevelArray.filter(state => state.desingationLevel.toLowerCase().includes(filterValue));
  } */
}
