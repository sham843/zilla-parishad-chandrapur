import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent implements OnInit {
  tableDataArray = new Array();
  totalItem: any;
  tableData: any;
  pageNumber: number = 1;
  filterForm!: FormGroup;
  resGetUserTypeData = new Array();
  constructor(private apiService: ApiService, private errors: ErrorsService, private masterService: MasterService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.callFilterForm();
    this.getUserTypeData();
    this.getAllPagesData();
  }

  callFilterForm() {
    this.filterForm = this.fb.group(({
      DesignationtypeId: [0],
      Textsearch: ['']
    }))

  }

  getUserTypeData() {
    this.masterService.getUserType('en-IN').subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.resGetUserTypeData = res.responseData;
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
        let displayedColumns = ['srNo', 'pageName', 'pageURL', 'select'];
        let displayedheaders = ['Sr NO.', 'PAGE NAME', 'PAGE URL', 'SELECT'];
        this.tableData = {
          pageNumber: this.pageNumber,
          img: '', blink: '', badge: '', isBlock: '', checkBox: 'select',
          displayedColumns: displayedColumns,
          tableData: this.tableDataArray,
          tableSize: this.totalItem,
          tableHeaders: displayedheaders
        };
        this.apiService.tableData.next(this.tableData);
      },
      error: ((err: any) => { this.errors.handelError(err) })
    });
  }

  childCompInfo(obj: any) {
    console.log(obj);
    if (obj.label == 'checkBox') {
      let obj = {
        "createdBy": 0,
        "modifiedBy": 0,
        "createdDate": "2022-12-21T09:30:52.489Z",
        "modifiedDate": "2022-12-21T09:30:52.489Z",
        "isDeleted": true,
        "id": 0,
        "designationtypeId": 0,
        "readRight": true,
        "writeRight": true,
        "pageId": 0
      }
      console.log(obj)
    }
  }
}