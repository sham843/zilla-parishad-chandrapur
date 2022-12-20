import { Injectable } from '@angular/core'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as FileSaver from 'file-saver'; 
declare const ExcelJS: any;
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root',
})
export class ExcelPdfDownloadService {
  private numToAlpha(_num: number) {
    let alpha = '';
    return alpha;
  }
  constructor() {}

 //#region--------------------------------------------------------download pdf method start--------------------------------------------
   downLoadPdf() {
    let header = ['sr.No'],column;
    let doc: any = new jsPDF()
    doc.setFontSize(20)
    doc.text(80, 10, 'School Registration')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    autoTable(doc,{
      head:[header],
       body: [],
    })
    doc.save('schoolData')
  }
  //#endregion-------------------------------------------------------download pdf method end-------------------------------------------------------
  //#region----------------------------------------------------------download excel method start--------------------------------------
  downloadExcel(){
      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      //Add Data Conditional Formating
        workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
          const blob = new Blob([data], { type: EXCEL_TYPE });
          FileSaver.saveAs(blob, "School Registration" + EXCEL_EXTENSION);
        });
  }
  //#endregion-------------------------------------------------------download excel method end--------------------------------------
}
