import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border bg-base-800 px-4 py-3 shadow-lg backdrop-blur"
          [class.border-signal-success]="toast.variant === 'success'"
          [class.border-signal-error]="toast.variant === 'error'"
          [class.border-accent]="toast.variant === 'info'"
        >
          <span
            class="text-sm font-medium"
            [class.text-signal-success]="toast.variant === 'success'"
            [class.text-signal-error]="toast.variant === 'error'"
            [class.text-accent]="toast.variant === 'info'"
          >
            {{ toast.message }}
          </span>
          <button
            type="button"
            class="ml-auto shrink-0 text-ink-500 hover:text-ink-100"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
