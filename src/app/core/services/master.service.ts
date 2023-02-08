import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CommonMethodsService } from './common-methods.service';
import { WebStorageService } from './web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  encryptInfo: any;

  constructor(private apiService: ApiService, private webStorage: WebStorageService, private router:Router, private commonMethods:CommonMethodsService) { }

  getAllState(strPara?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllState?flag_lang=' + strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllDistrict(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllDistrict?flag_lang=' + strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        // error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllTaluka(strPara: string, distId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllTalukaByDistrictId?flag_lang=' + strPara + '&DistrictId=' + distId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        // error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllVillage(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllVillage?flag_lang=' + strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllCenter(strPara: string, talukaId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllCenterByTalukaId?flag_lang=' + strPara + '&TalukaId=' + talukaId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        // error: (e: any) => { obj.error(e) }
      });
    });
  }
  getDesignationLevel(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'designation/get-designation-level?flag=' + strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }
  getGenderType(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllGender?flag_lang=' + strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }
  getUserType(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllUserType?flag_lang=' + strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        // error: (e: any) => { obj.error(e)}
      });
    });
  }
  getSchoolByCenter(strPara: string, centerId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang=' + strPara + '&CenterId=' + centerId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        // error: (e: any) => { obj.error(e) }
      });
    });
  }

  getServerDateTime() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetCurrentDateTime', false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  refreshTokenJWT(obj: any) {
    this.apiService.setHttp('POST', 'zp_chandrapur/user-registration/Refresh-Token-String', false, obj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          let loginObj:any = JSON.parse(this.webStorage.getLocalStorageData());
          loginObj.responseData.jwtAuthResult = res.responseData;
          this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(JSON.stringify(loginObj)), 'secret key 123').toString());
          localStorage.setItem('loggedInData', this.encryptInfo);
          window.location.reload();
        } else { 
          localStorage.removeItem('loggedInData');
          this.router.navigate(['/login']);
          this.commonMethods.snackBar('Your Session Has Expired. Please Re-Login Again.', 1);
        }
      },
      error: () => { 
        localStorage.removeItem('loggedInData');
        this.router.navigate(['/login']);
        this.commonMethods.snackBar('Your Session Has Expired. Please Re-Login Again.', 1);
       }
    });
  }
}


