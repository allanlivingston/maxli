import { IOrderService } from './interfaces/IOrderService';
import { IOrderRepository } from '../db/interfaces/IOrderRepository';
import { Order, DBOrder, OrderStatus, ShippingAddress } from '../types/Order';
import { OrderRepositoryFactory } from '../factories/OrderRepositoryFactory';
import { JsonOrderRepository } from '../db/json/repositories/JsonOrderRepository';
import fs from 'fs/promises';
import path from 'path';

export class OrderService implements IOrderService {
  private orderRepository: IOrderRepository;
  private logDir: string;

  constructor() {
    this.orderRepository = OrderRepositoryFactory.getRepository();
    // Assuming we're using JsonOrderRepository. If not, we'll fall back to a default.
    this.logDir = (this.orderRepository as JsonOrderRepository).getDataDir?.() || path.join(process.cwd(), 'logs');
  }

  private async logToFile(message: string) {
    const logPath = path.join(this.logDir, 'order-service-logs.txt');
    await fs.appendFile(logPath, `${new Date().toISOString()}: ${message}\n`);
    console.log('Logged to file:', logPath);
  }

  private convertToOrder(dbOrder: DBOrder): Order {
    const { _id, ...rest } = dbOrder;
    return { id: _id, ...rest };
  }

  private convertToDBOrder(order: Omit<Order, 'id' | 'created_at'>): Omit<DBOrder, '_id' | 'created_at'> {
    return order;
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    try {
      console.log('OrderService: Creating order with data:', orderData);
      const orderWithTimestamp = {
        ...orderData,
        created_at: new Date(),
      };
      const createdDBOrder = await this.orderRepository.create(orderWithTimestamp);
      console.log('OrderService: Order created successfully:', createdDBOrder);
      const createdOrder = this.convertToOrder(createdDBOrder);
      return createdOrder;
    } catch (error) {
      console.error('OrderService: Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const dbOrder = await this.orderRepository.findById(id);
      return dbOrder ? this.convertToOrder(dbOrder) : null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  async getOrderByStripeSessionId(sessionId: string): Promise<Order | null> {
    try {
      const dbOrder = await this.orderRepository.findByStripeSessionId(sessionId);
      return dbOrder ? this.convertToOrder(dbOrder) : null;
    } catch (error) {
      console.error('Error fetching order by Stripe session ID:', error);
      throw new Error('Failed to fetch order by Stripe session ID');
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    try {
      const dbOrder = await this.orderRepository.update(id, { status });
      return dbOrder ? this.convertToOrder(dbOrder) : null;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      return await this.orderRepository.delete(id);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  }

  async getAllOrders(limit?: number): Promise<Order[]> {
    try {
      const dbOrders = await this.orderRepository.findAll(limit);
      return dbOrders.map(this.convertToOrder);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Failed to fetch all orders');
    }
  }

  async processPayment(orderId: string): Promise<boolean> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      // Implement actual payment processing logic here
      // This is a placeholder implementation
      const paymentSuccessful = Math.random() < 0.9; // 90% success rate
      if (paymentSuccessful) {
        await this.updateOrderStatus(orderId, 'paid');
        return true;
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Failed to process payment');
    }
  }

  calculateTax(order: Order): number {
    // Implement actual tax calculation logic here
    // This is a placeholder implementation
    const taxRate = 0.1; // 10% tax rate
    return order.total * taxRate;
  }

  validateShippingAddress(address: ShippingAddress | undefined): boolean {
    if (!address) return false;
    const requiredFields = ['line1', 'city', 'state', 'postal_code', 'country'];
    return requiredFields.every(field => !!address[field as keyof ShippingAddress]);
  }

  async updateShippingAddress(orderId: string, shippingAddress: ShippingAddress): Promise<Order | null> {
    try {
      await this.logToFile(`Updating shipping address for order: ${orderId}`);
      await this.logToFile(`New shipping address: ${JSON.stringify(shippingAddress)}`);
      const updatedOrder = await this.orderRepository.update(orderId, { shippingAddress });
      await this.logToFile(`Repository update result: ${JSON.stringify(updatedOrder)}`);
      return updatedOrder ? this.convertToOrder(updatedOrder) : null;
    } catch (error) {
      await this.logToFile(`Error updating shipping address: ${error}`);
      throw new Error('Failed to update shipping address');
    }
  }

  // Add any other business logic methods as needed
}
