import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrderRequest, Order } from '../models';

/**
 * Isola a comunicação HTTP com o order-service (porta 8082).
 * O POST daqui é o gatilho de todo o fluxo assíncrono: ao criar o pedido,
 * o order-service publica ORDER_CREATED no RabbitMQ por conta própria —
 * o front não sabe (nem precisa saber) que o RabbitMQ existe.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/orders';

  list(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  create(payload: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, payload);
  }
}
