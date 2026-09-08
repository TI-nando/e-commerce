import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InventoryReservation, Order } from '../../core/models';
import { OrderService } from '../../core/services/order.service';
import { InventoryService } from '../../core/services/inventory.service';
import { OrdersPanelComponent } from './orders-panel/orders-panel.component';
import { InventoryPanelComponent } from './inventory-panel/inventory-panel.component';
import { EventConnectorComponent } from './event-connector/event-connector.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';

const POLL_INTERVAL_MS = 3000;
const HIGHLIGHT_DURATION_MS = 1800;
const PULSE_DURATION_MS = 1400;

type LoadState = 'loading' | 'error' | 'ready';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    OrdersPanelComponent,
    InventoryPanelComponent,
    EventConnectorComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-4 py-10">
      <header class="mb-8">
        <p class="font-mono text-xs uppercase tracking-wide text-accent">Sistema distribuído</p>
        <h1 class="mt-1 text-3xl font-semibold text-ink-100">Dashboard de eventos</h1>
        <p class="mt-2 max-w-2xl text-sm text-ink-500">
          Atualiza a cada {{ pollSeconds }}s. Quando um pedido novo aparece à esquerda e o
          RabbitMQ entrega o evento <code class="font-mono text-accent">ORDER_CREATED</code>,
          uma reserva de estoque correspondente surge à direita — o pulso azul mostra
          esse trajeto acontecendo.
        </p>
      </header>

      @switch (state()) {
        @case ('loading') {
          <app-loading-spinner label="Sincronizando com os microsserviços…" />
        }
        @case ('error') {
          <app-empty-state
            icon="⚠"
            title="Não foi possível carregar o dashboard"
            description="Confira se o order-service (8082) e o inventory-service (8083) estão no ar."
          />
        }
        @case ('ready') {
          <div class="flex flex-col items-stretch gap-4 lg:flex-row">
            <div class="min-w-0 flex-1">
              <app-orders-panel [orders]="orders()" [recentOrderIds]="recentOrderIds()" />
            </div>

            <app-event-connector [pulses]="pulses()" />

            <div class="min-w-0 flex-1">
              <app-inventory-panel
                [reservations]="reservations()"
                [recentReservationIds]="recentReservationIds()"
              />
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class DashboardComponent {
  private readonly orderService = inject(OrderService);
  private readonly inventoryService = inject(InventoryService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pollSeconds = POLL_INTERVAL_MS / 1000;

  protected readonly orders = signal<Order[]>([]);
  protected readonly reservations = signal<InventoryReservation[]>([]);
  protected readonly state = signal<LoadState>('loading');

  protected readonly recentOrderIds = signal<Set<number>>(new Set());
  protected readonly recentReservationIds = signal<Set<number>>(new Set());
  protected readonly pulses = signal<number[]>([]);

  private seenOrderIds = new Set<number>();
  private seenReservationIds = new Set<number>();
  private isFirstLoad = true;
  private pulseCounter = 0;

  constructor() {
    timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => forkJoin([this.orderService.list(), this.inventoryService.listReservations()])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ([orders, reservations]) => this.applySnapshot(orders, reservations),
        error: () => this.state.set('error'),
      });
  }

  private applySnapshot(orders: Order[], reservations: InventoryReservation[]): void {
    const newOrderIds = orders.map((o) => o.id).filter((id) => !this.seenOrderIds.has(id));
    const newReservations = reservations.filter((r) => !this.seenReservationIds.has(r.id));

    orders.forEach((o) => this.seenOrderIds.add(o.id));
    reservations.forEach((r) => this.seenReservationIds.add(r.id));

    this.orders.set([...orders].sort((a, b) => b.id - a.id));
    this.reservations.set([...reservations].sort((a, b) => b.id - a.id));
    this.state.set('ready');

    // Na primeira carga não animamos nada (evita "piscar" a tela toda ao abrir a página).
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }

    if (newOrderIds.length > 0) {
      this.highlight(this.recentOrderIds, newOrderIds);
    }

    if (newReservations.length > 0) {
      this.highlight(
        this.recentReservationIds,
        newReservations.map((r) => r.id),
      );
      newReservations.forEach(() => this.firePulse());
    }
  }

  private highlight(target: typeof this.recentOrderIds, ids: number[]): void {
    target.update((current) => new Set([...current, ...ids]));
    setTimeout(() => {
      target.update((current) => {
        const next = new Set(current);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }, HIGHLIGHT_DURATION_MS);
  }

  private firePulse(): void {
    const id = this.pulseCounter++;
    this.pulses.update((list) => [...list, id]);
    setTimeout(() => {
      this.pulses.update((list) => list.filter((p) => p !== id));
    }, PULSE_DURATION_MS);
  }
}
