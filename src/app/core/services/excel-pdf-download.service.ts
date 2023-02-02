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
  downloadExcel(data:any,pageName:any,key:any,headersArray:any){
    let keyCenterNo = ""
    if (key.length == 4) {
      keyCenterNo = "C"
    } else {
      keyCenterNo = String.fromCharCode(Math.ceil(key.length / 2) + 64)
    }
    const header = key;
    let result: any = data.map((obj: any) => {
      let filterObj: any = {};
      for (let i: any = 0; i < headersArray.length; i++) {
        filterObj[headersArray[i]] = obj[headersArray[i]];
      }
      return filterObj;
    });
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Snippet Coder';
    workbook.lastModifiedBy = 'SnippetCoder';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(pageName);
    // Adding Header Row
    worksheet.addRow([]);
    worksheet.mergeCells(keyCenterNo + '4:' + this.numToAlpha(header.length - 2) + '4');
    worksheet.getCell(keyCenterNo + '4').value = pageName;
    worksheet.getCell(keyCenterNo + '4').alignment = { horizontal: 'center',};
    worksheet.getCell(keyCenterNo + '4').font = { size: 17, bold: true };
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell: any, index: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFFFFFFF'
        },
        bgColor: {
          argb: 'FFFFFFFF'
        },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = { size: 12, bold: true }
      worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
      worksheet.getColumn(1).width = 15;
      pageName == 'School Registration'? worksheet.getColumn(2).width = 20:worksheet.getColumn(2).width = 40;
      pageName == 'School Registration'? worksheet.getColumn(3).width = 50:worksheet.getColumn(3).width = 20;
      pageName == 'Designation Master'? worksheet.getColumn(4).width = 80:pageName =='NGO Registration'?worksheet.getColumn(4).width = 30:worksheet.getColumn(4).width = 20;
      pageName=='User Registration'? worksheet.getColumn(5).width = 40:worksheet.getColumn(5).width = 20;
      pageName == 'School Registration'? worksheet.getColumn(6).width = 40: worksheet.getColumn(6).width = 20;
      pageName == 'School Registration'? worksheet.getColumn(7).width = 40: worksheet.getColumn(7).width = 20;
      pageName == 'Student Registration'? worksheet.getColumn(6).width = 60: worksheet.getColumn(7).width = 20;
      worksheet.getColumn(12).width = 90;
    });

    //Add Data Conditional Formating
 result.forEach((element: any) => {
      const eachRow: any = [];
      headersArray.forEach((column: any) => {
        element[column].length==0?element[column]='N/A':element[column];
        eachRow.push(element[column]);
      })
      const deletedRow = worksheet.addRow(eachRow);
      deletedRow.eachCell((cell: any) => {
        cell.font = {
          align: 'left'
        };
        cell.alignment = {
          vertical: 'middle', horizontal: 'left'
        };
        cell.border = {
          top: { style: 'thin' },
          left: { tyle: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }); 
    })

      workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
        const blob = new Blob([data], { type: EXCEL_TYPE });
        FileSaver.saveAs(blob, pageName + EXCEL_EXTENSION);
      });
  }
  //#endregion-------------------------------------------------------download excel method end--------------------------------------
}
