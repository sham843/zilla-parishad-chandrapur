import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/core/services/api.service'
import { CommonMethodsService } from 'src/app/core/services/common-methods.service'
import { ErrorsService } from 'src/app/core/services/errors.service'
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service'
import { MasterService } from 'src/app/core/services/master.service'
import { WebStorageService } from 'src/app/core/services/web-storage.service'
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component'
import { RegisterUsersComponent } from './register-users/register-users.component'
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent {
  serachUserForm!: FormGroup;
  tableData: any
  tableDataArray = new Array();
  totalItem!: number;
  pageNumber: number = 1;
  lang: string = 'English';
  userTypeArray = new Array();
  talukaArray = new Array();
  centerArray = new Array();
  schoolArray = new Array();
  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    public translate: TranslateService,
    private master: MasterService,
    private webStorage: WebStorageService,
    private fb: FormBuilder,
    private excel:ExcelPdfDownloadService,
    private errors:ErrorsService,
    private common:CommonMethodsService
  ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res=='Marathi'?this.lang='mr-IN':this.lang='en';
      this.setTableData();
    })
    this.getFormControl();
    this.getAllUserData();
    this.getUserType();
    this.getTaluka();
  }
  getFormControl() {
    this.serachUserForm = this.fb.group({
      UserTypeId: [0],
      TalukaId: [0],
      CenterId: [0],
      SchoolId: [0],
      textSearch: [''],
    })
  }
  getUserType() {
    this.master.getUserType(this.lang).subscribe((res: any) => {
      this.userTypeArray = res.responseData;
    })
  }
  getTaluka() {
    this.master.getAllTaluka(this.lang, 1).subscribe((res: any) => {
      this.talukaArray = res.responseData;
    })
  }
  getCenter(talukaId: number) {
    this.master.getAllCenter(this.lang, talukaId).subscribe((res: any) => {
      this.centerArray = res.responseData;
    })
  }
  getSchoolList(centerId: number) {
    this.master.getSchoolByCenter(this.lang, centerId).subscribe((res: any) => {
      this.schoolArray = res.responseData;
    })
  }
  getAllUserData() {
    let obj = `pageno=${this.pageNumber}&pagesize=10&UserTypeId=${this.serachUserForm.value.UserTypeId}&TalukaId=${this.serachUserForm.value.TalukaId}
    &CenterId=${this.serachUserForm.value.CenterId}&SchoolId=${this.serachUserForm.value.SchoolId}&textSearch=${this.serachUserForm.value.textSearch}`
    this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetAll?' + obj, false, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.tableDataArray = res.responseData.responseData1;
        this.totalItem = res.responseData.responseData2.pageCount;
       }
     else{
        this.tableDataArray = []
        this.totalItem = 0
         this.common.snackBar(res.statusMessage,1)
       }  this.setTableData();
      },
         error: ((err: any) => { this.errors.handelError(err) })
     })
  
    }

