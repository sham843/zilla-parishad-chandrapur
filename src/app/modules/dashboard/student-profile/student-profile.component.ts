import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
 import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
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
  standardArray = new Array();
  schoolArray = new Array();
  foods=new Array();
  pageNumber: number = 1;
  lang!:string;
  tableDataArray = new Array();
  tableDatasize!:number;
  totalPages!:number;
  dataArray:any;//for view
  studentId!:number;

  constructor(
    private webStorage: WebStorageService,
    private apiService: ApiService,
     private commonMethod: CommonMethodsService,
    // private master: MasterService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
   private spinner: NgxSpinnerService,
   private router:ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.formData();
    this.getTableData();
    // console.log("rrrrrrrrrrr",this.commonMethod.getUserTypeID());
   this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
    this.getSchool(this.lang,2713010002);
this.router.params.subscribe((res:any)=>{
this.studentId=res.id
});
   this.displayData(this.studentId);
  }

  formData() {
    this.filterFrm = this.fb.group({
      schoolId: [0],
      standardId: [0],
      searchText: ['']
    })
  }

  getTableData(flag?:any) {
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 :'';
    let formData = this.filterFrm.value;
    // (formData?.talukaId)
    let str =`?pageno=${this.pageNumber}&pagesize=10`
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str+'&SchoolId='+(formData?.schoolId)+'&standardid='+(formData?.standardId)+'&searchText='+(formData?.searchText),false, false, false, 'baseUrl');
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

  displayData(id?:any){
  this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetById?Id='+id,false, false, false, 'baseUrl');
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
    console.log("obj",obj)
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
        case 'Row':this.displayData(obj?.id)
          break
       }
      //  console.log(obj);
 }

 getSchool(strPara:string,centerId: number) {
  this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + strPara + '&CenterId=' + centerId, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: ((res: any) => {
      if (res.statusCode == "200") {
        this.schoolArray = res.responseData;
        this.getStandard(this.lang,this.filterFrm.value?.schoolId);
         }
      else {
        this.schoolArray = [];
        this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
      }
    }),
    error: (error: any) => {
      this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
    }
  })
}

getStandard(strPara: string, schoolId: number) {
  this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllClassBySchoolId?flag_lang=' + strPara + '&SchoolId=' + schoolId, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: ((res: any) => {
      if (res.statusCode == "200") {
        this.standardArray = res.responseData;
         }
      else {
        this.standardArray = [];
        this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
      }
    }),
    error: (error: any) => {
      this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
    }
  })
}

clearForm() {
  this.filterFrm.reset();
  this.formData();
  this.standardArray = [];
  this.getTableData('filter');
}




}
