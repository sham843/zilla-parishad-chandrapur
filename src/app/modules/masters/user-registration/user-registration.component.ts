import { Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { TranslateService } from '@ngx-translate/core'
import { NgxSpinnerService } from 'ngx-spinner'
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
  tableData: any;
  loginData: any;
  tableDataArray = new Array();
  totalItem!: number;
  totalPages!: number;
  pageNumber: number = 1;
  levelId!: number;
  excelDowobj:any;
  lang: string = '';
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
    private common:CommonMethodsService,
    private spinner:NgxSpinnerService
  ) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res=='Marathi'?this.lang='mr-IN':this.lang='en';
      this.setTableData();
    })
    this.loginData=this.webStorage.getLoginData();
    this.levelId=this.loginData.designationLevelId;
    console.log(this.loginData);
    this.getFormControl();
    this.getAllUserData();
    this.getUserType();
    this.getTaluka();
  }
  getFormControl() {
    this.serachUserForm = this.fb.group({
      UserTypeId: [''],
      TalukaId: [''],
      CenterId: [''],
      SchoolId: [''],
      textSearch: [''],
    })
  }
  //#region--------------------------------------------------------Drop down methods start-------------------------------------------------
  getUserType() {
    this.master.getUserType(this.lang).subscribe((res: any) => {
      this.userTypeArray = res.responseData;
    })
  }
  getTaluka() {
    this.master.getAllTaluka(this.lang, 1).subscribe((res: any) => {
      this.talukaArray = res.responseData;
      this.levelId==3 || this.levelId==4 || this.levelId==5 ?this.serachUserForm.controls['TalukaId'].setValue(this.loginData.talukaId):'';
      this.levelId==4 || this.levelId==5 ? this.getCenter(this.loginData.talukaId):'';
    })
  }
  getCenter(talukaId: number) {
    this.master.getAllCenter(this.lang, talukaId).subscribe((res: any) => {
      this.centerArray = res.responseData;
      this.levelId==4 || this.levelId==5 ? (this.serachUserForm.controls['CenterId'].setValue(this.loginData.centerId), this.getSchoolList(this.loginData.centerId)):'';
    })
  }
  getSchoolList(centerId: number) {
    this.master.getSchoolByCenter(this.lang, centerId).subscribe((res: any) => {
      this.schoolArray = res.responseData;
      this.levelId==5 ?this.serachUserForm.controls['SchoolId'].setValue(this.loginData.schoolId):'';
    })
  }
  //#endregion---------------------------------------dropdown method end--------------------------------------------------------------------
  
  //#region------------------------------------------get all user data method start------------------------------------------------------------
  getAllUserData(flag?:any) {
    flag == 'filter' ? this.pageNumber = 1 :'';
    this.spinner.show();
    let userTypeId=this.serachUserForm.value.UserTypeId?this.serachUserForm.value.UserTypeId:0;
    let taluka=this.serachUserForm.value.TalukaId?this.serachUserForm.value.TalukaId:0;
    let school=this.serachUserForm.value.SchoolId?this.serachUserForm.value.SchoolId:0;
    let center=this.serachUserForm.value.CenterId?this.serachUserForm.value.CenterId:0;
    let text=this.serachUserForm.value.textSearch?this.serachUserForm.value.textSearch:'';

    let serchText = `&UserTypeId=${userTypeId}&TalukaId=${taluka}
    &CenterId=${center}&SchoolId=${school}&textSearch=${text}`

    let obj =  flag != 'excel' ? `pageno=${this.pageNumber}&pagesize=10` : `pageno=1&pagesize=${this.totalPages * 10}`;
    this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetAll?' +  `${obj}${serchText}`, false, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.spinner.hide();
        this.tableDataArray = res.responseData.responseData1;
        this.totalItem = res.responseData.responseData2.pageCount;
        this.totalPages = res.responseData.responseData2.totalPages;
       }
     else{
      this.spinner.hide();
        this.tableDataArray = [];
        this.totalItem = 0;
        this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
       } 
       flag != 'excel' && this.tableDataArray ? this.setTableData() : this.excel.downloadExcel(this.tableDataArray, this.excelDowobj.pageName, this.excelDowobj.header, this.excelDowobj.column);
      },
         error: ((err: any) => { this.errors.handelError(err) })
     })
  
    }
