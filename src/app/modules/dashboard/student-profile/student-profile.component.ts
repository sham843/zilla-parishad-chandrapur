import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
// import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';

// import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent {
  filterFrm!: FormGroup;
  talukaArray = new Array();
  centerArray = new Array();
  schoolArray = new Array();
  foods=new Array();
  pageNumber: number = 1;
  lang!:string;
  tableDataArray = new Array();
  tableDatasize!:number;
  totalPages!:number;
  dataArray:any;//for view

  constructor(
    private webStorage: WebStorageService,
    private apiService: ApiService,
    // private commonMethod: CommonMethodsService,
    // private master: MasterService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
   private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    // this.formData();
    this.getTableData();
    // console.log("rrrrrrrrrrr",this.commonMethod.getUserTypeID());
   this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
     this.displayData();
   
  }

  formData() {
    this.filterFrm = this.fb.group({
      schoolId: [0],
      standardId: [0],
      searchText: ['']
    })
  }

  getTableData() {
    this.spinner.show();
    // let formData = this.filterFrm.value;
    let str =`?pageno=${this.pageNumber}&pagesize=10`
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str ,false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData;
          this.tableDataArray?.map((ele: any) => {
            ele.fullName = ele.f_Name + ' ' + ele.m_Name + ' ' + ele.l_Name;
          })
          this.tableDatasize = res.responseData1?.pageCount;
          this.totalPages = res.responseData1.totalPages;
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
       this.setTableData() ;
      },
      error: ((err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err)
      })
    });
  }

  setTableData() {
    let displayedColumns;
    displayedColumns =  this.lang == 'mr-IN' ? ['saralId', 'fullName', 'standard'] : ['saralId', 'fullName','standard']
    let displayedheaders;
    displayedheaders =  this.lang == 'mr-IN' ? ['सरल आयडी', 'नाव','इयत्ता'] : ['Saral ID', 'Name','Standard']
     let tableData = {
      pageNumber: this.pageNumber,
      img: '', blink: '', badge: '', isBlock: '', pagination: true,
      displayedColumns: displayedColumns, tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
    };
    this.apiService.tableData.next(tableData);
  }

  displayData(){
  this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetById?Id=55',false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
         if (res.statusCode == "200") {
          this.dataArray = res.responseData;
          this.dataArray?.map((ele: any) => {
            ele.fatherName = ele.m_Name + ' ' + ele.l_Name;
          })
         } 
         else {
          this.dataArray = [];
          }
     },
      error: ((err: any) => {
        this.errorService.handelError(err)
      })
    });
}

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
       }
       console.log(obj);
  }

}
