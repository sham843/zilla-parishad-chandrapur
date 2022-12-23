import { Component } from '@angular/core';
import { WebStorageService } from '../services/web-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  loginPages = new Array();

  constructor(private WebStorageService: WebStorageService) {
    let data: any = this.WebStorageService.getAllPageName();
    this.sideBarMenu(data);
  }

  sideBarMenu(data: []) {
    this.loginPages = [];
    let items: any = data.filter((ele: any) => {
      if (ele.isSideBarMenu == true) {
        return ele;
      }
    })
    items.forEach((item: any) => {
      let existing: any = this.loginPages.filter((v: any) => {
        return v.pageNameView == item.pageNameView;
      });
      if (existing.length) {
        let existingIndex: any = this.loginPages.indexOf(existing[0]);
        this.loginPages[existingIndex].pageURL = this.loginPages[existingIndex].pageURL.concat(item.pageURL);
        this.loginPages[existingIndex].pageName = this.loginPages[existingIndex].pageName.concat(item.pageName);
      } else {
        if (typeof item.pageName == 'string')
          item.pageURL = [item.pageURL];
        item.pageName = [item.pageName];
        this.loginPages.push(item);
      }
    });
  }

}
