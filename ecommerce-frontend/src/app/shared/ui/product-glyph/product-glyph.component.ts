import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { gradientFor, initialsFor } from '../../utils/placeholder.util';

/**
 * Placeholder criativo para produtos sem foto: um bloco com gradiente
 * determinístico (mesmo nome = mesma cor sempre) + monograma + um ícone
 * de "linha de grade" sutil no fundo, remetendo a um diagrama técnico —
 * consistente com a identidade visual "painel de sistema" do resto da app.
 */
@Component({
  selector: 'app-product-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-t-xl"
      [style.background]="'linear-gradient(135deg, ' + gradient().from + ', ' + gradient().to + ')'"
    >
      <svg class="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="grid-{{ initials() }}" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="white" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" [attr.fill]="'url(#grid-' + initials() + ')'" />
      </svg>
      <span class="font-display text-3xl font-semibold tracking-wide text-white/90">
        {{ initials() }}
      </span>
    </div>
  `,
})
export class ProductGlyphComponent {
  readonly name = input.required<string>();

  protected readonly gradient = computed(() => gradientFor(this.name()));
  protected readonly initials = computed(() => initialsFor(this.name()));
}
