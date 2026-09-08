import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InventoryReservation } from '../../../core/models';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-inventory-panel',
  standalone: true,
  imports: [DatePipe, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card flex h-full flex-col p-5">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <p class="font-mono text-xs uppercase tracking-wide text-accent">Inventory Service · :8083</p>
          <h2 class="text-lg font-semibold text-ink-100">Reservas de estoque</h2>
        </div>
        <span class="badge badge-success font-mono">{{ reservations().length }} registros</span>
      </header>

      @if (reservations().length === 0) {
        <app-empty-state
          icon="◇"
          title="Nenhuma reserva ainda"
          description="Assim que um evento ORDER_CREATED for consumido pelo RabbitMQ, a reserva aparece aqui."
        />
      } @else {
        <ul class="flex flex-col gap-2 overflow-auto">
          @for (reservation of reservations(); track reservation.id) {
            <li
              class="flex items-center justify-between rounded-lg border border-base-700 bg-base-900 px-3 py-2.5 text-sm"
              [class.animate-row-flash]="isRecent(reservation.id)"
              [attr.data-reservation-row]="reservation.id"
            >
              <div>
                <p class="font-mono text-xs text-ink-500">
                  reserva #{{ reservation.id }} · pedido #{{ reservation.orderId }}
                </p>
                <p class="text-ink-100">produto #{{ reservation.productId }} · {{ reservation.reservedQuantity }}x</p>
              </div>
              <div class="text-right">
                <span class="badge badge-success">reservado</span>
                <p class="mt-1 font-mono text-[11px] text-ink-500">
                  {{ reservation.reservedAt | date: 'HH:mm:ss' }}
                </p>
              </div>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class InventoryPanelComponent {
  readonly reservations = input.required<InventoryReservation[]>();
  readonly recentReservationIds = input<Set<number>>(new Set());

  protected isRecent(id: number): boolean {
    return this.recentReservationIds().has(id);
  }
}
