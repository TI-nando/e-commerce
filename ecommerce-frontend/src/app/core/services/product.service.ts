import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models';

/**
 * Isola toda comunicação HTTP com o product-service (porta 8081).
 * Note que o caminho é relativo ("/api/products") — quem decide para
 * onde isso vai de verdade é o proxy.conf.json em modo dev (e, em produção,
 * um API Gateway/reverse proxy real faria esse papel).
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/products';

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}
