import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
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

  constructor(private fb: FormBuilder, private service: ApiService, public dialogRef: MatDialogRef<RegisterSchoolComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
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
      schoolName: '',
      m_SchoolName: '',
      stateId: 0,
      districtId: '',
      talukaId: '',
      centerId: '',
      s_CategoryId: '',
      s_TypeId: '',
      g_GenderId: '',
      g_ClassId: '',
      lan: ''
    })
  }

  getDistrict() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllDistrict?flag_lang=en', false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtArray = res.responseData;
        }
      }),
    })
    this.editFlag ? this.getTaluka() : '';
  }

  getTaluka() {
    let formData = this.registerForm.value.districtId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang=en&DistrictId=' + formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.talukaArray = res.responseData;
        }
      }),
    })
    this.editFlag ? this.getCenter() : '';

  }

  getCenter() {
    let formData = this.registerForm.value.talukaId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=en&TalukaId=' + formData, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.centerArray = res.responseData;
        }
      }),
    })
    this.editFlag ? this.getSchoolCategory() : '';

  }

  getSchoolCategory() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetSchoolCategory?flag_lang=en', false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schoolcategoryArray = res.responseData;
        }
      }),
    })
    this.editFlag ? this.getSchoolType() : '';
  }

  getSchoolType() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllSchoolType?flag_lang=en', false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.schooltypeArray = res.responseData;
        }
      }),
    })
    this.editFlag ? this.getGenderAllow() : '';
  }

  getGenderAllow() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllGender?flag_lang=en', false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.genderAllowArray = res.responseData;
        }
      }),
    })
    this.editFlag ? this.getGroupClass() : '';
  }

  getGroupClass() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllGroupClass?flag_lang=en', false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.groupArray = res.responseData;
        }
      }),
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
            this.registerForm.reset();
            this.dialogRef.close();
          }
        }),
      })
    } else {
      this.editFlag = true;
      this.service.setHttp('put', 'zp_chandrapur/School/Update', false, formData, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.registerForm.reset();
            this.dialogRef.close();
          }
        }),
      })
    }
  }

  clearForm(){
    this.editFlag=false;
  }

  // onDeletData(obj?:any){
  //   obj=this.data;
  //   console.log(obj);
  //   let delObj={
  //     "id":obj.id,
  //     "modifiedBy": 0,
  //     "modifiedDate": "2022-12-21T12:56:19.376Z",
  //     "lan":''    
  //   }
  //   this.service.setHttp('delete', 'zp_chandrapur/School/Delete?lan=en', false, delObj, false, 'baseUrl');
  //   this.service.getHttp().subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == '200') {
  //         this.dialogRef.close();
  //       }
  //     }),
  //   })
  // }
    

  }




