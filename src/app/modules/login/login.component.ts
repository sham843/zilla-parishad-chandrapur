import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  forgotPasswodFlag: boolean = false;
  language!: string;
  loginForm: FormGroup | any;
  hide = true;
  encryptInfo: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private errors: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
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
    this.loginForm = this.fb.group(({
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
      userName: ['', [Validators.required, Validators.pattern(this.validation.mobile_No), Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z0-9])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{4,20}$')]],
      recaptchaReactive: ['', [Validators.required]],
    }))
  }

  get loginFormControls() { return this.loginForm.controls }

  ngAfterViewInit(): void {
    !this.forgotPasswodFlag ? this.commonMethods.createCaptchaCarrerPage() : '';
  }

  onSubmit() {
    const formValue = this.loginForm.value;
    if (this.loginForm.invalid) {
      return;
    } else if (formValue.recaptchaReactive?.trim() != this.commonMethods.checkvalidateCaptcha()) {
      this.commonMethods.snackBar("Please Enter Valid Captcha ", 1);
      this.commonMethods.createCaptchaCarrerPage();
      return;
    }
    let loginData = this.loginForm.value;
    delete loginData.recaptchaReactive
    this.apiService.setHttp('POST', 'zp_chandrapur/user-registration/check-login-user-for-web', false, loginData, false, 'baseUrl');
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
  //#endregion -----------------------------------------login from functionlity is ended--------------------------------------------------------//


}
