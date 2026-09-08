import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-base-600 py-16 text-center">
      <span class="text-2xl">{{ icon() }}</span>
      <p class="font-medium text-ink-100">{{ title() }}</p>
      @if (description()) {
        <p class="max-w-sm text-sm text-ink-500">{{ description() }}</p>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input('◇');
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
