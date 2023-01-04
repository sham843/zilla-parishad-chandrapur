import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';
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
    this.data ?  (this.editFlag  = true, this.getDistrict()) :this.editFlag  = false
    this.getFormData()
  }

  //#region ---------------------------------------Get Register Form Data------------------------------------------------------------
  getFormData() {
    let obj = this.data;
    this.registerForm = this.fb.group({
      schoolName: [obj?.schoolName || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern('^[-_., a-zA-Z0-9]+$')]],
      districtId: ['', Validators.required],
      talukaId: [obj?.talukaId || this.loginData.talukaId, Validators.required],
      centerId: [obj?.centerId || this.loginData.centerId, Validators.required],
      s_CategoryId: [obj?.s_CategoryId || '', Validators.required],
      s_TypeId: [obj?.s_TypeId || ''],
      g_GenderId: [obj?.g_GenderId || ''],
      classFrom: [obj?.classFrom || '', Validators.required],
      classTo: [obj?.classTo || '', Validators.required],
      udiseCode: [obj?.udiseCode || '', [Validators.required]],
      schoolLocationId: [obj?.schoolLocationId || 1, [Validators.required]],
      schoolAddress: [obj?.schoolAddress || '', [Validators.required]],
    })
    // if (flag != 'clear') {
    //   this.getDistrict();
    //   this.getSchoolCategory();
    //   this.getSchoolType();
    //   this.getGenderAllow();
    //   this.getFromClass();
    //   // this.getToClass();
    // }
  }

  getDistrict() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllDistrict?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtArray = res.responseData;
          // this.registerForm.controls['districtId'].setValue(this.service.disId)
          this.editFlag || this.levelId !=1 ? (this.registerForm.controls['districtId'].setValue(this.data?.districtId), this.getTaluka()) : this.getTaluka();
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
    let formData = this.registerForm.value.districtId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang=' + this.lang + '&DistrictId=' + formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.talukaArray = res.responseData;
          this.levelId == 3 || this.levelId == 4 || this.levelId == 5 || this.editFlag ? (this.registerForm.controls['talukaId'].setValue(this.loginData.talukaId), this.getCenter()) : '';
          // this.editFlag ? (this.registerForm.controls['talukaId'].setValue(this.data?.talukaId), this.getCenter()) : ''
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
    let formData = this.registerForm.value.talukaId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=' + this.lang + '&TalukaId=' + formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.centerArray = res.responseData;
          this.levelId == 4 || this.levelId == 5 ? this.registerForm.controls['centerId'].setValue(this.loginData.centerId) : '';
          this.editFlag ? (this.registerForm.controls['centerId'].setValue(this.data?.centerId)) : ''
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
    this.service.setHttp('get', 'zp_chandrapur/master/GetSchoolCategory?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schoolcategoryArray = res.responseData;
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
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllSchoolType?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schooltypeArray = res.responseData;
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
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllGender?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.genderAllowArray = res.responseData;
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
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllStandard?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.fromClassArray = res.responseData;
          this.toClassArray = res.responseData
        } else {
          this.fromClassArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  // getToClass() {
  //   this.service.setHttp('get', 'zp_chandrapur/master/GetAllStandard?flag_lang=' + this.lang, false, false, false, 'baseUrl');
  //   this.service.getHttp().subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == '200') {
  //         this.toClassArray = res.responseData
  //       } else {
  //         this.toClassArray = [];
  //         this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
  //       }
  //     }), error: (error: any) => {
  //       this.error.handelError(error.status);
  //     }
  //   })
  // }

  onSubmitData() {
    let formData = this.registerForm.value;
    if (this.registerForm.invalid) {
      if (this.registerForm.controls['schoolLocationId'].invalid) {
        this.showRedio = true
      }
      return;
    } else {
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
            this.registerForm.reset();
            this.dialogRef.close(this.data ? 'post' : 'put');
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
    this.showRedio = false;
    this.editFlag = false;
    this.formDirective.resetForm({
      schoolLocationId: 1
    });
    // this.getFormData('clear');
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  //#endregion ---------------------------------------Get Register Form Data------------------------------------------------------------


}




