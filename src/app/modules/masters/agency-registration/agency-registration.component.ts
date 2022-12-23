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

@Component({
  selector: 'app-agency-registration',
  templateUrl: './agency-registration.component.html',
  styleUrls: ['./agency-registration.component.scss'],
})
export class AgencyRegistrationComponent {
  searchControl = new FormControl()
  pageNumber: number = 1
  totalItem!: number
  tableDataArray = new Array()
  tableData!: object
language:any;
  constructor(
    public dialog: MatDialog,
    private excelPdf: ExcelPdfDownloadService,
    private apiService: ApiService,
    private webStorage:WebStorageService,
    private errors: ErrorsService,
    private spinner:NgxSpinnerService,
    private common:CommonMethodsService
  ) {}

  ngOnInit() {
    this.getAllAgencyData();
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
      this.setTableData();
    })
  }
  //--------------------------------------------------------get agency data-----------------------------------------------------------
  getAllAgencyData() {
    this.spinner.show();
    let serchText = this.searchControl.value ? this.searchControl.value : ''
    let obj = `pageno=${this.pageNumber}&pagesize=10&textSearch=${serchText}`;
    this.apiService.setHttp('get','zp_chandrapur/agency/GetAll?' + obj,true,false,false,'baseUrl')
    this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == "200") {
        this.spinner.hide();
        this.tableDataArray = res.responseData.responseData1;
        this.totalItem = res.responseData.responseData2.pageCount;
        this.setTableData()
      } else {
        this.spinner.hide();
        this.common.snackBar(res.statusMessage,1);
          this.tableDataArray = []
          this.totalItem = 0
      }
     this.setTableData();
    },
    error: ((err: any) => { this.errors.handelError(err) })
  });
}

  setTableData(){
    let displayedColumns;
    this.language =='Marathi'? displayedColumns=['srNo','m_AgencyName','contactNo','emailId','action']:displayedColumns=[ 'srNo', 'agencyName','contactNo','emailId','action']
    let displayedheaders;
    this.language =='Marathi'? displayedheaders=['अनुक्रमणिका','एजन्सीचे नाव','संपर्क क्र.','ई-मेल आयडी','कृती']:displayedheaders=[ 'Sr.No.','Agency Name','Contact No.','Email Id','Action']
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
  
  registeragency(obj?:any) {
   const dialog= this.dialog.open(RegisterAgencyComponent, {
      width: '750px',
      disableClose: true,
      data:obj
    })
    dialog.afterClosed().subscribe((res:any)=>{
        if(res=='Yes'){
          this.getAllAgencyData();
        }
      })
  }
  //----------------------------------------------------delete functionality---------------------------------------------------------
  deleteAgencyModalOpen(obj?:any) {
    const dialog= this.dialog.open(GlobalDialogComponent, {
       width: '750px',
       disableClose: true,
       data: { p1:this.language == 'Marathi' ? 'तुम्हाला खात्री आहे की तुम्ही निवडलेली एजन्सी हटवू इच्छिता?': 'Are You Sure You Want To Delete Selected Agency?',
        p2: '',
        cardTitle: this.language == 'Marathi' ? 'हटवा' : 'Delete',
        successBtnText: this.language == 'Marathi' ? 'हटवा' : 'Delete',
        dialogIcon: 'assets/images/logout.gif',
        cancelBtnText: this.language == 'Marathi' ? 'रद्द करा' : 'Cancel',
      },
     })
     dialog.afterClosed().subscribe((res:any)=>{
         if(res=='Yes'){
           this.deleteAgency(obj);
         }
       })
   }

  deleteAgency(obj:any){
    let langFlag;
    this.language=='Marathi'?(langFlag='mr-IN'):(langFlag='en');
    let deleteObj={
        "id":obj.id,
        "modifiedBy": 0,
        "modifiedDate":new Date(),
        "lan":langFlag
    }
    this.apiService.setHttp('delete','zp_chandrapur/agency/Delete',true,deleteObj,false,'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if(res.statusCode=='200'){
          this.common.snackBar(res.statusMessage,0);
          this.getAllAgencyData();
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
     
  }
  //#region------------------------------------------------start pdf & excel download method-----------------------------------------
  pdfDownload() {
    let pageName='Agency Registration';
    let header=['Sr.No.','Agency Name','Contact No.','Email Id'];
    let column=['srNo', 'agencyName','contactNo','emailId'];
    this.excelPdf.downLoadPdf(this.tableDataArray,pageName,header,column);
  }
  excelDownload() {
    let pageName='Agency Registration';
    let header=['Sr.No.','Agency Name','Contact No.','Email Id'];
    let column=['srNo', 'agencyName','contactNo','emailId'];
    this.excelPdf.downloadExcel(this.tableDataArray,pageName,header,column);
  }
}
