import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '../../../core/models';
import { ProductGlyphComponent } from '../../../shared/ui/product-glyph/product-glyph.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, ProductGlyphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card group flex flex-col overflow-hidden transition-colors hover:border-accent/50">
      <app-product-glyph [name]="product().name" />

      <div class="flex flex-1 flex-col gap-2 p-4">
        <h3 class="text-base font-semibold text-ink-100">{{ product().name }}</h3>
        <p class="line-clamp-2 flex-1 text-sm text-ink-500">{{ product().description }}</p>

        <div class="mt-2 flex items-center justify-between">
          <span class="font-mono text-lg font-medium text-accent">
            {{ product().price | currency: 'BRL' }}
          </span>
          <button type="button" class="btn-primary" (click)="buy.emit(product())">
            Comprar
          </button>
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly buy = output<Product>();
}
