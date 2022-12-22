import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ApiService } from 'src/app/core/services/api.service'
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
    private webStorage:WebStorageService
  ) {}

  ngOnInit() {
    // this.getAllAgencyData();
    this.webStorage.langNameOnChange.subscribe((res: any) => {
      res == 'Marathi' ? (this.language = 'mr-IN') : (this.language = 'en');
      this.getAllAgencyData();
    })
  }
  //--------------------------------------------------------get agency data-----------------------------------------------------------
  getAllAgencyData() {
    let serchText = this.searchControl.value ? this.searchControl.value : ''
    let obj = `pageno=${this.pageNumber}&pagesize=10&textSearch=${serchText}&lan=${this.language}`;
    this.apiService.setHttp('get','zp_chandrapur/agency/GetAll?' + obj,true,false,false,'baseUrl')
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == '200') {
        this.tableDataArray = res.responseData.responseData1;
        this.totalItem = res.responseData.responseData2.pageCount;
      } else {
        this.tableDataArray = []
        this.totalItem = 0
      }
      let displayedColumns;
      this.language =='mr-IN'? displayedColumns=['srNo','m_AgencyName','contactNo','emailId','action']:displayedColumns=[ 'srNo', 'agencyName','contactNo','emailId','action']
      let displayedheaders;
      this.language =='mr-IN'? displayedheaders=['अनुक्रमणिका','एजन्सीचे नाव','संपर्क क्र.','ई-मेल आयडी','कृती']:displayedheaders=[ 'Sr.No.','Agency Name','Contact No.','Email Id','Action']
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
    })
  }

  childCompInfo(obj: any) {   //table method
    if (obj.label == 'Pagination') {
      this.pageNumber = obj.pageNumber
      this.getAllAgencyData();
    } else if (obj.label == 'Edit') {
      this.registeragency(obj);
    } else {
      this.removeModalOpen(obj);
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

  clearFilter(){
    this.searchControl.setValue('');
    this.getAllAgencyData();
  }
  //----------------------------------------------------delete functionality---------------------------------------------------------
  removeModalOpen(obj?:any) {
    const dialog= this.dialog.open(GlobalDialogComponent, {
       width: '750px',
       disableClose: true,
       data:obj
     })
     dialog.afterClosed().subscribe((res:any)=>{
         if(res=='Yes'){
           this.removeAgency(obj);
         }
       })
   }

  removeAgency(obj:any){
    let deleteObj={
        "id":obj.id,
        "modifiedBy": 0,
        "modifiedDate":new Date(),
        "lan": ""
    }
    this.apiService.setHttp('delete','zp_chandrapur/agency/Delete',true,deleteObj,false,'baseUrl')
    this.apiService.getHttp().subscribe((res: any) => {
      if(res.statusCode=='200'){
        this.getAllAgencyData();
      }
    })
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
