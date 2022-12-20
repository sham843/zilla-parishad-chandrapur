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
 
  getAllSchool(strPara: string,centerId:any) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolsByCenter?flag_lang='+strPara+'&CenterId='+centerId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSchoolType(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllSchoolType?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllUserType(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllUserType?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getDesignationType(strPara: string,designationLevelId:number) {
  return new Observable((obj) => {
    this.apiService.setHttp('GET', 'designation/get-set-designation-types?designationLevelId='+designationLevelId+'flag='+strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
      error: (e: any) => { obj.error(e) }
    });
  });
}

getAllAgency(strPara: string) { 
return new Observable((obj) => {
  this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllAgency?flag_lang='+strPara, false, false, false, 'baseUrl');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
    error: (e: any) => { obj.error(e) }
  });
});
}

getAllStandard(strPara: string) {
  return new Observable((obj) => {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllStandard?flag_lang='+strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
      error: (e: any) => { obj.error(e) }
    });
  });
}
getAllReligion(strPara: string) {
  return new Observable((obj) => {
    this.apiService.setHttp('GET', 'zp_chandrapur/master/GetAllReligion?flag_lang='+strPara, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {if (res.statusCode == "200"){obj.next(res)} else { obj.error(res); }},
      error: (e: any) => { obj.error(e) }
    });
  });
}




 /*  getAllSubject(strPara: string) { zp_chandrapur/master/GetAllAgency
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSubject?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }


 

  getAllGroupClass(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllGroupClass?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllGender(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllGender?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }



  getAllSpecialization(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSpecialization?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllCaste(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllCaste?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getRoleOfTeacher(strPara: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetRoleOfTeacher?flag_lang='+strPara, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {if (res.statusCode == "200"){ console.log("res",res);obj.next(res)} else { obj.error(res); }},
        error: (e: any) => { obj.error(e) }
      });
    });
  }

 */
}