setTableData(){
  let displayedColumns:any;
  this.lang=='mr-IN'?displayedColumns=['srNo','m_UserType','name','mobileNo','action']:displayedColumns= ['srNo','userType', 'name', 'mobileNo', 'action']
      let displayedheaders:any;
      this.lang=='mr-IN'?displayedheaders=['अनुक्रमांक','वापरकर्ता प्रकार','नाव','मोबाईल नंबर','कृती']:displayedheaders= ['Sr. No.','User Type', 'Name', 'Mobile No', 'Action']
      this.tableData = {
        pageNumber: this.pageNumber,
        img: '',
        blink: '',
        badge: '',
        isBlock: '',
        displayedColumns: displayedColumns,
        tableData: this.tableDataArray,
        tableSize: this.totalItem,
        tableHeaders: displayedheaders,
        pagination: true,
        edit: true,
        delete: true,
      }
      this.apiService.tableData.next(this.tableData)
}
  childCompInfo(obj: any) {
    obj.label == 'Edit' ? this.registerusers(obj) : this.deleteDialog(obj)
  }
  //----------------------------------------------------------Add update modal open------------------------------------------------------------
  registerusers(editObj?: any) {
    this.dialog.open(RegisterUsersComponent, {
      width: '700px',
      disableClose: true,
      data: editObj,
    })
  }
  // ----------------------------------------------------------Delete modal-------------------------------------------------------------
  deleteDialog(deleteObj: any) {
    const dialog = this.dialog.open(GlobalDialogComponent, {
      width: '700px',
      disableClose: true,
      data:{
        p1: this.lang='mr-IN' ? 'तुम्हाला खात्री आहे की तुम्ही निवडलेली एजन्सी हटवू इच्छिता?' : 'Are You Sure You Want To Delete Selected Agency?',
        p2: '',
        cardTitle: this.lang='mr-IN' ? 'हटवा' : 'Delete',
        successBtnText: this.lang='mr-IN' ? 'हटवा' : 'Delete',
        dialogIcon: 'assets/images/logout.gif',
        cancelBtnText: this.lang='mr-IN' ? 'रद्द करा' : 'Cancel',
      },
    })
    dialog.afterClosed().subscribe((res) => {
      if (res == 'Yes') {
        this.removeUser(deleteObj)
      }
    })
  }
  removeUser(deleteData:any) {
    let obj={
      "id":deleteData.id,
      "modifiedBy": 0,
      "modifiedDate":new Date(),
      "lan": ""
    }
    this.apiService.setHttp('delete', 'zp_chandrapur/user-registration/DeleteUser?lan=' + this.lang, false, obj, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.common.snackBar(res.statusMessage, 0);
          this.getAllUserData();
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });

  }
  getAllClearData(flag?:any){
    if(flag=='taluka'){
      this.serachUserForm.controls['CenterId'].setValue('');
      this.serachUserForm.controls['SchoolId'].setValue('');
    }else if(flag=='kendra'){
      this.serachUserForm.controls['SchoolId'].setValue('');
    }else{
      this.serachUserForm.controls['UserTypeId'].setValue('');
      this.serachUserForm.controls['TalukaId'].setValue('');
      this.serachUserForm.controls['CenterId'].setValue('');
      this.serachUserForm.controls['SchoolId'].setValue('');
      this.serachUserForm.controls['textSearch'].setValue('');
    }
  }
  //#region---------------------------------------------------Start download pdf and excel------------------------------------------------
  excelDownload() { 
    // this.getAllAgencyData('excel');
    let pageName;
    this.lang=='mr-IN'?pageName='वापरकर्ता नोंदणी':pageName='User Registration';
    let header:any;
    this.lang=='mr-IN'?header=['अनुक्रमांक','वापरकर्ता प्रकार','नाव','मोबाईल नंबर']:header=['Sr. No.','User Type', 'Name', 'Mobile No'];
    let column:any;
    this.lang=='mr-IN'?column=['srNo','m_UserType','name','mobileNo']:column=['srNo','userType', 'name', 'mobileNo'];
    this.excel.downloadExcel(this.tableDataArray,pageName,header,column);
  }
  /* getAllAgencyData(arg0: string) {
    throw new Error('Method not implemented.')
  } */

  /* let pageName: any;
  this.language == 'Marathi' ? pageName = 'एजन्सी नोंदणी' : pageName = 'Agency Registration';
  let header: any;
  this.language == 'Marathi' ? header = ['अनुक्रमणिका', 'एजन्सीचे नाव', 'संपर्क क्र.', 'ई-मेल आयडी'] : header = ['Sr.No.', 'Agency Name', 'Contact No.', 'Email Id'];
  let column: any;
  this.language == 'Marathi' ? column = ['srNo', 'm_AgencyName', 'contactNo', 'emailId'] : column = ['srNo', 'agencyName', 'contactNo', 'emailId'];
  this.excelDowobj ={'pageName':pageName,'header':header,'column':column} */
  //#endregion------------------------------------------------End download pdf and excel method-----------------------------------------
}
