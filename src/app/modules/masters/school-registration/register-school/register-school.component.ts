import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  editFlag:boolean=false;

  constructor(private fb: FormBuilder, private service: ApiService,public dialog: MatDialog) { }

  ngOnInit() {
    this.getFormData();
    this.getDistrict();
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
 
  onSubmitData() {
    let formData = this.registerForm.value;
    if (this.registerForm.invalid) {
      return
    } if(!this.editFlag){
      this.service.setHttp('post', 'zp_chandrapur/School/Add', false, formData, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            alert('post done');
            this.registerForm.reset();
          }
        }),
      })
    }else{
      this.editFlag=true;
      this.service.setHttp('put', 'zp_chandrapur/School/Update', false, formData, false, 'baseUrl');
      this.service.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            alert('update done');
            this.registerForm.reset();
          }
        }),
      })
    }
  }


}
