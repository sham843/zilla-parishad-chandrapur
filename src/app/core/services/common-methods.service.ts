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
      'path3109': {
        id: "1",
        tooltip: "पुणे",
      },
      'path3121': {
        id: "2",
        tooltip: "सांगली",

      },
      'path3117': {
        id: "3",
        tooltip: "सातारा",

      },
      'path3193': {
        id: "5",
        tooltip: "परभणी",

      },
      'path3209': {
        id: "6",
        tooltip: "यवतमाळ",

      },
      'path3113': {
        id: "7",
        tooltip: "सोलापूर",

      },
      'path3157': {
        id: "8",
        tooltip: "अहमदनगर",

      },
      'path3125': {
        id: "9",
        tooltip: "कोल्हापूर",

      },
      'path3169': {
        id: "10",
        tooltip: "औरंगाबाद",

      },
      'path3181': {
        id: "11",
        tooltip: "बीड",

      },
      'path3197': {
        id: "12",
        tooltip: "हिंगोली",

      },
      'path3173': {
        id: "13",
        tooltip: "जालना",

      },
      'path3185': {
        id: "14",
        tooltip: "लातूर",

      },
      'path3177': {
        id: "15",
        tooltip: "नांदेड",

      },
      'path3189': {
        id: "16",
        tooltip: "उस्मानाबाद",

      },
      'path3213': {
        id: "17",
        tooltip: "अकोला",

      },
      'path3201': {
        id: "18",
        tooltip: "अमरावती",

      },
      'path3205': {
        id: "19",
        tooltip: "बुलडाणा",

      },
      'path3217': {
        id: "20",
        tooltip: "वाशिम",

      },
      'path3165': {
        id: "21",
        tooltip: "धुळे",

      },
      'path3149': {
        id: "22",
        tooltip: "जळगाव",

      },
      'path3161': {
        id: "23",
        tooltip: "नंदुरबार",

      },
      'path3153': {
        id: "24",
        tooltip: "नाशिक",

      },
      'path3237': {
        id: "25",
        tooltip: "भंडारा",

      },
      'path3233': {
        id: "26",
        tooltip: "चंद्रपूर",

      },
      'path3229': {
        id: "27",
        tooltip: "गडचिरोली",

      },
      'path3241': {
        id: "28",
        tooltip: "गोंदिया",

      },
      'path3221': {
        id: "29",
        tooltip: "नागपूर",

      },
      'path3225': {
        id: "30",
        tooltip: "वर्धा",

      },
      'path3129': {
        id: "31",
        tooltip: "मुंबई उपनगर",

      },
      'path3137': {
        id: "32",
        tooltip: "रायगड",

      },
      'path3133': {
        id: "33",
        tooltip: "रत्नागिरी",

      },
      'path3141': {
        id: "34",
        tooltip: "सिंधुदुर्ग",

      },
      'path1022': {
        id: "35",
        tooltip: "ठाणे",

      },
      'path1026': {
        id: "36",
        tooltip: "मुंबई शहर",

      },
      'path3145': {
        id: "37",
        tooltip: "पालघर",

      },
    }


    return regions_m;
  }
  getUserTypeID() {
    let userTypeId = JSON.parse(this.webStorage.getLocalStorageData())
    return userTypeId.responseData.id;
  }
}
