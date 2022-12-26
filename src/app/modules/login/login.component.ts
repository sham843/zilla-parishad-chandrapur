import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import * as CryptoJS from 'crypto-js';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('formDirective') formDirective!: NgForm;
  loginForm!: FormGroup;
  sendOtpFlag: boolean = false;
  language!: string;
  loginUser = [{ id: 2, name: 'Officer Login', m_name: 'अधिकारी लॉगिन' }, { id: 3, name: 'School login', m_name: 'शाळा लॉगिन' }];
  otpTimer: number = 20
  otpTimerFlag: boolean = false;
  encryptInfo: any;
  otpTimerSub: any;
  forgotPasswodFlag: boolean = false;
  forgotPassword!: FormGroup;
  hide = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private errors: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    private commonMethods: CommonMethodsService,
    private webStorage: WebStorageService,
    private translate: TranslateService
  ) {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
    })
    this.translate.use(this.language)
    this.loginDefForm();
    this.forgotPasswordForm();
  }

  loginDefForm() {
    this.loginForm = this.fb.group(({
      MobileNo: ['', [Validators.required, Validators.pattern(this.validation.mobile_No), Validators.minLength(10), Validators.maxLength(10)]],
      userType: [2],
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
      o1: ['', Validators.required],
      o2: ['', Validators.required],
      o3: ['', Validators.required],
      o4: ['', Validators.required],
    }))
  }

  forgotPasswordForm() {
    this.loginForm = this.fb.group(({
      userName: [this.loginForm.value.MobileNo],
      password: [''],
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
    }))
  }

  get f() {
    return this.loginForm.controls;
  }

  sendOtp() {
    if (this.loginForm.controls['MobileNo'].status == 'INVALID') {
      this.commonMethods.snackBar(this.language == 'English' ? 'Please enter valid Mobile No. ' : 'कृपया वैध मोबाईल क्रमांक प्रविष्ट करा.', 1)
    } else {

      let loginData = this.loginForm.value;
      let str = `?MobileNo=${loginData.MobileNo}&userType=${loginData.userType}&flag=${loginData.flag}`
      this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetUserLogin' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.sendOtpFlag = true;
          this.setOtpTimer();
          this.commonMethods.snackBar(res.responseData.message, 0);
        }
        else {
          this.commonMethods.snackBar(res.responseData.message, 1)
        }
      }, (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }

  setOtpTimer() {
    this.otpTimerFlag = false;
    this.otpTimerSub = setInterval(() => {
      --this.otpTimer;
      if (this.otpTimer == 0) {
        this.otpTimerFlag = true;
        clearInterval(this.otpTimerSub);
        this.clearVal(false)
        this.otpTimer = 20;
      }
    }, 1000)
  }

  clearMobAndOTP() {
    this.sendOtpFlag = false;
    this.clearVal(true)
    clearInterval(this.otpTimerSub);
    this.otpTimer = 20;
  }

  clearVal(mobNoFlag: boolean) {
    if (mobNoFlag) {
      this.loginForm.controls['MobileNo'].setValue('');
    }
    this.loginForm.controls['o1'].setValue('');
    this.loginForm.controls['o2'].setValue('');
    this.loginForm.controls['o3'].setValue('');
    this.loginForm.controls['o4'].setValue('');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.commonMethods.snackBar(this.language == 'English' ? 'Please enter valid OTP...' : 'कृपया वैध OTP प्रविष्ट करा...', 1)
      return;
    } else if (this.loginForm.valid) {
      let loginData = this.loginForm.value;
      let str = `otpNumber=${loginData.o1}${loginData.o2}${loginData.o3}${loginData.o4}&userTypeId=${loginData.userType}&mobileNumber=${loginData.MobileNo}&flag=${loginData.flag}`
      this.apiService.setHttp('get', 'zp_chandrapur/user-registration/VerifyOTP?' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          if (res.responseData.pageLstModels.length == 0) {
            this.commonMethods.snackBar(this.language == 'English' ? 'Soory you not have right to access page. Please contact admin.' : 'सोरी तुम्हाला पृष्ठावर प्रवेश करण्याचा अधिकार नाही. कृपया प्रशासकाशी संपर्क साधा.', 1)
            return
          }
          sessionStorage.setItem('loggedIn', 'true');
          this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(JSON.stringify(res)), 'secret key 123').toString());
          localStorage.setItem('loggedInData', this.encryptInfo);
          this.router.navigate(['../dashboard'])
        }
        else {
          this.commonMethods.snackBar(res.statusMessage, 1)
        }
      }, (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }

  onSubmitFP() {
    let forgotPasswordData = this.forgotPassword.value;
    let str = `?userName=${forgotPasswordData.MobileNo}&password=${forgotPasswordData.password}&flag=${forgotPasswordData.flag}`
    this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetUserLogin' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.sendOtpFlag = true;
        this.commonMethods.snackBar(res.responseData.message, 0);
        this.forgotPasswodFlag = false;
      }
      else {
        this.commonMethods.snackBar(res.responseData.message, 1)
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }
}
