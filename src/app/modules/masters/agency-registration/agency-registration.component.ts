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
  subscription!: Subscription;
  constructor(
    public dialog: MatDialog,
    private excelPdf: ExcelPdfDownloadService,
    private apiService: ApiService,
    private webStorage: WebStorageService,
    private errors: ErrorsService,
    private spinner: NgxSpinnerService,
    private common: CommonMethodsService
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
          this.common.snackBar(res.statusMessage, 1);
          this.tableDataArray = []
          this.totalItem = 0
        }
        flag != 'excel' && this.tableDataArray? this.setTableData() : this.excelPdf.downloadExcel(this.tableDataArray, this.excelDowobj.pageName, this.excelDowobj.header, this.excelDowobj.column);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  setTableData() {
    let displayedColumns;
    this.language == 'Marathi' ? displayedColumns = ['srNo', 'm_AgencyName', 'contactNo', 'emailId', 'action'] : displayedColumns = ['srNo', 'agencyName', 'contactNo', 'emailId', 'action']
    let displayedheaders;
    this.language == 'Marathi' ? displayedheaders = ['अनुक्रमांक', 'एनजीओ नाव', 'संपर्क क्र.', 'ई-मेल आयडी', 'कृती'] : displayedheaders = ['Sr. No.', 'NGO Name', 'Contact No', 'Email Id', 'Action']
    this.tableData = {
      pageNumber: this.pageNumber,
      highlightedRow: '',
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
    this.apiService.tableData.next(this.tableData)
  }


  childCompInfo(obj: any) {   //table method
    if (obj.label == 'Pagination') {
      this.pageNumber = obj.pageNumber
      this.getAllAgencyData();
    } else if (obj.label == 'Edit') {
      this.registeragency(obj);
    } else {
      this.deleteAgencyModalOpen(obj);
    }
  }

  registeragency(obj?: any) {
    const dialog = this.dialog.open(RegisterAgencyComponent, {
      width: '850px',
      disableClose: true,
      data: {
        cardTitle: obj ? (this.language == 'Marathi' ? 'अपडेट एनजीओ' : 'Update NGO') : (this.language == 'Marathi' ? 'नोंदणी एनजीओ' : 'Register NGO'),
        successBtnText: obj ? (this.language == 'Marathi' ? 'अपडेट' : 'Update') : (this.language == 'Marathi' ? 'प्रस्तुत करणे' : 'Submit'),
        obj: obj,
        cancelBtnText: this.language == 'Marathi' ? 'रद्द करा' : 'Cancel',
      }
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res == 'Yes') {
        this.getAllAgencyData();
      }
    })
  }
  //----------------------------------------------------delete functionality---------------------------------------------------------
  deleteAgencyModalOpen(obj?: any) {
    const dialog = this.dialog.open(GlobalDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
        p1: this.language == 'Marathi' ? 'तुम्हाला खात्री आहे की तुम्ही निवडलेली एजन्सी हटवू इच्छिता?' : 'Are You Sure? You Want To Delete Selected Agency?',
        p2: '',
        cardTitle: this.language == 'Marathi' ? 'हटवा' : 'Delete',
        successBtnText: this.language == 'Marathi' ? 'हटवा' : 'Delete',
        dialogIcon: 'assets/images/trash.gif',
        cancelBtnText: this.language == 'Marathi' ? 'रद्द करा' : 'Cancel',
      },
    })
    dialog.afterClosed().subscribe((res: any) => {
      if (res == 'Yes') {
        this.deleteAgency(obj);
      }

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
    this.language == 'Marathi' ? header = ['अनुक्रमणिका', 'एनजीओ नाव', 'संपर्क क्र.', 'ई-मेल आयडी'] : header = ['Sr.No.', 'NGo Name', 'Contact No.', 'Email Id'];
    let column: any;
    this.language == 'Marathi' ? column = ['srNo', 'm_AgencyName', 'contactNo', 'emailId'] : column = ['srNo', 'agencyName', 'contactNo', 'emailId'];
    this.excelDowobj ={'pageName':pageName,'header':header,'column':column}
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
