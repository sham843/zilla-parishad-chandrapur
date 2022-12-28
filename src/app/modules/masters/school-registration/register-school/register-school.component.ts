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
  subscription!: Subscription;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  constructor
    (
      private fb: FormBuilder,
      private service: ApiService,
      public dialogRef: MatDialogRef<RegisterSchoolComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      private webStorage: WebStorageService,
      private common: CommonMethodsService,
      private error: ErrorsService,
      public validator: ValidationService
    ) { }

  ngOnInit() {
    this.subscription=this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.data ? ( this.editFlag = true , this.getDistrict()):  this.getDistrict();
    this.getFormData();
  }

  //#region ---------------------------------------Get Register Form Data------------------------------------------------------------
  getFormData(obj?: any) {
    obj = this.data;
    this.registerForm = this.fb.group({
      createdBy: [obj ? obj.createdBy : this.webStorage.getUserId()],
      modifiedBy:[obj ? obj.modifiedBy :  this.webStorage.getUserId()],
      createdDate: [obj ? obj.createdDate : new Date()],
      modifiedDate: [new Date()],
      isDeleted: true,
      id: [obj ? obj.id : 0],
      schoolName: [obj?.schoolName || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern('^[-_., a-zA-Z0-9]+$')]],
      m_SchoolName: [''],
      stateId: [obj?.stateId || this.service.stateId, Validators.required],
      districtId: [obj?.districtId ||this.service.disId, Validators.required],
      talukaId: [obj?.talukaId || '', Validators.required],
      centerId: [obj?.centerId || '', Validators.required],
      s_CategoryId: [obj?.s_CategoryId || '', Validators.required],
      s_TypeId: [obj?.s_TypeId || '', Validators.required],
      g_GenderId: [obj?.g_GenderId || '', Validators.required],
      g_ClassId: [obj?.g_ClassId || '', Validators.required],
      lan:[ this.lang]
    })
  }
  getDistrict() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllDistrict?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtArray = res.responseData;
          this.editFlag ? (this.registerForm.controls['districtId'].setValue(this.data?.districtId), this.getTaluka()) : this.getTaluka();
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
          this.editFlag ? (this.registerForm.controls['talukaId'].setValue(this.data?.talukaId), this.getCenter()) : ''
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
    let formData = this.registerForm.value.talukaId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=' + this.lang + '&TalukaId=' + formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.centerArray = res.responseData;
          this.editFlag ? (this.registerForm.controls['centerId'].setValue(this.data?.centerId), this.getSchoolCategory()) : ''
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
          this.editFlag ? this.getSchoolType() : '';
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
          this.editFlag ? this.getGenderAllow() : '';
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
          this.editFlag ? this.getGroupClass() : '';
        } else {
          this.genderAllowArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
   
  }

  getGroupClass() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllGroupClass?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.groupArray = res.responseData;
        } else {
          this.groupArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }

  onSubmitData() {
    let formData = this.registerForm.value;
    if (this.registerForm.invalid) {
      return;
    } else {
      //  let api= !this.editFlag ?'zp_chandrapur/School/Add' :'zp_chandrapur/School/Update'
      this.service.setHttp(!this.editFlag ? 'post' : 'put', 'zp_chandrapur/School/' + (!this.editFlag ? 'Add' : 'Update'), false, formData, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.common.snackBar(res.statusMessage, 0);
            this.registerForm.reset();
            this.dialogRef.close(this.editFlag ? 'post' : 'put');
          }else{
            this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.error.handelError(error.status);
        }
      })
    }
  }

  clearForm() {
    this.editFlag = false;
    this.formDirective.reset();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  //#endregion ---------------------------------------Get Register Form Data------------------------------------------------------------
}




