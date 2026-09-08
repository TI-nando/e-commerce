import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
      <div
        class="h-8 w-8 animate-spin rounded-full border-2 border-base-600 border-t-accent"
        role="status"
        aria-label="Carregando"
      ></div>
      <p class="font-mono text-xs uppercase tracking-wider">{{ label() }}</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly label = input('Carregando…');
}
