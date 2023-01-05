
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
  educationYearArray = new Array();
  getAllSubjectArray = new Array();
  assessmentsArray = new Array();
  piechartOptionstData: any;
  piechartSecondOptionsData: any;
  talukaWiseAssData: any;

  ;
  progressBarcolors: any = ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889', '#73AFFE'];
  loginData!: any;
  levelId!: number;
  enbTalDropFlag: boolean = false;
  enbCenterDropFlag: boolean = false;
  enbSchoolDropFlag: boolean = false;

  constructor(public translate: TranslateService,
    private apiService: ApiService,
    private errors: ErrorsService,
    private webStorage: WebStorageService,
    private commonMethods: CommonMethodsService,
    private fb: FormBuilder, private master: MasterService,
    public validation: ValidationService,
    private router: Router) { }

  ngOnInit() {
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId; // admin - 1, district - 2, taluka - 3, kendra - 4, school - 5

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
    });
    this.mainFilterForm();
    this.educationYear();
    this.getAllSubject();
    this.getDynamicDetails()//demo
  }

  ngAfterViewInit() {
    this.showSvgMap(this.commonMethods.mapRegions());
    this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? '' : this.clickOnSvgMap();
    this.getTaluka();
  }



  //#region ---------------------------------top bar filter and card data info function's start heare ---------------------------------------//

  mainFilterForm() {
    this.topFilterForm = this.fb.group({
      yearId: [0],
      talukaId: [0],
      kendraId: [0],
      schoolId: [0],
      assesmentId: [0],
      subjectId: [0],
      flag: [this.language == 'English' ? 'en' : 'mr-IN'],
    })
  }

  clearFilterForm(flag: string) {
    if (flag == 'taluka') {
      this.topFilterForm.controls['kendraId'].setValue(0);
      this.topFilterForm.controls['schoolId'].setValue(0);
    } else if (flag == 'kendra') {
      this.topFilterForm.controls['schoolId'].setValue(0);
    }
  }

  educationYear() {
    this.apiService.setHttp('get', 'zp_chandrapur/master/get-all-educationyear-details', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.educationYearArray = res.responseData;
          this.topFilterForm.controls['yearId'].setValue(this.educationYearArray[0].id);
          this.levelId == 1 || this.levelId == 2 ? this.cardCountData() : '';
          this.getAssessments();
        }
        else {
          this.schoolArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }

  getTaluka() {
    this.master.getAllTaluka('en', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? (this.topFilterForm.controls['talukaId'].setValue(this.loginData.talukaId), this.enbTalDropFlag = true, this.clickOnSvgMap('select')) : '';
          this.levelId == 4 || this.levelId == 5 ? this.getKendra() : this.levelId == 3 ? this.cardCountData() : '';

        }
        else {
          this.talukaArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }

  getKendra() {
    let formData = this.topFilterForm?.value;
    this.master.getAllCenter(formData.flag, formData.talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          this.levelId == 4 || this.levelId == 5 ? (this.topFilterForm.controls['kendraId'].setValue(this.loginData.centerId), this.enbCenterDropFlag = true) : '';
          this.levelId == 5 ? this.getSchools() : this.levelId == 4 ? this.cardCountData() : this.cardCountData();
        }
        else {
          this.centerArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
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
          this.levelId == 5 ? (this.topFilterForm.controls['schoolId'].setValue(this.loginData.schoolId), this.enbSchoolDropFlag = true, this.cardCountData()) : '';
        }
        else {
          this.schoolArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }

  getAssessments() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.flag}&yearId=${filterFormData.yearId}`
    this.apiService.setHttp('get', 'ExamMaster/GetAllExamMasterForDropdown?flag=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.assessmentsArray = res.responseData;
        }
        else {
          this.schoolArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }

  // 

  cardCountData() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}&yearId=${filterFormData.yearId}`
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


  getAllSubject() {
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSubject', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.getAllSubjectArray = res.responseData;
        }
        else {
          this.schoolArray = [];
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }
  //#endregion ------------------------------------------top bar filter and card data info function's start heare ------------------------------//

  //#region ---------------------------------------------main contant api fn start heare-----------------------------------------------//

  getAssesmentPiChartData() {//Explain Meaning of English Word //Explain Meaning of English Sentence
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}&yearId=${filterFormData.yearId}&assesmentId=${filterFormData.assesmentId}`
    this.apiService.setHttp('get', 'dashboard/get-general-assesment-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.piechartOptionstData = res.responseData[0].assesmentDetails;
        this.piechartSecondOptionsData = res.responseData[1].assesmentDetails;
        this.piechartOptionstData.length ? this.pieChart(res.responseData) : [];
        this.piechartSecondOptionsData.length ? this.pieChart(res.responseData) : [];
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
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}&yearId=${filterFormData.yearId}&assesmentId=${filterFormData.assesmentId}`
    this.apiService.setHttp('get', 'dashboard/get-survey-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.getSurveyedData = res.responseData;
        this.checkBoxChecked('default');
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
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}&standard=${this.selStdArray.toString()}&yearId=${filterFormData.yearId}&assesmentId${filterFormData.assesmentId}`
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
      if (label.target.checked) {
        this.selStdArray.push(val.standardId);
        this.selNumber = this.selNumber + val.data
      } else {
        let selIndex = this.selStdArray.findIndex((ele: any) => ele == val.standardId);
        this.selStdArray.splice(selIndex, 1);
        this.selNumber = this.selNumber - val.data;
      }
      this.getAssesmentDashboardDetails();
    } else {
      this.selStdArray.push('1');
      this.getAssesmentDashboardDetails();
      this.getSurveyedData.find((ele: any, i:number) => {
        if (i ==2) {
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
      fill: {
        colors: ['#4284FD', '#02CCC0'],
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
      series: [data[1].assesmentDetails[0]?.assesmentCalculationValue, data[0]?.assesmentDetails[1]?.assesmentCalculationValue],
      chart: {
        type: "donut",
        height: 250,
      },
      labels: [data[1].assesmentDetails[0]?.assessmentParamenterName, data[0]?.assesmentDetails[1]?.assessmentParamenterName],
      legend: {
        position: "bottom",
        fontSize: "11px"
      },
      fill: {
        colors: ['#4284FD', '#02CCC0'],
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
          'data': [parseInt(ele['assesmentDetails'][i].assesmentCalculationValue)]
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
        width: 300,
        columnWidth: '45%',
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false
        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            console.log(event, chartContext, config.seriesIndex)
          }
        }
      },
      bar: {
        horizontal: true,
        columnWidth: "10%",
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
        categories: ['2022']
      },

      yaxis: {
        show: true,
        showAlways: false,
        floating: false,

        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        },
        labels: {
          show: false,

        },
      },
      fill: {
        opacity: 1,
        colors: ['#CB4B4B', '#E76A63', '#E98754', '#EFB45B', '#65C889', '#73AFFE'],
      },
      plotOptions: {
        bar: {
          distributed: false,
          horizontal: false,
          // borderRadius: 10,
          // borderRadiusApplication: 'end',
          // borderRadiusWhenStacked: "all", // "all"/"last",
          columnWidth: 40,
        },
      },
      legend: {
        position: 'right',
        fontSize: '11px',
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
      this.enbTalDropFlag ? $('#mapsvg path').addClass('disabledAll') : '';
      let checkTalActiveClass = $('#mapsvg   path').hasClass("talActive");
      checkTalActiveClass ? $('#mapsvg path[id="' + this.globalTalId + '"]').removeAttr("style") : '';
      this.svgMapAddOrRemoveClass();
    }

    $(document).on('click', '#mapsvg  path', (e: any) => {
      this.clearFilterForm('taluka');
      let getClickedId = e.currentTarget;
      let talId = $(getClickedId).attr('id');
      this.topFilterForm.controls['talukaId'].setValue(+talId);
      this.getKendra();
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

  getDynamicDetails() {
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&assesmentId=${filterFormData.assesmentId}&yearId=${filterFormData.yearId}&subjectId=${filterFormData.subjectId}&flag=${filterFormData.flag}&pageNo=1&pageSize=10`
    this.apiService.setHttp('get', 'dashboard/get-dashboard-dynamic-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.talukaWiseAssData = res.responseData.responseData1;
        this.talukaWiseAssData[0]['assesmentDetails'] = [
          {
            "assessmentId": 1,
            "assessmentParamenterName": "Initiala",
            "assesmentCalculationValue": 11.11
          },
          {
            "assessmentId": 2,
            "assessmentParamenterName": "Letter",
            "assesmentCalculationValue": 11.11
          },
          {
            "assessmentId": 3,
            "assessmentParamenterName": "Wordspp",
            "assesmentCalculationValue": 11.11
          },
          {
            "assessmentId": 4,
            "assessmentParamenterName": "Paragraph",
            "assesmentCalculationValue":11.11
          },
          {
            "assessmentId": 5,
            "assessmentParamenterName": "Story",
            "assesmentCalculationValue":11.11
          },
          {
            "assessmentId": 20,
            "assessmentParamenterName": "Standard",
            "assesmentCalculationValue":11.11
          },
          {
            "assessmentId": 21,
            "assessmentParamenterName": "Standard Test 1",
            "assesmentCalculationValue": 11.11
          },
          {
            "assessmentId": 22,
            "assessmentParamenterName": "writings",
            "assesmentCalculationValue": 11.11
          },
          {
            "assessmentId": 23,
            "assessmentParamenterName": "honest",
            "assesmentCalculationValue": 11.11
          }]//demo
      }
      else {
        this.talukaWiseAssData=[];
        // this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }
  displayProfile(id: number) {
    this.router.navigateByUrl('/student-profile/' + id);
  }

  ngOnDestroy() {
    this.graphInstance.destroy();
  }
}