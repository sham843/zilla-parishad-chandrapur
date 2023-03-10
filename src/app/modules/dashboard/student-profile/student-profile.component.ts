import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
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
  educationYearArray = new Array();
  assessmentsArray = new Array();
  StudentDataArray: any;
  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  studentId!: number;
  schoolId!: number;
  lang!: string;
  subjectId = new FormControl();
  @ViewChild("chart") chart!: any;
  @ViewChild('select') select: MatSelect | any;
  ChartOptions: any;
  globalObj: any;
  talukaArray: any;
  centerArray: any;
  levelId: any;
  language: any;
  chartData:any;
  loginData:any;
  getURLData:any;
  clearFlag:boolean=true;
  allSelected:boolean=false;
  tooltipSub:any;

  constructor(
    private webStorage: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private errorService: ErrorsService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private master: MasterService,
    private errors: ErrorsService,
  ) { 
    let ReceiveDataSnapshot: any = this.route.snapshot.params['id'];
    if (ReceiveDataSnapshot) {
      ReceiveDataSnapshot = ReceiveDataSnapshot.split('.');
      this.getURLData = { 'TalukaId': +ReceiveDataSnapshot[0], 'KendraId': +ReceiveDataSnapshot[1],'SchoolId': +ReceiveDataSnapshot[2],
        'StandardId': +ReceiveDataSnapshot[3] ,'StudentId': +ReceiveDataSnapshot[4], 'SubjectId': +ReceiveDataSnapshot[5]}
    }
  }

  ngOnInit() {
    this.loginData = this.webStorage.getLoginData();
    this.levelId = this.loginData.designationLevelId; // admin - 1, district - 2, taluka - 3, kendra - 4, school - 5
    let obj = this.commonMethod.recParToUrl((this.route.snapshot.params['id']).toString(), 'secret key');
    this.globalObj = JSON.parse(obj);
    this.getTaluka();
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
      this.getAllSubject();
      this.getStudentProChart();
    })
    this.getformControl();
    this.getTaluka();
    this.getStandard();
    this.getEducationYear();
  }

  //#region  --------------------------------------------dropdown with filter fn start heare------------------------------------------------//
  getformControl() {
    this.filterFrm = this.fb.group({
      talukaId:[0],
      kendraId: [0],
      schoolId: [0],
      standardId: [0],
      searchText: [''],
      subjId:[this.globalObj.subjectId],
      yearId:[this.globalObj.yearId],
      assesmentId:[this.globalObj.examId], 
      typeId:[this.globalObj.typeId?this.globalObj.typeId:4],
      flag: [this.language = this.apiService.translateLang ? this.language : 'en'],
    });
    this.clearFlag==false?this.filterFrm.value.standardId=[]:this.globalObj.staId;
  }
  
  getTaluka() {
    this.master.getAllTaluka('en', 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.talukaArray = res.responseData;
          (((this.levelId == 1 || this.levelId == 2) && this.clearFlag==true && this.globalObj.talukaId!=0)) ? (this.filterFrm.controls['talukaId'].setValue(this.globalObj.talukaId),this.getKendra()):
          (this.levelId == 3 || this.levelId == 4 || this.levelId == 5 && this.globalObj.talukaId!=0) ? (this.filterFrm.controls['talukaId'].setValue(this.loginData.talukaId),this.getKendra()):'';
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
          this.centerArray=res.responseData;
          ((this.levelId == 1 || this.levelId == 2 || this.levelId == 3) && this.clearFlag==true && (this.globalObj.kendraId!=0 && this.globalObj.kendraId!=undefined))? (this.filterFrm.controls['kendraId'].setValue(this.globalObj.kendraId),this.getSchool()):
          ((this.levelId == 4 || this.levelId == 5) && (this.globalObj.kendraId!=0&& this.globalObj.kendraId!=undefined)) ? (this.filterFrm.controls['kendraId'].setValue(this.loginData.centerId),this.getSchool()):'';
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
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + (this.apiService.translateLang ? this.lang : 'en') + '&CenterId=' + (formData.kendraId), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.schoolArray = res.responseData;
          ((this.levelId == 1 || this.levelId == 2 || this.levelId == 3 || this.levelId == 4) && this.clearFlag==true)?(this.filterFrm.controls['schoolId'].setValue(this.globalObj.schoolId),this.getStandard()):
          (this.levelId == 5 && this.globalObj.schoolId!=0)? (this.filterFrm.controls['schoolId'].setValue(this.loginData.schoolId),this.getStandard()):'';
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
    let formData = this.filterFrm.value;
    let schoolIds=formData.schoolId!=undefined && formData.schoolId!=0 ? formData.schoolId:0;
    this.apiService.setHttp('GET', schoolIds!=0?('zp_chandrapur/master/GetAllClassBySchoolId?flag_lang=' + (this.apiService.translateLang ? this.lang : 'en') + '&SchoolId=' + formData.schoolId):('zp_chandrapur/master/GetAllStandard?flag_lang='+(this.apiService.translateLang ? this.lang : 'en')), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.standardArray = res.responseData;
          let standIds:any=[];
          this.standardArray.forEach(ele=>{
            standIds.push(ele.id);
          });
          standIds.length!=0?(this.filterFrm.controls['standardId'].setValue(standIds),this.allSelected =true):this.allSelected =false;
          (this.clearFlag==true && this.globalObj.staId!=0 && this.globalObj.staId!=undefined)?(this.filterFrm.controls['standardId'].setValue(this.globalObj.staId),this.getAllStudentData()):(this.filterFrm.controls['standardId'].setValue(standIds),this.getAllStudentData());
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

  allStandardSelect(){
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  singleStandard() {
    let stdStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        stdStatus = false;
      }
    });
    this.allSelected = stdStatus;
  }

  getAllSubject() {
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSubject?flag_lang='+this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.subjectArray = res.responseData;
          this.filterFrm.controls['subjId'].setValue(this.subjectArray[0].id);
          this.subjectId.setValue(this.subjectArray[0].id);
          this.globalObj.subjectId!=0?(this.subjectId.setValue(this.globalObj.subjectId),this.filterFrm.controls['subjId'].setValue(this.globalObj.subjectId)):'';
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

  getEducationYear(){
    this.apiService.setHttp('get', 'zp_chandrapur/master/get-all-educationyear-details', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.educationYearArray = res.responseData;
          this.filterFrm.controls['yearId'].setValue(this.educationYearArray[0].id);
          // this.getAssessments();
        }
        else {
          this.educationYearArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }
  getAssessments(){
    let filterFormData = this.filterFrm.value;
    let str = `${this.apiService.translateLang ? this.lang : 'en'}&yearId=${filterFormData.yearId}`
    this.apiService.setHttp('get', 'ExamMaster/GetAllExamMasterForDropdown?flag=' + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.assessmentsArray = res.responseData;
          this.filterFrm.controls['assesmentId'].setValue(this.assessmentsArray[0].id);
        }
        else {
          this.schoolArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.errors.handelError(error.status);
      }
    })
  }
  clearForm() {
    this.clearFlag=false;
    this.filterFrm.reset();
    this.globalObj='';
    this.getformControl();
    this.getTaluka();
    this.getStandard();
    this.filterFrm.controls['subjId'].setValue(1);
    this.filterFrm.controls['yearId'].setValue(1);
    this.filterFrm.controls['assesmentId'].setValue(1);
    // this.getAllStudentData('filter');
  }
  //#endregion -------------------------------------------dropdown with filter fn end heare------------------------------------------------//

  //#region ------------------------------------------- table fn  start heare-------------------------------------------//
  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getAllStudentData();
        break;
      case 'Row': this.studentDataById(obj)
        break
    }
  }
 
  getAllStudentData(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 : '';
    let formData = this.filterFrm.value;
    let str = `&nopage=${this.pageNumber}`
    let obj = (formData.yearId?formData.yearId:0) + '&AssesmentId=' +(formData.assesmentId?formData.assesmentId:0)+ 
    '&Districtid=' + 1 + '&TalukaId=' + (formData?.talukaId?formData?.talukaId:0) + '&CenterId=' + (formData?.kendraId?formData?.kendraId:0)
        + '&SchoolId=' + (formData?.schoolId?formData?.schoolId:0) + '&Standardid=' + (formData?.standardId?formData?.standardId:0)+
     '&subjectId=' + (formData.subjId?formData.subjId:0) + '&lan=' + 1 + '&searchtext=' + (formData?.searchText)
        +'&typeId='+(formData?.typeId?formData?.typeId:4)
        +'&assesmentparameterid='+(this.globalObj?.assesmentId?this.globalObj?.assesmentId:0)+'&userId='+(this.webStorage.getId())
        this.apiService.setHttp('GET', 'Getstudentprofilelist_V_1?EducationYearid=' + obj + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDataArray.length!=0?this.studentDataById(this.tableDataArray[0]):'';
          this.tableDatasize = res.responseData.responseData2.pageCount;
          this.totalPages = res.responseData.responseData2.totalPages;
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
    displayedColumns = this.lang == 'mr-IN' ? ['saralId', 'marathiFullName', 'standardId','colorcode'] : ['saralId', 'englishFullName', 'standardId','colorcode']
    let displayedheaders;
    displayedheaders = this.lang == 'mr-IN' ? ['????????? ????????????', '?????????', '??????????????????','????????????'] : ['Saral ID', 'Name', 'Standard','Level']
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow:true,
      pageName:'studentProfile',
      img: '', blink:'colorcode', badge: '', isBlock: '', pagination: true,
      displayedColumns: displayedColumns, tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      edit: true,
      delete: true,
    };
    this.apiService.tableData.next(tableData);
  }
  //#endregion ------------------------------------------- table fn  start heare-------------------------------------------//

  //#region -------------------------------------------------main fn start heare Student info and graph -----------------------------//
  studentDataById(obj?: any) {
    this.spinner.show();
    this.apiService.setHttp('GET', 'Getstudentprofilebyid?StandardId='+ (obj?obj.standardId:0) +'&StudentId='+(obj?obj.studentId:0) 
    +'&EducationYearId='+ (obj?obj.eductionYearId:0)+'&SchoolId='+(obj?obj.schoolId:0) + '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.StudentDataArray = res.responseData;
          this.assesmentChartData();
        }
        else {
          this.spinner.hide();
          this.StudentDataArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err)
      })
    });
  }

  assesmentChartData(){     //get chart data
    let studentData=this.StudentDataArray;
    let obj=(studentData.standardId)+'&StudentId='+(studentData.id)+'&EducationYearId='+1+'&SubjectId='+(this.subjectId.value)+'&lan='+(this.lang)
    this.apiService.setHttp('GET', 'GetDataForStudentAssementChart?StandardId='+obj, false, false, false, 'baseUrl');
    // this.apiService.setHttp('GET', 'GetDataForStudentAssementChart?&StandardId=10&StudentId=7&EducationYearId=1&SubjectId=3&IsInspection=0&flag_lang=En', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.chartData=res.responseData;
         this.tooltipSub=this.chartData?.responseData1[0].subjectId==1?'Bhasha':this.chartData?.responseData1[0].subjectId==2?'Maths':'English'
          this.getStudentProChart();
        }
        else {
          this.chartData = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => {
        this.errorService.handelError(err)
      })
    });
  }

  getStudentProChart() { 
    let proIndCat = new Array(); 
    let categoriesArray = new Array(); 
    let seriesArray: any[] = [
      {
        name: "Teacher",
        data: [],
      },
      {
        name: "NGO",
        data: [],
      },
      {
        name: "Officer",
        data: [],
      }
    ];
    this.chartData?.responseData1.find((ele:any) => { // y axies label data push heare 
     this.lang=='mr-IN'? proIndCat.push(ele.m_AssesmentParameter): proIndCat.push(ele.assesmentParameter);
    }); 
    proIndCat.reverse();
    proIndCat.unshift('');
    this.chartData?.responseData2.find((ele:any) => { // for Teacher res data 2
      seriesArray[0].data.push(ele.marking);
      this.lang=='mr-IN'? categoriesArray.push(ele.m_ExamName):categoriesArray.push(ele.examName);
    }); 
    seriesArray[0].data.unshift(0);

    this.chartData?.responseData4.find((ele:any) => { // for pratham res data 2
      seriesArray[1].data.push(ele.marking);
      categoriesArray.length?(
        categoriesArray.forEach(ele1=>{
          if(ele.examName!=ele1){
            this.lang=='mr-IN'? categoriesArray.push(ele.m_ExamName): categoriesArray.push(ele.examName);
          }
        })
      ):this.lang=='mr-IN'? categoriesArray.push(ele.m_ExamName): categoriesArray.push(ele.examName);;
    });
    seriesArray[1].data.unshift(0);
 
    this.chartData?.responseData3.find((ele:any) => { // for kendra res data 2
      seriesArray[2].data.push(ele.marking);
      categoriesArray.length?(
        categoriesArray.forEach(ele1=>{
          if(ele.examName!=ele1){
            this.lang=='mr-IN'? categoriesArray.push(ele.m_ExamName):  categoriesArray.push(ele.examName);
          }
        })
      ):this.lang=='mr-IN'? categoriesArray.push(ele.m_ExamName): categoriesArray.push(ele.examName);
    }); 
    seriesArray[2].data.unshift(0); 
    categoriesArray.unshift('');

    this.ChartOptions = {
      series: seriesArray,
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false,
        },
      },
       dataLabels: {
        enabled: false, 
        colors:['#008ffb', '#feb019', '#00e396']
      },
      colors:['#008ffb', '#feb019', '#00e396'],

      stroke: {
        curve: "smooth"
      },
      xaxis: {
      type: "level",
      categories:categoriesArray,
      parameter:this.tooltipSub
      },
      yaxis: {
        max:5,
        tickAmount:5,
        range:1,
        min:0,
        parameters:proIndCat,
        labels: {
          minWidth: 100,
          formatter: (_value:any, i:any)=> {
          let val = proIndCat[i]
          return  val
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              show: false, // not able to hide chart legends
            },
          },
        },
      ],
      legend: {
        position: "top",
        offsetY: 20,
      },
      fill: {
        opacity: 1
      },
       tooltip: {
        custom: function({seriesIndex, dataPointIndex, w }: any) { 
          var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          data=data?data:0;
          return (
            '<div class="arrow_box" style="padding:10px;">' +
            "<div>" + w.config.xaxis.parameter+ " : <b> " + w.config.yaxis[0]['parameters'][data]+ '</b>' + "</div>" +
          "</div>"
          );
        },
        } 
    };
  }
  //#endregion -------------------------------------------------main fn end here Student info and graph -----------------------------//
  clearDropdown(flag:any){
    if(flag=='taluka'){
      this.filterFrm.controls['kendraId'].setValue('');
      this.filterFrm.controls['schoolId'].setValue('');
      this.filterFrm.controls['standardId'].setValue('');
      this.globalObj='';
    }else if(flag=='kendra'){
      this.filterFrm.controls['schoolId'].setValue('');
      this.filterFrm.controls['standardId'].setValue('');
    }else if(flag=='school'){
      this.filterFrm.controls['standardId'].setValue('');
    }
    this.getStandard();
  }
}