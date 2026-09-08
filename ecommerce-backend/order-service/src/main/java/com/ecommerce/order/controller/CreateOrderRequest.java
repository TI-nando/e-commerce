package com.ecommerce.order.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOrderRequest(
        @NotNull Long productId,
        @NotNull @Positive Integer quantity,
        @NotBlank String customerName
) {
}
