import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswodFlag: boolean = false;
  language!: string;
  forgotPasswordForm: FormGroup | any;
  hide = true;
  chide = true;
  encryptInfo: any;
  otpTimer: number = 20
  otpTimerFlag: boolean = false;
  otpTimerSub: any;
  sendOtpFlag: boolean = false;
  verOtpFlag: boolean = false;

  constructor(
    private apiService: ApiService,
    private errors: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    private router: Router,
    public commonMethods: CommonMethodsService,
    private webStorage: WebStorageService,
    private translate: TranslateService) {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
    })
    this.translate.use(this.language)
    this.loginDefForm();
  }

  //#region --------------------------------------------login form functionlity is started------------------------------------------------------//
  loginDefForm() {
    this.forgotPasswordForm = this.fb.group(({
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
      mobileNumber: ['', [Validators.required, Validators.pattern(this.validation.mobile_No), Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{4,20}$')]],
      cpassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{4,20}$')]],
      otpNumber: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]]
    }))
  }

  get forgotPasswordFormControls() { return this.forgotPasswordForm.controls }



  sendOtp() {
    if (this.forgotPasswordForm.controls.mobileNumber.status == 'INVALID') {
      this.commonMethods.snackBar(this.language == 'English' ? 'Please enter valid Mobile No...' : 'कृपया वैध OTP प्रविष्ट करा...', 1)
      return;
    } else {
      let loginData = this.forgotPasswordForm.value;
      let str = `mobileNumber=${loginData.mobileNumber}&flag=${loginData.flag}`
      this.apiService.setHttp('POST', 'zp_chandrapur/user-registration/generate-otp-for-forgot-password?' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.setOtpTimer();
          this.sendOtpFlag = true;
          this.commonMethods.snackBar(res.statusMessage, 0);
        }
        else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }

  verOtp() {
    if (this.forgotPasswordForm.controls.mobileNumber.status != 'VALID' || this.forgotPasswordForm.controls.otpNumber.status != 'VALID') {
      this.commonMethods.snackBar(this.language == 'English' ? 'Please enter valid OTP...' : 'कृपया वैध OTP प्रविष्ट करा...', 1)
      return;
    } else {
      let loginData = this.forgotPasswordForm.value;
      let str = `otpNumber=${loginData.otpNumber}&mobileNumber=${loginData.mobileNumber}&flag=${loginData.flag}`
      this.apiService.setHttp('post', 'zp_chandrapur/user-registration/verfify-forgot-password-webotp?' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.verOtpFlag = true;
          this.commonMethods.snackBar(res.statusMessage, 0);
        }
        else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }

  clearMobAndOTP() {
    let formValue = this.forgotPasswordForm.value;
    formValue?.mobileNumber ?  this.forgotPasswordForm.controls['mobileNumber'].setValue('') : '';
    formValue?.otpNumber ?this.forgotPasswordForm.controls['otpNumber'].setValue('') : '';
    this.sendOtpFlag = false;
    clearInterval(this.otpTimerSub);
    this.otpTimer = 20;
  }

  setOtpTimer() {
    this.otpTimerFlag = false;
    this.otpTimerSub = setInterval(() => {
      --this.otpTimer;
      if (this.otpTimer == 0) {
        this.otpTimerFlag = true;
        clearInterval(this.otpTimerSub);
        this.otpTimer = 20;
      }
    }, 1000)
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.commonMethods.snackBar(this.language == 'English' ? 'Something went wrong' : '', 1)
      return;
    } else {
      let loginData = this.forgotPasswordForm.value;
      let obj = {
        "userName": loginData.mobileNumber,
        "password": loginData.password,
        "flag": loginData.flag
      }
      this.apiService.setHttp('post', 'zp_chandrapur/user-registration/forgot-password-for-web', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.router.navigate(['../login']);
        }
        else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }


  //#endregion -----------------------------------------login from functionlity is ended--------------------------------------------------------//
}