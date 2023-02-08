import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddClassComponent } from './add-class/add-class.component';
import { AddLevelComponent } from './add-level/add-level.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-performance-indicators',
  templateUrl: './performance-indicators.component.html',
  styleUrls: ['./performance-indicators.component.scss']
})
export class PerformanceIndicatorsComponent implements OnInit {


  @ViewChild(MatSort) sort!: MatSort;
  // displayedColumns: string[] = ['srno','assesmentParameter', 'first', 'second', 'third','fourth','fifth'];
  displayedColumns!: string[];
  dataSource: any;
  filterForm: FormGroup | any;
  language: any;
  getAllSubjectArray: any;
  performanceIndicatorArray: any;
  filterEnglishLag = new FormControl(1);
  classStandardArray = [{ first: 1 }, { second: 2 }, { third: 3 }, { fourth: 4 }, { fifth: 5 }, { sixth: 6 }, { seventh: 7 },
     { eighth: 8 }, { ninth: 9 }, { tenth: 10 }, { eleventh: 11 }, { twelth: 12 }]; //Add Required When Api Side Changes
  checkedAssesmentArray: any[] = [];
  copyCheckedAssesmentArray: any[] = [];
  english_MarathiHeadingArray:any;
  allcheckClass = new FormControl();


  constructor(
    private apiService: ApiService,
    private errors: ErrorsService,
    private commonMethod: CommonMethodsService,
    private webStorage: WebStorageService,
    private errorService: ErrorsService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? this.language = 'mr-IN' : this.language = 'en-IN';
      this.getAllSubject();
      this.english_MarathiHeadingArray = this.language == 'en-IN' ?
      [{ assesmentParameterId: 'Sr. No.' }, { assesmentParameter: 'Assesment Name' }, { m_AssesmentParameter: 'मूल्यांकन नाव' }, { first: 'First' }, { second: 'Second' }, { third: 'Third' }, { fourth: 'Fourth' }, { fifth: 'Fifth' }, { sixth: 'Sixth' }, { seventh: 'Seventh' },
      { eighth: 'Eighth' }, { ninth: 'Ninth' }, { tenth: 'Tenth' }, { eleventh: 'Eleventh' }, { twelth: 'Twelth' }] :
      [{ assesmentParameterId: 'अनुक्रमणिका' }, { assesmentParameter: 'Assesment Name' }, { m_AssesmentParameter: 'मूल्यांकन नाव' }, { first: 'पहिली' }, { second: 'दुसरी' }, { third: 'तिसरी' }, { fourth: 'चौथी ' }, { fifth: 'पाचवी' }, { sixth: 'सहावी' }, { seventh: 'सातवी' },
      { eighth: 'आठवी' }, { ninth: 'नववी' }, { tenth: 'दहावी' }, { eleventh: 'अकरावी' }, { twelth: 'बारावी' }];
      this.getAllPerformanceIndicatorData();
    })
  }

  getAllSubject() {
    let language=this.apiService.translateLang?this.language:'en-IN';
   this.apiService.setHttp('get', 'zp_chandrapur/PerformanceIndicator/GetAllSubjectforPI?flag_lang='+ `${language}`, true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.getAllSubjectArray = res.responseData;
        } else {
          this.getAllSubjectArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  getAllPerformanceIndicatorData() {
    let obj = `${this.filterEnglishLag.value}&UserId=${this.webStorage.getUserId()}`;
    this.apiService.setHttp('get', 'zp_chandrapur/PerformanceIndicator/GetAll?SubjectId=' + obj, true, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.performanceIndicatorArray = res.responseData;

          this.displayedColumns = Object.keys(this.performanceIndicatorArray[0]);
          this.displayedColumns.map((ele: any, index: any) => { // Add Remove English Marathi Level Name Field
            return (this.language == 'mr-IN' && ele == 'assesmentParameter') ? this.displayedColumns.splice(index, 1) : ele == 'm_AssesmentParameter' ? this.displayedColumns.splice(index, 1) : ''
          })

          this.dataSource = new MatTableDataSource(this.performanceIndicatorArray);
          this.dataSource.sort = this.sort;
          //........................ AssesmentArray code Start Here....................//
          this.checkedAssesmentArray = []; //first Clear Array
          this.performanceIndicatorArray.map((ele: any) => {
            for (let x in ele) { // check key value data in Object
              this.classStandardArray.find((eleClass: any) => {
                let classKeyName: any = Object.keys(eleClass); //find class keyName
                if (classKeyName == x) { //matched Value push in Object
                  let obj: any = {
                    "standardId": eleClass[classKeyName],
                    "assesmentPerformanceId": ele.assesmentParameterId,
                    "flag": ele[x],
                  }
                  this.checkedAssesmentArray.push(obj);
                }
              })
            }
          })
          this.checkedOrNotCondtn();
          this.copyCheckedAssesmentArray = JSON.parse(JSON.stringify(this.checkedAssesmentArray));

          //........................ AssesmentArray code End Here....................//
        } else {
          this.dataSource = [];
          this.performanceIndicatorArray = [];
          this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  checkedOrNotCondtn(){
    this.checkedAssesmentArray.some((ele: any) => { //  check all Class checked or not condition for true(1) false(0)
      if (ele.flag == 1) { this.allcheckClass.setValue(1); return } else { this.allcheckClass.setValue(0); return true }
    })
  }

  addCheckedassesment(event: any, assmntParameterId: any, classType: any) { //Single Check
    let classValueName: any; this.classStandardArray.map((ele: any) => { Object.keys(ele) == classType ? classValueName = Object.values(ele).toString() : '' }) //get classValueName from classStandardArray
    this.checkedAssesmentArray.map((ele: any) => {
    (assmntParameterId == ele.assesmentPerformanceId && ele.standardId == classValueName) ? ele.flag = event.checked == true ? 1 : 0 : '';
    })

    this.checkedOrNotCondtn();
  }

  checkAllClass(event: any) { //All Check
    this.performanceIndicatorArray.map((ele: any) => {   // code for Show only Table true Value
      for (let x in ele) { // check key value data in Object
        this.classStandardArray.find((eleClass: any) => {
          let classKeyName: any = Object.keys(eleClass); //find class keyName
          if (classKeyName == x) {
            ele[x] = event.checked == true ? 1 : 0;
          }
        })
      }
    })

    this.checkedAssesmentArray.map((ele: any) => {
      ele.flag = event.checked == true ? 1 : 0;
    })

  }

  onSubmitPI() {
    // if (JSON.stringify(this.checkedAssesmentArray) === JSON.stringify(this.copyCheckedAssesmentArray)) {
    //   this.commonMethod.snackBar('Please Update at least one Class', 1);
    // } else {
      let obj: any = {
        "subjectId": this.filterEnglishLag.value,
        "createdBy": this.webStorage.getUserId(),
        "createdDate": new Date(),
        "assesment": this.checkedAssesmentArray
      }
      this.spinner.show();
      this.apiService.setHttp('POST', 'zp_chandrapur/PerformanceIndicator/AddPerformancesubject', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.getAllPerformanceIndicatorData();
          } else {
            this.commonMethod.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.commonMethod.checkEmptyData(error.statusMessage) == false ? this.errorService.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusMessage, 1);
        }
      })
    // }
  }

  addclass() {
    let data = {
      language: this.language,
    }
    const dialogRef = this.dialog.open(AddClassComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.getAllPerformanceIndicatorData();
      }
    })
  }

  addUpdatelevel(editObj?:any) {
    let data = {
      language: this.language,
      subjectId: this.filterEnglishLag.value,
      editObjData:editObj
    }
    const dialogRef = this.dialog.open(AddLevelComponent, {
      width: '500px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.getAllPerformanceIndicatorData();
      }
    })
  }

}
