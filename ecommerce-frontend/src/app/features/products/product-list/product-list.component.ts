import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

type ViewState = 'loading' | 'error' | 'empty' | 'ready';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, LoadingSpinnerComponent, EmptyStateComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-6xl px-4 py-10">
      <header class="mb-8">
        <p class="font-mono text-xs uppercase tracking-wide text-accent">Product Service · :8081</p>
        <h1 class="mt-1 text-3xl font-semibold text-ink-100">Vitrine de produtos</h1>
        <p class="mt-2 max-w-xl text-sm text-ink-500">
          Catálogo servido em tempo real pelo microsserviço de produtos. Comprar aqui
          dispara um evento assíncrono processado pelo serviço de estoque — veja o
          resultado no <a routerLink="/dashboard" class="text-accent hover:underline">Dashboard</a>.
        </p>
      </header>

      @switch (state()) {
        @case ('loading') {
          <app-loading-spinner label="Buscando produtos…" />
        }
        @case ('error') {
          <app-empty-state
            icon="⚠"
            title="Não foi possível carregar os produtos"
            description="Confira se o product-service está rodando na porta 8081 e tente novamente."
          />
        }
        @case ('empty') {
          <app-empty-state
            icon="◇"
            title="Nenhum produto cadastrado ainda"
            description="Crie um produto pelo Swagger (localhost:8081/swagger-ui.html) para vê-lo aparecer aqui."
          />
        }
        @case ('ready') {
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @for (product of products(); track product.id) {
              <app-product-card [product]="product" (buy)="openCheckout($event)" />
            }
          </div>
        }
      }
    </section>
  `,
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(Dialog);

  protected readonly products = signal<Product[]>([]);
  protected readonly state = signal<ViewState>('loading');

  constructor() {
    this.load();
  }

  private load(): void {
    this.state.set('loading');
    this.productService.list().subscribe({
      next: (products) => {
        this.products.set(products);
        this.state.set(products.length === 0 ? 'empty' : 'ready');
      },
      error: () => this.state.set('error'),
    });
  }

  protected openCheckout(product: Product): void {
    this.dialog.open(CheckoutModalComponent, {
      data: { product },
      panelClass: 'checkout-dialog-panel',
      backdropClass: 'cdk-overlay-dark-backdrop',
    });
  }
}
