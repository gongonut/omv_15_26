import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CotizaDialogComponent } from '../modal/cotiza-dialog/cotiza-dialog.component';
import { JsonFormData } from '../components/dynamic-form/dynamic-form.component';
import { CategoDialogComponent } from '../modal/catego-dialog/catego-dialog.component';

export interface DialogData {
  title?: string;
  description?: string;
  schema?: JsonFormData;
  value?: any;
  file?: boolean;
  bfile?: boolean;
  tag?: string; // Opciones externas. En este caso 0 Deseos 1 Cotiza  2 Cotizar
  newUsr?: boolean;
  dgwidth?: number;
  dgheight?: number;
  imgwidth?: number;
  imgheight?: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public dialogRef: MatDialogRef<CotizaDialogComponent | CategoDialogComponent> | undefined;

  constructor(public dialog: MatDialog) { }

   aactualQuote(adata: DialogData) { 
    const dgsize = this.dialogsize(adata.dgheight, adata.dgwidth);
    this.dialogRef = this.dialog.open(CotizaDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: dgsize.dheight,
      width: dgsize.dwidth,
      data: adata
    });
    return this.dialogRef.afterClosed();
  }

  aShowCateg(adata: DialogData) { 
    const dgsize = this.dialogsize(adata.dgheight, adata.dgwidth);
    this.dialogRef = this.dialog.open(CategoDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: dgsize.dheight,
      width: dgsize.dwidth,
      data: adata
    });
    return this.dialogRef.afterClosed();
  }

  openQuoteDialog(adata: DialogData): Observable<any> { 
    const dgsize = this.dialogsize(adata.dgheight, adata.dgwidth);
    this.dialogRef = this.dialog.open(CotizaDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: dgsize.dheight,
      width: dgsize.dwidth,
      data: adata
    }) as MatDialogRef<CotizaDialogComponent>; // Cast to specific type
    return this.dialogRef.afterClosed();
  }

  openCategoryDialog(adata: DialogData): Observable<any> { 
    const dgsize = this.dialogsize(adata.dgheight, adata.dgwidth);
    this.dialogRef = this.dialog.open(CategoDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: dgsize.dheight,
      width: dgsize.dwidth,
      data: adata
    }) as MatDialogRef<CategoDialogComponent>; // Cast to specific type
    return this.dialogRef.afterClosed();
  }

  updatePropResult(obj: any, propVal: any): any {
    if (!propVal) return;
    Object.keys(propVal).forEach(key => {
      // if (obj.hasOwnProperty(key)) { obj[key] = propVal[key] }
      if(propVal[key] !== null && propVal[key] !== undefined) {obj[key] = propVal[key]; }
    });
    return obj;
  }

  private dialogsize(dgheight?: number, dgwidth?: number) {
    let maxheight = window.innerHeight - 20;
    dgheight = dgheight ?? maxheight; // Use nullish coalescing operator
    maxheight = maxheight > dgheight ? dgheight : maxheight;

    let maxwidth = (window.innerWidth - 20);
    dgwidth = dgwidth ?? maxwidth; // Use nullish coalescing operator
    maxwidth = maxwidth > dgwidth ? dgwidth : maxwidth;

    return { dheight: maxheight.toString() + 'px', dwidth: maxwidth.toString() + 'px' } as const
  }
}
