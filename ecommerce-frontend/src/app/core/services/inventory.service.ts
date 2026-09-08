import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryReservation } from '../models';

/**
 * Isola a comunicação HTTP com o inventory-service (porta 8083).
 * Este serviço nunca é chamado diretamente pelo fluxo de compra —
 * só existe pra podermos "espiar" o resultado do consumo assíncrono
 * do evento no Dashboard.
 */
@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/inventory';

  listReservations(): Observable<InventoryReservation[]> {
    return this.http.get<InventoryReservation[]>(`${this.baseUrl}/reservations`);
  }
}
