import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  tableData = new Subject<any>(); //all table set and set data using BehaviorSubject
  stateId:number = 1; // maharashta
  disId:number = 1 // 1 for Chandrapur
  translateLang:boolean=false;
  userObj:any;

  private httpObj: any = {
    type: '',
    url: '',
    options: Object
  };

  disableCloseFlag: boolean = true;

  constructor(private http: HttpClient) { }

  
  getBaseurl(url: string) {
    switch (url) {     
      case 'baseUrl': return 'https://zpchaservices.mahamining.com/'; break; // developement
      // case 'baseUrl': return 'https://zpchaservicesuat.mahamining.com/'; break; //live
      default: return ''; break;
    }
  }

  getHttp(): any {
    !this.httpObj.options.body && (delete this.httpObj.options.body)
    !this.httpObj.options.params && (delete this.httpObj.options.params)
    return this.http.request(this.httpObj.type, this.httpObj.url, this.httpObj.options);
  }

  setHttp(type: string, url: string, isHeader: Boolean, obj: any, params: any, baseUrl: any) {
    try {
      // this.userObj = this.webStorage.getLoginData();
    } catch (e) { }
    this.clearHttp();
    this.httpObj.type = type;
    this.httpObj.url = this.getBaseurl(baseUrl) + url;
    if (isHeader) {
      let tempObj: any = {
        // "Authorization": "Bearer " + this.userObj.jwtAuthResult.accessToken // token set
      };
      this.httpObj.options.headers = new HttpHeaders(tempObj);
    }

    obj !== false ? this.httpObj.options.body = obj : this.httpObj.options.body = false;
    params !== false ? this.httpObj.options.params = params : this.httpObj.options.params = false;
  }

  clearHttp() {
    this.httpObj.type = '';
    this.httpObj.url = '';
    this.httpObj.options = {};
  }
}
