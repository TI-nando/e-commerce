import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-toast />

    <div class="min-h-full">
      <nav class="border-b border-base-700 bg-base-900/80 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a routerLink="/" class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(76,158,255,0.6)]"></span>
            <span class="font-display text-sm font-semibold tracking-wide text-ink-100">
              E-COMMERCE <span class="text-accent">MICROSERVICES</span>
            </span>
          </a>

          <div class="flex items-center gap-1">
            <a
              routerLink="/"
              routerLinkActive="bg-base-800 text-ink-100"
              [routerLinkActiveOptions]="{ exact: true }"
              class="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-100"
            >
              Vitrine
            </a>
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-base-800 text-ink-100"
              class="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-100"
            >
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
