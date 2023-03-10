import { OverlayContainer } from '@angular/cdk/overlay'
import { Component, HostBinding } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { RegisterUsersComponent } from 'src/app/modules/masters/user-registration/register-users/register-users.component'
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { ChangePasswordComponent } from '../change-password/change-password.component'
import { WebStorageService } from '../services/web-storage.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @HostBinding('class') className = ''
  language: string = 'English'
  lag = ['English', 'Marathi']
  selLang!: string;
  loginData!: any;
  profilePhoto!:string;
  encryptInfo:any;
  darkClassName:any;
  profileUserName!:any;
  constructor(
    private overlay: OverlayContainer,
    private dialog: MatDialog,
    private router: Router,
    private webStorage: WebStorageService,
    private translate: TranslateService,
  
  ) {
    translate.addLangs(['English', 'Marathi'])
    translate.setDefaultLang('English');
  }
  ngOnInit(): void {
    this.loginData = this.webStorage.getLoginData();
    this.profileUserName=this.loginData?.name;
    this.profilePhoto=this.loginData?.profilePhoto;
    let language: any = sessionStorage.getItem('language');
    this.webStorage.setLanguage.next(language);
    this.translate.use(language);
    this.webStorage.setLanguage.subscribe((res: any) => {
      this.selLang = res;
    })
    this.darkClassName=sessionStorage.getItem('theme');
    this.webStorage.setTheme(this.darkClassName);
  }

  changeTheme(darkMode: any) {
    this.className =darkMode == 'light'? (this.darkClassName = 'lightMode'): (this.darkClassName = 'darkMode');
    this.webStorage.setTheme(this.darkClassName);
    if (darkMode == 'light') {
      this.overlay.getContainerElement().classList.add('lightMode')
      this.overlay.getContainerElement().classList.remove('darkMode')
    } else {
      this.overlay.getContainerElement().classList.add('darkMode')
      this.overlay.getContainerElement().classList.remove('lightMode')
    }
    sessionStorage.setItem('theme',this.darkClassName);
  }

  changeLanguage(lang: any) {
    this.language = lang
    this.translate.use(lang)
    this.webStorage.setLanguage.next(lang)
    sessionStorage.setItem('language', lang)
  }

  openLogoutModal() {
    let modalLang=this.language;
    this.webStorage.setLanguage.subscribe((res: any) => {
      modalLang = res
    })
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '350px',
      data: {
        p1: modalLang == 'Marathi' ? '???????????????????????? ??????????????? ?????????????????? ?????????????????? ??????????' : 'Do You Really Want To Logout?',
        p2: '',
        cardTitle: modalLang == 'Marathi' ? '??????????????? ?????????' : 'Logout',
        successBtnText: modalLang == 'Marathi' ? '??????????????? ?????????' : 'Logout',
        dialogIcon: 'assets/images/logout.gif',
        cancelBtnText: modalLang == 'Marathi' ? '???????????? ?????????' : 'Cancel',
      },
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.localStorageClear()
      }
    })
  }
  openChangePassModal() {
    let lang;
    this.webStorage.setLanguage.subscribe((res: any) => {
      lang = res
    })
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '700px',
      data: {
        p1: '',
        p2: '',
        cardTitle: lang == 'Marathi' ? '????????????????????? ????????????' : 'Change Password',
        successBtnText: lang == 'Marathi' ? '????????????????????? ????????????' : 'Change Password',
        cancelBtnText: lang == 'Marathi' ? '???????????? ?????????' : 'Cancel',
      },
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.localStorageClear()
      }
    })
  }
  localStorageClear() {
    localStorage.clear()
    this.router.navigate(['../home'])
  }

  openMyProfileDialog() {
    let lang;
    this.webStorage.setLanguage.subscribe((res: any) => {
      lang = res
    })
    const dialog = this.dialog.open(RegisterUsersComponent,{
      width: '850px',
      disableClose: true,
      data:{
        cardTitle: lang=='Marathi' ?'???????????? ????????????????????????':'My Profile',
        successBtnText: lang=='Marathi' ? '???????????????????????? ????????????' : 'Update Profile',
        flag:'profile',
        cancelBtnText:lang=='Marathi' ? '???????????? ?????????' : 'Cancel',
      }
    })
    dialog.afterClosed().subscribe((res:any) => {
      if (res == 'Yes') {
        this.webStorage.getProfileData().subscribe((res:any)=>{
          this.profilePhoto=res.profilePhoto;
          this.profileUserName=res.name;
          let localData=JSON.parse(this.webStorage.getLocalStorageData());
          localData.responseData.profilePhoto=res.profilePhoto;
          localData.responseData.name=res.name;
          this.encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(JSON.stringify(localData)), 'secret key 123').toString());
           localStorage.setItem('loggedInData', this.encryptInfo);
        })
      }
    })
  } 
}
