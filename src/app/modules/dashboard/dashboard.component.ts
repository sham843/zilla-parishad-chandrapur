
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  math = Math;
  topFilterForm!: FormGroup;
  language!: any;
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
  selNumber: number = 0;
  getAssesmentData: any;
  selStdArray = new Array();
  educationYearArray = new Array();
  getAllSubjectArray = new Array();
  assessmentsArray = new Array();
  piechartOptionstData: any;
  piechartSecondOptionsData: any;
  talukaWiseAssData: any;
  loginData!: any;
  levelId!: number;
  enbTalDropFlag: boolean = false;
  enbCenterDropFlag: boolean = false;
  enbSchoolDropFlag: boolean = false;
  assLabelName:string='Taluka';
  checkBoxCheckAll:boolean = true;
  displayedColumns = ['srNo', 'textValue','assesmentCalculationValue', 'totalStudent','evaluvatedStudent','pendingStudent'];
  dataSource:any;
  pageNumber:number =1;
  totalRows!:number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(public translate: TranslateService,
    private apiService: ApiService,
    private errors: ErrorsService,private spiner:NgxSpinnerService,
    private webStorage: WebStorageService,
    private commonMethods: CommonMethodsService,
    private fb: FormBuilder, private master: MasterService,
    public validation: ValidationService) { }

  ngOnInit() {
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId; // admin - 1, district - 2, taluka - 3, kendra - 4, school - 5

    this.webStorage.setLanguage.subscribe((res: any) => {
      this.language = res;
      this.getAllSubject();
      this.cardCountData();
    });
    this.mainFilterForm();
    this.educationYear();
  }

  ngAfterViewInit() {
    this.language = sessionStorage.getItem('language');
    this.showSvgMap(this.commonMethods.mapRegions());
    // this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? '' : this.clickOnSvgMap();
    this.getTaluka();

  }

  showToolTipOnPro(){
    // $('.progress-bar').tooltip()
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    //   tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new bootstrap.Tooltip(tooltipTriggerEl)
    //   })
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
      userId:[this.webStorage.getId()],
      userTypeId:[this.webStorage.getUserId()],
      flag: [this.language = this.apiService.translateLang ? this.language : 'en'],
    })
  }

  clearFilterForm(flag: string) {
    this.pageNumber = 1;
    if (flag == 'year') {
      this.topFilterForm.controls['talukaId'].setValue(0);
      this.topFilterForm.controls['kendraId'].setValue(0);
      this.topFilterForm.controls['schoolId'].setValue(0);
    } 
    else if (flag == 'taluka') {
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
          this.educationYearArray = [];
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
          this.levelId == 3 || this.levelId == 4 || this.levelId == 5 ? (this.topFilterForm.controls['talukaId'].setValue(this.loginData.talukaId), this.enbTalDropFlag = true, this.clickOnSvgMap('select')) : this.clickOnSvgMap();
          this.levelId == 4 || this.levelId == 5 ? this.getKendra() : this.levelId == 3 ? (this.cardCountData(), this.getKendra()) : '';

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
    this.assLabelName='Kendra';
    let formData = this.topFilterForm?.value;
    this.master.getAllCenter(formData.flag, formData.talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.centerArray = res.responseData;
          this.levelId == 4 || this.levelId == 5 ? (this.topFilterForm.controls['kendraId'].setValue(this.loginData.centerId), this.enbCenterDropFlag = true) : '';
          this.levelId == 5 ? this.getSchools() : this.levelId == 4 ? (this.getSchools(), this.cardCountData()) : ''; // this.cardCountData() temp
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
    this.assLabelName='School';
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
          this.topFilterForm.controls['assesmentId'].setValue(this.assessmentsArray[0].id);
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
    let filterFormData = this.topFilterForm?.value;
    console.log("filterFormData",filterFormData)
    let str = `${filterFormData?.talukaId ?filterFormData?.talukaId:0}&kendraId=${filterFormData?.kendraId ? filterFormData?.kendraId:0}&schoolId=${filterFormData?.schoolId? filterFormData?.schoolId: 0}
    &flag=${filterFormData?.flag? filterFormData?.flag :'en'}&yearId=${filterFormData?.yearId? filterFormData?.yearId :0}&userId=${filterFormData?.userId? filterFormData?.userId :0}`
    this.apiService.setHttp('get', 'dashboard/get-summary-dashboard-count?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.cardInfoData = res.responseData;
        this.checkBoxCheckAll = true; 
        this.getSurveyDashboardDetails();
        this.getAssesmentPiChartData();
        this.getDynamicDetails();
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }


  getAllSubject() {
    let lang =this.language == 'Marathi'?'mr-IN':'en';
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSubject?flag_lang='+lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.getAllSubjectArray = res.responseData;
          this.topFilterForm.controls['subjectId'].setValue(this.getAllSubjectArray[0].id);
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
    let lang =this.language == 'Marathi'?'mr-IN':'en';
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${lang}&yearId=${filterFormData.yearId}&assesmentId=${filterFormData.assesmentId}&userId=${filterFormData.userId}&standard=${this.selStdArray.toString()}&userTypeId=${filterFormData.userTypeId}`
    this.apiService.setHttp('get', 'dashboard/get-general-assesment-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.piechartOptionstData = res.responseData[0].assesmentDetails;
       let getValEnglishWords = this.piechartOptionstData.every((ele:any)=> ele.assesmentCalculationValue == 0);
        this.piechartSecondOptionsData = res.responseData[1].assesmentDetails;
        let getValEnglishSentence = this.piechartSecondOptionsData.every((ele:any)=> ele.assesmentCalculationValue == 0);
        this.piechartOptionstData.length && !getValEnglishWords ? this.pieChart(res.responseData) : this.piechartOptionstData = [];
        this.piechartSecondOptionsData.length && !getValEnglishSentence ? this.pieChart(res.responseData) : this.piechartSecondOptionsData =[];
        // this.getSurveyDashboardDetails();
      }
      else {
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  getSurveyDashboardDetails() {
    this.selNumber = 0;
    this.selStdArray = [];
    let filterFormData = this.topFilterForm.value;
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${filterFormData.flag}&yearId=${filterFormData.yearId}&assesmentId=${filterFormData.assesmentId}&userId=${filterFormData.userId}&userTypeId=${filterFormData.userTypeId}`
    this.apiService.setHttp('get', 'dashboard/get-survey-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.getSurveyedData = res.responseData;

        this.calSelectedNumber(true)
        this.getSurveyedData[0].data != 0 ? this.checkBoxChecked('default') : this.getAssesmentData = [];
      }
      else {
        this.getSurveyedData = [];
        this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }

  calSelectedNumber(flag?: boolean) {
    this.getSurveyedData.map((ele: any, i: number) => {
      flag ?  ele.checked = true : '';
      i > 1 ? this.selNumber += ele.data : '';
      i == 0 && ele.text == 'Total Number' ? ele['text_m'] = '???????????? ??????????????????' : i == 1 && ele.text == 'Surveyed' ? ele.text_m = '??????????????????????????? ????????????' : ele['text_m'] = ele.text;
    })
  }

  getAssesmentDashboardDetails() {
    let lang =this.language == 'Marathi'?'mr-IN':'en';
    if (this.selStdArray.length) {
      let filterFormData = this.topFilterForm.value;
      let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&flag=${lang}&standard=${this.selStdArray.toString()}&yearId=${filterFormData.yearId}&assesmentId=${filterFormData.assesmentId}&userId=${filterFormData.userId}&userTypeId=${filterFormData.userTypeId}`
      this.apiService.setHttp('get', 'dashboard/get-assesment-dashboard-details?talukaId=' + str, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.getAssesmentData = res.responseData;
          let checkEvery:any;
          this.getAssesmentData.find((ele:any)=>{
            checkEvery = ele.assesmentDetails.every((i:any)=>{i.length ==0});
          })
          checkEvery ? (this.getAssesmentData = []): (this.getBarChart())

        }
        else {
          this.getAssesmentData = [];
          // this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.errors.handelError(error.status);
      })
    }else{
      this.getAssesmentData = []
    }
  }

  checkBoxChecked(event: any, val?: any) {
    if (val) {
      let selStdIndex = this.getSurveyedData.findIndex((ele: any) => ele.standardId == val.standardId);
      if (event.target.checked) {
        this.selStdArray.push(val.standardId);
        this.selNumber = this.selNumber + val.data
        this.getSurveyedData[selStdIndex].checked = true;
        let checkAllChecked = this.getSurveyedData.every((ele:any)=>ele.checked);
        checkAllChecked? this.checkBoxCheckAll = true : ''; 
      } else {
        this.checkBoxCheckAll = false; 
        let selIndex = this.selStdArray.findIndex((ele: any) => ele == val.standardId);
        this.selStdArray.splice(selIndex, 1);
        this.getSurveyedData[selStdIndex].checked = false;
        let subtraction = this.selNumber - val.data;
        this.selNumber  = subtraction > 0 ? subtraction : 0
      }
      this.getAssesmentDashboardDetails();this.getAssesmentPiChartData();
    } else {
      this.checkBoxCheckAll = true; 
      this.getSurveyedData.find((ele: any, i: number) => {
        if (i > 1) {
          let checkStaIndex = !this.selStdArray.length ? false : this.selStdArray.includes(ele.standardId);
          !checkStaIndex ? this.selStdArray.push(ele.standardId) : '';
        }
      });
      this.getAssesmentDashboardDetails();this.getAssesmentPiChartData();
    }
  }

  checkBoxCheckedAll(event: any) {
    this.getSurveyedData.find((ele: any, i: number) => {
      if (i > 1) {
        if (event.checked) {
          ele.checked = true;
          this.selStdArray.push(ele.standardId);
          this.selNumber=0;
          this.calSelectedNumber();
        } else {
          ele.checked = false;
          this.selStdArray = [];
          this.selNumber = 0;
        }
      }
    });
    event.checked ? (this.checkBoxCheckAll = true, this.checkBoxChecked('default')): this.checkBoxCheckAll = false;
    this.getAssesmentDashboardDetails();this.getAssesmentPiChartData();
    
  }

  //#endregion------------------------------------------main contant api fn end heare ----------------------------------------------//

  //#region  --------------------------------------------------- graphs fn start heare-----------------------------------------------//
  pieChart(data: any) {
    this.piechartOptions = {
      series: [+(data[0]?.assesmentDetails[0]?.assesmentCalculationValue)?.toFixed(2), +(data[0]?.assesmentDetails[1]?.assesmentCalculationValue)?.toFixed(2)],
      chart: {
        type: "donut",
        height: 200,
      },
      labels: [data[0]?.assesmentDetails[0]?.assessmentParamenterName, data[0]?.assesmentDetails[1]?.assessmentParamenterName],
      legend: {
        position: "bottom",
        fontSize: "11px",
        markers: {
          fillColors: ['#4284FD', '#02CCC0'],
        },
        onItemClick: {
          toggleDataSeries: false
      },
      },
      fill: {
        colors: ['#4284FD', '#02CCC0'],
      },
      plotOptions: {
        columnWidth: 100,
        pie: {
          customScale: 1.1,
          expandOnClick: false,
          donut:{
            size:'50px'
          }
        }
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
      series: [+(data[1].assesmentDetails[0]?.assesmentCalculationValue)?.toFixed(2), +(data[1]?.assesmentDetails[1]?.assesmentCalculationValue)?.toFixed(2)],
      chart: {
        type: "donut",
        height: 200,
      },
      labels: [data[1].assesmentDetails[0]?.assessmentParamenterName, data[1]?.assesmentDetails[1]?.assessmentParamenterName],
      legend: {
        position: "bottom",
        fontSize: "11px",
        onItemClick: {
          toggleDataSeries: false
      },
        markers: {
          fillColors: ['#4284FD', '#02CCC0'],
        }
      },
      plotOptions: {
        columnWidth: 100,
        pie: {
          customScale: 1.1,
          expandOnClick: false,
          donut:{
            size:'50px'
          }
        }
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
    let barColorpal:any[] = [];
    let categoriesLabel:any[] = [];
    this.getAssesmentData.find((ele: any) => {
      var arr = new Array();
      for (var i = 0; i < ele.assesmentDetails.length; i++) {
      //  if (ele['assesmentDetails'][i].assesmentCalculationValue > 0) {
          let obj: any = {
            'name': ele['assesmentDetails'][i].assessmentParamenterName,
            'assessmentId': ele['assesmentDetails'][i].assessmentId,
            'data': [(ele['assesmentDetails'][i].assesmentCalculationValue)?.toFixed(2)],
            'info': ele['assesmentDetails'][i].noStudent,
            "lang": ele.subjectName,
            "subjectId":ele.subjectId
          }
          arr.push(obj);
          barColorpal.push(ele['assesmentDetails'][i].colorCodeValue);
      //  }
      }
      categoriesLabel.push(ele.subjectName)
      seriesData.push(arr);
    });
    this.barchartOptions = {
      series: seriesData,
      chart: {
        events: {
          click:(_event:any, _chartContext:any, config:any)=> {
            if(config?.seriesIndex>=0){
                this.redToStuProfile('subject',config.config?.series[0].subjectId, config.config?.series[config.seriesIndex].assessmentId)
            }
          }
        },
        type: "bar",
        offsetX: -15,
        height: 360,
        width: 280,
        horizontal: false,
        borderRadius: 10,
        columnWidth: '45%',
        stacked: true,
        stackType: '100%', // 100% normal
        toolbar: {
          show: false
        },
      },
      bar: {
        horizontal: true,
        columnWidth: "30%",
        barHeight: '80%',
        borderRadiusOnAllStackedSeries: true,
      },
      dataLabels: {
        formatter: function(val:any, ) {
          return val?.toFixed(2)+"%"
        }
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
        axisTicks: {
          show: false
      },
        labels: {
          show: false,

        },
        parameters:categoriesLabel,
        categories: ['']
      },
      grid: {
      padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },
        show: false,      // you can either change hear to disable all grids
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
        colors: barColorpal,
      },
      plotOptions: {
        bar: {
          distributed: false,
          horizontal: false,
          // borderRadius: 10,
          // borderRadiusApplication: 'end',
          // borderRadiusWhenStacked: "all", // "all"/"last",
          columnWidth: 70,
        },
      },
      legend: {
        offsetX: 0,
        offsetY: 10,
        width:160,
        showForSingleSeries: true,
        inverseOrder:true,
        position: 'right',
        fontSize: '11px',
        show: true,

        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: barColorpal,
        },
        itemMargin: {
          horizontal: 0,
          vertical: 0
      },
      },
      tooltip :{
        custom: ({ series, seriesIndex, dataPointIndex, w }: any)=> {         
          var data = w.globals.initialSeries[seriesIndex];
          return ('<div class="arrow_box" style="padding:10px;">' +
              "<div>" +data.lang + " : <b> " + w.globals.seriesNames[seriesIndex]+ '</b>' + "</div>" +
              "<div>" + 'No of Students ' + " : <b> " + data.info + '</b>' + "</div>" +
              "<div>" + '% of Students ' + " : <b> " + series[seriesIndex][dataPointIndex] + '%</b>' + "</div>" +
            "</div>"
          );
        },
      }
    };

  }

  showSvgMap(data: any) {
    this.graphInstance ? this.graphInstance.destroy() : '';
    this.graphInstance = $("#mapsvg").mapSvg({
      colors: {
        baseDefault: "#0042bd",
        background: "#fff",
        selected: "#0042bd",
        hover: "#0042bd",
        directory: "#0042bd",
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
      // source: this.language == 'English'? "assets/chandrapur_dist.svg":"assets/chandrapur_dist_m.svg",
      title: "Maharashtra-bg_o",
      responsive: true
    });
  }

  clickOnSvgMap(flag?: string) {
    this.spiner.show();
    if (flag == 'select') {
      this.enbTalDropFlag ? $('#mapsvg g').addClass('disabledAll') : '';
      let checkTalActiveClass = $('#mapsvg g').hasClass("talActive");
      checkTalActiveClass ?  $('#mapsvg  g[id="' + this.globalTalId + '"] path').css({ 'fill' : 'rgb(67, 133, 255)'}) : '';
      this.svgMapAddOrRemoveClass();
    }
    this.spiner.hide();
    $(document).on('click', ('#mapsvg  g g'), (e: any) => {
      this.clearFilterForm('taluka');
      let getClickedId = e.currentTarget;
      let talId = $(getClickedId).attr('id');
      this.topFilterForm.controls['talukaId'].setValue(+talId);
      this.getKendra();
      this.cardCountData();
        this.checkBoxCheckAll = true;
      this.svgMapAddOrRemoveClass();
    })
  }

  svgMapAddOrRemoveClass() {
    let checkTalActiveClass = $('#mapsvg   g').hasClass("talActive");
    checkTalActiveClass ? ($('#mapsvg   g#' + this.globalTalId).removeClass("talActive"), 
    $('#mapsvg  g[id="' + this.globalTalId + '"] path').css({ 'fill' : 'rgb(67, 133, 255)'})) : '';
    this.talukaArray.find(() => {
      this.globalTalId = this.topFilterForm?.value?.talukaId;
      $('#mapsvg g[id="' + this.topFilterForm?.value?.talukaId + '"]').addClass('talActive');
    });
  }
  //#endregion ------------------------------------------------- graph's fn end heare -----------------------------------------------//

  getDynamicDetails() {
    let filterFormData = this.topFilterForm.value;
    filterFormData.schoolId ?  this.displayedColumns = ['srNo', 'textValue','standardName','assesmentCalculationValue', 'totalStudent','evaluvatedStudent','pendingStudent']: this.displayedColumns = ['srNo','textValue','assesmentCalculationValue', 'totalStudent','evaluvatedStudent','pendingStudent']
    let str = `${filterFormData.talukaId}&kendraId=${filterFormData.kendraId}&schoolId=${filterFormData.schoolId}&assesmentId=${filterFormData.assesmentId}&yearId=${filterFormData.yearId}&subjectId=${filterFormData.subjectId}&flag=${filterFormData.flag}&pageNo=${this.pageNumber}&pageSize=10&userId=${filterFormData.userId}`
    this.apiService.setHttp('get', 'dashboard/get-dashboard-dynamic-details?talukaId=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.talukaWiseAssData = res.responseData.responseData1;
        this.talukaWiseAssData = new MatTableDataSource(this.talukaWiseAssData);
        this.talukaWiseAssData.sort = this.sort;
        this.totalRows = res.responseData.responseData2.pageCount;
        this.totalRows > 10 && this.pageNumber == 1 ? this.paginator?.firstPage() : '';
        setTimeout(() => {this.showToolTipOnPro() }, 1000);
      }
      else {
        this.totalRows = 0;
        this.talukaWiseAssData = [];
        // this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.errors.handelError(error.status);
    })
  }
  pageChanged(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.getDynamicDetails();
  }
  displayProfile(_id?: number) {

  }

  ngOnDestroy() {
    this.graphInstance.destroy();
  }

  setName(label: string) {
     let formValue =  this.topFilterForm.value;
    let str!: string;
    if (label == 'Taluka') {
      str = sessionStorage.getItem('language') == 'English' ? 'Taluka' : '??????????????????';
    } else if (label == 'Kendra') {
      if(formValue.talukaId == 0){
        str = sessionStorage.getItem('language') == 'English' ? 'Taluka' : '??????????????????';
      }else{
        str = sessionStorage.getItem('language') == 'English' ? 'Kendra' : '??????????????????';
      }
    }else if (label == 'School') {
      if(formValue.kendraId == 0){
        str = sessionStorage.getItem('language') == 'English' ? 'Kendra' : '??????????????????';
      }else{
        str =sessionStorage.getItem('language') == 'English' ? 'School' : '????????????';
      }
    } else if (label == 'Student Name') {
      if(formValue.schoolId == 0){
        str =sessionStorage.getItem('language') == 'English' ? 'School' : '????????????';
      }else{
        str = sessionStorage.getItem('language') == 'English' ? 'School Name' : '?????????????????? ?????????';
      }
     
    }
    return str
  }

  redToStuProfile(lable:string,id:any, assessmentId?:any){
     let formValue =  this.topFilterForm.value; 
    let obj:any = {
      kendraId: (lable!='subject' && this.setName(this.assLabelName)=='Kendra')?id.sourceId :formValue.kendraId,
      schoolId: lable!='subject' && (this.setName(this.assLabelName)=='School' || this.setName(this.assLabelName)=='School Name')?id.sourceId :formValue.schoolId,
      typeId:(lable=='subject' || lable == 'bar')? 1 : lable=='School Name'? 3 : lable=='School'?2:4,//121
      yearId:formValue.yearId,
      talukaId: (lable!='subject' && this.setName(this.assLabelName)=='Taluka')?id.sourceId :formValue.talukaId,
      examId:formValue.assesmentId,
      assesmentId:assessmentId,
      subjectId: lable == 'subject'? id : lable == 'bar'? this.topFilterForm.value.subjectId : 0,
      staId:(lable != 'subject' && this.setName(this.assLabelName) =='School Name')?[id.standardId] : this.selStdArray
    }
    this.commonMethods.redToNextPageWithPar(JSON.stringify(obj),'/student-profile/','secret key');
  } 
}



/* 
 let formValue =  this.topFilterForm.value;
    let obj:any = {
      kendraId: formValue.kendraId,
      schoolId: lable != 'subject'?id.sourceId:formValue.schoolId,
      typeId:lable=='subject'? 1 : lable=='School Name'? 3 : lable=='School'?2:4,//121
      yearId:formValue.yearId,
      talukaId:formValue.talukaId,
      examId:formValue.assesmentId,
      assesmentId:assessmentId,
      subjectId: lable != 'subject'? 0 : id,
      staId:lable != 'subject'?[id.standardId]:this.selStdArray 
    }
*/