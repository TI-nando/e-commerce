package com.ecommerce.order.service;

import com.ecommerce.order.config.RabbitMQConfig;
import com.ecommerce.order.event.OrderCreatedEvent;
import com.ecommerce.order.model.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

/**
 * Responsável exclusivamente por publicar eventos relacionados a Order.
 * Mantê-lo separado do OrderController/OrderService de persistência deixa claro
 * qual parte do código lida com "efeitos colaterais assíncronos" vs "regra de negócio".
 */
@Slf4j
@Service
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OrderEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(
                order.getId(),
                order.getProductId(),
                order.getQuantity(),
                order.getCustomerName(),
                order.getCreatedAt()
        );

        log.info("Publicando evento ORDER_CREATED para o pedido id={}", order.getId());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_EXCHANGE,
                RabbitMQConfig.ORDER_CREATED_ROUTING_KEY,
                event
        );
    }

}
