package com.ecommerce.inventory.event;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Deve espelhar o contrato de com.ecommerce.order.event.OrderCreatedEvent.
 * O Jackson2JsonMessageConverter casa os campos pelo nome (JSON), então
 * o pacote/nome da classe pode ser diferente entre os serviços — o que
 * precisa bater são os nomes dos campos.
 */
public record OrderCreatedEvent(
        Long orderId,
        Long productId,
        Integer quantity,
        String customerName,
        LocalDateTime createdAt
) implements Serializable {
}
