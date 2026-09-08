import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Este é o "elemento de assinatura" do dashboard: uma linha tracejada entre
 * o painel de Pedidos e o de Estoque, com um pulso viajando da esquerda pra
 * direita toda vez que um novo evento ORDER_CREATED é consumido.
 *
 * A ideia pedagógica: em vez de só listar dois arrays lado a lado e deixar
 * o usuário inferir a relação entre eles, tornamos o fluxo assíncrono
 * literalmente visível — é a arquitetura de eventos "acontecendo" na tela.
 *
 * Cada elemento da lista `pulses` é um evento em trânsito. Usamos @for com
 * `track` no próprio id (não em índice) para que o Angular sempre crie um
 * nó de DOM novo por pulso — é isso que garante que a animação CSS
 * (@keyframes packet) reinicie do zero a cada evento, em vez de "grudar"
 * num elemento reaproveitado.
 */
@Component({
  selector: 'app-event-connector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative hidden h-full w-14 shrink-0 flex-col items-center justify-center lg:flex">
      <div class="h-full w-px border-l border-dashed border-base-600"></div>

      <div class="absolute left-0 top-1/2 h-0 w-full -translate-y-1/2">
        @for (pulseId of pulses(); track pulseId) {
          <div
            class="absolute top-1/2 h-3 w-3 rounded-full bg-accent
                   shadow-[0_0_12px_2px_rgba(76,158,255,0.7)] animate-packet"
          ></div>
        }
      </div>

      <span
        class="absolute rounded-full bg-base-950 px-1.5 py-0.5 font-mono text-[10px] text-ink-500"
        style="top: 100%; margin-top: 0.5rem; white-space: nowrap;"
      >
        RabbitMQ
      </span>
    </div>
  `,
})
export class EventConnectorComponent {
  /** Lista de eventos atualmente "em trânsito" visualmente. */
  readonly pulses = input<number[]>([]);
}
