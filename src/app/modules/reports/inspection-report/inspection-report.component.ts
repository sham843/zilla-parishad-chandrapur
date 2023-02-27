import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { InspectionReportDetailsComponent } from './inspection-report-details/inspection-report-details.component';

@Component({
  selector: 'app-inspection-report',
  templateUrl: './inspection-report.component.html',
  styleUrls: ['./inspection-report.component.scss']
})
export class InspectionReportComponent {
  searchForm!:FormGroup;
  pageNumber:number = 1;
  lang:string |any;
  tableData:object |any;
  excelDowobj:object |any;
  visitDataArray = new Array();
  talukaArray = new Array();
  kendraArray = new Array();
  schoolArray = new Array();  
  totalItem!:number;
  pageSize:number = 10;
  constructor(private apiService:ApiService,
    private commonMethos:CommonMethodsService,
    private errors:ErrorsService,
    private webStorage:WebStorageService,
    private excel:ExcelPdfDownloadService,
    private dialog:MatDialog,
    private fb:FormBuilder,
    private masterService:MasterService,
    public validation:ValidationService,
    private router:Router,
    private datePipe:DatePipe){}

  ngOnInit(){
    this.getFormControl();
    this.webStorage.setLanguage.subscribe((res: any) => {
      res=='Marathi'?this.lang='mr-IN':this.lang='en';
      this.setTableData();
    })
    this.getTaluka();
    this.getAllVisitData();
  }

  getFormControl(){
    this.searchForm=this.fb.group({
      talukaId:[''], 
      kendraID:[''], 
      schoolId:[''],
    })
  }

  //#region------------------------------------------drop-down methods start here------------------------------------------------------------------
  getTaluka(){
    this.masterService.getAllTaluka((this.apiService.translateLang?this.lang:'en'), 1).subscribe((res: any) => {
      this.talukaArray = res.responseData;
    })
  }
  getkendra(talukaID:any){
    this.masterService.getAllCenter((this.apiService.translateLang?this.lang:'en'), talukaID).subscribe((res: any) => {
      this.kendraArray = res.responseData;
    })
  }
  getSchool(kendraId:any){
    this.masterService.getSchoolByCenter((this.apiService.translateLang?this.lang:'en'), kendraId).subscribe((res: any) => {
      this.schoolArray = res.responseData;
    })
  }
  //#endregion---------------------------------------Drop-down method end here--------------------------------------------------------------------

  getAllVisitData(flag?:any){
    flag=='excel'? this.pageSize = this.totalItem * 10 :this.pageSize =10;
  let obj= 1+'&pageno='+(this.pageNumber)+'&pagesize='+(this.pageSize)+'&searchText='+('');
  this.apiService.setHttp('GET', 'VisitorForm/GetAll?UserTypeId='+obj, false, false, false, 'baseUrl')
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      if (res.statusCode == '200') {
        this.visitDataArray=res.responseData.responseData1;
        this.visitDataArray?.forEach((ele:any)=>{
         ele.visitDate= this.datePipe.transform(ele.visitDate,'dd/MM/yyyy');
        })
        this.totalItem =res.responseData.responseData2.pageCount;
      }
      else{
        this.commonMethos.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethos.snackBar(res.statusMessage, 1);
      }
      flag != 'excel' && this.visitDataArray ? this.setTableData() : (this.excel.downloadExcel(this.visitDataArray, this.excelDowobj.pageName, this.excelDowobj.header, this.excelDowobj.column));
    },
    error: ((err: any) => { this.errors.handelError(err) })
  });

  }
  
  setTableData(){
    let displayedColumns:any;
    this.lang=='mr-IN' && this.apiService.translateLang? displayedColumns=['srNo','m_Taluka','schoolCenter', 'schoolName','visitDate','vistorName','action']:displayedColumns= ['srNo','taluka','schoolCenter', 'schoolName','visitDate','vistorName','action']
        let displayedheaders:any;
        this.lang=='mr-IN'?displayedheaders=['अनुक्रमांक', 'तालुका', 'केंद्र','शाळेचे नाव','भेटीची तारीख','अधिकाऱ्याचे नाव','कृती']:displayedheaders= ['Sr.No.','Taluka','Kendra','School Name','Visit Date','Officer Name','Action']
        this.tableData = {
          pageNumber: this.pageNumber,
          highlightedrow:true,
          img: '',
          blink: '',
          badge: '',
          isBlock: '',
          displayedColumns: displayedColumns,
          tableData: this.visitDataArray,
          tableSize: this.totalItem,
          tableHeaders: displayedheaders,
          pagination: true,
          edit: false,
          delete: false,
          view: true,
        }
        this.apiService.tableData.next(this.tableData)
  }

  childCompInfo(obj:any){
    if(obj.label=='view'){
      this.router.navigate(['../inspection-report-details/'+obj.id]);
    }
  }

  onSearchReport(){
    
  }
  excelDownload() {
    this.getAllVisitData('excel');
    let pageName:any;
    this.lang=='mr-IN'?pageName='शैक्षणिक शाळेला भेट':pageName='Educational school visit';
    let header:any;
    this.lang=='mr-IN'?header=['अनुक्रमांक', 'तालुका', 'केंद्र','शाळेचे नाव','भेटीची तारीख','अधिकाऱ्याचे नाव','शाळेचे माध्यम', 'मुख्याध्यापक नाव', 'वर्ग शिक्षकाचे नाव', 'भेट दिलेली इयत्ता', 'एकूण विद्यार्थी इयत्तेत', 'सध्याचे विद्यार्थी','कृती']:
    header=['Sr.No.','Taluka','Kendra', 'School Name','Visit Date','Officer Name','School Medium','Principle Name','Class Teacher Name','Visited Standard Id','Student In Standard','Present Student','Action'];
    let column:any;
    this.lang=='mr-IN' && this.apiService.translateLang?column=['Sr.No.','m_Taluka','schoolCenter', 'schoolName','visitDate','vistorName','schoolMedium','principleName','classTeacherName','visitedStandardId','studentInStandard','presentStudent','action']:
    column=['Sr.No.','taluka','schoolCenter', 'schoolName','visitDate','vistorName','schoolMedium','principleName','classTeacherName','visitedStandardId','studentInStandard','presentStudent','action'];
    this.excelDowobj ={'pageName':pageName,'header':header,'column':column}
  }

  viewVisitData(id:number){
    this.dialog.open(InspectionReportDetailsComponent, {
      width: '1000px',
      disableClose: true,
      data:id,
    })
  }
}

/*   
 
  "principleW_No": "1233554",
  "sclmgtTypeName": "N.P./M.N.P.",
  "m_SclmgtTypeName": "न.प./म.न.पा.",
  "panchayatCommiteeId": 2257845,
  "taluka": null,
  "m_Taluka": null,
  "visitDate": "2023-02-10T09:18:54.423",
  "classTeacherName": "oipu9",
  "visitedStandardId": 5,
  "standard": "5th",
  "m_Standard": "पाचवी",
  "studentInStandard": 60,
  "presentStudent": 59,
  "surveyFeedback": "pokokh",
  "surveyPhoto": "", */
 