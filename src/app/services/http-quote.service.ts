import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CotizaWish, Etiqueta, Item } from '../datatypes';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { catchError } from 'rxjs/operators';

// Define an interface for the API response structure if it's consistent
interface CatalogResponse {
  data: Item[];
}

@Injectable({
  providedIn: 'root'
})
export class HttpQuoteService {

  constructor(private httpq: HttpClient, private storage: LocalstorageService) { }

  getHeader() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // withCredentials: true
    };
  }

  getQuotes(): Observable<CotizaWish[]> {
    return this.httpq.get<CotizaWish[]>(`${this.storage.QUOTE_SERVER}quote/findAll`);
  }
  getQuote(id: string): Observable<CotizaWish> {
    return this.httpq.get<CotizaWish>(`${this.storage.QUOTE_SERVER}quote/findOne/${id}`);
  }

  createQuote(quote: CotizaWish): Observable<CotizaWish> {
    quote.date = new Date().getTime();
    return this.httpq.post<CotizaWish>(`${this.storage.QUOTE_SERVER}quote`, quote, this.getHeader());
  }

  deleteQuote(id: string): Observable<CotizaWish> {
    return this.httpq.delete<CotizaWish>(`${this.storage.QUOTE_SERVER}quote/delete?id=${id}`, this.getHeader());
  }

  updateQuote(id: string, quote: CotizaWish): Observable<CotizaWish> {
    return this.httpq.put<CotizaWish>(`${this.storage.QUOTE_SERVER}quote/update?id=${id}`, quote, this.getHeader());
  }

  // ....................................................................................

  getOMVCats(): Observable<CatalogResponse> {
    return this.httpq.get<CatalogResponse>(`${this.storage.QUOTE_SERVER}catalog`);
  }

  getOMARPICOCats(): Observable<Item[]> { // Assuming marpico returns Item[] directly
    return this.httpq.get<Item[]>(`${this.storage.QUOTE_SERVER}marpico`);
  }

  getOMVCatsFromTxt(): Observable<Item[]> {
    return this.httpq.get<Item[]>(`${this.storage.QUOTE_SERVER}catalog/txtdatabs`);
  }

  private async _getCatsDataPromise(catName: string, fetchObservable: Observable<any>, resolveFn: (items: Item[]) => Promise<void> | void): Promise<boolean> {
    if (this.storage.selCatalogTitle === catName && this.storage.itemList2Show.length > 0) {
      return true;
    }
    try {
      const data = await firstValueFrom(fetchObservable);
      // Adjust based on actual API response structure
      this.storage.itemList2Show = (data.data || data) as Item[]; 
      if (this.storage.itemList2Show.length > 0) {
        await Promise.resolve(resolveFn(this.storage.itemList2Show)); // Ensure it's a promise
      }
      this.storage.selCatalogTitle = catName;
      return true;
    } catch (err) {
      console.error(`Error fetching ${catName} cats:`, err);
      return false;
    }
  }

  async getOMVCatsDataPromise(catName: string): Promise<boolean> {
    return this._getCatsDataPromise(catName, this.getOMVCats(), this.storage.resolveDataOMV.bind(this.storage));
  }

  async getMARPICOCatsDataPromise(catName: string) {
    if (this.storage.selCatalogTitle === catName && this.storage.itemList2Show.length > 0) {
      return true;
    }
    try {
      const data = await firstValueFrom(this.getOMARPICOCats());
      this.storage.itemList2Show = data as Item[];
      // CORRECCIÓN: Llamar al resolver de MARPICO
      if (this.storage.itemList2Show.length > 0) { await this.storage.resolveDataMARPICO(this.storage.itemList2Show); }
      this.storage.selCatalogTitle = catName;
      return true;
    } catch (err) {
      console.error('Error fetching MARPICO cats:', err);
      return false;
    }
  }

  // ........................... GENERAL GENERAL MARPICO .................................

  /*
  async getMARPICO() {    
    const pr = await firstValueFrom(
      this.httpq.get<any>(`${this.storage.QUOTE_SERVER}general/marpico/`)
    )
    return this.storage.marpicoCatTitleList = pr.data;
  }
  */

}
