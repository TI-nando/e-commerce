/**
 * Espelha com.ecommerce.inventory.model.InventoryReservation (inventory-service).
 * Cada registro aqui é a "prova visual" de que um evento ORDER_CREATED
 * publicado pelo order-service foi consumido com sucesso via RabbitMQ.
 */
export interface InventoryReservation {
  id: number;
  orderId: number;
  productId: number;
  reservedQuantity: number;
  reservedAt: string;
}
