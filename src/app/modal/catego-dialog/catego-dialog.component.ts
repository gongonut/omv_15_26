import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogService } from '../../services/dialog.service';
import { CatalogComponent } from '../../components/catalog/catalog.component';
import { CatTree, Filter, LocalstorageService } from '../../services/localstorage.service';


@Component({
  selector: 'app-catego-dialog',
  templateUrl: './catego-dialog.component.html',
  styleUrls: ['./catego-dialog.component.scss'],
  standalone: true,
  imports: [CatalogComponent]
})
export class CategoDialogComponent {

  // @ViewChild('search') search!: ElementRef;
  result: any;
  catList!: CatTree[];
  private svalue = '';
  showFltr = false;

  constructor(
    public dialogRef: MatDialogRef<CategoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private storage: LocalstorageService,
    // private snkBar: MatSnackBar,
    private dg: DialogService) {
      
      this.catList = data.value;
    // data.schema = this.cotizaData;
    // dialogRef.disableClose = true;
    
  }

  onSelSub(tit: string, sub: string) {
    
    const filter: Filter = {seltype: 0, catFilter: [tit,sub]}
    this.dialogRef.close(filter); 
  }

  getValue(event: any) {
    this.svalue = event.target.value;
  }

  onSearch() {
    
    const filter: Filter = {seltype: 1, find: this.svalue, catFilter: ['Filtrar',this.svalue]}
    this.dialogRef.close(filter);
  }
  
  getImage(cat: CatTree): string {
    // console.log(`${this.storage.QUOTE_SERVER + 'catalog/'}${this.removeAccents(cat.categ)}.PNG`)
    
    return `${this.storage.QUOTE_SERVER + 'catalog/'}${this.removeAccents(cat.categ)}.PNG`;
    // return this.storage.QUOTE_SERVER + 'assets/images/empty.png';
  }

  private removeAccents(str: string) {
    
    str = str.replaceAll(/,/g,'').toUpperCase();
    str = str.replaceAll(' ','_');
    
    // str = str.replace(' ','_');
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

  /*
  private removeAccents(str: string) {
    
    str = str.split(' ')[0];
    str = str.replaceAll(/,/g,'').toUpperCase();
    // str = str.replace(' ','_');
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 
  */

  onShowFilter() {
    this.showFltr = !this.showFltr;
  }
  
  onFilterSelected(filter: Filter) {
    
    // console.log(e)
    this.dialogRef.close(filter); 
  }


}
