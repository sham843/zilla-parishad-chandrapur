import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
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
  lang: string = 'English';
  districtArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  schoolArray = new Array();
  standardArray = new Array();
  genderArray = new Array();
  religionArray = new Array();
  casteArray = new Array();
  educationYearArray = new Array();
  @ViewChild('formDirective')
  private formDirective!: NgForm;
  editFlag: boolean = false;
  addData: any;
  todayDate = new Date();
  subscription!: Subscription;
  loginData: any;
  levelId!: number;

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
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
    })
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId;


    if (this.data) {
      this.onEdit();
    } else {
      this.formData();
      // this.getDistrict();
      this.getGender();
      this.getReligion();
      this.getCaste()
      this.getEducationYear()
    }
  }
  //#region  -----------------------------------------------------form Fun start heare ---------------------------------------------------//
  formData(data?: any) {
    this.studentFrm = this.fb.group({
      "id": [data?.id || 0],
      "f_Name": [data?.f_Name || '', [Validators.required, Validators.pattern(this.validation.fullName), Validators.minLength(2)]],
      "m_Name": [data?.m_Name || '', [Validators.pattern(this.validation.fullName), Validators.minLength(2)]],
      "l_Name": [data?.l_Name || '', [Validators.required, Validators.pattern(this.validation.fullName), Validators.minLength(2)]],
      "f_Name_Mar": [data?.f_Name_Mar || '', [Validators.pattern(this.validation.marathi)]],
      "m_Name_Mar": [data?.m_Name_Mar || '', [Validators.pattern(this.validation.marathi)]],
      "l_Name_Mar": [data?.l_Name_Mar || '', [Validators.pattern(this.validation.marathi)]],
      "districtId": [data?.districtId || this.apiService.disId, [Validators.required]],
      "talukaId": [data?.talukaId || (this.levelId == 1|| this.levelId == 2 ? '' : this.loginData.talukaId),  Validators.required],
      "centerId": [data?.centerId || (this.levelId == 1|| this.levelId == 2 ? '' :  this.loginData.centerId),  Validators.required],
      "schoolId": [data?.schoolId || (this.levelId == 1|| this.levelId == 2 ? '' :  this.loginData.schoolId), Validators.required],
      "standardId": [data?.standardId || '', Validators.required],
      "saralId": [data?.saralId || '', [Validators.required, Validators.minLength(2)]],
      "genderId": [data?.genderId || '',Validators.required],
      "dob": [data?.dob || ''],
      "aadharNo": [data?.aadharNo || '', [Validators.pattern(this.validation.aadhar_card)]],
      "religionId": [data?.religionId || 0],
      "castId": [data?.castId || 0],
      "parentsMobileNo": [data?.parentsMobileNo || '', [Validators.pattern(this.validation.mobile_No)]],
      "stateId": [data?.stateId || this.apiService.stateId],
       "educationYearId": [data?.educationYearId || '', Validators.required],
       "lan": ['' || this.lang],
      "emailId": [''],
    })
    this.getDistrict();
  }

  get f() {
    return this.studentFrm.controls;
  }

  onEdit() {
    this.editFlag = true;
    this.formData(this.data);
  }

  clearForm() {
   if(!this.data){
    this.formDirective.resetForm();
    this.formData();
   this.editFlag = false;
   this.getDistrict();
   }
   else if(this.data){
    this.dialogRef.close('No');
   }
  }

  clearDropdown(flag: any) {
    this.editFlag = false;
    switch (flag) {
      case 'talukaId':
        this.studentFrm.controls['centerId'].setValue('');
        this.studentFrm.controls['schoolId'].setValue('');
        this.studentFrm.controls['standardId'].setValue('');
        break;
      case 'centerId':
        this.studentFrm.controls['schoolId'].setValue('');
        this.studentFrm.controls['standardId'].setValue('');
        break;
      case 'schoolId':
        this.studentFrm.controls['standardId'].setValue('');
        break;
    }
  }

  //#endregion -----------------------------------------------------form Fun end heare ---------------------------------------------------//


  //#region -------------------------------------------------------dropdown fun start heare-----------------------------------------//
  getDistrict() {
    this.master.getAllDistrict(this.apiService.translateLang?this.lang:'en').subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.districtArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['districtId'].setValue(this.studentFrm.value.districtId), this.getTaluka()) : this.getTaluka();
        }
        else {
          this.districtArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getTaluka() {
    this.master.getAllTaluka((this.apiService.translateLang?this.lang:'en'), this.studentFrm.value.districtId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          this.editFlag || this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? (this.studentFrm.controls['talukaId'].setValue(this.studentFrm.value.talukaId),this.getCenter()) :'';
        }
        else {
          this.talukaArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    });
  }

  getCenter() {
    this.master.getAllCenter((this.apiService.translateLang?this.lang:'en'), this.studentFrm.value.talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          this.editFlag || this.levelId == 4 || this.levelId == 5 ? (this.studentFrm.controls['centerId'].setValue(this.studentFrm.value.centerId), this.getSchool()) : '';
        }
        else {
          this.centerArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getSchool() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + (this.apiService.translateLang?this.lang:'en') + '&CenterId=' + this.studentFrm.value.centerId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
          this.editFlag || this.levelId == 5 ? (this.studentFrm.controls['schoolId'].setValue(this.studentFrm.value.schoolId), this.getStandard()) : '';
        }
        else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getStandard() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllClassBySchoolId?flag_lang=' + (this.apiService.translateLang?this.lang:'en') + '&SchoolId=' + this.studentFrm.value.schoolId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.standardArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['standardId'].setValue(this.data.standardId), this.getGender()) : '';
        }
        else {
          this.standardArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }



  getGender() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllGender?flag_lang=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.genderArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['genderId'].setValue(this.data.genderId), this.getReligion()) : '';
        }
        else {
          this.genderArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getReligion() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllReligion?flag_lang=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.religionArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['religionId'].setValue(this.data.religionId), this.getCaste()) : '';
        }
        else {
          this.religionArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getCaste() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllCast?flag_lang=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.casteArray = res.responseData;
          this.editFlag ? (this.studentFrm.controls['castId'].setValue(this.data.castId), this.getEducationYear()) : '';
        }
        else {
          this.casteArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getEducationYear() {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/get-all-educationyear-details?flag_lang=' + (this.apiService.translateLang?this.lang:'en'), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.educationYearArray = res.responseData;
          this.editFlag ? this.studentFrm.controls['educationYearId'].setValue(this.data.educationYearId) : 
          this.studentFrm.controls['educationYearId'].setValue(this.educationYearArray[0].id);
        }
        else {
          this.casteArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }
  //#endregion -----------------------------------------------------dropdown fun end heare ----------------------------------------//


  onClickSubmit() {
    if (!this.studentFrm.valid) {
      return;
    } else {
      let data = this.studentFrm.value;
      let obj = {
        "createdBy": !this.editFlag ? this.webStorage.getUserId() : this.data.createdBy,
        "modifiedBy": this.webStorage.getUserId(),
        "createdDate": !this.editFlag ? new Date() : this.data.createdDate,
        "modifiedDate": new Date(),
        "isDeleted": false,
      }
      data.aadharNo = data.aadharNo ? data.aadharNo : 0;
      data.standardId=data.standardId?data.standardId:0;
      data.genderId=data.genderId?data.genderId:0;
      data.educationYearId=data.educationYearId?data.educationYearId:0;
      data.dob = data.dob ? data.dob : null;
      let mainData = { ...obj, ...data };
      this.data ? mainData.id=this.data.id:mainData.id=0;//when we edit data -> clear form -> data not updated(we used)
      let url;
      this.data ? url = 'zp-Chandrapur/Student/UpdateStudent' : url = 'zp-Chandrapur/Student/AddStudent'
      this.apiService.setHttp(this.data ? 'put' : 'post', url, false, mainData, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.ngxspinner.hide();
          if (res.statusCode == '200') {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
             this.clearForm();
            this.editFlag = false;
          } else {
            this.ngxspinner.hide();
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.ngxspinner.hide();
          this.errorService.handelError(error.status);
        }
      })
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
