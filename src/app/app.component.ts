import { Component } from '@angular/core';
import { NavObserverService } from './services/nav-observer.service';
import { Router, RouterOutlet } from '@angular/router';
import { LocalstorageService } from './services/localstorage.service';
import { HttpQuoteService } from './services/http-quote.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'OMV_15';
  
  // selMenuList: MenuList = this.menuList[0];

  // public prodList!:  any[];

  constructor(
    
    private storage: LocalstorageService,
    public nvg: NavObserverService,
    private router: Router,
    ) {
      
    }

  async ngOnInit() {
    
    this.navObserver();
    this.storage.getScreenWidth();
    this.nvg.setReady();
    this.nvg.onRouteDetail('', '', 'itemlist', true);
  }

  navObserver() {
    this.nvg.getRouteDetailObs().subscribe(navDeta => {

      if (navDeta.tag && navDeta.tag.length > 0) {
        this.router.navigate([navDeta.route, navDeta.tag], { skipLocationChange: true }); // .catch(rason => console.log(rason));
      } else {
        this.router.navigate([navDeta.route], { skipLocationChange: true });// this.router.navigate([`/${navDeta.route}`]); // .catch(rason => console.log(rason));
      }
      // this.router.navigate([`/myPage/`], { relativeTo: this.route, skipLocationChange: true })
    });
  }



}