import { Injectable } from '@angular/core'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
   downLoadPdf(responceData:any,pageName:any,header:any,column:any) {
    let result: any = responceData.map((obj: any) => {
      let filterObj: any = {};
      for (let i: any = 0; i < column.length; i++) {
        filterObj[column[i]] = obj[column[i]];
      }
      return filterObj;
    });
    let conMulArray: any;
    conMulArray = result.map((o: any) => Object.keys(o).map(k => o[k]));
    let doc: any = new jsPDF()
    doc.setFontSize(20)
    doc.text(80, 10,pageName)
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.autoTable(
      header, conMulArray, {
        startY: 35,
        margin: { horizontal: 7 },
    })
    
    doc.save('Agency')
  }
  //#endregion-------------------------------------------------------download pdf method end-------------------------------------------------------
 
  //#region----------------------------------------------------------download excel method start--------------------------------------
  downloadExcel(){
    this.numToAlpha
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
