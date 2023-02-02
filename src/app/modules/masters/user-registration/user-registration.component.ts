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
  highlightRowFlag:boolean=true;
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
      this.getUserType();
      this.getTaluka();
    })
    this.loginData=this.webStorage.getLoginData();
    this.levelId=this.loginData.designationLevelId;
    this.getFormControl();
    this.getAllUserData();
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
    this.master.getUserType(this.apiService.translateLang?this.lang:'en').subscribe((res: any) => {
      this.userTypeArray = res.responseData;
    })
  }
  getTaluka() {
    this.master.getAllTaluka((this.apiService.translateLang?this.lang:'en'), 1).subscribe((res: any) => {
      this.talukaArray = res.responseData;
      this.levelId==3 || this.levelId==4 || this.levelId==5 ?this.serachUserForm.controls['TalukaId'].setValue(this.loginData.talukaId):'';
      this.levelId==4 || this.levelId==5 ? this.getCenter(this.loginData.talukaId):this.levelId==3?(this.getAllUserData('filter')):'';
    })
  }
  getCenter(talukaId: number) {
    this.master.getAllCenter((this.apiService.translateLang?this.lang:'en'), talukaId).subscribe((res: any) => {
      this.centerArray = res.responseData;
      this.levelId==4 || this.levelId==5 ?this.serachUserForm.controls['CenterId'].setValue(this.loginData.centerId):'';
      this.levelId==4 || this.levelId==5 ? this.getSchoolList(this.loginData.centerId):'';
      this.levelId==4?(this.getAllUserData('filter')):'';
    })
  }
  getSchoolList(centerId: number) {
    this.master.getSchoolByCenter((this.apiService.translateLang?this.lang:'en'), centerId).subscribe((res: any) => {
      this.schoolArray = res.responseData;
      this.levelId==5 ?(this.serachUserForm.controls['SchoolId'].setValue(this.loginData.schoolId),this.getAllUserData('filter')):'';
    })
  }
  //#endregion---------------------------------------dropdown method end--------------------------------------------------------------------

  //#region------------------------------------------get all user data method start------------------------------------------------------------
  getAllUserData(flag?:any) {
    flag == 'filter' ? this.pageNumber = 1 :'';
    this.spinner.show();
    this.serachUserForm.value.UserTypeId=this.serachUserForm.value.UserTypeId?this.serachUserForm.value.UserTypeId:0;
    this.serachUserForm.value.TalukaId=this.serachUserForm.value.TalukaId?this.serachUserForm.value.TalukaId:0;
    this.serachUserForm.value.SchoolId=this.serachUserForm.value.SchoolId?this.serachUserForm.value.SchoolId:0;
    this.serachUserForm.value.CenterId=this.serachUserForm.value.CenterId?this.serachUserForm.value.CenterId:0;
    this.serachUserForm.value.textSearch=this.serachUserForm.value.textSearch?this.serachUserForm.value.textSearch:'';

    let serchText = `&UserTypeId=${this.serachUserForm.value.UserTypeId}&TalukaId=${this.serachUserForm.value.TalukaId}
    &CenterId=${this.serachUserForm.value.CenterId}&SchoolId=${this.serachUserForm.value.SchoolId}&textSearch=${this.serachUserForm.value.textSearch}`

    let obj =  flag == 'excel' ?  `pageno=1&pagesize=${this.totalPages * 10}`:`pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('get', 'zp_chandrapur/user-registration/GetAll?' +  `${obj}${serchText}`, false, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
       if(res.statusCode == "200"){
        this.spinner.hide();
        this.tableDataArray = res.responseData.responseData1;
        this.tableDataArray.forEach(ele=>{
         ele.isBlock=='Block'?ele['blockStatus']=true:ele['blockStatus']=false;
        })
        this.totalItem = res.responseData.responseData2.pageCount;
        this.totalPages = res.responseData.responseData2.totalPages;
       }
     else{
      this.spinner.hide();
        this.tableDataArray = [];
        this.totalItem = 0;
        this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
       }
       flag != 'excel' && this.tableDataArray ? this.setTableData() : (this.excel.downloadExcel(this.tableDataArray, this.excelDowobj.pageName, this.excelDowobj.header, this.excelDowobj.column),  this.getAllUserData());
      },
         error: ((err: any) => { this.errors.handelError(err) })
     })

    }
//#endregion------------------------------------------------get all user method end----------------------------------------------------------
setTableData(){     // table
  this.highlightRowFlag=true;
  let displayedColumns:any;
  this.lang=='mr-IN' && this.apiService.translateLang? displayedColumns=['srNo','name','m_UserType','m_DesignationLevel','m_DesignationName','mobileNo','isBlock','action']:displayedColumns= ['srNo', 'name','userType','designationLevel', 'designationName', 'mobileNo','isBlock','action']
      let displayedheaders:any;
      this.lang=='mr-IN'?displayedheaders=['अनुक्रमांक','नाव','वापरकर्ता प्रकार ','पातळी','पदनाव','मोबाईल नंबर','ब्लॉक','कृती']:displayedheaders= ['Sr. No.', 'Name','User Type','Level','Designation', 'Contact No','Block','Action']
      this.tableData = {
        pageNumber: this.pageNumber,
        highlightedrow:true,
        img: '',
        blink: '',
        badge: '',
        isBlock: 'isBlock',
        displayedColumns: displayedColumns,
        tableData: this.tableDataArray,
        tableSize: this.totalItem,
        tableHeaders: displayedheaders,
        pagination: true,
        edit: true,
        delete: false,
      }
      this.highlightRowFlag?this.tableData.highlightedrow=true:this.tableData.highlightedrow=false,
      this.apiService.tableData.next(this.tableData)
}

  childCompInfo(obj: any) {     //table functionality
    if (obj.label == 'Pagination') {
    this.pageNumber = obj.pageNumber
    this.getAllUserData();
  } else if (obj.label == 'Edit') {
    this.registerusers(obj);
  } else if(obj.label =='Delete'){
    this.deleteDialog(obj);
  }else if(obj.label =='Block'){
    this.blockUnblockDialog(obj)
  }
  }
  //----------------------------------------------------------Add update modal open------------------------------------------------------------
  registerusers(editObj?: any) {
    const dialog =this.dialog.open(RegisterUsersComponent, {
      width: '650px',
      disableClose: true,
      data:{
        cardTitle: this.lang=='mr-IN' ? (editObj?'वापरकर्ता अद्यतनित करा':'वापरकर्ता नोंदणी'):(editObj?'Update User':'User Registration'),
        obj:editObj,
        flag:editObj?'Update':'Add',
        successBtnText: this.lang=='mr-IN' ? (editObj?'अद्यतन':'जतन करा'):(editObj?'Update':'Submit'),
        cancelBtnText:editObj? (this.lang=='mr-IN' ? 'रद्द करा' : 'Cancel'):(this.lang=='mr-IN' ? 'रद्द करा' : 'Clear'),
      },
    })
    dialog.afterClosed().subscribe((res:any) => {
      if (res == 'Yes') {
        this.getAllUserData('editClose');
      }
        this.highlightRowFlag=false;
        this.setTableData();
    })
  }
  //#region----------------------------------------------------------Delete modal start-------------------------------------------------------------
  deleteDialog(deleteObj: any) {
    const dialog = this.dialog.open(GlobalDialogComponent, {
      width: '350px',
      disableClose: true,
      data:{
        p1: this.lang=='mr-IN' ? ' तुम्ही निवडलेले वापरकर्ता नोंदणी रेकॉर्ड हटवू इच्छिता?' : 'Do You Want To Delete Selected User Registered Record?',
        p2: '',
        cardTitle: this.lang=='mr-IN' ? 'हटवा' : 'Delete',
        successBtnText: this.lang=='mr-IN' ? 'हटवा' : 'Delete',
        dialogIcon: 'assets/images/trash.gif',
        cancelBtnText: this.lang=='mr-IN' ? 'रद्द करा' : 'Cancel',
      },
    })
    dialog.afterClosed().subscribe((res) => {
      if (res == 'Yes') {
        this.removeUser(deleteObj)
        this.highlightRowFlag=false;
      }
      else{
        this.highlightRowFlag=false;
        this.setTableData();
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
    this.apiService.setHttp('delete', 'zp_chandrapur/user-registration/DeleteUser?lan=' + (this.apiService.translateLang?this.lang:'en'), false, obj, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.common.snackBar(res.statusMessage, 0);
          this.getAllUserData();
        }
        else{
          this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
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
    this.lang=='mr-IN'?header=['अनुक्रमांक','नाव','वापरकर्ता प्रकार ','पातळी','पदनाव','जिल्हा', 'तालुका', 'केंद्र','मोबाईल नंबर','ब्लॉक स्थिती']:header=['Sr. No.', 'Name','User Type','Level','Designation','District','Taluka','Center', 'Mobile No','Block Status'];
    let column:any;
    this.lang=='mr-IN' && this.apiService.translateLang?column=['srNo','name','m_UserType','m_DesignationLevel','m_DesignationName','m_District','m_Taluka','m_Center','mobileNo','isBlock']:
    column=['srNo', 'name','userType','designationLevel', 'designationName','district','taluka','center','mobileNo','isBlock'];
    this.excelDowobj ={'pageName':pageName,'header':header,'column':column}
  }
  //#endregion------------------------------------------------End download pdf and excel method-----------------------------------------
//#region-----------------------------------------------------Start block unBlock user method------------------------------------------------
blockUnblockDialog(obj:any){
  const dialog = this.dialog.open(GlobalDialogComponent, {
    width: '350px',
    disableClose: true,
    data:{
      p1:obj.checked==true? (this.lang=='mr-IN' ? 'तुम्हाला निवडलेल्या वापरकर्त्याला ब्लॉक करायचे आहे का?' : 'Do You Want To Block Selected User?'):(this.lang=='mr-IN' ? ' तुम्हाला निवडलेल्या वापरकर्त्याला अनब्लॉक करायचे आहे का?' : 'Do You Want To UnBlock Selected User?'),
      p2: '',
      cardTitle:obj.checked==true? (this.lang=='mr-IN' ? 'ब्लॉक वापरकर्ता' : 'Block User'):(this.lang=='mr-IN' ? 'वापरकर्ता अनब्लॉक करा' : 'UnBlock User'),
      successBtnText:obj.checked==true?(this.lang=='mr-IN' ? 'ब्लॉक' : 'Block'):(this.lang=='mr-IN' ? 'अनब्लॉक' : 'UnBlock'),
      cancelBtnText: this.lang=='mr-IN' ? 'रद्द करा' : 'Cancel',
    },
  })
  dialog.afterClosed().subscribe((res) => {
    if (res == 'Yes') {
      this.blockUnblockUser(obj);
      this.highlightRowFlag=false;
    }
    else{
      this.highlightRowFlag=false;
      this.getAllUserData();
    }
  })
}

blockUnblockUser(blockObj:any){
  let obj={
    "id":blockObj.id,
    "isBlock": blockObj.checked,
    "blockDate":new Date(),
    "blockBy": 0
  }
  this.apiService.setHttp('PUT', 'zp_chandrapur/user-registration/BlockUnblockUser', false, obj, false, 'baseUrl')
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == '200') {
        this.common.snackBar(res.statusMessage, 0);
        this.getAllUserData();
      }
      else{
        this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
      }
    },
    error: ((err: any) => { this.errors.handelError(err) })
  });
}
//#endregion---------------------------------------------------End block unBlock user method---------------------------------------------------------
}
