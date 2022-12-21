import { Component } from '@angular/core';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.scss']
})
export class RegisterStudentComponent {
<<<<<<< HEAD
=======
studentFrm!:FormGroup;
lang: string = 'en';
districtArray=new Array();
talukaArray=new Array();
centerArray=new Array();
schoolArray=new Array();
standardArray=new Array();
genderArray=new Array();
religionArray=new Array();
editFlag:boolean=false;
addData:any;
  constructor(
   private apiService : ApiService, 
    private errorService : ErrorsService,
    private fb:FormBuilder,
    private master:MasterService,
    private commonMethod:CommonMethodsService,
    private webStorage: WebStorageService,
     private ngxspinner: NgxSpinnerService,
     private dialogRef: MatDialogRef<RegisterStudentComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
      console.log("data",this.data);
      this.webStorage.langNameOnChange.subscribe((res: any) => {
        res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
      })
      this.formData();
      this.getDistrict();
      this.getStandard();
      this.getReligion();
      
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
      "aadharNo": [''],
      "religion": [''],
      "cast": [''],
      "mobileNo": ['']     
    })
    // this.onEdit(this.data);
 
  }

  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.districtArray = res.responseData;
          console.log("this.districtArray",this.districtArray)
          this.getTaluka();
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

  


  getTaluka() {
    this.master.getAllTaluka(this.lang,this.studentFrm.value.district).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
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

  getCenter() {
    this.master.getAllCenter(this.lang,this.studentFrm.value.taluka).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
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

  getSchool() {
    this.master.getAllSchool(this.lang,this.studentFrm.value.center).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
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



  getStandard() {
    this.master.getAllStandard(this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.standardArray = res.responseData;
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

  getReligion() {
    this.master.getAllReligion(this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.religionArray = res.responseData;
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

  
  // onEdit(editObj: any) {
  //   console.log("editObj",editObj);
  //   this.editFlag = true;
  //   this.studentFrm.patchValue({
  //     createdBy: 0,
  //     modifiedBy: 0,
  //     createdDate: new Date(),
  //     modifiedDate:  new Date(),
  //     isDeleted: true,
  //     id: editObj.id,
  //     f_Name: editObj.f_Name,
  //     m_Name: editObj.m_Name,
  //     l_Name: editObj.l_Name,
  //     stateId:editObj.stateId,
  //     districtId:editObj.districtId,
  //     talukaId:editObj.talukaId,
  //     centerId: editObj.centerId,
  //     schoolId:editObj.schoolId,
  //     standardId: editObj.standardId,
  //     saralId:editObj.saralId,
  //     genderId:editObj.genderId,
  //     dob:editObj.dob,
  //     aadharNo: editObj.aadharNo,
  //     lan: editObj.lan,
  //     religionId:editObj.religionId,
  //     castId:editObj.cast,
  //     mobileNo: editObj.mobileNo,
  //     emailId: editObj.emailId,
  //   });
    
  // }

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
            
            // this.displayData();
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.formData();
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
>>>>>>> fcabc6a069d7d115e1224f840185d2863fe2dbb9

}
