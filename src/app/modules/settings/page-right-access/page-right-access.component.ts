import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  tableDataArray = new Array();
  totalItem: any;
  tableData: any;
  pageNumber: number = 1;
  filterForm!: FormGroup;
  language: any;
  subscription!: Subscription;
  resGetUserTypeData = new Array();
  constructor(private apiService: ApiService, private errors: ErrorsService,
    private masterService: MasterService, private fb: FormBuilder, private commonMethods: CommonMethodsService,
    private webStorage: WebStorageService) { }


  ngOnInit(): void {
    this.callFilterForm();
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      res == 'Marathi' ? this.language = 'mr-IN' : this.language = 'en-IN';
      this.setTableData(); this.getUserTypeData(this.language);
    })
  }

  callFilterForm() {
    this.filterForm = this.fb.group(({
      DesignationtypeId: [0],
      Textsearch: ['']
    }))

  }

  getUserTypeData(lang: any) {
    this.masterService.getUserType(lang).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.resGetUserTypeData = res.responseData;
        this.filterForm.controls['DesignationtypeId'].setValue(this.resGetUserTypeData[0].userTypeId);
        this.getAllPagesData();
      } else {
        this.resGetUserTypeData = [];
      }
    });
  }

  getAllPagesData() {
    let formValue = this.filterForm.value;
    let obj = `pageno=${this.pageNumber}&pagesize=10&DesignationtypeId=${formValue?.DesignationtypeId}&Textsearch=${formValue?.Textsearch}`;
    this.apiService.setHttp('get', 'zp_chandrapur/user-pages/GetByCriteria?' + obj, true, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.tableDataArray = res.responseData.responseData1;
          this.totalItem = res.responseData.responseData2[0].pageCount;
        } else {
          this.tableDataArray = [];
          this.totalItem = 0;
        }
        this.setTableData();
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  setTableData() {
    let displayedColumns;
    this.language == 'mr-IN' ? displayedColumns = ['srNo', 'pageName', 'pageURL', 'select'] : displayedColumns = ['srNo', 'pageName', 'pageURL', 'select'];
    let displayedheaders;
    this.language == 'mr-IN' ? displayedheaders = ['अनुक्रमणिका', 'पृष्ठाचे नाव', 'पृष्ठ Url', 'निवडा'] : displayedheaders = ['Sr. NO.', 'PAGE NAME', 'PAGE URL', 'SELECT'];
    this.tableData = {
      pageNumber: this.pageNumber, pagintion: true,
      img: '', blink: '', badge: '', isBlock: '', checkBox: 'select',
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.totalItem,
      tableHeaders: displayedheaders
    };
    this.apiService.tableData.next(this.tableData);
  }
  childCompInfo(obj: any) {
    if (obj.label == 'checkBox') {
      let postObj = {
        "createdBy": obj.createdBy,
        "modifiedBy": 1,
        "createdDate": obj.createdDate,
        "modifiedDate": new Date(),
        "isDeleted": false,
        "id": obj.id,
        "designationtypeId": obj.designationtypeId,
        "readRight": obj?.checkBoxValue,
        "writeRight": false,
        "pageId": obj.pageId
      }
      this.apiService.setHttp('POST', 'zp_chandrapur/user-pages/AddRecord', false, [postObj], false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.getAllPagesData();
            this.commonMethods.snackBar(res.statusMessage, 0)
          } else {
            this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.errors.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.commonMethods.checkEmptyData(error.statusText) == false ? this.errors.handelError(error.statusCode) : this.commonMethods.snackBar(error.statusMessage, 1);
        }
      })
    } else if (obj.label == 'Pagination') {
      this.pageNumber = obj.pageNumber;
      this.getAllPagesData();
    }
  }

  clearForm() {
    this.formGroupDirective.resetForm({
      DesignationtypeId: this.filterForm.value.DesignationtypeId,
      Textsearch: '',
    });
    this.getAllPagesData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}