package com.ecommerce.order.event;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Contrato do evento publicado no RabbitMQ.
 * Importante: este DTO (ou um equivalente compatível) deve existir também
 * no lado do consumidor (Inventory Service), já que não há um schema-registry
 * neste boilerplate. Em produção, considere um contrato compartilhado
 * (ex: biblioteca "commons" ou Avro/JSON Schema).
 */
public record OrderCreatedEvent(
        Long orderId,
        Long productId,
        Integer quantity,
        String customerName,
        LocalDateTime createdAt
) implements Serializable {
}
