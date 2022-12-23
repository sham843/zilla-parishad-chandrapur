import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';
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
      private fb: FormBuilder, 
      private service: ApiService,
      public dialogRef: MatDialogRef<RegisterSchoolComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      private webStorage: WebStorageService,
      private common: CommonMethodsService, 
      private error: ErrorsService,
      public validator:ValidationService
    ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
    this.getFormData();
    this.getDistrict();
    this.data ? this.onEditData() : '';
  }

  //#region ---------------------------------------Get Register Form Data------------------------------------------------------------
  getFormData() {
    this.registerForm = this.fb.group({
      createdBy: 0,
      modifiedBy: 0,
      createdDate: new Date(),
      modifiedDate: new Date(),
      isDeleted: true,
      id: 0,
      schoolName: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(500),Validators.pattern]],
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
//#endregion ---------------------------------------Get Register Form Data------------------------------------------------------------

//#region  ---------------------------------------Get DropDowns-----------------------------------------------------------------------
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
//#endregion ---------------------------------------Get DropDowns-----------------------------------------------------------------------

//#region  ---------------------------------------Get Edit Data Patch Value--------------------------------------------------------------
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
//#endregion ---------------------------------------Get Edit Data Patch Value--------------------------------------------------------------

//#region ---------------------------------------Submit Data-------------------------------------------------------------------------------
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
//#endregion ---------------------------------------Submit Data-------------------------------------------------------------------------------

//#region ---------------------------------------Clear Form ------------------------------------------------------------------------------
  clearForm() {
    this.editFlag = false;
  }
  //#endregion---------------------------------------Clear Form ------------------------------------------------------------------------------

 /*  'school_marathi':{
    "school_registration":"शाळा नोंदणी",
    "school_list":"शाळा सूची",
    "school_name":"शाळेचे नाव",
    "add_school":"शाळा जोडा",
    "kendra_required":"कृपया केंद्र निवडा",
    "please_select_school_name":"कृपया शाळेचे नाव निवडा",
    "please_select_school_category":"कृपया शाळा श्रेणी निवडा",
    "please_select_school_type":"कृपया शाळेचा प्रकार निवडा",
    "please_select_gender_allowed":"कृपया लिंग निवडा",
    "please_select_group_class": "कृपया ग्रुप वर्ग निवडा"
    "chimur":"चिमूर",
    "gondpipri":"गोंडपिपरी",
    "bhadravati":"भद्रावती",
    "warora":"वरोरा",
    "chandrapur":"चंद्रपूर",
    "1_primary":"१-प्राथमिक",
    "2_primary_with_upper_primary":"2 उच्च प्राथमिक सह प्राथमिक",
    "private":"खाजगी",
    "goverment":"शासकीय",
    "male":"पुरुष",
    "female":"स्त्री",
    "co_ducation":"सह शिक्षण",
    "group_class":"गट वर्ग",
    "1st_2nd":"१ला - 2रा",
    "3rd_5th":"3रा - 5वा",
    "6th_8th":"6वी_8वी",
    "school_category":"शाळा श्रेणी"
    "school_type":"शाळेचा प्रकार"
    "gender_selected":"लिंग निवडा"
}

"school_english":{
  "school_registration":"Register School",
  "school_list":"School List",
  "school_name":"School Name",
  "add_school":"Add School",
  "kendra_required":"Kendra Required",
  "please_select_school_name":"Please Select School Name",
  "please_select_school_category":"Please Select School Category",
  "please_select_school_type":"Please Select School Type",
  "please_select_gender_allowed":"Please Select Gender Allowed",
  "please_select_group_class": "Please Select Group Class"
  "chimur":"Chimur",
  "gondpipri":"Gondpipri",
  "bhadravati":"Bhadravati",
  "warora":"Warora",
  "chandrapur":"Chandrapur",
  "1_primary":"1-Primary",
  "2_primary_with_upper_primary":"2-Primary With Upper Primary",
  "private":"Private",
  "goverment":"Goverment",
  "male":"Male",
  "female":"Female",
  "co_ducation":"Co-ducation",
  "group_class":"Group Class",
  "1st_2nd":"1st-2nd",
  "3rd_5th":"3rd-5th",
  "6th_8th":"6th-8th",
  "school_category":"School Category"
  "school_type":"School Type"
  "gender_selected":"Gender Selected"
}
 */
    





  
}




