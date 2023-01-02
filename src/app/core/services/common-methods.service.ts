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
    ctx.fillText(captcha.join(""), 45, 28);
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
    let regions_m = {
      "271301":{
        "taluka": "CHANDRAPUR",
        "taluka_m":"चंद्रपूर"
      },
      "271302":{
        "taluka": "BHADRAWATI",
        "taluka_m":"भद्रावत"
      },
      "271303":{
        "taluka": "WARORA",
        "taluka_m":"वरोरा"
      },
      "271304":{
        "taluka": "BALLARPUR",
        "taluka_m":"बल्लारपूर"
      },
      "271305":{
        "taluka": "RAJURA",
        "taluka_m":"राजुर",
      },
      "271306":{
        "taluka": "GONDPIPARI",
        "taluka_m":"गोंडपिंपर"
      },
      "271307":{
        "taluka": "KORPANA",
        "taluka_m":"कोरपना"
      },
      "271308":{
        "taluka": "MUL",
        "taluka_m":"मूल"
      },
      "271309":{
        "taluka": "SINDEWAHI",
        "taluka_m":"सिंदेवाही"
      },
      "271310":{
        "taluka": "NAGBHID",
        "taluka_m":"नागभीड"
      },
      "271311":{
        "taluka": "BRAMHAPURI",
        "taluka_m":"ब्रम्हपूरी"
      },
      "271312":{
        "taluka": "CHIMUR",
        "taluka_m":"चिमूर"
      },
      "271313":{
        "taluka": "SAOLI",
        "taluka_m":"सावली"
      },
      "271314":{
        "taluka": "POMBURNA",
        "taluka_m":"पोंभुर्णा"
      },
      "271315":{
        "taluka": "JIWATI",
        "taluka_m":"जिवती"
      },
    }
    
    return regions_m;
  }
  getUserTypeID() {
    let userTypeId = JSON.parse(this.webStorage.getLocalStorageData())
    return userTypeId.responseData.id;
  }
}
