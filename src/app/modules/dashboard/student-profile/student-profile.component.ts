import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
// import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
 import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
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
  tableDataArray = new Array();
  // subjectArray=new Array();
  StudentDataArray:any;
  pageNumber: number = 1;
  tableDatasize!:number;
  totalPages!:number;
  studentId!:number;
  lang!:string;
  searchFilter = new FormControl();
  
  constructor(
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router:ActivatedRoute) {}

  ngOnInit() {
   this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
    this.router.params.subscribe((res:any)=>{
    this.studentId=res.id});
    this.getformControl();
    this.studentDataById(this.studentId);
    this.getAllStudentData();
    this.getSchool(2713010002);
    // this.getSubject(this.lang);
  }

  // ngAfterViewInit() {
  //   let formValue = this.searchFilter.valueChanges;
  //   formValue.pipe(
  //     filter(() => this.searchFilter.valid),
  //     debounceTime(1000),
  //     distinctUntilChanged())
  //     .subscribe(() => {
  //       this.clearForm()
  //       this.getAllStudentData();
  //     })
  // }

  getformControl() {
    this.filterFrm = this.fb.group({
      schoolId: [2],
      standardId: [0],
      searchText: ['']
    })
  }

  getAllStudentData(flag?:any) {
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 :'';
    let formData = this.filterFrm.value;
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

  studentDataById(id?:any){
  this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetById?Id='+id+'&lan='+this.lang,false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
         if (res.statusCode == "200") {
          this.StudentDataArray = res.responseData;
          this.StudentDataArray.f_Name1 =  this.StudentDataArray.m_Name + ' ' +  this.StudentDataArray.l_Name
          this.filterFrm.controls['schoolId'].setValue(this.StudentDataArray.schoolId);
          this.filterFrm.controls['standardId'].setValue(this.StudentDataArray.standardId);
          this.filterFrm.controls['searchText'].setValue(this.StudentDataArray.f_Name);
         
         } 
         else {
          this.StudentDataArray = [];
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
        this.getAllStudentData();
        break;
        case 'Row':this.studentDataById(obj?.id)
          break
       }
      //  console.log(obj);
 }

 getSchool(centerId: number) {
  this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + this.lang + '&CenterId=' + centerId, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: ((res: any) => {
      if (res.statusCode == "200") {
        this.schoolArray = res.responseData;
        this.getStandard(this.filterFrm.value?.schoolId);
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

getStandard(schoolId: number) {
  this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllClassBySchoolId?flag_lang=' + this.lang + '&SchoolId=' + schoolId, false, false, false, 'baseUrl');
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

// getSubject(strPara: string) {
//   this.apiService.setHttp('GET', 'zzp_chandrapur/master/GetAllSubject?flag_lang=' + strPara, false, false, false, 'baseUrl');
//   this.apiService.getHttp().subscribe({
//     next: ((res: any) => {
//       if (res.statusCode == "200") {
//         this.subjectArray = res.responseData;
//       }
//       else {
//         this.subjectArray = [];
//         this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
//       }
//     }),
//     error: (error: any) => {
//       this.commonMethod.checkEmptyData(error.statusText) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
//     }
//   })
// }

clearForm() {
  this.filterFrm.reset();
  this.getformControl();
  this.standardArray = [];
  this.getAllStudentData('filter');
}




}
