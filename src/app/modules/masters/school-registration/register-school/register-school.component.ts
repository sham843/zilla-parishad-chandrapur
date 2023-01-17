import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-register-school',
  templateUrl: './register-school.component.html',
  styleUrls: ['./register-school.component.scss']
})
export class RegisterSchoolComponent {
  registerForm!: FormGroup;
  districtArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  schoolcategoryArray = new Array();
  schooltypeArray = new Array();
  genderAllowArray = new Array();
  groupArray = new Array();
  editFlag: boolean = false;
  lang!: string;
  fromClassArray = new Array();
  toClassArray = new Array();
  subscription!: Subscription;
  showRedio: boolean = false;
  loginData: any;
  levelId!: number;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  radioArray = [{ id: 1, type: 'Rural' }, { id: 2, type: 'Urban' }]
  constructor
    (
      private spinner: NgxSpinnerService,
      private fb: FormBuilder,
      private service: ApiService,
      public dialogRef: MatDialogRef<RegisterSchoolComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      private webStorage: WebStorageService,
      private common: CommonMethodsService,
      private error: ErrorsService,
      public validator: ValidationService,
    ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId;
    if (this.data) {
      this.editFlag = true;
      this.getFormData(this.data);
    } else {
      this.getFormData();
      this.getSchoolCategory();
      this.getSchoolType();
      this.getGenderAllow();
      this.getFromClass();
    }
  }

  //#region ---------------------------------------Get Register Form Data------------------------------------------------------------
  getFormData(obj?: any) {
    this.registerForm = this.fb.group({
      schoolName: [obj?.schoolName || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern('^[-_., a-zA-Z0-9]+$')]],
      districtId: [obj?.districtId || this.loginData.districtId, [Validators.required]],
      talukaId: [obj?.talukaId || (this.levelId == 1 || this.levelId == 2 ? '' : this.loginData.talukaId), [Validators.required]],
      centerId: [obj?.centerId || (this.levelId == 1 || this.levelId == 2 ? '' : this.loginData.centerId),[Validators.required]],
      s_CategoryId: [obj?.s_CategoryId || '', Validators.required],
      s_TypeId: [obj?.s_TypeId || ''],
      g_GenderId: [obj?.g_GenderId || ''],
      classFrom: [obj?.classFrom || '', Validators.required],
      classTo: [obj?.classTo || '', Validators.required],
      udiseCode: [obj?.udiseCode || '', [Validators.required,Validators.maxLength(20)]],
      schoolLocationId: [obj?.schoolLocationId || 1, [Validators.required]],
      schoolAddress: [obj?.schoolAddress || '', [Validators.required, Validators.maxLength(500)]],
    })
    this.getDistrict();
  }
 
  getDistrict() {
    let formData = this.registerForm.value.districtId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllDistrict?flag_lang=' + (this.service.translateLang ? this.lang : 'en'), false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtArray = res.responseData;
          this.editFlag || this.levelId != 1 ? (this.registerForm.controls['districtId'].setValue(formData), this.getTaluka()) : this.getTaluka();
        } else {
          this.districtArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  getTaluka() {
    let formData = this.registerForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang=' + (this.service.translateLang ? this.lang : 'en') + '&DistrictId=' + formData.districtId, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.talukaArray = res.responseData;
          this.levelId == 3 || this.levelId == 4 || this.levelId == 5 || this.editFlag ? (this.registerForm.controls['talukaId'].setValue(formData.talukaId), this.getCenter()) : '';
        } else {
          this.talukaArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  getCenter() {
    this.centerArray = [];
    let formData = this.registerForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=' + (this.service.translateLang ? this.lang : 'en') + '&TalukaId=' + formData.talukaId, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.centerArray = res.responseData;
          this.levelId == 4 || this.levelId == 5 || this.editFlag ? this.registerForm.controls['centerId'].setValue(formData.centerId) : '';
          this.editFlag ? this.getSchoolCategory() : ' '
        } else {
          this.centerArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  getSchoolCategory() {
    let formData = this.registerForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetSchoolCategory?flag_lang=' + (this.service.translateLang ? this.lang : 'en'), false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schoolcategoryArray = res.responseData;
          this.editFlag ? (this.registerForm.controls['s_CategoryId'].setValue(formData.s_CategoryId), this.getSchoolType()) : ' '
        } else {
          this.schoolcategoryArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  getSchoolType() {
    let formData = this.registerForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllSchoolType?flag_lang=' + (this.service.translateLang ? this.lang : 'en'), false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schooltypeArray = res.responseData;
          this.editFlag ? (this.registerForm.controls['s_TypeId'].setValue(formData.s_TypeId), this.getGenderAllow()) : ' '
        } else {
          this.schooltypeArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  getGenderAllow() {
    let formData = this.registerForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllSchoolGender?flag_lang=' + (this.service.translateLang ? this.lang : 'en'), false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.genderAllowArray = res.responseData;
          this.editFlag ? (this.registerForm.controls['g_GenderId'].setValue(formData.g_GenderId), this.getFromClass()) : ' '
        } else {
          this.genderAllowArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  getFromClass() {
    let formData = this.registerForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllStandard?flag_lang=' + (this.service.translateLang ? this.lang : 'en'), false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.fromClassArray = res.responseData;
          this.toClassArray = res.responseData;
          this.editFlag ? (this.registerForm.controls['classFrom'].setValue(formData.classFrom), this.registerForm.controls['classTo'].setValue(formData.classTo)) : ' '
        } else {
          this.fromClassArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  onSubmitData() {
    this.spinner.show();
    let formData = this.registerForm.value;
    if (this.registerForm.invalid) {
      this.spinner.hide();      
      return;
    } else {
      this.spinner.hide();
      let radiovalue = this.registerForm.value.schoolLocationId;
      if (radiovalue == 'Rural') {
        this.registerForm.controls['schoolLocationId'].setValue(1);
      } else {
        this.registerForm.controls['schoolLocationId'].setValue(2);
      }
      let obj = {
        ...formData,
        createdBy: this.data ? this.data.createdBy : this.webStorage.getUserId(),
        modifiedBy: this.data ? this.data.modifiedBy : this.webStorage.getUserId(),
        createdDate: this.data ? this.data.createdDate : new Date(),
        modifiedDate: new Date(),
        isDeleted: true,
        id: this.data ? this.data.id : 0,
        stateId: 1,
        lan: this.lang,
        m_SchoolName: '',
      }
      this.service.setHttp(!this.data ? 'post' : 'put', 'zp_chandrapur/School/' + (!this.data ? 'Add' : 'Update'), false, obj, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.common.snackBar(res.statusMessage, 0);
            this.dialogRef.close(this.data ? 'post' : 'put');
            this.clearForm();
          } else {
            this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.error.handelError(error.status);
        }
      })
    }
  }
  clearForm() {
   if(!this.data){
    this.editFlag = false;
    let formData = this.registerForm.value;
    this.formDirective.resetForm({
      schoolLocationId: 1,
      districtId: formData.districtId,
      talukaId: this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? formData.talukaId : '',
      centerId: this.levelId == 4 || this.levelId == 5 ? formData.centerId : '',
    });
   }else if(this.data){
    this.dialogRef.close('No');
   }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  //#endregion ---------------------------------------Get Register Form Data------------------------------------------------------------


}




