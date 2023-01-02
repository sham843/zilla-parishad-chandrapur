
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
  globalTalId: any;
  selNumber!: number;
  getAssesmentData: any;
  selStdArray = new Array();

  constructor(public translate: TranslateService,
    private apiService: ApiService,
    private errors: ErrorsService,
    private webStorage: WebStorageService,
    private commonMethods: CommonMethodsService,
    private fb: FormBuilder, private master: MasterService,
    public validation: ValidationService,
    private router: Router) { }

  ngOnInit() {
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
    });
    this.mainFilterForm();
    this.getTaluka();
    this.cardCountData();
  }

  ngAfterViewInit() {
    this.showSvgMap(this.commonMethods.mapRegions());
    this.clickOnSvgMap();
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
    this.master.getAllTaluka('en', 1).subscribe({
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

  getAssesmentPiChartData() {//Explain Meaning of English Word //Explain Meaning of English Sentence
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
        this.checkBoxChecked('default');
        this.getAssesmentDashboardDetails();
   
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  getAssesmentDashboardDetails() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}&standard=${this.selStdArray.toString()}`
    this.apiService.setHttp('get', 'dashboard/get-assesment-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.getAssesmentData = res.responseData;
        this.getBarChart();
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  checkBoxChecked(label: any, val?: any) {
    if (val) {
      this.selNumber = label.target.checked ? this.selNumber + val : this.selNumber - val;
    } else {
      this.selStdArray.push('1')
      this.getSurveyedData.find((ele: any) => {
        if (ele.text == '1st' && label == 'default') {
          ele.checked = true;
          this.selNumber = ele?.data
        }
      });
    }
  }

  //#endregion------------------------------------------main contant api fn end heare ----------------------------------------------//

  //#region  --------------------------------------------------- graphs fn start heare-----------------------------------------------//
  pieChart(data: any) {
    this.piechartOptions = {
      series: [data[0]?.assesmentDetails[0]?.assesmentCalculationValue, data[0]?.assesmentDetails[1]?.assesmentCalculationValue],
      chart: {
        type: "donut",
        height: 250,
      },
      labels: [data[0]?.assesmentDetails[0]?.assessmentParamenterName, data[0]?.assesmentDetails[1]?.assessmentParamenterName],
      legend: {
        position: "bottom",
        fontSize: "11px"
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
        fontSize: "11px"
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
    let seriesData: any[] = [];
    this.getAssesmentData.find((ele: any) => {
      var arr = new Array();
      for (var i = 0; i < ele.assesmentDetails.length; i++) {
        let obj: any = {
          'name': ele['assesmentDetails'][i].assessmentParamenterName,
          'data': [ele['assesmentDetails'][i].assesmentCalculationValue]
        }
        arr.push(obj)
      }
      seriesData.push(arr)
    });

    this.barchartOptions = {
      series: seriesData,
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false
        },

      },
      bar: {
        horizontal: true,
        barHeight: '80%',
        borderRadiusOnAllStackedSeries: true,
      },
      responsive: [
        {
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            },
          }
        }
      ],
      xaxis: {
        labels: {
          show: false,
        },
        categories: ["2022"]
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
        opacity: 1,
        colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889', '#73AFFE'],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 15,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: "last", // "all"/"last",
          columnWidth: 30,
        },
      },
      legend: {
        position: 'bottom',
        fontSize: '12px',
        show: true,
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889', '#73AFFE'],
        }
      }
    };
  }

  showSvgMap(data: any) {
    this.graphInstance ? this.graphInstance.destroy() : '';

    this.graphInstance = $("#mapsvg").mapSvg({
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

  clickOnSvgMap(flag?: string) {
    if (flag == 'select') {
      let checkTalActiveClass = $('#mapsvg   path').hasClass("talActive");
      checkTalActiveClass ? $('#mapsvg path[id="' + this.globalTalId + '"]').removeAttr("style") : '';
      this.svgMapAddOrRemoveClass();
    }

    $(document).on('click', '#mapsvg  path', (e: any) => {
      let getClickedId = e.currentTarget;
      let talId = $(getClickedId).attr('id');
      this.topFilterForm.controls['talukaId'].setValue(+talId);
      this.svgMapAddOrRemoveClass();
    })
  }

  svgMapAddOrRemoveClass() {
    let checkTalActiveClass = $('#mapsvg   path').hasClass("talActive");
    checkTalActiveClass ? $('#mapsvg   path#' + this.globalTalId).removeClass("talActive") : '';
    this.talukaArray.find(() => {
      this.globalTalId = this.topFilterForm?.value?.talukaId;
      $('#mapsvg path[id="' + this.topFilterForm?.value?.talukaId + '"]').addClass('talActive');
    });
  }
  //#endregion ------------------------------------------------- graph's fn end heare -----------------------------------------------//
  displayProfile(id: number) {
    this.router.navigateByUrl('/student-profile/' + id);
  }
}
