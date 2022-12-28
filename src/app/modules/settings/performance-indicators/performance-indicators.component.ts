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
  classStandardArray = [{ first: 1 }, { second: 2 }, { third: 3 }, { fourth: 4 }, { fifth: 5 }, { sixth: 6 }, { seven: 7 }, { eight: 8 }, { nine: 9 }, { ten: 10 }];
  checkedAssesmentArray: any[] = [];

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
    this.getAllPerformanceIndicatorData();
    this.getAllSubject();
    this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? this.language = 'mr-IN' : this.language = 'en-IN';
    })
  }

  getAllSubject() {
    this.apiService.setHttp('get', 'zp_chandrapur/master/GetAllSubject', true, false, false, 'baseUrl')
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
          this.dataSource = new MatTableDataSource(res.responseData);
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
          console.log(this.checkedAssesmentArray, 'Main checkedAssesmentArray Data');
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

  addCheckedassesment(event: any, assmntParameterId: any, classType: any) {
    let classValueName: any; this.classStandardArray.map((ele: any) => { Object.keys(ele) == classType ? classValueName = Object.values(ele).toString() : '' }) //get classValueName from classStandardArray
    this.checkedAssesmentArray.map((ele: any) => {
    (assmntParameterId == ele.assesmentPerformanceId && ele.standardId == classValueName) ? ele.flag = event.checked == true ? 1 : 0 : '';
    })
    console.log(this.checkedAssesmentArray, 'Final checked Assesment Data');
  }

  onSubmitPI() {
    if (!this.checkedAssesmentArray.length) {
      this.commonMethod.snackBar('Please Update at least one Class', 1);
    } else {
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
    }
  }

  addclass() {
    let data = {
      language: this.language,
    }
    const dialogRef = this.dialog.open(AddClassComponent, {
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

  addlevel() {
    let data = {
      language: this.language,
      subjectId: this.filterEnglishLag.value
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