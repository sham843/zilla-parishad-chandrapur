import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
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
  lang: string = 'en';
  constructor
    (
      private fb: FormBuilder, private service: ApiService,
      public dialogRef: MatDialogRef<RegisterSchoolComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      private webStorage: WebStorageService,
      private common: CommonMethodsService, private error: ErrorsService,
    ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
    this.getFormData();
    this.getDistrict();
    this.data ? this.onEditData() : '';
  }

  getFormData() {
    this.registerForm = this.fb.group({
      createdBy: 0,
      modifiedBy: 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: true,
      id: 0,
      schoolName: ['', Validators.required],
      m_SchoolName: '',
      stateId: [1, Validators.required],
      districtId: ['', Validators.required],
      talukaId: ['', Validators.required],
      centerId: ['', Validators.required],
      s_CategoryId: ['', Validators.required],
      s_TypeId: ['', Validators.required],
      g_GenderId: ['', Validators.required],
      g_ClassId: ['', Validators.required],
      lan: ''
    })
  }

  getDistrict() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllDistrict?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtArray = res.responseData;
        } else {
          this.districtArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
    this.editFlag ? this.getTaluka() : '';
  }

  getTaluka() {
    let formData = this.registerForm.value.districtId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang='+this.lang+'&DistrictId='+formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.talukaArray = res.responseData;
        } else {
          this.talukaArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
    this.editFlag ? this.getCenter() : '';
  }

  getCenter() {
    let formData = this.registerForm.value.talukaId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang='+this.lang+'&TalukaId=' + formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.centerArray = res.responseData;
        } else {
          this.centerArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
    this.editFlag ? this.getSchoolCategory() : '';
  }

  getSchoolCategory() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetSchoolCategory?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schoolcategoryArray = res.responseData;
        } else {
          this.schoolcategoryArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
    this.editFlag ? this.getSchoolType() : '';
  }

  getSchoolType() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllSchoolType?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schooltypeArray = res.responseData;
        } else {
          this.schooltypeArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
    this.editFlag ? this.getGenderAllow() : '';
  }

  getGenderAllow() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllGender?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.genderAllowArray = res.responseData;
        } else {
          this.genderAllowArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
    this.editFlag ? this.getGroupClass() : '';
  }

  getGroupClass() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllGroupClass?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.groupArray = res.responseData;
        } else {
          this.groupArray = [];
          this.common.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
  }

  onEditData(obj?: any) {
    obj = this.data
    this.editFlag = true;
    this.registerForm.patchValue({
      createdBy: 0,
      modifiedBy: 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: true,
      id: obj.id,
      schoolName: obj.schoolName,
      m_SchoolName: '',
      stateId: obj.stateId,
      districtId: obj.districtId,
      talukaId: obj.talukaId,
      centerId: obj.centerId,
      s_CategoryId: obj.s_CategoryId,
      s_TypeId: obj.s_TypeId,
      g_GenderId: obj.g_GenderId,
      g_ClassId: obj.g_ClassId,
      lan: ''
    })
    this.editFlag ? this.getDistrict() : '';
  }

  onSubmitData() {
    let formData = this.registerForm.value;
    if (this.registerForm.invalid) {
      return
    } if (!this.editFlag) {
      this.service.setHttp('post', 'zp_chandrapur/School/Add', false, formData, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.common.snackBar(res.statusMessage, 1);
            this.registerForm.reset();
            this.dialogRef.close();
          }
        }), error: (error: any) => {
          this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
        }
      })
    } else {
      this.editFlag = true;
      this.service.setHttp('put', 'zp_chandrapur/School/Update', false, formData, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.common.snackBar(res.statusMessage, 1);
            this.registerForm.reset();
            this.dialogRef.close();
          }
        }), error: (error: any) => {
          this.common.checkEmptyData(error.statusText) == false ? this.error.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
        }
      })
    }
  }

  clearForm() {
    this.editFlag = false;
  }
}




