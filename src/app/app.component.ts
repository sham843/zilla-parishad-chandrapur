import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { WebStorageService } from './core/services/web-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Zilla Parishad Chandrapur';
  classname: any;
  constructor(private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private webStorage: WebStorageService) {
    this.checkBaseUrl();
    this.setTitle();
  }

  ngOnInit() {
    sessionStorage.getItem('language')?'':sessionStorage.setItem('language', 'English');
    this.webStorage.getTheme().subscribe((res: any) => {
      this.classname = res;
    })
    
  }


  checkBaseUrl() {//If base url is log in hide header and footer
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0);
      }
    });
  }

  setTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),  // set title dynamic
    ).subscribe(() => {
      var rt = this.getChild(this.activatedRoute);
      let titleName = rt?.data._value?.breadcrumb[rt.data?._value?.breadcrumb?.length - 1]?.title;
      rt.data.subscribe(() => {
        this.titleService.setTitle(titleName)
      })
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

}
