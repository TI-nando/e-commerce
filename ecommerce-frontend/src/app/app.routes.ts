import { Routes } from '@angular/router';

/**
 * Ambas as rotas usam loadComponent (lazy-loading a nível de rota).
 * Cada feature só é baixada pelo navegador quando o usuário navega até ela,
 * o que mantém o bundle inicial pequeno mesmo se o projeto crescer.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
    title: 'Vitrine · E-commerce Microservices',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard · E-commerce Microservices',
  },
  { path: '**', redirectTo: '' },
];
