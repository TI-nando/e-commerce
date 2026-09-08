import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

/**
 * Serviço simples de notificações "toast". Usamos um signal com um array
 * em vez de um Subject porque o componente <app-toast> só precisa
 * *ler* o estado atual — não há necessidade de RxJS aqui.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private nextId = 0;

  success(message: string): void {
    this.push(message, 'success');
  }

  error(message: string): void {
    this.push(message, 'error');
  }

  info(message: string): void {
    this.push(message, 'info');
  }

  dismiss(id: number): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(message: string, variant: ToastVariant): void {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, message, variant }]);
    setTimeout(() => this.dismiss(id), 5000);
  }
}
