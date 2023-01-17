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
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN'
      this.setTableData();
    })
    this.getformControl();
    this.getTaluka();
    this.globalObj.talukaId==0?this.getAllStudentData():'';
    this.globalObj.schoolId==0?this.getStandard():'';
    this.getAllSubject();
    this.getStudentProChart();
    this.getEducationYear();
    console.log(this.globalObj);
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
      studentId:[this.globalObj.stuId],
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
          ((this.levelId == 1 || this.levelId == 2 || this.levelId == 3) && this.clearFlag==true)? (this.filterFrm.controls['kendraId'].setValue(this.globalObj.kendraId),this.getSchool()):
          ((this.levelId == 4 || this.levelId == 5) && this.globalObj.kendraId!=0) ? (this.filterFrm.controls['kendraId'].setValue(this.loginData.centerId),this.getSchool()):'';
          (this.globalObj.kendraId!=0 && this.globalObj.schoolId==0)?this.getAllStudentData():'';
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
          ((this.levelId == 1 || this.levelId == 2 || this.levelId == 3 || this.levelId == 4) && this.clearFlag==true)?(this.filterFrm.controls['schoolId'].setValue(this.globalObj.schoolId),this.getStandard()):
          (this.levelId == 5 && this.globalObj.schoolId!=0)? (this.filterFrm.controls['schoolId'].setValue(this.loginData.schoolId),this.getStandard()):'';
          (this.globalObj.schoolId!=0 && this.globalObj.standardId==0)?this.getAllStudentData():'';
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
          this.clearFlag==true?(this.filterFrm.controls['standardId'].setValue(this.globalObj.staId),this.getAllStudentData()):'';
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
          this.getAssessments();
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
    this.getformControl();
    this.filterFrm.controls['subjId'].setValue(1);
    this.filterFrm.controls['yearId'].setValue(1);
    this.filterFrm.controls['assesmentId'].setValue(1);
    this.globalObj='';
    this.getTaluka();
    this.getStandard();
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
      case 'Row': this.studentDataById(obj.studentId)
        break
    }
  }
 
  getAllStudentData(flag?: any) {
    console.log(this.filterFrm.value)
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 : '';
    let formData = this.filterFrm.value;
    let str = `&nopage=${this.pageNumber}`
    let obj = 1 + '&AssesmentId=' +(formData.assesmentId?formData.assesmentId:0)+ '&Districtid=' + 1 + '&TalukaId=' + (formData?.talukaId?formData?.talukaId:0) + '&CenterId=' + (formData?.kendraId?formData?.kendraId:0)
    + '&SchoolId=' + (formData?.schoolId?formData?.schoolId:0) + '&Standardid=' + (formData?.standardId?formData?.standardId:0)+ '&subjectId=' + (formData.subjId?formData.subjId:0) + '&lan=' + 1 + '&searchText=' + (formData?.searchText)
    +'&studentId='+(formData?.studentId?formData?.studentId:0)
    +'&assesmentparameterid='+(this.globalObj?.assesmentId?this.globalObj?.assesmentId:0)+'&userId='+(this.webStorage.getId())
    this.apiService.setHttp('GET', 'Getstudentprofilelist?EducationYearid=' + obj + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.studentDataById(this.tableDataArray[0]?.studentId?this.tableDataArray[0]?.studentId:0);
          this.tableDatasize = res.responseData.responseData2[0].pageCount;
          this.totalPages = res.responseData.responseData2[0].totalPages;
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
    displayedheaders = this.lang == 'mr-IN' ? ['सरल आयडी', 'नाव', 'इयत्ता','स्तर'] : ['Saral ID', 'Name', 'Standard','Level']
    let tableData = {
      pageNumber: this.pageNumber,
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
  studentDataById(id?: any) {
    this.apiService.setHttp('GET', 'zp-Chandrapur/Student/GetById?Id=' + id + '&lan=' + this.lang, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.StudentDataArray = res.responseData;
          this.assesmentChartData();
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

  assesmentChartData(){     //get chart data
    let studentData=this.StudentDataArray;
    let obj=(studentData.standardId)+'&StudentId='+(studentData.id)+'&EducationYearId='+1+'&SubjectId='+(this.subjectId.value)+'&lan='+(this.lang)
    this.apiService.setHttp('GET', 'GetDataForStudentAssementChart?StandardId='+obj, false, false, false, 'baseUrl');
    // this.apiService.setHttp('GET', 'GetDataForStudentAssementChart?&StandardId=10&StudentId=7&EducationYearId=1&SubjectId=3&IsInspection=0&flag_lang=En', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.chartData=res.responseData;
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
        name: "शिक्षक",
        data: [],
      },
      {
        name: "पहिला",
        data: [],
      },
      {
        name: "अधिकारी",
        data: [],
      }
    ];
    this.chartData?.responseData1.find((ele:any) => { // y axies label data push heare
      proIndCat.push(ele.assesmentParameter);
    }); 
    proIndCat.reverse();

    this.chartData?.responseData2.find((ele:any) => { // for Teacher res data 2
      seriesArray[0].data.push(ele.marking);
      categoriesArray.push(ele.examName)
      
    }); 

    this.chartData?.responseData3.find((ele:any) => { // for pratham res data 2
      seriesArray[1].data.push(ele.marking);
    }); 

    this.chartData?.responseData3.find((ele:any) => { // for kendra res data 2
      seriesArray[2].data.push(ele.marking);
    }); 

    this.ChartOptions = {
      series: seriesArray,
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
      type: "level",
      categories:categoriesArray
      },
      yaxis: {
        max:5,
        tickAmount:5,
        range:1,
        min:0,
        labels: {
          minWidth: 100,
          formatter: (_value:any, i:any)=> {
          let val = proIndCat[i]
          return  val
          },
        },
      },
      legend: {
        position: "top",
        offsetY: 20,
      },
      fill: {
        opacity: 1
      },
      tooltip :{
        custom: (value:any) =>{
          console.log(value)   
           const subjectName = this.subjectArray.find(element =>element.id == this.subjectId.value);
          //  const stageName = this.chartData?.responseData1.find((element:any) => console.log(element));
          return ('<div class="arrow_box" style="padding:10px;">' +
              "<div>" +subjectName.subject+ " : <b> " + + '</b>' + "</div>" +
            "</div>"
          );
        },
      }
    };
  }

  //#endregion -------------------------------------------------main fn end heare Student info and graph -----------------------------//
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