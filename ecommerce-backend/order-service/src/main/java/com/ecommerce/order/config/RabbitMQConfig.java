package com.ecommerce.order.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Define a topologia do RabbitMQ do lado de quem PUBLICA.
 *
 * Exchange do tipo TOPIC: permite que, no futuro, outros serviços criem suas
 * próprias filas escutando o mesmo evento com routing keys diferentes
 * (ex: "order.created", "order.cancelled") sem precisar alterar este serviço.
 *
 * Publicamos a fila aqui também (idempotente/declarativa) para que o boilerplate
 * funcione mesmo se o Inventory Service subir depois do Order Service.
 */
@Configuration
public class RabbitMQConfig {

    public static final String ORDER_EXCHANGE = "order.exchange";
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";
    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(ORDER_EXCHANGE, true, false);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return new Queue(ORDER_CREATED_QUEUE, true);
    }

    @Bean
    public Binding orderCreatedBinding(Queue orderCreatedQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderCreatedQueue)
                .to(orderExchange)
                .with(ORDER_CREATED_ROUTING_KEY);
    }

    /**
     * Serializa/desserializa mensagens como JSON (em vez do padrão Java Serialization).
     * Isso é essencial em microsserviços poliglotas ou apenas para manter as mensagens
     * legíveis na UI do RabbitMQ.
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

}
