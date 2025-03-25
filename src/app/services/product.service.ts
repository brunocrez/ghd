import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API = 'http://localhost:3000/products';
  private http = inject(HttpClient);

  load(order = 'asc', nameFilter = ''): Observable<Product[]> {
    const params = new HttpParams()
      .set('_sort', 'name')
      .set('_order', order)
      .set('name_like', nameFilter);

    return this.http.get<Product[]>(this.API, { params });
  }
}
