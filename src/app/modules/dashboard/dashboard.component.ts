import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as ApexCharts from 'apexcharts';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  topFilterForm!: FormGroup;
  language!: string;
  cardInfoData!: any;
  centerArray = new Array();
  talukaArray = new Array();
  schoolArray = new Array();

  constructor(public translate: TranslateService,
    private apiService: ApiService,
    private errors: ErrorsService,
    private webStorage: WebStorageService,
    private commonMethods: CommonMethodsService,
    private fb: FormBuilder, private master: MasterService,
    public validation: ValidationService) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
    });
    this.mainFilterForm();
    this.getTaluka();
    this.cardCountData();
  }

  //#region ---------------------------------top bar filter and card data info function's start heare ---------------------------------------//

  mainFilterForm() {
    this.topFilterForm = this.fb.group({
      talukaId: [0],
      kendraId: [0],
      schoolId: [0],
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
    })
  }

  getTaluka() {
    let formData = this.topFilterForm?.value;
    this.master.getAllTaluka(formData?.flag, 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
        }
        else {
          this.talukaArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethods.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethods.snackBar(error.statusText, 1);
      }
    })
  }

  getKendra() {
    let formData = this.topFilterForm?.value;
    this.master.getAllCenter(formData.flag, formData.talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
        }
        else {
          this.centerArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethods.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethods.snackBar(error.statusText, 1);
      }
    })
  }

  getSchools() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.flag}&TalukaId=${filterFormData.talukaId}&CenterId=${filterFormData.kendraId}`
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSchoolByCriteria?flag_lang' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
        }
        else {
          this.schoolArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.commonMethods.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethods.snackBar(error.statusText, 1);
      }
    })
  }

  cardCountData() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}`
    this.apiService.setHttp('get', 'dashboard/get-summary-dashboard-count?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.cardInfoData = res.responseData;
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  //#endregion ------------------------------------------top bar filter and card data info function's start heare ------------------------------//

  //#region ------------------------------main conatnet svg map with graph-------------------------------------------------------//
  ngAfterViewInit(){
    this.pieChart();
    this.columnChart();
  }

  pieChart() {
    var options = {
      series: [44, 55],
      chart: {
        type: 'donut',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 80
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
    var chart = new ApexCharts(document.querySelector("#piChart"), options);
    chart.render();
  }

  columnChart(){
    var options = {
      series: [{
      name: 'PRODUCT A',
      data: [44, 55, 41, 67, 22, 43, 21, 49]
    }, {
      name: 'PRODUCT B',
      data: [13, 23, 20, 8, 13, 27, 33, 12]
    }, {
      name: 'PRODUCT C',
      data: [11, 17, 15, 15, 21, 14, 15, 13]
    }],
      chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    xaxis: {
      categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2',
        '2012 Q3', '2012 Q4'
      ],
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'right',
      offsetX: 0,
      offsetY: 50
    },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  
  

  }
  //#endregion  -----------------------------main conatnet svg map with graph-----------------------------------------------------//
}
