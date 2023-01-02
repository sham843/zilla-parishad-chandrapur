import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service'; import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  standalone: true,
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

  profileForm!: FormGroup;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  getImgExt: any;
  file: any;
  ImgUrl: any;
  selectedFile: any;
  @ViewChild('fileInput') fileInput: ElementRef | any;
  levelArray = new Array();
  designationArray = new Array;
  districtArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  subscription!: Subscription;
  lang!: string;
  getObj: any;
  levelId!:number;

  constructor(
    public dialogRef: MatDialogRef<MyProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commonMethod: CommonMethodsService,
    private uploadFilesService: FileUploadService,
    private service: ApiService,
    private error: ErrorsService,
    private webStorage: WebStorageService,
    public validator: ValidationService
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'mr-IN') : (this.lang = 'en');
    })
    this.getDataByID();
    this.getFormData();
  }
  
  getFormData(obj?:any) {
    this.profileForm = this.fb.group({
      mobileNo: [obj?.mobileNo || '', [Validators.required,Validators.pattern('[7-9]\\d{9}'),Validators.maxLength(10)]],
      emailId: [obj?.emailId || '', [Validators.required,Validators.email]],
      designationLevelId: [obj?.designationLevelId || '', [Validators.required]],
      designationId: [obj?.designationId || '', [Validators.required]],
      districtId: [obj?.districtId || '', [Validators.required]],
      talukaId: [obj?.talukaId || '', [Validators.required]],
      centerId: [obj?.centerId || '', [Validators.required]],
      profilePhoto: [obj?.profilePhoto || ''],
      name: [obj?.name || '', [Validators.required,Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')]],
    })
    this.getObj ? this.getLevel() : '';
    this.profileForm.controls['profilePhoto'].setValue(this.getObj?.profilePhoto);
  }

  getDataByID() {
    let Id = this.commonMethod.getUserTypeID();
    this.service.setHttp('get', 'zp_chandrapur/user-registration/GetById?Id=' + Id+ '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.getObj = res.responseData;
          this.levelId =this.getObj.designationLevelId;
          this.getFormData(this.getObj);
        } else {
          this.getObj = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
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

  onSubmitData() { //onSubmit
    if (this.profileForm.invalid) {
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
    this.service.setHttp('get', 'designation/get-designation-level?flag=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.levelArray = res.responseData;
          this.getDesignation();
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
    this.service.setHttp('get', 'designation/get-set-designation-types?designationLevelId=' +this.profileForm.value?.designationLevelId+ '&flag=' + this.lang, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.designationArray = res.responseData;
          this.getDistrict()
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
          this.getTaluka()
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
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang=' + this.lang + '&DistrictId=' + formData?.districtId, false, false, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.talukaArray = res.responseData;
          this.getCenter()
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
    let formData = this.profileForm.value.talukaId;
    this.service.setHttp('get', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=' + this.lang + '&TalukaId=' + formData, false, false, false, 'baseUrl');
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
  submitProfileData() {
    let obj;
    obj=this.profileForm.value;
    obj.createdBy=this.webStorage.getUserId();
    obj.modifiedBy=this.webStorage.getUserId();
    obj.createdDate=new Date();
    obj.modifiedDate=new Date();
    obj.isDeleted=false,
    obj.id=this.getObj.id,
    this.service.setHttp('put', 'zp_chandrapur/user-registration/UpdateUserProfile', false, obj, false, 'baseUrl');
    this.service.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.dialogRef.close();
          // formDirective.resetForm();
        } else {
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }), error: (error: any) => {
        this.error.handelError(error.status);
      }
    })

  }
  clearForm(formDirective: any) {
    formDirective.resetForm();
    this.profileForm.controls['districtId'].setValue(1);
  }
  onClick(flag: any) {
    if (flag == 'No') {
      this.dialogRef.close('No');
    }
  }

}




