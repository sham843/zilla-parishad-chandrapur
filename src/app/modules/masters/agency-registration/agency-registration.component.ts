import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { NgxSpinnerService } from 'ngx-spinner'
import { ApiService } from 'src/app/core/services/api.service'
import { CommonMethodsService } from 'src/app/core/services/common-methods.service'
import { ErrorsService } from 'src/app/core/services/errors.service'
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service'
import { WebStorageService } from 'src/app/core/services/web-storage.service'
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component'
import { RegisterAgencyComponent } from './register-agency/register-agency.component'
import { Subscription } from 'rxjs';
import { ValidationService } from 'src/app/core/services/validation.service'
@Component({
  selector: 'app-agency-registration',
  templateUrl: './agency-registration.component.html',
  styleUrls: ['./agency-registration.component.scss'],
})
export class AgencyRegistrationComponent {
  searchControl = new FormControl()
  pageNumber: number = 1
  totalItem!: number;
  totalPages!: number;
  tableDataArray = new Array()
  agencyData = new Array()
  tableData: any
  language: any;
  pageSize: number = 10;
  excelDowobj!:any;
  highLightFlag:boolean=true;
  subscription!: Subscription;
  constructor(
    public dialog: MatDialog,
    private excelPdf: ExcelPdfDownloadService,
    private apiService: ApiService,
    private webStorage: WebStorageService,
    private errors: ErrorsService,
    private spinner: NgxSpinnerService,
    private common: CommonMethodsService,
    public validation:ValidationService,
  ) { }

