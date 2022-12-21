import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorsService } from 'src/app/core/services/errors.service';

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

  constructor(private apiService: ApiService, private errors: ErrorsService) { }

  ngOnInit(): void {
    this.getAllPagesData();
  }

  getAllPagesData() {
    // UserTypeId=''&SubUserTypeId=''&Textsearch=''&
    let obj = `pageno=${this.pageNumber}&pagesize=10`
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
    if (obj.label == 'checkBox') {
      console.log(obj);
    }
  }
}