import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  topFilterForm!: FormGroup;
  language!: string;
  cardInfoData!: any;
  centerArray = new Array();
  talukaArray = new Array();
  schoolArray = new Array();
  graphInstance: any;
  barchartOptions!: any;
  piechartOptions: any;
  piechartSecondOptions: any;
  getSurveyedData: any;

  constructor(public translate: TranslateService,
    private apiService: ApiService,
    private errors: ErrorsService,
    private webStorage: WebStorageService,
    private commonMethods: CommonMethodsService,
    private fb: FormBuilder, private master: MasterService,
    public validation: ValidationService,
    private router:Router) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
    });
    this.mainFilterForm();
    this.getTaluka();
    this.cardCountData();
  }

  ngAfterViewInit() {
    this.getBarChart();
    this.showSvgMap(this.commonMethods.mapRegions());
    $(document).on('click', '#mapsvg  path', (e: any) => {
      let getClickedId = e.currentTarget;
      let distrctId = $(getClickedId).attr('id');
      console.log(distrctId);
    })
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
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSchoolByCriteria?flag_lang=' + str, false, false, false, 'baseUrl');
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
        this.commonMethods.checkEmptyData(error.statusText) ? this.errors.handelError(error.statusCode) : this.commonMethods.snackBar(error.statusText, 1);
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
        this.getAssesmentPiChartData();
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  //#endregion ------------------------------------------top bar filter and card data info function's start heare ------------------------------//

  //#region ---------------------------------------------main contant api fn start heare-----------------------------------------------//

  getAssesmentPiChartData(){//Explain Meaning of English Word //Explain Meaning of English Sentence
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}`
    this.apiService.setHttp('get', 'dashboard/get-general-assesment-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.pieChart(res.responseData)
        this.getSurveyDashboardDetails();
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  getSurveyDashboardDetails() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}`
    this.apiService.setHttp('get', 'dashboard/get-survey-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.getSurveyedData = res.responseData;
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }


  //#endregion------------------------------------------main contant api fn end heare ----------------------------------------------//

  //#region  --------------------------------------------------- graphs fn start heare-----------------------------------------------//
  pieChart(data:any) {
    this.piechartOptions = {
      series: [data[0].assesmentDetails[0].assesmentCalculationValue, data[0].assesmentDetails[1].assesmentCalculationValue],
      chart: {
        type: "donut",
        height: 250,
      },
      labels: [data[0].assesmentDetails[0].assessmentParamenterName, data[0].assesmentDetails[1].assessmentParamenterName],
      legend: {
        position: "bottom",
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.piechartSecondOptions = {
      series: [data[1].assesmentDetails[0].assesmentCalculationValue, data[0].assesmentDetails[1].assesmentCalculationValue],
      chart: {
        type: "donut",
        height: 250,
      },
      labels: [data[1].assesmentDetails[0].assessmentParamenterName, data[0].assesmentDetails[1].assessmentParamenterName],
      legend: {
        position: "bottom",
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  getBarChart() {
    this.barchartOptions = {
      series: [
        [{
          name: "PRODUCT A",
          data: [44]
        },
        {
          name: "PRODUCT B",
          data: [13]
        },
        {
          name: "PRODUCT C",
          data: [11]
        }],
        [{
          name: "PRODUCT A",
          data: [24]
        },
        {
          name: "PRODUCT B",
          data: [10]
        },
        {
          name: "PRODUCT C",
          data: [48]
        }],
        [{
          name: "PRODUCT A",
          data: [65]
        },
        {
          name: "PRODUCT B",
          data: [10]
        },
        {
          name: "PRODUCT C",
          data: [37]
        }],
        [{
          name: "PRODUCT A",
          data: [65, 36, 25, 15]
        },
        {
          name: "PRODUCT B",
          data: [10, 70, 25, 42]
        },
        {
          name: "PRODUCT C",
          data: [37, 65, 74, 20]
        }],
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false
        },

      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        labels: {
          show: false,
        },
        categories: [
          "2011 Q1",
        ]
      },

      yaxis: {
        show: false,
        showAlways: false,
        floating: false,
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        },
        labels: {
          show: false
        },

      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      }
    };
  }
  showSvgMap(data: any) {
    this.graphInstance ? this.graphInstance.destroy() : '';
    let createMap: any = document.getElementById("#mapsvg");

    this.graphInstance = createMap?.mapSvg({
      width: 550,
      height: 430,
      colors: {
        baseDefault: "#bfddff",
        background: "#fff",
        selected: "#272848",
        hover: "#ebebeb",
        directory: "#bfddff",
        status: {}
      },
      regions: data,
      viewBox: [0, 0, 763.614, 599.92],
      cursor: "pointer",
      zoom: {
        on: false,
        limit: [0, 50],
        delta: 2,
        buttons: {
          on: true,
          location: "left"
        },
        mousewheel: true
      },
      tooltips: {
        mode: "title",
        off: true,
        priority: "local",
        position: "bottom"
      },
      popovers: {
        mode: "on",
        on: false,
        priority: "local",
        position: "top",
        centerOn: false,
        width: 300,
        maxWidth: 50,
        maxHeight: 50,
        resetViewboxOnClose: false,
        mobileFullscreen: false
      },
      gauge: {
        on: false,
        labels: {
          low: "low",
          high: "high"
        },
        colors: {
          lowRGB: {
            r: 211,
            g: 227,
            b: 245,
            a: 1
          },
          highRGB: {
            r: 67,
            g: 109,
            b: 154,
            a: 1
          },
          low: "#d3e3f5",
          high: "#436d9a",
          diffRGB: {
            r: -144,
            g: -118,
            b: -91,
            a: 0
          }
        },
        min: 0,
        max: false
      },
      source: "assets/chandrapur_dist.svg",
      title: "Maharashtra-bg_o",
      responsive: true
    });
    // });
  }
  //#endregion ------------------------------------------------- graph's fn end heare -----------------------------------------------//
  displayProfile(id:number){
    this.router.navigateByUrl('/student-profile/'+id);
  }

}
