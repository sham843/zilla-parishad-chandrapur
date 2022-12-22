import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';


@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent {
studentFrm!:FormGroup;
lang:string |any='English';
districtArray=new Array();
talukaArray=new Array();
centerArray=new Array();
schoolArray=new Array();
standardArray=new Array();
genderArray=new Array();
religionArray=new Array();
@ViewChild('formDirective')
private formDirective!: NgForm;
editFlag:boolean=false;
addData:any;
  constructor(
   private apiService : ApiService, 
    private errorService : ErrorsService,
    private fb:FormBuilder,
    private master:MasterService,
    private commonMethod:CommonMethodsService,
    public validation: ValidationService,
     private ngxspinner: NgxSpinnerService,
     private dialogRef: MatDialogRef<RegisterStudentComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
      console.log("data",this.data);
      this.lang=this.apiService.getLanguageFlag();
      this.formData();
      this.getDistrict();
      this.getStandard(this.lang);
      this.getReligion(this.lang);
      this.getGender(this.lang);
      // if (this.data) {
      //   this.onEdit()
      // }
      this.data ? this.onEdit() : '';

    }

    get f() {
      return this.studentFrm.controls;
    }
  

  formData() {
    this.studentFrm = this.fb.group({
      "id": [0],
      "f_Name": ['',[Validators.required,Validators.pattern(this.validation.fullName)]],
      "m_Name": ['',[Validators.required,Validators.pattern(this.validation.fullName)]],
      "l_Name": ['',[Validators.required,Validators.pattern(this.validation.fullName)]],
     "districtId": [1 ,[Validators.required]],
      "talukaId": [ ,Validators.required],
      "centerId": [ ,[Validators.required]],
      "schoolId": [ ,[Validators.required]],
      "standardId": [ ,[Validators.required]],
      "saralId": ['',[Validators.required]],
      "genderId": [ ,[Validators.required]],
      "dob": ['',[Validators.required]],
      "aadharNo": ['',[Validators.required,Validators.pattern(this.validation.aadhar_card)]],
      "religionId": [ ,[Validators.required]],
      "cast": ['',[Validators.required,Validators.pattern(this.validation.fullName)]],
      "parentsMobileNo": ['', [Validators.required,Validators.pattern(this.validation.mobile_No)]]     
    })
    // this.onEdit(this.data);
 
  }

  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.districtArray = res.responseData;
          // console.log("this.districtArray",this.districtArray)
          this.getTaluka(this.studentFrm.value.districtId);
          if (this.editFlag == true) {
            this.studentFrm.controls['districtId'].setValue(this.data.districtId);
            
          }
        }
        else {
          this.districtArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getTaluka(districtId:any) {
    this.master.getAllTaluka(this.lang,districtId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          if (this.editFlag == true) {
            this.studentFrm.controls['talukaId'].setValue(this.data.talukaId);
            this.getCenter(this.studentFrm.value.talukaId);
          }
         }
        else {
          this.talukaArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getCenter(talukaId:number) {
     this.master.getAllCenter(this.lang,talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          if (this.editFlag == true) {
            this.studentFrm.controls['centerId'].setValue(this.data.centerId);
            this.getSchool(this.lang,this.studentFrm.value.centerId);
          }
        }
        else {
          this.centerArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    }) 
  }

  getSchool(strPara: string, centerId: number) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + strPara + '&CenterId=' + centerId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
          if (this.editFlag == true) {
            this.studentFrm.controls['schoolId'].setValue(this.data.schoolId);
           }
        }
        else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getStandard(strPara: string) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllStandard?flag_lang='+ strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.standardArray = res.responseData;
          if (this.editFlag == true) {
            this.studentFrm.controls['standardId'].setValue(this.data.standardId);
           }
        }
        else {
          this.standardArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getGender(strPara: string) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllGender?flag_lang='+ strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.genderArray = res.responseData;
          if (this.editFlag == true) {
            this.studentFrm.controls['genderId'].setValue(this.data.genderId);
           }
        }
        else {
          this.genderArray=[];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  getReligion(strPara: string) {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllReligion?flag_lang='+ strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.religionArray = res.responseData;
          if (this.editFlag == true) {
            this.studentFrm.controls['religionId'].setValue(this.data.religionId);
           }
        }
        else {
          this.religionArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  // getSchool() {
  //    this.master.getAllSchool(this.lang,this.studentFrm.value.center).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200") {
  //         this.schoolArray = res.responseData;
  //       }
  //       else {
  //         this.schoolArray = [];
  //         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     }),
  //     error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   }) 
  // }



  // getStandard() {
  //    this.master.getAllStandard(this.lang).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200") {
  //         this.standardArray = res.responseData;
  //       }
  //       else {
  //         this.standardArray = [];
  //         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     }),
  //     error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   }) 
  // }

  // getReligion() {
  //   this.master.getAllReligion(this.lang).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200") {
  //         this.religionArray = res.responseData;
  //       }
  //       else {
  //         this.religionArray = [];
  //         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     }),
  //     error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   }) 
  // }

  
  onEdit() {
    this.editFlag = true;
    this.studentFrm.patchValue({
      createdBy: 0,
      modifiedBy: 0,
      createdDate: new Date(),
      modifiedDate:  new Date(),
      isDeleted: true,
      id: this.data.id,
      f_Name: this.data.f_Name,
      m_Name: this.data.m_Name,
      l_Name:this.data.l_Name,
      stateId:0,
      saralId:this.data.saralId,
       dob:this.data.dob.split('T')[0],
      aadharNo: this.data.aadharNo,
      lan: this.lang,
      cast:this.data.cast,
      parentsMobileNo: this.data.parentsMobileNo,
      emailId: this.data.emailId,
    });
  }

onClickSubmit() {
    if (!this.studentFrm.valid) {
      return;
    } else {
      this.ngxspinner.show();
      let data = this.studentFrm.value;
      let url;
      this.editFlag ? url = 'zp-Chandrapur/Student/UpdateStudent' : url = 'zp-Chandrapur/Student/AddStudent'
      this.apiService.setHttp(this.editFlag ? 'put' : 'post', url, false, data, false, 'baseUrl');
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

  clearForm() {
    this.formDirective && this.formDirective.resetForm();
    this.editFlag = false;
   }

   clearDropdown(flag:any){
switch(flag){
  case 'talukaId':
    this.studentFrm.controls['talukaId'].setValue('')
}
   }

}
