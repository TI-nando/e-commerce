# E-commerce Microservices — Front-end (Angular)

Interface Angular 18 (Standalone Components + Signals) que consome os três
microsserviços Java (`product-service`, `order-service`, `inventory-service`)
sem passar por um API Gateway — a resolução de rotas é feita via **proxy de
desenvolvimento** (`proxy.conf.json`).

A UI é tratada visualmente como um **painel de observabilidade de sistema
distribuído**: o objetivo é tornar visível, na tela, o fluxo assíncrono de
eventos entre `order-service` → RabbitMQ → `inventory-service`.

## Stack

- Angular 18 (Standalone Components, `@if`/`@for`, Signals)
- TypeScript
- Tailwind CSS
- Angular CDK (`Dialog`) para o modal de checkout
- `ReactiveFormsModule` para o formulário de compra

## Pré-requisitos

- Node.js 18+ (recomendado 20 LTS)
- Os três microsserviços Java rodando localmente:
  - `product-service` → `http://localhost:8081`
  - `order-service` → `http://localhost:8082`
  - `inventory-service` → `http://localhost:8083`

## Instalação e execução

```bash
npm install
npm start
```

`npm start` roda `ng serve` **com o proxy já habilitado** (configurado em
`angular.json`, na seção `architect.serve.options.proxyConfig`). Acesse:

```
http://localhost:4200
```

> Se os microsserviços não estiverem no ar, a aplicação ainda carrega — você
> verá um estado de erro visual em vez de uma tela em branco (veja a seção
> "Tratamento de erros" abaixo).

## Como o proxy resolve o problema de CORS

Sem um API Gateway, o navegador enxergaria 3 origens diferentes
(`localhost:8081`, `8082`, `8083`) e bloquearia as requisições por CORS.
O `proxy.conf.json` resolve isso **só em desenvolvimento**: o próprio
dev-server do Angular intercepta as chamadas e as encaminha no lado do
servidor (onde CORS não se aplica), então o navegador só enxerga uma origem:
`localhost:4200`.

```json
// proxy.conf.json
{
  "/api/products": { "target": "http://localhost:8081", "changeOrigin": true },
  "/api/orders":   { "target": "http://localhost:8082", "changeOrigin": true },
  "/api/inventory":{ "target": "http://localhost:8083", "changeOrigin": true }
}
```

Por isso, em todo o código, as chamadas HTTP usam caminhos relativos como
`/api/products` — nunca `http://localhost:8081/api/products` diretamente.
Isso também significa que, no dia em que você adicionar um API Gateway de
verdade (Spring Cloud Gateway, por exemplo), **o código do front-end não
muda nada** — só o `proxy.conf.json` deixa de ser necessário.

## Estrutura do projeto

```
src/app/
├── core/
│   ├── models/            # interfaces TS espelhando os DTOs Java
│   ├── services/          # ProductService, OrderService, InventoryService, ToastService
│   └── interceptors/      # errorInterceptor (feedback global de falhas HTTP)
├── features/
│   ├── products/
│   │   ├── product-list/      # página inicial: GET /api/products
│   │   ├── product-card/      # card individual + botão "Comprar"
│   │   └── checkout-modal/    # formulário reativo + POST /api/orders
│   └── dashboard/
│       ├── dashboard.component.ts   # orquestra o polling e detecta eventos novos
│       ├── orders-panel/            # GET /api/orders
│       ├── inventory-panel/         # GET /api/inventory/reservations
│       └── event-connector/         # animação do evento "viajando" entre os painéis
└── shared/ui/              # componentes reutilizáveis (spinner, empty-state, toast...)
```

## Como cada tela consome a API (guia de aprendizado)

### 1. Vitrine de produtos (`/`)

`ProductListComponent` injeta `ProductService` e, no `constructor`, chama
`productService.list()`, que faz:

```ts
this.http.get<Product[]>('/api/products');
```

O estado da tela (`loading` → `ready`/`empty`/`error`) é controlado por um
`signal<ViewState>`, e o template usa `@switch` pra decidir o que renderizar
— sem `*ngIf` encadeados.

### 2. Fluxo de compra (modal de checkout)

Ao clicar em "Comprar", `ProductListComponent` chama `Dialog.open()` (Angular
CDK) passando o produto selecionado como `data`. Dentro do
`CheckoutModalComponent`, um `FormGroup` reativo valida `quantity` (> 0) e
`customerName` (obrigatório). No submit:

```ts
this.orderService.create({ productId, quantity, customerName });
// -> POST /api/orders
```

A resposta do `order-service` já dispara, **no back-end**, a publicação do
evento `ORDER_CREATED` no RabbitMQ — o front-end não sabe disso, só recebe
a confirmação HTTP e mostra um toast de sucesso avisando que o estoque será
processado de forma assíncrona.

### 3. Dashboard (`/dashboard`)

Este é o coração pedagógico do projeto. `DashboardComponent`:

1. Usa `timer(0, 3000)` (RxJS) para buscar `GET /api/orders` e
   `GET /api/inventory/reservations` a cada 3 segundos, em paralelo, com
   `forkJoin`.
2. Compara os IDs recebidos com os IDs já vistos (`Set<number>`) pra
   descobrir o que é **novo** desde a última rodada.
3. Quando encontra um pedido novo, marca a linha correspondente como
   "recente" por 1.8s (leve destaque visual).
4. Quando encontra uma **reserva de estoque nova**, além de destacar a
   linha, dispara um "pulso" no `EventConnectorComponent` — o pontinho azul
   que atravessa a linha tracejada entre os dois painéis. Esse pulso é a
   representação visual literal de "o RabbitMQ acabou de entregar uma
   mensagem".

Teste isso na prática: abra o Dashboard em uma aba, a Vitrine em outra, crie
um pedido, e volte pro Dashboard dentro de 3 segundos — você vai ver o
pedido aparecer à esquerda, o pulso atravessar, e a reserva aparecer à
direita, tudo sem dar refresh na página.

## Tratamento de erros

`errorInterceptor` (`core/interceptors/error.interceptor.ts`) é um
interceptor HTTP funcional registrado globalmente em `app.config.ts`. Ele
intercepta **qualquer** chamada HTTP da aplicação e:

- `status === 0` → serviço, banco de dados ou RabbitMQ fora do ar
  ("Não foi possível conectar ao Order Service. Ele está rodando?")
- `status >= 500` → erro interno do microsserviço
- `status === 404` → recurso não encontrado
- outros `4xx` → requisição inválida

Isso cobre o caso descrito no enunciado: se um dos três bancos Postgres ou o
RabbitMQ cair, o usuário recebe um toast vermelho explicando qual serviço
falhou, em vez de a tela travar silenciosamente.

## Scripts disponíveis

```bash
npm start       # ng serve com proxy.conf.json habilitado
npm run build   # build de produção em dist/ecommerce-frontend
npm test        # testes unitários (Karma/Jasmine)
```

## Próximos passos sugeridos

- Trocar o polling do Dashboard por Server-Sent Events ou WebSocket
  (exigiria expor isso em algum dos microsserviços Java).
- Adicionar paginação em `GET /api/orders` quando o volume crescer.
- Estado de autenticação (hoje o `customerName` é só um campo de texto livre).
- Substituir o proxy de desenvolvimento por um API Gateway real ao subir
  para produção — a troca é só de configuração, o código não muda.
