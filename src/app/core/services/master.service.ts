import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  constructor(private apiService: ApiService)
     {  }

  getAllState(strPara?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllState?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllDistrict(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllDistrict?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllTaluka(strPara: string,distId:number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang='+strPara+'&DistrictId='+distId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllVillage(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllVillage?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllCenter(strPara: string,talukaId:number) { 
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang='+strPara+'&TalukaId='+talukaId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }
  getDesignationLevel(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'designation/get-designation-level?flag='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }
  getGenderType(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllGender?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }
}
