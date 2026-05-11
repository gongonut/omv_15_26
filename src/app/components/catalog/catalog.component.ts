import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CatTree, Filter, LocalstorageService } from '../../services/localstorage.service';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {

  constructor(private storage: LocalstorageService) {}

  @Input() catList!: CatTree[];
  @Output() filterSelected = new EventEmitter<Filter>();
  showFltr = false;

  getImage(cat: CatTree): string {    
    return `${this.storage.QUOTE_SERVER + 'catalog/'}${this.removeAccents(cat.categ)}.PNG`;
  }

  private removeAccents(str: string) {
    
    str = str.replaceAll(/,/g,'').toUpperCase();
    str = str.replaceAll(' ','_');
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

  onShowFilter() {
    this.showFltr = !this.showFltr;
  }

  onSelSub(tit: string, sub: string) {
    console.log('CatalogComponent onSelSub', tit, sub);
    const filter: Filter = {seltype: 0, catFilter: [tit,sub]};
    
    this.filterSelected.emit(filter);
  }

}
