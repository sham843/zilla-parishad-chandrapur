import { Component } from '@angular/core';
import { WebStorageService } from '../services/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  loginPages = new Array();
  language:string='English';
  
  constructor(private WebStorageService: WebStorageService) {
    let data: any = this.WebStorageService.getAllPageName();
    this.sideBarMenu(data);
  }
  ngOnInit(){
    this.WebStorageService.setLanguage.subscribe(res=>{
      this.language=res;
    })
  }

  sideBarMenu(data: []) {
    this.loginPages = [];
    let items: any = data?.filter((ele: any) => {
      if (ele.isSideBarMenu == true) {
        return ele;
      }
    })
      items?.forEach((item: any) => { 
      let existing: any = this.loginPages.filter((v: any) => {
        return v.pageNameView == item.pageNameView && v.m_PageNameView == item.m_PageNameView;
      });
      if (existing.length) {
        let existingIndex: any = this.loginPages.indexOf(existing[0]);
        this.loginPages[existingIndex].pageURL = this.loginPages[existingIndex].pageURL.concat(item.pageURL);
        this.loginPages[existingIndex].pageName = this.loginPages[existingIndex].pageName.concat(item.pageName);
        this.loginPages[existingIndex].m_PageName = this.loginPages[existingIndex].m_PageName.concat(item.m_PageName);
      } else {
        if (typeof item.pageName == 'string')
          item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        item.m_PageName = [item.m_PageName];
        this.loginPages.push(item);
      }
    });
  }

}
