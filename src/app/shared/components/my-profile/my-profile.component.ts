import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  standalone:true,
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class MyProfileComponent {

  profileForm!:FormGroup;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  getImgExt:any;
  file: any;
  ImgUrl: any;
  selectedFile:any;
  @ViewChild('fileInput') fileInput: ElementRef | any;
  levelArray=new Array();
  designationArray=new Array;
  districtArray=new Array();
  talukaArray=new Array();
  centerArray=new Array();
  subscription!: Subscription;
  lang!: string;;



  constructor(
      private fb: FormBuilder,
      private commonMethod: CommonMethodsService,
      private uploadFilesService:FileUploadService,
      private service:ApiService,
      private error:ErrorsService,
      private webStorage: WebStorageService,
      

    ) { }

  ngOnInit(){
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.getFormData();
    this.getLevel();
  }
  // {
  //   "createdBy": 0,
  //   "modifiedBy": 0,
  //   "createdDate": "2022-12-29T09:26:26.566Z",
  //   "modifiedDate": "2022-12-29T09:26:26.566Z",
  //   "isDeleted": true,
  //   "id": 0,
  //   "name": "fdjbjfdbj",
  //   "mobileNo": "8574859687",
  //   "districtId": 1,
  //   "talukaId": 1,
  //   "centerId": 1,
  //   "schoolId": 1,
  //   "emailId": "stringdfjhkjfd",
  //   "designationLevelId": 1,
  //   "designationId": 1,
  //   "profilePhoto": "string",
  //   "timestamp": "2022-12-29T09:26:26.566Z",
  //   "UserName":"str",
  //    "password":"",
  //   "standardModels": [
  //     {
  //       "standardId": 0
  //     }
  //   ],
  //   "subjectModels": [
  //     {
  //       "subjectId": 0
  //     }
  //   ]
  // }

  getFormData(){
    this.profileForm=this.fb.group({
        createdBy:[this.webStorage.getUserId()],
        modifiedBy:[ this.webStorage.getUserId()],
        createdDate:[new Date()],
        modifiedDate:[new Date()],
        isDeleted: true,
        id: 0,
        mobileNo: [''],
        emailId: [''],
        designationLevelId:[''],
        designationId:[''],
        districtId:[''],
        talukaId:[''],
        centerId:[''],
        profilePhoto:[''],
        UserName:[''],
        password: [''],
        name:[''],
        standardModels: [[
          {
            standardId: 0
          }
        ]],
        subjectModels: [[
          {
            subjectId: 0
          }
        ]]
    })
  }

  documentUpload(event: any) {
    this.file = event;
    let selResult: any = event.target.value.split('.');
    let getImgExt = selResult.pop();
    getImgExt.toLowerCase();
    if (getImgExt == "png" || getImgExt == "jpg" || getImgExt == "jpeg") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.ImgUrl = event.target.files[0].name;
      }
    }
    else {
      this.commonMethod.snackBar("Profile image allowed only jpg or png format", 1);
    }

  }

  onSubmitData(){ //onSubmit
    if(this.profileForm.invalid){
      return
    }
    this.ImgUrl ? this.fileUploaded() : this.submitProfileData();
  }

  fileUploaded() {
    let documentUrl: any = this.uploadFilesService.uploadDocuments(this.file, "profile", "png,jpg,jpeg", 5, 5000);
    documentUrl.subscribe((ele: any) => {
      if (ele.statusCode == '200') {
        if (ele == 'error') {
          this.fileInput.nativeElement.value = '';
        }
         this.profileForm.controls['profilePhoto'].setValue(ele.responseData);
        this.submitProfileData();
      } else {
        this.commonMethod.snackBar('Profile img is not uploaded', 1);
        this.submitProfileData();
      }

    })
  }

  deleteImg() {
    this.file = "";
    this.ImgUrl = '';
    this.fileInput.nativeElement.value = '';
    this.profileForm.controls['profilePhoto'].setValue(''); 
  }


  getLevel() {
        this.service.setHttp('get', 'designation/get-designation-level?flag='+this.lang, false, false, false, 'baseUrl');
        this.service.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == '200') {
              this.levelArray = res.responseData;
            } else {
              this.levelArray = [];
              this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
            }
          }), error: (error: any) => {
            this.error.handelError(error.status);
          }
        })
    
   }

    getDesignation() {
      let formData=this.profileForm.value
          this.service.setHttp('get', 'designation/get-set-designation-types?designationLevelId='+formData.designationLevelId+'&flag='+this.lang, false, false, false, 'baseUrl');
          this.service.getHttp().subscribe({
            next: ((res: any) => {
              if (res.statusCode == '200') {
                this.designationArray = res.responseData;
              } else {
                this.designationArray = [];
              this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
              }
            }), error: (error: any) => {
              this.error.handelError(error.status);
            }
          })
      
        }

  getDistrict() {
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllDistrict?flag_lang=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtArray = res.responseData;
        } else {
          this.districtArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })

   }

  getTaluka() {
    let formData = this.profileForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang=' + this.lang + '&DistrictId=' +formData.districtId, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.talukaArray = res.responseData;
          // this.editFlag ? (this.registerForm.controls['talukaId'].setValue(this.data?.talukaId), this.getCenter()) : ''
        } else {
          this.talukaArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })

  }

  getCenter() {
    let formData = this.profileForm.value;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=' + this.lang + '&TalukaId=' +formData.talukaId, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.centerArray = res.responseData;
          // this.editFlag ? (this.registerForm.controls['centerId'].setValue(this.data?.centerId), this.getSchoolCategory()) : ''
        } else {
          this.centerArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
  }
  // zp_chandrapur/user-registration/AddRecord
  submitProfileData(){
    let formObj=this.profileForm.value;
   formObj.profilePhoto=this.ImgUrl;
    this.service.setHttp('post','zp_chandrapur/user-registration/AddRecord', false, formObj, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.profileForm.reset();
        } else {
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })
    console.log(formObj)
    
  }

 }




