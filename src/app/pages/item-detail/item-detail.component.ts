import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import {MatSelectModule} from '@angular/material/select';
import { CotizaWish, Materiales } from '../../datatypes';
import { LocalstorageService } from '../../services/localstorage.service';
import { NavObserverService } from '../../services/nav-observer.service';
import { HttpQuoteService } from '../../services/http-quote.service';
import { DialogData, DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  imports: [MatFormFieldModule, MatIconModule, DecimalPipe, MatBadgeModule, MatSelectModule]
})
export class ItemDetailComponent implements OnInit, OnDestroy {

  constructor(
    public storage: LocalstorageService,
    private snkBar: MatSnackBar,
    private nvg: NavObserverService,
    private http_quote: HttpQuoteService,
    private dg: DialogService
  ) { }

  imageList: string[] = [];
  imageOptionList: { nombre: string, codigo: string }[] = [];
  imageSMList: string[] = [];
  private imageXLList: string[] = [];
  SelImg = '';
  private selMaterial!: Materiales;
  cotizaTtl = 0;
  wishTtl = 0;
  bagSubs!: Subscription;

  ngOnInit() {
    this.getImageLists();
    this.SelImg = this.imageXLList[0] || '';
    this.badgeObs();
  }

  ngOnDestroy(): void {
    if (this.bagSubs) this.bagSubs.unsubscribe();
  }

  badgeObs() {
    this.storage.getactualWishQuote();
    this.bagSubs = this.storage.getBadgeObs().subscribe(wq => {
      if (wq.list_name === 'wishList') { this.wishTtl = wq.total }
      if (wq.list_name === 'quoteList') { this.cotizaTtl = wq.total }
    });
  };

  private getImageLists(code: string = '') {

    // console.log( typeof( this.selMaterial));
    this.imageList = [];
    this.imageOptionList = [{ codigo: '', nombre: 'Todo' }];
    this.storage.selItem.materiales.forEach(mti => {
      this.imageOptionList.push({ codigo: mti.codigo, nombre: mti.color_nombre });
    });
    if (code.length === 0) {

      this.selMaterial = this.storage.selItem.materiales[-1];
      if (this.storage.selItem.imagenes) { this.imageList = [...this.storage.selItem.imagenes]; }
      this.storage.selItem.materiales.forEach(mat => {
        this.imageList = [...this.imageList, ...mat.imagenes];
      });
      /*
      this.selMaterial = this.storage.selItem.materiales[-1];
      this.imageList = [...this.storage.selItem.imagenes];
      this.imageList.push(this.storage.selItem.imagen);
      this.storage.selItem.materiales.forEach(mti => {
        this.imageList = [...this.imageList, ...mti.imagenes];
      })
      */
    } else {
      const mat = this.storage.selItem.materiales.find(mt => mt.codigo === code);
      if (mat) {
        this.selMaterial = mat;
        this.imageList = [...this.imageList, ...mat.imagenes];
      }
    }
    this.imageSMList = []; this.imageXLList = [];
    this.imageList.forEach(iml => {
      // this.imageSMList.push(iml.imagen.file_sm); this.imageXLList.push(iml.imagen.file_md);
      this.imageSMList.push(iml); this.imageXLList.push(iml);
    })

  }

  setImage(index: number) {
    this.SelImg = this.imageXLList[index] || '';
  }

  getInventario(): number {
    if (this.selMaterial) {
      return this.selMaterial.inventario || 0
    } else {
      return Number(this.storage.selItem.existencia) || 0
    }
  }

  /*
  getImage(): string {
    return 'https://tecdn.b-cdn.net/img/new/slides/041.jpg';
  }
  */

  add2Cotiza() {

    if (!this.selMaterial) {
      this.snkBar.open('Debe seleccionar un color o estilo', 'Ok', { duration: 3000 });
      return;
    }
    if (this.storage.addWishQuote('1', this.storage.selItem, this.selMaterial)) {
      this.snkBar.open('Agregado a la lista de Cotización', 'Ok', { duration: 3000 });
    } else {
      this.snkBar.open('No existe inventario', 'Ok', { duration: 3000 });
    }
  }

  add2WishList() {
    this.storage.addWishQuote('0', this.storage.selItem);
  }

  onSelectEvent(value: any) {
    this.getImageLists(value);
    if (this.imageXLList.length > 0) this.setImage(0);
  }

  async onSelected(event: any) {
    this.goBack();

  }

  goBack() {
    this.nvg.onRouteDetail('', '', 'itemlist', true);
  }

  // ...................................................................................
  wishQuoteModule(what: string): void {

    let tit = '';
    let list!: CotizaWish;

    switch (what) {
      case '0':
        if (this.wishTtl === 0) return;
        tit = 'Lista de Favoritos';
        list = this.storage.wishList;
        break;
      case '1':
        if (this.cotizaTtl === 0) return;
        tit = 'Módulo de Cotizaciones';
        list = this.storage.quoteList;
        break;
    }

    const ddta: DialogData = {
      title: tit,
      tag: what,
      value: list,
    }
    this.dg.aactualQuote(ddta).subscribe((result: any) => {

      if (this.storage.quoteList.status === 1) {
        this.http_quote.createQuote(list).subscribe({
          error: (e) => this.snkBar.open(`Error al enviar la cotización. Intente más tarde. -- ${e.error}`, 'Listo', { duration: 3000 }),
          complete: () => {
            this.storage.deleteactualWidhQuote('1');
            this.snkBar.open(`Su solicitud ha sido enviada, responderemos en el menor tiempo posible`, 'Listo', { duration: 3000 })
          }
        });
      } else {
        this.storage.saveWishQuote(what);
        // if (this.storage.filter.seltype === 2) { this.whishCatSelected.emit(true); }
      }
    });
  }

  getWhatsApp() {
    this.storage.getWhatsApp()
  }


}
