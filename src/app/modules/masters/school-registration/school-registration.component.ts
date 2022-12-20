import { Component } from '@angular/core'
import { ExcelPdfDownloadService } from 'src/app/core/services/excel-pdf-download.service'
import { MasterService } from 'src/app/core/services/master.service'
import { WebStorageService } from 'src/app/core/services/web-storage.service'

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss'],
})
export class SchoolRegistrationComponent {
  stateArr = new Array()
  districtArr = new Array()
  lang: string = 'en'
  constructor(
    private master: MasterService,
    private webStorage: WebStorageService,
    private excelPdf: ExcelPdfDownloadService,
  ) {}

  ngOnInit() {
    this.webStorage.langNameOnChange.subscribe((res: any) => {
      res == 'Marathi' ? (this.lang = 'm_') : (this.lang = 'en')
    })
  }
 
}
