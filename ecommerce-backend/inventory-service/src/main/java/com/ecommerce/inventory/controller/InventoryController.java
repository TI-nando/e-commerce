package com.ecommerce.inventory.controller;

import com.ecommerce.inventory.model.InventoryReservation;
import com.ecommerce.inventory.repository.InventoryReservationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoint apenas de LEITURA. Existe para você conseguir visualizar, via
 * Swagger/Postman, que o evento ORDER_CREATED foi consumido com sucesso e
 * gerou uma reserva de estoque — sem precisar entrar direto no banco.
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryReservationRepository inventoryReservationRepository;

    public InventoryController(InventoryReservationRepository inventoryReservationRepository) {
        this.inventoryReservationRepository = inventoryReservationRepository;
    }

    @GetMapping("/reservations")
    public List<InventoryReservation> findAll() {
        return inventoryReservationRepository.findAll();
    }

}
