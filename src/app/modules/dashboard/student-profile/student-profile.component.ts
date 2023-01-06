import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexStroke, ApexXAxis, ApexTooltip, ApexYAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis:ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
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
  lang!: string;
  searchFilter = new FormControl();
  @ViewChild("chart") chart!: any;
  ChartOptions: any;

  constructor(
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
    this.router.params.subscribe((res: any) => {
      this.studentId = res.id
    });
    this.getformControl();
    this.studentDataById(this.studentId);
    this.getAllStudentData();
    this.getSchool(2713010002);//temp pass center id
    this.getAllSubject();
    this.getChart();
  }

  getformControl() {
    this.filterFrm = this.fb.group({
      schoolId: [2],
      standardId: [0],
      searchText: ['']
    })
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
        }
      },
      error: ((err: any) => {
        this.errorService.handelError(err)
      })
    });
  }

  childCompInfo(obj: any) {
    console.log("obj", obj)
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getAllStudentData();
        break;
      case 'Row': this.studentDataById(obj?.id)
        break
    }
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
        this.errorService.handelError(error.status);
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
//#region  -----------------------------------------------------Apex Chart Fun start here ---------------------------------------------------//
getChart() {
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
    // yaxis: {
    //   title: {
    //     text: 'abcd',
    //     offsetY: 20,
    //    },
    // },
    tooltip: {
      x: {
        format: ""
      }
    }
  };
}

public generateData(_baseval: any, count: any, yrange: any) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
    series.push([x, y, z]);
    // baseval += 86400000;
    i++;
  }
  return series;
}
//#endregion  -----------------------------------------------------Apex Chart Fun end here ---------------------------------------------------//


}
