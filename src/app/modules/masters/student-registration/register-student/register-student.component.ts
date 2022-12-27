import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent {
  studentFrm!: FormGroup;
  lang: string  = 'English';
  districtArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  schoolArray = new Array();
  standardArray = new Array();
  genderArray = new Array();
  religionArray = new Array();
  @ViewChild('formDirective')
  private formDirective!: NgForm;
  editFlag: boolean = false;
  addData: any;
  todayDate = new Date();

  constructor(
    private apiService: ApiService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private master: MasterService,
    private commonMethod: CommonMethodsService,
    public validation: ValidationService,
    private ngxspinner: NgxSpinnerService,
    private webStorage: WebStorageService,
    private dialogRef: MatDialogRef<RegisterStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
    })
    this.formData();
    
    if (this.data) {
      this.onEdit()
    } else {
      this.getDistrict();
      this.getStandard(this.lang);
      this.getReligion(this.lang);
      this.getGender(this.lang);
    }
  }
   //#region  -----------------------------------------------------form Fun start heare ---------------------------------------------------//
   formData(data?: any) {
    this.studentFrm = this.fb.group({
      "id": [data?.id || 0],
      "f_Name": [data?.f_Name || '', [Validators.required, Validators.pattern(this.validation.fullName)]],
      "m_Name": [data?.m_Name || '', [Validators.required, Validators.pattern(this.validation.fullName)]],
      "l_Name": [data?.l_Name || '', [Validators.required, Validators.pattern(this.validation.fullName)]],
      "districtId": [data?.districtId || this.apiService.disId, [Validators.required]],
      "talukaId": [data?.talukaId || '', Validators.required],
      "centerId": [data?.centerId || '', [Validators.required]],
      "schoolId": [data?.schoolId || '', [Validators.required]],
      "standardId": [data?.standardId || '', [Validators.required]],
      "saralId": [data?.saralId || '', [Validators.required,Validators.minLength(2)]],
      "genderId": [data?.genderId || '', [Validators.required]],
      "dob": [data?.dob || '', [Validators.required]],
      "aadharNo": [data?.aadharNo || '', [Validators.required, Validators.pattern(this.validation.aadhar_card)]],
      "religionId": [data?.religionId || '', [Validators.required]],
      "cast": [data?.cast || '', [Validators.required, Validators.pattern(this.validation.fullName)]],
      "parentsMobileNo": [data?.parentsMobileNo || '', [Validators.required, Validators.pattern(this.validation.mobile_No)]],
      "stateId": [data?.stateId || this.apiService.stateId],
      "lan": ['' || this.lang],
      "emailId": [''],
    })
  }

  get f() {
    return this.studentFrm.controls;
  }

  onEdit() {
    this.editFlag = true;
    this.formData(this.data);
    this.getDistrict();
    this.getStandard(this.lang);
    this.getReligion(this.lang);
    this.getGender(this.lang);
  }

  clearForm() {
    this.formDirective.resetForm();
    this.editFlag = false;
    this.formData();
  }

  clearDropdown(flag: any) {
    this.editFlag = false;
    switch (flag) {
      case 'talukaId':
        this.studentFrm.controls['centerId'].setValue('');
        this.studentFrm.controls['schoolId'].setValue('');
        break;
      case 'centerId':
        this.studentFrm.controls['schoolId'].setValue('');
        break;
    }
  }

  //#endregion -----------------------------------------------------form Fun end heare ---------------------------------------------------//


  //#region -------------------------------------------------------dropdown fun start heare-----------------------------------------//
  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.districtArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['districtId'].setValue(this.data.districtId), this.getTaluka(this.studentFrm.value.districtId)) : this.getTaluka(this.studentFrm.value.districtId);
        }
        else {
          this.districtArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  getTaluka(districtId: any) {
    this.master.getAllTaluka(this.lang, districtId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['talukaId'].setValue(this.data.talukaId), this.getCenter(this.studentFrm.value.talukaId)) : '';
        }
        else {
          this.talukaArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  getCenter(talukaId: number) {
    this.master.getAllCenter(this.lang, talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['centerId'].setValue(this.data.centerId), this.getSchool(this.lang, this.studentFrm.value.centerId)) : '';
        }
        else {
          this.centerArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  getSchool(strPara: string, centerId: number) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + strPara + '&CenterId=' + centerId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
          this.editFlag ? this.studentFrm.controls['schoolId'].setValue(this.data.schoolId) : '';
        }
        else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  getStandard(strPara: string) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllStandard?flag_lang=' + strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.standardArray = res.responseData;
            this.editFlag ?   this.studentFrm.controls['standardId'].setValue(this.data.standardId) : '';
        }
        else {
          this.standardArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  getGender(strPara: string) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllGender?flag_lang=' + strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.genderArray = res.responseData;
          this.editFlag ? this.studentFrm.controls['genderId'].setValue(this.data.genderId) : '';
        }
        else {
          this.genderArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }

  getReligion(strPara: string) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllReligion?flag_lang=' + strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.religionArray = res.responseData;
          this.editFlag ? this.studentFrm.controls['religionId'].setValue(this.data.religionId) : '';
        }
        else {
          this.religionArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
      }
    })
  }
  //#endregion -----------------------------------------------------dropdown fun end heare ----------------------------------------//

 
  onClickSubmit() {
    if (!this.studentFrm.valid) {
      return;
    } else {
      this.ngxspinner.show();
      let data = this.studentFrm.value;
      let obj = {
        "createdBy": !this.editFlag ? this.webStorage.getUserId() : this.data.createdBy,
        "modifiedBy": this.webStorage.getUserId(),
        "createdDate": !this.editFlag ? new Date() :  this.data.createdDate,
        "modifiedDate": new Date(),
        "isDeleted": false,
      }
      let mainData = { ...obj, ...data};
      let url;
      this.editFlag ? url = 'zp-Chandrapur/Student/UpdateStudent' : url = 'zp-Chandrapur/Student/AddStudent'
      this.apiService.setHttp(this.editFlag ? 'put' : 'post', url, false, mainData, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.ngxspinner.hide();
          if (res.statusCode == '200') {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.clearForm();
            this.editFlag = false;
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.ngxspinner.hide();
          this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
        }
      })
    }
  }
}