//#endregion------------------------------------------------get all user method end----------------------------------------------------------
setTableData(){     // table 
  let displayedColumns:any;
  this.lang=='mr-IN'?displayedColumns=['srNo','name','m_UserType','m_DesignationLevel','m_DesignationName','mobileNo','action']:displayedColumns= ['srNo', 'name','userType','designationLevel', 'designationName', 'mobileNo', 'action']
      let displayedheaders:any;
      this.lang=='mr-IN'?displayedheaders=['अनुक्रमांक','नाव','वापरकर्ता प्रकार ','पातळी','पदनाव','मोबाईल नंबर','कृती']:displayedheaders= ['Sr. No.', 'Name','User Type','Level','Designation', 'Mobile No', 'Action']
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

  childCompInfo(obj: any) {     //table functionality
    console.log(obj);
    if (obj.label == 'Pagination') {
    this.pageNumber = obj.pageNumber
    this.getAllUserData();
  } else if (obj.label == 'Edit') {
    this.registerusers(obj);
  } else if(obj.label =='Delete'){
    this.deleteDialog(obj);
  }
  }
  //----------------------------------------------------------Add update modal open------------------------------------------------------------
  registerusers(editObj?: any) {
    const dialog =this.dialog.open(RegisterUsersComponent, {
      width: '850px',
      disableClose: true,
      data: editObj,
    })
    dialog.afterClosed().subscribe((res:any) => {
      if (res == 'Yes') {
        this.getAllUserData();
      }
    })
  } 
  //#region----------------------------------------------------------Delete modal start-------------------------------------------------------------
  deleteDialog(deleteObj: any) {
    const dialog = this.dialog.open(GlobalDialogComponent, {
      width: '700px',
      disableClose: true,
      data:{
        p1: this.lang=='mr-IN' ? 'तुम्हाला खात्री आहे की तुम्ही निवडलेली एजन्सी हटवू इच्छिता?' : 'Are You Sure You Want To Delete Selected Agency?',
        p2: '',
        cardTitle: this.lang=='mr-IN' ? 'हटवा' : 'Delete',
        successBtnText: this.lang=='mr-IN' ? 'हटवा' : 'Delete',
        dialogIcon: 'assets/images/logout.gif',
        cancelBtnText: this.lang=='mr-IN' ? 'रद्द करा' : 'Cancel',
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
        else{
          this.common.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getAllClearData(flag?:any){    //clear 
    if(flag=='taluka'){
      this.serachUserForm.controls['CenterId'].setValue('');
      this.serachUserForm.controls['SchoolId'].setValue('');
      this.schoolArray=[];
    }else if(flag=='kendra'){
      this.serachUserForm.controls['SchoolId'].setValue('');
    }
  }

  clearAllFilter(){
      this.getFormControl();
      this.centerArray=[];
      this.schoolArray=[];
      this.getAllUserData();this.getTaluka()
  }
  //#region---------------------------------------------------Start download pdf and excel------------------------------------------------
  excelDownload() { 
    this.getAllUserData('excel');
    let pageName:any;
    this.lang=='mr-IN'?pageName='वापरकर्ता नोंदणी':pageName='User Registration';
    let header:any;
    this.lang=='mr-IN'?header=['अनुक्रमांक','नाव','वापरकर्ता प्रकार ','पातळी','पदनाव','मोबाईल नंबर']:header=['Sr. No.', 'Name','User Type','Level','Designation', 'Mobile No'];
    let column:any;
    this.lang=='mr-IN'?column=['srNo','name','m_UserType','m_DesignationLevel','m_DesignationName','mobileNo']:column=['srNo', 'name','userType','designationLevel', 'designationName', 'mobileNo'];
    this.excelDowobj ={'pageName':pageName,'header':header,'column':column}
  }
  //#endregion------------------------------------------------End download pdf and excel method-----------------------------------------
}
