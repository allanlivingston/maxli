import { Order, OrderStatus, ShippingAddress } from '../../types/Order';

export interface IOrderService {
  createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getOrderByStripeSessionId(sessionId: string): Promise<Order | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
  deleteOrder(id: string): Promise<boolean>;
  getAllOrders(limit?: number): Promise<Order[]>;
  processPayment(orderId: string): Promise<boolean>;
  calculateTax(order: Order): number;
  validateShippingAddress(address: ShippingAddress | undefined): boolean;
  updateShippingAddress(orderId: string, shippingAddress: ShippingAddress): Promise<Order | null>;
}
