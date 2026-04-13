import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NavigateDetail } from '../datatypes';
// import { JsonFormData } from './components/dynamic-form/dynamic-form.component';

@Injectable({
  providedIn: 'root'
})
export class NavObserverService {

  private RouteDetailObs = new Subject<NavigateDetail>();

  private comeFromPage = '';
  actualTitle = ''
  routeTitleLst: string[] = [];
  // private routePrevList: string[] = [];
  backarrow = '';
  private ready = false;
  showProgress = false;
  // sidenav = true;
  // playing = false;
  // jsonDefSelect!: JsonFormData;

  constructor(private router: Router) { }

  getReady(): boolean {
    return this.ready;
  }

  setReady() {
    this.ready = true;
  }

  getRouteDetailObs(): Observable<NavigateDetail> {
    return this.RouteDetailObs.asObservable();
  }

  getPrevPage(): string { return this.comeFromPage; }


  /*
  onRouteDefPollDetail(title: string, icon: string, route: string, tag: string, jsonDefSelect: JsonFormData) {
    this.jsonDefSelect = jsonDefSelect;
    this.onRouteDetail(title, icon, route, false, tag);
  }
  */

  onRouteDetail(title: string, icon: string, route: string, back: boolean, tag: string = '') {

    if (!this.getReady()) return;
    // if (sidenav) {this.sidenav = !this.sidenav; return;}
    this.comeFromPage = this.router.url;

    this.actualTitle = title;
    // this.playing = false;
    /*
    if (back) {
      this.routeTitleLst.splice(this.routeTitleLst.length - 1, 1);}
    else {this.routeTitleLst.push(title || '---'); }
    this.backarrow = this.routeTitleLst[this.routeTitleLst.length - 1];
    */
    this.RouteDetailObs.next({ title, icon, route, back, tag });
  }

}
