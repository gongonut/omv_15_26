import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { NavObserverService } from '../../services/nav-observer.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, NavBarComponent]
})
export class HomeComponent implements OnInit {

  // private menuIndex = 0;

  constructor(
    private nvg: NavObserverService,
    private storage: LocalstorageService,
    private scroller: ViewportScroller,
    private router: Router
    ) {}

    ngOnInit(): void {
      this.router.navigate(["/"]);
    }

  onSelected(menuindex: any) {
    
    this.nvg.showProgress = false;
    const anch = 't' + this.storage.selMenu[1].toString();
    this.scroller.scrollToAnchor(anch);
    // this.menuIndex = menuindex;
   // this.menuIndex = menuindex as NavEvent;
  }

  getHover(p: number): string {
    if (this.storage.selMenu[1] === p) {return 'bg-gray-100'} {return 'bg-white'}
  }

}
