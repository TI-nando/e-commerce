import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { finalize } from 'rxjs';
import { Product } from '../../../core/models';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';

export interface CheckoutModalData {
  product: Product;
}

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card w-[min(92vw,26rem)] p-6">
      <header class="mb-4 flex items-start justify-between gap-4">
        <div>
          <p class="font-mono text-xs uppercase tracking-wide text-ink-500">Novo pedido</p>
          <h2 class="text-lg font-semibold text-ink-100">{{ data.product.name }}</h2>
        </div>
        <button
          type="button"
          class="text-ink-500 hover:text-ink-100"
          (click)="dialogRef.close()"
          aria-label="Fechar"
        >
          ✕
        </button>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
        <div>
          <label class="field-label" for="quantity">Quantidade</label>
          <input
            id="quantity"
            type="number"
            min="1"
            class="field-input"
            formControlName="quantity"
          />
          @if (quantity.invalid && quantity.touched) {
            <p class="field-error">
              @if (quantity.errors?.['required']) {
                Informe a quantidade.
              } @else if (quantity.errors?.['min']) {
                A quantidade deve ser maior que zero.
              }
            </p>
          }
        </div>

        <div>
          <label class="field-label" for="customerName">Nome do cliente</label>
          <input
            id="customerName"
            type="text"
            class="field-input"
            placeholder="Ex: Maria Silva"
            formControlName="customerName"
          />
          @if (customerName.invalid && customerName.touched) {
            <p class="field-error">Informe o nome do cliente.</p>
          }
        </div>

        <div class="flex items-center justify-between rounded-lg bg-base-900 px-3 py-2.5 text-sm">
          <span class="text-ink-500">Total estimado</span>
          <span class="font-mono font-medium text-ink-100">
            {{ (data.product.price * (quantity.value || 0)) | currency: 'BRL' }}
          </span>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" class="btn-secondary flex-1" (click)="dialogRef.close()">
            Cancelar
          </button>
          <button type="submit" class="btn-primary flex-1" [disabled]="submitting()">
            @if (submitting()) {
              Enviando…
            } @else {
              Confirmar pedido
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CheckoutModalComponent {
  protected readonly dialogRef = inject(DialogRef<Product | null>);
  protected readonly data = inject<CheckoutModalData>(DIALOG_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);

  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    quantity: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
    customerName: this.fb.nonNullable.control('', [Validators.required]),
  });

  protected get quantity() {
    return this.form.controls.quantity;
  }

  protected get customerName() {
    return this.form.controls.customerName;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.orderService
      .create({
        productId: this.data.product.id,
        quantity: this.form.getRawValue().quantity,
        customerName: this.form.getRawValue().customerName,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(
            'Pedido criado! O estoque será reservado de forma assíncrona via RabbitMQ — acompanhe no Dashboard.',
          );
          this.dialogRef.close(this.data.product);
        },
        error: () => {
          // O toast de erro genérico já é disparado pelo interceptor global;
          // aqui só mantemos o modal aberto pra o usuário poder tentar de novo.
        },
      });
  }
}
