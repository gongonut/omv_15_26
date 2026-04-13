import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DialogData, DialogService } from '../../services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgxImageCompressService} from 'ngx-image-compress';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { DynamicFormComponent, JsonFormData } from '../../components/dynamic-form/dynamic-form.component';
import { LocalstorageService } from '../../services/localstorage.service';
import { Item } from '../../datatypes';

@Component({
  selector: 'app-cotiza-dialog',
  templateUrl: './cotiza-dialog.component.html',
  styleUrls: ['./cotiza-dialog.component.scss'],
  imports: [MatIcon, DecimalPipe, DynamicFormComponent, MatCheckbox]
})
export class CotizaDialogComponent implements OnInit {

  cotizaData: JsonFormData = {
    controls: [
      {
        name: 'client_name',
        label: 'Nombres de la empresa:',
        type: 'text',
        style: 'w-full',
        validators: { required: true }
      },
      {
        name: 'client_contact',
        label: 'Nombre del contacto:',
        type: 'text',
        style: 'w-full',
        validators: { }
      },
      {
        name: 'client_contact_position',
        label: 'Cargo:',
        type: 'text',
        style: 'w-full',
        validators: { }
      },
      {
        name: 'client_contact_city',
        label: 'Ciudad:',
        type: 'text',
        validators: { }
      },
      {
        name: 'client_phone',
        label: 'Teléfono:',
        type: 'text',
        style: 'w-full',
        validators: {required: true}
      },
      {
        name: 'client_email',
        label: 'Correo:',
        type: 'text',
        style: 'w-full',
        validators: { required: true }
      },
      {
        name: 'client_observations',
        label: 'Observaciones:',
        type: 'textarea',
        style: 'w-full',
        totalRows: 4,
        // sideBtn: 'insert_photo',
        validators: {}
      },
      /*
      {
        name: 'ok',
        label: 'Acepto términos y condiciones establecidos en la cotización',
        type: 'checkbox',
        validators: { required: true }
      },
      
      {
        name: 'newUsr',
        label: 'Nuevo usuario',
        type: 'checkbox',
        validators: { }
      }
      */
    ]
  }

  page = 0;
  result!: any;
  valid = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CotizaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private storage: LocalstorageService,
    private snkBar: MatSnackBar,
    private dg: DialogService,
    @Inject(NgxImageCompressService) private imageCompress: NgxImageCompressService,
    private sanitizer: DomSanitizer,
    ) {
    // data.schema = this.cotizaData;
    dialogRef.disableClose = true;
    
  }
  ngOnInit(): void {
    
    if (this.data.value.itemList.error && this.data.value.itemList.error.length > 0) {
      this.snkBar.open(this.data.value.itemList.error.length, 'Ok', { duration: 3000 })
    }
  }

  onGetData(result: any) {
    
    this.result = result;
    this.valid = result['_valid_'];
    this.getValidCotiza();
  }

  getValidCotiza() {
    
    let b = true;
    if (this.data.tag === '0') {this.valid = true; return; } // Lista de deseos
    this.data.value.itemList.forEach((ct: Item) => {
      if (ct.itemTag && ct.itemTag.cantidad) {
        b = (b && ct.itemTag.cantidad > 0);
        if (ct.itemTag.cantidad > ct.materiales[0].inventario) {
          b = false;
          this.snkBar.open(`La cantidad solicitada de ${ct.descripcion_comercial} es superior a la existencia (Inventario: ${ct.materiales[0].inventario})`, 'Ok', { duration: 3000 })
        }
      } else {b = false;}
    })
    this.valid = this.valid && b;
  }

  getImage(item: Item): string {
    if (item.materiales[0].imagenes.length > 0 ) return item.materiales[0].imagenes[0];
    return item.imagen;
    
    /*
    if (item.materiales[0].imagenes.length > 0 && item.materiales[0].imagenes[0].imagen.file_sm) return item.materiales[0].imagenes[0].imagen.file_sm;
    return item.imagen.imagen.file_sm;
    */
  }

  onGetItem(item: Item) {
    this.storage.filter = {seltype: 2, familia: item.familia, catalogTitle: item.itemTag?.origen, catFilter: ['Producto',item.descripcion_comercial]}
    this.close()
  }

  getExist(item: Item) {
    if (this.data.tag === '0') {return 1}  
    return item.materiales[0].inventario || 0;

  }

  onChangeVal(e: any, item: Item) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    if (item.itemTag) {
      item.itemTag.cantidad = e.target.value;
      this.getValidCotiza();
    }
  }

  onDelete(i: number) {

    this.snkBar.open(`Eliminar: "${this.data.value.itemList[i].descripcion_comercial} de la Lista?"`, 'Eliminar', { duration: 3000 })
      .onAction().subscribe(ok => {
        this.data.value.itemList.splice(i, 1);
        // this.storage.saveWishQuote();
      });
  }

  
  onSelPage() {
    this.page = this.page === 0 ? 1 : 0;
    this.dg.updatePropResult(this.data.value, this.result);
  }

  btnName(): string {
    if (this.page === 0) { return 'Datos del cotizante' }
    return 'Lista Cotización'

  }

  fileChangeEvent() {
    
    this.imageCompress.uploadFile().then(
      ({ image, orientation }) => {

        // this.imgResult = image;
        // console.log("Size in bytes of the uploaded image was:", this.imageCompress.byteCount(image));
        // this.link = image; // TRATAR ESTE TEMA DEL LINK
        this.imageCompress
          .compressFile(image, orientation, 100, 100, 550, 550) // 50% ratio, 50% quality
          .then(
            (compressedImage) => {
              // this.imgResult = compressedImage;
              this.data.value.crome_image = compressedImage;
              // console.log("Size in bytes after compression is now:", this.imageCompress.byteCount(compressedImage));
            }
          );
      }
    );
   
  }

  getComImage(): any {
    return this.sanitizer.bypassSecurityTrustUrl(this.data.value.crome_image);
  }

  ok(ok: boolean) {
    this.data.value.ok = ok;
    this.valid = this.valid && ok;
  }

  close() {
    
    if (this.result) {this.dg.updatePropResult(this.data.value, this.result);}
    // this.data.value.status = 0;
    this.dialogRef.close(this.data.value);
  }

  onAccept() {
    
    if (this.result) {this.dg.updatePropResult(this.data.value, this.result);}
    if (!this.data.value.client_contact || this.data.value.client_contact.length == 0) {
      this.data.value.client_name = this.data.value.client_contact;
    }
    
    this.data.value.status = 1;
    this.dialogRef.close(this.data.value);
  }

  
  /*
  onGetItem(item: Item) {
    if (this.result) {this.dg.updatePropResult(this.data.value, this.result);}
    this.storage.filter.seltype = 2;
    this.storage.filter.familia = item.familia;
    this.dialogRef.close();
    
  }
  */

}
