import { Component, Inject, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/core/services/api.service'
import { ErrorsService } from 'src/app/core/services/errors.service'
import { MasterService } from 'src/app/core/services/master.service'
import { ValidationService } from 'src/app/core/services/validation.service'

@Component({
  selector: 'app-register-agency',
  templateUrl: './register-agency.component.html',
  styleUrls: ['./register-agency.component.scss'],
})
export class RegisterAgencyComponent {
  agencyForm: FormGroup | any;
  districtArr = new Array();
  talukaArr = new Array();
  lang: any;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  get f() {
    return this.agencyForm.controls
  }
  constructor(
    public dialogRef: MatDialogRef<RegisterAgencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private master: MasterService,
    private apiService: ApiService,
    private errors:ErrorsService,
    public validation:ValidationService,
    public translate:TranslateService
  ) {}

  ngOnInit() {
    this.lang = this.apiService.getLanguageFlag()
    this.getAgencyControl()
    this.getDistrict()
  }
 
  getAgencyControl() {
    this.agencyForm = this.fb.group({
      agencyName: [this.data?this.data.agencyName:'', [Validators.required]],
      agencyNameMr: [this.data?this.data.m_AgencyName:'', [Validators.required]],
      registrationNo: [this.data?this.data.registrationNo:'', [Validators.required]],
      contactPerson: [this.data?this.data.contactPersonName:'', [Validators.required,Validators.pattern(this.validation.fullName)]],
      district: [this.data?this.data.districtId:'', [Validators.required]],
      taluka: [this.data?this.data.talukaId:'', [Validators.required]],
      contactNo: [this.data?this.data.contactNo:'', [Validators.required,Validators.pattern(this.validation.mobile_No)]],
      emailId: [this.data?this.data.emailId:'', [Validators.required,Validators.email,Validators.pattern(this.validation.email)]],
      address: [this.data?this.data.address:'', [Validators.required]],
    })
  }
  getDistrict() {
    this.master.getAllDistrict(this.lang).subscribe((res: any) => {
      this.districtArr = res.responseData;
    })
  }
  getTalukaArr(distId: number) {
    this.master.getAllTaluka(this.lang, distId).subscribe((res: any) => {
      this.talukaArr = res.responseData
    })
  }
  agencyRegister(formDirective:any) {
    if (this.agencyForm.invalid) {
      return
    } else {
      let obj = {
        createdBy: 0,
        modifiedBy: 0,
        createdDate: new Date(),
        modifiedDate: new Date(),
        isDeleted: false,
        id: 0,
        agencyName: this.agencyForm.value.agencyName,
        m_AgencyName: '',
        registrationNo: this.agencyForm.value.registrationNo,
        contactPersonName: this.agencyForm.value.contactPerson,
        contactNo: this.agencyForm.value.contactNo,
        emailId: this.agencyForm.value.emailId,
        address: this.agencyForm.value.address,
        districtId: this.agencyForm.value.district,
        talukaId: this.agencyForm.value.taluka,
        lan: '',
      }
      this.apiService.setHttp('post','zp_chandrapur/agency/Add',true,obj,false, 'baseUrl')
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == '200') {
          this.dialogRef.close('Yes');
          formDirective.resetForm();
        }
      },
      (error: any) => {
        this.errors.handelError(error.status);
      })
    }
  }
  clearForm(formDirective:any){
    formDirective.resetForm();
  }
  contactNo(){
    this.agencyForm.value.contactNo==0?this.agencyForm.controls['contactNo'].setValue(' '):'';
  }
}
