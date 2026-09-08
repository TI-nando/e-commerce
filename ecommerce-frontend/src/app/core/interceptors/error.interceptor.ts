import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Interceptor funcional (padrão Angular 15+, dispensa classes com @Injectable).
 * Registrado em app.config.ts via provideHttpClient(withInterceptors([...])).
 *
 * Responsabilidade: dar um feedback visual PADRÃO sempre que uma chamada HTTP
 * falhar, sem que cada componente precise reimplementar essa lógica.
 * Continuamos relançando o erro (throwError) para que os componentes ainda
 * possam reagir localmente quando precisarem (ex: mostrar um empty-state).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const serviceName = describeService(req.url);

      if (error.status === 0) {
        // status 0 = requisição nem chegou a ter resposta: serviço fora do ar,
        // banco de dados indisponível, ou RabbitMQ derrubando a aplicação no startup.
        toast.error(`Não foi possível conectar ao ${serviceName}. Ele está rodando?`);
      } else if (error.status >= 500) {
        toast.error(`${serviceName} respondeu com um erro interno (${error.status}).`);
      } else if (error.status === 404) {
        toast.error(`${serviceName}: recurso não encontrado.`);
      } else if (error.status >= 400) {
        toast.error(`Requisição inválida para o ${serviceName} (${error.status}).`);
      }

      return throwError(() => error);
    }),
  );
};

function describeService(url: string): string {
  if (url.includes('/api/products')) return 'Product Service';
  if (url.includes('/api/orders')) return 'Order Service';
  if (url.includes('/api/inventory')) return 'Inventory Service';
  return 'serviço';
}
