import { IOrderService } from './interfaces/IOrderService';
import { IOrderRepository } from '../db/interfaces/IOrderRepository';
import { Order, DBOrder, OrderStatus, ShippingAddress } from '../types/Order';
import { OrderRepositoryFactory } from '../factories/OrderRepositoryFactory';
import { JsonOrderRepository } from '../db/json/repositories/JsonOrderRepository';
import fs from 'fs/promises';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class OrderService implements IOrderService {
  private orderRepository: IOrderRepository;
  private logDir: string;
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    this.orderRepository = OrderRepositoryFactory.getRepository();
    this.logDir = (this.orderRepository as JsonOrderRepository).getDataDir?.() || path.join(process.cwd(), 'logs');
  }
  private convertToOrder(dbOrder: DBOrder): Order {
    const { _id, ...rest } = dbOrder;
    return { id: _id, ...rest };
  }

  private convertToDBOrder(order: Omit<Order, 'id' | 'created_at'>): Omit<DBOrder, '_id' | 'created_at'> {
    return order;
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    try {
      console.log('OrderService: Creating order with data:', JSON.stringify(order, null, 2));
      const createdOrder = await this.orderRepository.create(order);
      console.log('OrderService: Order created successfully:', JSON.stringify(createdOrder, null, 2));
      
      // Add this line to ensure the id property is present
      return { id: createdOrder._id, ...createdOrder };
    } catch (error) {
      console.error('OrderService: Error creating order:', error);
      throw error;
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
      await console.log(`Updating shipping address for order: ${orderId}`);
      await console.log(`New shipping address: ${JSON.stringify(shippingAddress)}`);
      const updatedOrder = await this.orderRepository.update(orderId, { shippingAddress });
      await console.log(`Repository update result: ${JSON.stringify(updatedOrder)}`);
      return updatedOrder ? this.convertToOrder(updatedOrder) : null;
    } catch (error) {
      await console.log(`Error updating shipping address: ${error}`);
      throw new Error('Failed to update shipping address');
    }
  }

  async getOrdersByUserId(userid: string): Promise<Order[]> {
    try {
      console.log('OrderService: Getting orders by user ID:', userid);
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('userid', userid)
        .order('created_at', { ascending: false });  // Sort by created_at in descending order

      if (error) throw error;

      console.log(`OrderService: Found ${data?.length || 0} orders for user ID:`, userid);
      return data ? data.map(this.convertToOrder) : [];
    } catch (error) {
      console.error('Error fetching orders by user ID:', error);
      throw new Error('Failed to fetch orders by user ID');
    }
  }

  // Add any other business logic methods as needed
}
