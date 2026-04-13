import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DialogData, DialogService } from '../../services/dialog.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { ItemComponent } from '../../components/item/item.component';
import { CatalogModule } from '../../components/catalog/catalog.module';
import { CatTree, Filter, LocalstorageService } from '../../services/localstorage.service';
import { NavObserverService } from '../../services/nav-observer.service';
import { HttpQuoteService } from '../../services/http-quote.service';
import { Item } from '../../datatypes';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    NavBarComponent,
    ItemComponent,
    CatalogModule,
    NavBarComponent,
    ItemComponent
]
})
export class ItemListComponent implements OnInit {

  // menuIndex!: NavEvent;
  // private filter!: Filter;
  // catFilter = ['Selecciona una categoría','Pulse sobre éste link'];

  catView = false;
  catList!: CatTree[];

  constructor(
    public storage: LocalstorageService,
    private nvg: NavObserverService,
    private dg: DialogService,
    private snkBar: MatSnackBar,
    private http_omv: HttpQuoteService) {
  }

  async ngOnInit() {

    // await this.http_omv.getMARPICO();
    if (this.storage.itemList2Show.length === 0) {
      
      this.catView = true;
      this.storage.selMenu = [0, 0];
      title: 'Marpico';
      this.storage.filter = { seltype: 0, catFilter: ['Seleccione una categoría', '...'] };
      await this.http_omv.getMARPICOCatsDataPromise('MARPICO');
      this.catList = this.storage.categTree;


      // this.onSelected(this.storage.selMenu);
    }
  }

  onFilterSelected(filter: Filter) {
    debugger;
    // console.log(filter);
    this.storage.filter = filter;
    this.catView = false;
    
  }

  itemClicked(item: Item) {

    if (item.tag === 'select_ADV' || item.tag === 'select') {
      this.storage.selItem = item;
      if (item.tag === 'select_ADV') {
        this.snkBar.open('Debe seleccionar un color o estilo', 'Ok', { duration: 5000 });
      }
      this.nvg.onRouteDetail(item.descripcion_comercial, '', 'itemdeta', true);
    } else {
      this.add2WishList(item);
    }

  }

  async onSelected(event: any) {
    this.nvg.showProgress = true;
    switch (this.storage.selMenu[1]) {

      case 0: // Marpico
        title: 'Marpico';
        this.storage.filter = { seltype: 0, catFilter: ['Seleccione una categoría', '...'] };
        await this.http_omv.getMARPICOCatsDataPromise('MARPICO');
        break;

      case 1: // OMV
        title: 'omv';
        this.storage.filter = { seltype: 0, catFilter: ['Seleccione una categoría', '...'] };
        await this.http_omv.getOMVCatsDataPromise('OMV');

        break;


    }
    this.nvg.showProgress = false;
    this.getCat();

  }

  async onCatWishSel() {

    switch (this.storage.filter.catalogTitle) {
      case 'MARPICO': // Marpico
        await this.http_omv.getMARPICOCatsDataPromise('MARPICO');
        break;
      case 'OMV': // OMV
        await this.http_omv.getOMVCatsDataPromise('OMV');
        break;
    }
  }

  getCat() {
    // const h = this.storage.screenShort ? 0 : 400;
    
    if (this.storage.itemList2Show.length > 0) {
      const ddta: DialogData = {
        title: 'Seleccionar Categoría/Subcategoría ',
        tag: '1',
        // dgheigth: h,
        value: this.storage.categTree,
      }
      this.dg.aShowCateg(ddta).subscribe((result: any) => {

        if (result) {
          debugger;
          this.storage.filter = result as Filter;
          this.catView = false;
        }
      });
    } else {
      this.snkBar.open('Seleccione el catálogo de su preferencia', 'Ok', { duration: 3000 });
    }
  }

  filterItem(item: Item): boolean {

    switch (this.storage.filter.seltype) {
      case 0:
        return item.subcategoria_1.categoria.nombre === this.storage.filter.catFilter[0] && item.subcategoria_1.nombre === this.storage.filter.catFilter[1];
        break;
      case 1: // Elementos por nombre o id
        if (this.storage.filter.find) {
          if (item.familia.toUpperCase().includes(this.storage.filter.find.toUpperCase())) return true;
          return item.descripcion_comercial.toUpperCase().includes(this.storage.filter.find.toUpperCase());
        }
        return true;
        break;
      case 2:
        return item.familia === this.storage.filter.familia;
        break;

    }
    return false;
  }

  add2WishList(item: Item) {
    this.storage.addWishQuote('0', item);
  }

}
