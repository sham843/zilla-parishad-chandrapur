import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent {
studentFrm!:FormGroup;
lang: string = 'en';
districtArray=new Array();
talukaArray=new Array();
centerArray=new Array();
schoolArray=new Array();
standardArray=new Array();
genderArray=new Array();
religionArray=new Array();

  constructor(
    // private apiService : ApiService, 
    private errorService : ErrorsService,
    private fb:FormBuilder,
    private master:MasterService,
    private commonMethod:CommonMethodsService,
    private webStorage: WebStorageService,) { }

    ngOnInit() {
      this.webStorage.langNameOnChange.subscribe((res: any) => {
        res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
      })
      this.formData();
      // this.getDistrict();
      // this.getStandard();
      // this.getReligion();
      
    }

  formData() {
    this.studentFrm = this.fb.group({
      "id": [0],
      "f_Name": [''],
      "m_Name": [''],
      "l_Name": [''],
      "state": [''],
      "district": [1],
      "taluka": [''],
      "center": [''],
      "school": [''],
      "standard": [''],
      "saralId": [''],
      "gender": [''],
      "dob": [''],
      "dobFormatdate": [''],
      "aadharNo": [''],
      "religion": [''],
      "cast": [''],
      "mobileNo": [''],
      "emailId": [''],
    })
  }

  // getDistrict() {
  //   this.master.getAllDistrict(this.lang).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200") {
  //         this.districtArray = res.responseData;
  //         this.getTaluka();
  //       }
  //       else {
  //         this.districtArray = [];
  //         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     }),
  //     error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   })
  // }

  // getTaluka() {
  //   this.master.getAllTaluka1(this.lang,this.studentFrm.value.district).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200") {
  //         this.talukaArray = res.responseData;
         
  //       }
  //       else {
  //         this.talukaArray = [];
  //         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     }),
  //     error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   })
  // }

  // getCenter() {
  //   this.master.getAllCenter1(this.lang,this.studentFrm.value.taluka).subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200") {
  //         this.centerArray = res.responseData;
  //       }
  //       else {
  //         this.centerArray = [];
  //         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     }),
  //     error: (error: any) => {
  //       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     }
  //   })
  // }


  // getStandard() {
  //   this.master.getAllStandard(this.lang).subscribe({
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









}
