# E-commerce Microservices — Boilerplate

Sistema de e-commerce simplificado com 3 microsserviços (Catálogo, Pedidos, Estoque)
comunicando-se de forma assíncrona via RabbitMQ, cada um com seu próprio Postgres.

## Pré-requisitos

- Java 21
- Maven 3.9+
- Docker e Docker Compose

## 1. Subir a infraestrutura (bancos + RabbitMQ)

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe:
- `catalog-db` → Postgres na porta **5433**
- `order-db` → Postgres na porta **5434**
- `inventory-db` → Postgres na porta **5435**
- `rabbitmq` → AMQP na porta **5672**, UI de gerenciamento em **http://localhost:15672** (usuário/senha: `guest`/`guest`)

Confira se todos estão saudáveis:

```bash
docker compose ps
```

## 2. Rodar os microsserviços (localmente, via Maven)

Abra 3 terminais (um para cada serviço):

```bash
cd product-service && mvn spring-boot:run
```

```bash
cd order-service && mvn spring-boot:run
```

```bash
cd inventory-service && mvn spring-boot:run
```

Portas: `product-service` → **8081**, `order-service` → **8082**, `inventory-service` → **8083**.

> Alternativa: se preferir tudo containerizado, descomente os serviços no
> `docker-compose.yml` e rode `docker compose up -d --build`.

## 3. Testando o fluxo ponta a ponta

### Criar um produto

```bash
curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Teclado Mecânico", "description": "Switch azul", "price": 350.00}'
```

Resposta esperada (guarde o `id` retornado):
```json
{"id": 1, "name": "Teclado Mecânico", "description": "Switch azul", "price": 350.00}
```

### Criar um pedido (dispara o evento ORDER_CREATED)

```bash
curl -X POST http://localhost:8082/api/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2, "customerName": "Maria Silva"}'
```

Resposta esperada:
```json
{"id": 1, "productId": 1, "quantity": 2, "customerName": "Maria Silva", "status": "CREATED", "createdAt": "..."}
```

### Verificando o consumo do evento

No terminal do `inventory-service`, você deve ver logs como:

```
Evento ORDER_CREATED recebido: orderId=1, productId=1, quantity=2
Estoque reservado simbolicamente para o pedido id=1
```

Você também pode inspecionar visualmente as filas em
**http://localhost:15672** → aba *Queues* → `order.created.queue`.

## 4. Encerrando o ambiente

```bash
docker compose down        # mantém os volumes (dados persistem)
docker compose down -v     # remove também os volumes (reset total)
```

## Próximos passos sugeridos para evoluir este boilerplate

- Adicionar um API Gateway (Spring Cloud Gateway) na frente dos 3 serviços.
- Service Discovery (Eureka) em vez de portas fixas hardcoded.
- Padrão **Transactional Outbox** no `order-service` para eliminar o risco de
  salvar o pedido no banco mas falhar ao publicar no RabbitMQ.
- Dead Letter Queue (DLQ) no `inventory-service` para mensagens que falham repetidamente.
- Validações de negócio reais (ex: checar estoque disponível antes de "reservar").
- Testes de integração com Testcontainers (Postgres + RabbitMQ reais em containers efêmeros).
- Observabilidade: Micrometer + Prometheus + Grafana, e tracing distribuído (Zipkin/Tempo).
