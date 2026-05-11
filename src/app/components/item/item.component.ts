import { DecimalPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../../datatypes';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  imports: [DecimalPipe, MatIconModule]
})
export class ItemComponent {

  readonly COLORS = ['bg-lime-200', 'bg-amber-200', 'bg-teal-200', 'bg-purple-200'];

  @Input() item!: Item;
  @Output() onClicked = new EventEmitter<Item>();

  getImage(): string {
    console.log('ItemComponent getImage', this.item);
    // if (this.item.imagen && this.item.imagen.imagen && this.item.imagen.imagen.file_sm) { return this.item.imagen.imagen.file_sm || ''; }
    if (this.item.imagen && this.item.imagen.length > 0) { return this.item.imagen; }
    return '';
  }

  /*
  ongetItemBarColor(): string {
    const i = Math.floor(Math.random() * 4);
    return `h-11 w-56 p-2 flex ${this.COLORS[i]} rounded-b-sm`;
  }
  */

  onClick() {
    
    this.item.tag = 'select';
    console.log('ItemComponent onClick', this.item);
    this.onEmit();
  }

  onClickADV() {
    
    this.item.tag = 'select_ADV';
    this.onEmit();
  }

  add2Favorite() {
    this.item.tag = 'add2Favorite';
    this.onEmit();
    /*
    if (this.storage.addactualFavorite(this.storage.selItem, this.selMaterial)) {
      this.snkBar.open('Agregado a la lista de Favoritos', 'Ok', { duration: 3000 });
    } else {
      this.snkBar.open('No existe inventario', 'Ok', { duration: 3000 });
    }
    */
  }

  private onEmit() {
    this.onClicked.emit(this.item);
  }

  getDescArea() {
    return this.item.lista_colores && this.item.lista_colores.length > 0? 'Colores disponibles: ' + this.item.lista_colores : this.item.descripcion_larga
  }

}
