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
  loginUser = [{ id: 1, name: 'Officer Login', m_name: 'अधिकारी लॉगिन' }, { id: 2, name: 'School login', m_name: 'शाळा लॉगिन' }];
  //अधिकारी लॉगिन = 1 // शाळा लॉगिन = 2 
  encryptInfo: any;
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
      this.language = res ? res : 'English';
    })
    this.translate.use(this.language)
    this.loginDefForm();
  }

  loginDefForm() {
    this.loginForm = this.fb.group(({
      MobileNo: ['', [Validators.required, Validators.pattern(this.validation.mobile_No), Validators.minLength(10), Validators.maxLength(10)]],
      userType: [1],
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
      o1: ['', Validators.required],
      o2: ['', Validators.required],
      o3: ['', Validators.required],
      o4: ['', Validators.required],
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
      let str = `${loginData.MobileNo}?userType=${loginData.userType}&flag=${loginData.flag}`
      this.apiService.setHttp('get', 'zp_chandrapur/user-registration/' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.sendOtpFlag = true;
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

  clearMobAndOTP() {
    this.sendOtpFlag = false;
    this.loginForm.controls['MobileNo'].setValue('');
    this.loginForm.controls['o1'].setValue('');
    this.loginForm.controls['o2'].setValue('');
    this.loginForm.controls['o3'].setValue('');
    this.loginForm.controls['o4'].setValue('');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else if (this.loginForm.valid) {
      let loginData = this.loginForm.value;
      let str = `otpNumber=${loginData.o1}${loginData.o2}${loginData.o3}${loginData.o4}&mobileNumber=${loginData.MobileNo}&flag=${loginData.flag}`
      this.apiService.setHttp('get', 'zp_chandrapur/user-registration/VerifyOTP?' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
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
}
