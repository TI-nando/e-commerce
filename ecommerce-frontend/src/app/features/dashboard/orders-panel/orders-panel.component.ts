import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Order } from '../../../core/models';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-orders-panel',
  standalone: true,
  imports: [DatePipe, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card flex h-full flex-col p-5">
      <header class="mb-4 flex items-center justify-between">
        <div>
          <p class="font-mono text-xs uppercase tracking-wide text-accent">Order Service · :8082</p>
          <h2 class="text-lg font-semibold text-ink-100">Pedidos</h2>
        </div>
        <span class="badge badge-pending font-mono">{{ orders().length }} registros</span>
      </header>

      @if (orders().length === 0) {
        <app-empty-state icon="◇" title="Nenhum pedido ainda" description="Crie um pedido na vitrine para vê-lo aqui." />
      } @else {
        <ul class="flex flex-col gap-2 overflow-auto">
          @for (order of orders(); track order.id) {
            <li
              class="flex items-center justify-between rounded-lg border border-base-700 bg-base-900 px-3 py-2.5 text-sm"
              [class.animate-row-flash]="isRecent(order.id)"
              [attr.data-order-row]="order.id"
            >
              <div>
                <p class="font-mono text-xs text-ink-500">#{{ order.id }} · produto #{{ order.productId }}</p>
                <p class="text-ink-100">{{ order.customerName }} · {{ order.quantity }}x</p>
              </div>
              <div class="text-right">
                <span
                  class="badge"
                  [class.badge-pending]="order.status === 'CREATED'"
                  [class.badge-success]="order.status !== 'CREATED'"
                >
                  {{ order.status }}
                </span>
                <p class="mt-1 font-mono text-[11px] text-ink-500">{{ order.createdAt | date: 'HH:mm:ss' }}</p>
              </div>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class OrdersPanelComponent {
  readonly orders = input.required<Order[]>();
  readonly recentOrderIds = input<Set<number>>(new Set());

  protected isRecent(id: number): boolean {
    return this.recentOrderIds().has(id);
  }
}