  ngOnInit() {
    this.getAllAgencyData();
   this.subscription=this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
      this.setTableData();
    })
  }
  //--------------------------------------------------------get agency data-----------------------------------------------------------
  getAllAgencyData(flag?: string) {
    flag == 'filter' ? this.pageNumber = 1 :'';
    this.spinner.show();
    let serchText = this.searchControl.value ? this.searchControl.value : ''
    let obj =  flag != 'excel' ? `pageno=${this.pageNumber}&pagesize=10` : `pageno=1&pagesize=${this.totalPages * 10}`;
    this.apiService.setHttp('get', 'zp_chandrapur/agency/GetAll?' + `${obj}&textSearch=${serchText}`, true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.tableDataArray = res.responseData.responseData1;
          this.totalItem = res.responseData.responseData2.pageCount;
          this.totalPages = res.responseData.responseData2.totalPages;

        } else {
          this.spinner.hide();
          this.common.snackBar(this.language == 'Marathi' ? (res.statusMessage = 'माहिती सापडली नाही') : (res.statusMessage = 'Data Not Found'), 1);
          this.tableDataArray = []
          this.totalItem = 0;
          this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
        }
        flag != 'excel' && this.tableDataArray? this.setTableData() :( this.excelPdf.downloadExcel(this.tableDataArray, this.excelDowobj.pageName, this.excelDowobj.header, this.excelDowobj.column),this.getAllAgencyData());
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  setTableData() {
    this.highLightFlag=true;
    let displayedColumns;
    this.language == 'Marathi' && this.apiService.translateLang ? displayedColumns = ['srNo', 'm_AgencyName', 'contactNo', 'emailId', 'action'] : displayedColumns = ['srNo', 'agencyName', 'contactNo', 'emailId', 'action']
    let displayedheaders;
    this.language == 'Marathi' ? displayedheaders = ['अनुक्रमांक', 'एनजीओ नाव', 'संपर्क क्र.', 'ई-मेल आयडी', 'कृती'] : displayedheaders = ['Sr. No.', 'NGO Name', 'Contact No', 'Email ID', 'Action']
    this.tableData = {
      pageNumber: this.pageNumber,
      // highlightedRow:true,
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
      delete: true
    }
    this.highLightFlag?this.tableData.highlightedrow=true:this.tableData.highlightedrow=false,
    this.apiService.tableData.next(this.tableData);
  }
  childCompInfo(obj: any) {   //table method
    switch (obj.label) {
        case 'Pagination':
          this.pageNumber = obj.pageNumber;
          this.getAllAgencyData();
          break;
        case 'Edit':
          this.registeragency(obj);
          break;
        case 'Delete':
          this.deleteAgencyModalOpen(obj);
          break;
        case 'Row':
          // this.viewNgoDetails(obj);
          break;
      }
  }

  registeragency(obj?: any) {
    const dialog = this.dialog.open(RegisterAgencyComponent, {
      width: '850px',
      disableClose: true,
      data: {
        cardTitle: obj ? (this.language == 'Marathi' ? 'एनजीओ अपडेट करा' : 'Update NGO') : (this.language == 'Marathi' ? 'एनजीओ नोंदणी करा' : 'NGO Registration'),
        successBtnText: obj ? (this.language == 'Marathi' ? 'अपडेट' : 'Update') : (this.language == 'Marathi' ? 'प्रस्तुत करणे' : 'Submit'),
        obj: obj,
        cancelBtnText:obj ? (this.language == 'Marathi' ? 'रद्द करा' : 'Cancel'):(this.language == 'Marathi' ? '	रद्द करा' : 'Clear'),
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res == 'Yes') {
        this.getAllAgencyData();
      }
      this.highLightFlag=false;
      this.setTableData();
    })
  }
  //----------------------------------------------------delete functionality---------------------------------------------------------
  deleteAgencyModalOpen(obj?: any) {
    const dialog = this.dialog.open(GlobalDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
        p1: this.language == 'Marathi' ? 'तुम्ही निवडलेले एनजीओ रेकॉर्ड हटवू इच्छिता?' : 'Do You Want To Delete Selected NGO Record?',
        p2: '',
        cardTitle: this.language == 'Marathi' ? 'डिलीट करा' : 'Delete',
        successBtnText: this.language == 'Marathi' ? 'डिलीट' : 'Delete',
        dialogIcon: 'assets/images/trash.gif',
        cancelBtnText: this.language == 'Marathi' ? 'रद्द करा' : 'Cancel',
      },
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res == 'Yes') {
        this.deleteAgency(obj);
      }
      this.highLightFlag=false;
      this.setTableData();
    })
  }

  deleteAgency(obj: any) {
    let langFlag;
    this.language == 'Marathi' ? (langFlag = 'mr-IN') : (langFlag = 'en');
    let deleteObj = {
      "id": obj.id,
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "lan": ''
    }
    this.apiService.setHttp('delete', 'zp_chandrapur/agency/Delete?lan=' + langFlag, true, deleteObj, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.common.snackBar(res.statusMessage, 0);
          this.getAllAgencyData();
        }
         else{
          this.common.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
         }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  clearSearch(){
    this.searchControl.setValue('');
    this.getAllAgencyData();
  }
  //#region------------------------------------------------start pdf & excel download method-----------------------------------------

   excelDownload() {
    this.getAllAgencyData('excel');
    let pageName: any;
    this.language == 'Marathi' ? pageName = 'एनजीओ नोंदणी' : pageName = 'NGO Registration';
    let header: any;
    this.language == 'Marathi' ? header = ['अनुक्रमणिका', 'एनजीओ नाव', 'संपर्क क्र.', 'ई-मेल आयडी','नोंदणी क्रमांक', 'संपर्क व्यक्तीचे नाव', 'पत्ता', 'जिल्हा', 'तालुका'] : header = ['Sr.No.', 'NGO Name', 'Contact No.', 'Email Id','Registration No','Contact Person Name','Address','District','Taluka'];
    let column: any;
    this.language == 'Marathi' && this.apiService.translateLang? column = ['srNo', 'm_AgencyName', 'contactNo', 'emailId','registrationNo','contactPersonName','address','m_District','m_Taluka'] : column = ['srNo', 'agencyName', 'contactNo', 'emailId','registrationNo','contactPersonName','address','district','taluka'];
    this.excelDowobj ={'pageName':pageName,'header':header,'column':column}
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  /* viewNgoDetails(obj:any){
    let viewObj = {
      cardTitle: this.language == 'mr-IN' ? '' : 'NGO Master',
      data:[
        {label:'District',value:obj.district},
        {label:'Taluka',value:obj.taluka},
        {label:'NGo Name',value:obj.agencyName},
        {label:'Registration No.',value:obj.registrationNo},
        {label:'Contact No.',value:obj.contactNo},
        {label:'Contact Person Name',value:obj.contactPersonName},
        {label:'Email Id',value:obj.emailId},
      ],
    }
     this.dialog.open(ViewDialogComponent, {
      width: '850px',
      data: viewObj,
      disableClose: true,
      autoFocus: false
    })
  } */
}

