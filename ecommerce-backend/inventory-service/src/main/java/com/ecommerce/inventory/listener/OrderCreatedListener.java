package com.ecommerce.inventory.listener;

import com.ecommerce.inventory.config.RabbitMQConfig;
import com.ecommerce.inventory.event.OrderCreatedEvent;
import com.ecommerce.inventory.model.InventoryReservation;
import com.ecommerce.inventory.repository.InventoryReservationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Consumidor assíncrono do evento ORDER_CREATED.
 *
 * @RabbitListener cria um consumer que fica escutando a fila continuamente
 * (long-polling gerenciado pelo Spring AMQP). Cada evento publicado pelo
 * Order Service cai aqui automaticamente, sem nenhuma chamada HTTP direta
 * entre os dois serviços.
 */
@Slf4j
@Component
public class OrderCreatedListener {

    private final InventoryReservationRepository inventoryReservationRepository;

    public OrderCreatedListener(InventoryReservationRepository inventoryReservationRepository) {
        this.inventoryReservationRepository = inventoryReservationRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.ORDER_CREATED_QUEUE)
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Evento ORDER_CREATED recebido: orderId={}, productId={}, quantity={}",
                event.orderId(), event.productId(), event.quantity());

        // Simulação da reserva de estoque (sem checar saldo real de propósito).
        InventoryReservation reservation = new InventoryReservation();
        reservation.setOrderId(event.orderId());
        reservation.setProductId(event.productId());
        reservation.setReservedQuantity(event.quantity());
        reservation.setReservedAt(LocalDateTime.now());

        inventoryReservationRepository.save(reservation);

        log.info("Estoque reservado simbolicamente para o pedido id={}", event.orderId());
    }

}
