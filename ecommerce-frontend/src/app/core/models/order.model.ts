/**
 * Espelha com.ecommerce.order.model.OrderStatus (order-service).
 */
export type OrderStatus = 'CREATED' | 'STOCK_RESERVED' | 'CANCELLED';

/**
 * Espelha com.ecommerce.order.model.Order (order-service).
 */
export interface Order {
  id: number;
  productId: number;
  quantity: number;
  customerName: string;
  status: OrderStatus;
  createdAt: string;
}

/**
 * Payload enviado no POST /api/orders.
 * Espelha com.ecommerce.order.controller.CreateOrderRequest.
 */
export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  customerName: string;
}
