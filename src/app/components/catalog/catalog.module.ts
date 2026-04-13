import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';


@NgModule({
  imports: [
    CommonModule,
    CatalogRoutingModule,
    CatalogComponent
  ],
  exports: [CatalogComponent]
})
export class CatalogModule { }
