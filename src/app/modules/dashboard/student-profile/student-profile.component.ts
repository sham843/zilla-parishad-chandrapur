import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
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
  subjectArray = new Array();
  StudentDataArray: any;
  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  studentId!: number;
  schoolId!: number;
  lang!: string;
  searchFilter = new FormControl();
  @ViewChild("chart") chart!: any;
  ChartOptions: any;
  globalObj: any;
  talukaArray: any;
  centerArray: any;
  levelId: any;
  language: any;

  constructor(
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private master: MasterService,
  ) { }

  ngOnInit() {
    let loginData = this.webStorage.getLoginData();
    this.levelId = loginData.designationLevelId; // admin - 1, district - 2, taluka - 3, kendra - 4, school - 5

    let obj = this.commonMethod.recParToUrl((this.route.snapshot.params['id']).toString(), 'secret key');
    this.globalObj = JSON.parse(obj);
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
    this.getformControl();
    this.getTaluka();
    this.getAllStudentData();
  }


  //#region  --------------------------------------------dropdown with filter fn start heare------------------------------------------------//
  getformControl() {
    this.filterFrm = this.fb.group({
      talukaId:[0],
      kendraId: [0],
      schoolId: [this.globalObj?.schId || 0],
      standardId: [0],
      searchText: [''],
      flag: [this.language = this.apiService.translateLang ? this.language : 'en'],
    });
    this.getAllStudentData();
  }

  getTaluka() {
    this.master.getAllTaluka('en', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          // this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? (this.topFilterForm.controls['talukaId'].setValue(this.loginData.talukaId), this.enbTalDropFlag = true, this.clickOnSvgMap('select')) : '';
          // this.levelId == 4 || this.levelId == 5 ? this.getKendra() : this.levelId == 3 ? this.cardCountData() : '';
        }
        else {
          this.talukaArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getKendra() {
    let formData = this.filterFrm?.value;
    this.master.getAllCenter(formData.flag, formData.talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          // this.levelId == 4 || this.levelId == 5 ? (this.topFilterForm.controls['kendraId'].setValue(this.loginData.centerId), this.enbCenterDropFlag = true) : '';
          // this.levelId == 5 ? this.getSchools() : this.levelId == 4 ? (this.getSchools(), this.cardCountData()) : ''; // this.cardCountData() temp
        }
        else {
          this.centerArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getSchool() {
    let formData = this.filterFrm.value
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + (this.apiService.translateLang ? this.lang : 'en') + '&CenterId=' + formData.kendraId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
        }
        else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  getStandard() {
    let formData = this.filterFrm.value
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllClassBySchoolId?flag_lang=' + (this.apiService.translateLang ? this.lang : 'en') + '&SchoolId=' + formData.schoolId, false, false, false, 'baseUrl');
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
        this.errorService.handelError(error.status);
      }
    })
  }

  getAllSubject() {
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSubject', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.subjectArray = res.responseData;
        }
        else {
          this.subjectArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errorService.handelError(error.status);
      }
    })
  }

  clearForm() {
    this.filterFrm.reset();
    this.getformControl();
    this.standardArray = [];
    this.getAllStudentData('filter');
  }
  //#endregion -------------------------------------------dropdown with filter fn end heare------------------------------------------------//

  //#region ------------------------------------------- table fn  start heare-------------------------------------------//
  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getAllStudentData();
        break;
      case 'Row': this.studentDataById()
        break
    }
  }

  getAllStudentData(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 : '';
    let formData = this.filterFrm.value;
    let str = `?pageno=${this.pageNumber}&pagesize=10`
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetAll' + str + '&SchoolId=' + (formData?.schoolId) + '&standardid=' + (formData?.standardId) + '&searchText=' + (formData?.searchText), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData;
          this.studentDataById( this.tableDataArray[0].id)
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
        this.setTableData();
      },
      error: ((err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err)
      })
    });
  }
  setTableData() {
    let displayedColumns;
    displayedColumns = this.lang == 'mr-IN' ? ['saralId', 'fullName', 'standard'] : ['saralId', 'fullName', 'standard']
    let displayedheaders;
    displayedheaders = this.lang == 'mr-IN' ? ['सरल आयडी', 'नाव', 'इयत्ता'] : ['Saral ID', 'Name', 'Standard']
    let tableData = {
      pageNumber: this.pageNumber,
      img: '', blink: '', badge: '', isBlock: '', pagination: true,
      displayedColumns: displayedColumns, tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
    };
    this.apiService.tableData.next(tableData);
  }
  //#endregion ------------------------------------------- table fn  start heare-------------------------------------------//

  //#region -------------------------------------------------main fn start heare Student info and graph -----------------------------//
  studentDataById(id?: any) {
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetById?Id=' + id + '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.StudentDataArray = res.responseData;
          this.StudentDataArray.m_Name1 = this.StudentDataArray.m_Name + ' ' + this.StudentDataArray.l_Name;
          this.StudentDataArray.f_Name1 = this.StudentDataArray.f_Name + ' ' + this.StudentDataArray.l_Name
          this.filterFrm.controls['schoolId'].setValue(this.StudentDataArray.schoolId);
          this.filterFrm.controls['standardId'].setValue(this.StudentDataArray.standardId);
          this.filterFrm.controls['searchText'].setValue(this.StudentDataArray.f_Name);
        }
        else {
          this.StudentDataArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => {
        this.errorService.handelError(err)
      })
    });
  }

  getStudentProChart() {
    this.ChartOptions = {
      series: [
        {
          name: "शिक्षक",
          data: [0, 1, 2]
        },
        {
          name: "पहिला",
          data: [0, 0, 2]
        },
        {
          name: "अधिकारी",
          data: [1, 2, 0]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "level",
        categories: [
          "पूर्व चाचणी",
          "मध्य चाचणी",
          "अंतिम चाचणी",
        ]
      },
      yaxis: {
        type: "text",
        categories: [
          "Story",
          "Paragraph",
          "Words",
          "Letter",
          "Initial"
        ]
      },
      legend: {
        position: "top",
        offsetY: 20,
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        x: {
          format: ""
        }
      }
    };
  }
  //#endregion -------------------------------------------------main fn end heare Student info and graph -----------------------------//
}
