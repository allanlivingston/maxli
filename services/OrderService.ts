import { IOrderService } from './interfaces/IOrderService';
import { IOrderRepository } from '../db/interfaces/IOrderRepository';
import { Order, DBOrder, OrderStatus, ShippingAddress } from '../types/Order';
import { OrderRepositoryFactory } from '../factories/OrderRepositoryFactory';
import { JsonOrderRepository } from '../db/json/repositories/JsonOrderRepository';
import fs from 'fs/promises';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateOrderId } from '@/utils/orderIdGenerator';

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
    // No need to destructure, as the structures are now identical
    return dbOrder;
  }

  private convertToDBOrder(order: Omit<Order, 'privateid' | 'created_at'>): Omit<DBOrder, 'privateid' | 'created_at'> {
    return order;
  }

  async createOrder(order: Omit<Order, 'privateid' | 'orderid' | 'created_at'>): Promise<Order> {
    try {
      const orderWithIds = {
        ...order,
        orderid: generateOrderId(),
        stripeSessionId: order.stripeSessionId
      };

      console.log('OrderService: Creating order with data:', JSON.stringify(orderWithIds, null, 2));
      const { data, error } = await this.supabase
        .from('orders')
        .insert(orderWithIds)
        .select()
        .single();

      if (error) throw error;

      console.log('OrderService: Order created successfully:', JSON.stringify(data, null, 2));
      return data as Order;
    } catch (error) {
      console.error('OrderService: Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(privateid: string): Promise<Order | null> {
    try {
      const dbOrder = await this.orderRepository.findById(privateid);
      return dbOrder ? this.convertToOrder(dbOrder) : null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }
  
  async getOrderByStripeSessionId(sessionId: string): Promise<Order | null> {
    try {
      console.log('OrderService: Getting order by Stripe session ID:', sessionId);
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('stripeSessionId', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No order found for session ID:', sessionId);
          return null;
        }
        console.error('Error fetching order by Stripe session ID:', error);
        throw error;
      }

      console.log('OrderService: Order found:', JSON.stringify(data, null, 2));
      return data as Order;
    } catch (error) {
      console.error('Error fetching order by Stripe session ID:', error);
      throw new Error('Failed to fetch order by Stripe session ID');
    }
  }

  async updateOrderStatus(privateid: string, status: OrderStatus): Promise<Order | null> {
    try {
      console.log(`************ Updating order status for order ID: ${privateid} to ${status}`);
      const { data, error } = await this.supabase
        .from('orders')
        .update({ status })
        .eq('privateid', privateid)
        .select()
        .single();

      if (error) throw error;
      console.log(`Order status updated successfully: ${JSON.stringify(data)}`);
      return data as Order;
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
      console.log(`Updating shipping address for order ID: ${orderId}`);
      const { data, error } = await this.supabase
        .from('orders')
        .update({ shippingAddress })
        .eq('privateid', orderId)  // Change to 'privateid'
        .select()
        .single();

      if (error) throw error;
      console.log(`Shipping address updated successfully: ${JSON.stringify(data)}`);
      return data as Order;
    } catch (error) {
      console.error('Error updating shipping address:', error);
      throw new Error('Failed to update shipping address');
    }
  }

  async getOrdersByUserId(userid: string): Promise<Order[]> {
    try {
      console.log('OrderService: Getting non-cart orders by user ID:', userid);
      const { data, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('userid', userid)
        .neq('status', 'cart')  // Exclude orders with 'cart' status
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`OrderService: Found ${data?.length || 0} non-cart orders for user ID:`, userid);
      return data ? data.map(this.convertToOrder) : [];
    } catch (error) {
      console.error('Error fetching non-cart orders by user ID:', error);
      throw new Error('Failed to fetch non-cart orders by user ID');
    }
  }

  async updateOrderAfterStripeReturn(stripeSessionId: string): Promise<Order | null> {
    try {
      console.log('OrderService: Updating order after Stripe return:', stripeSessionId);
      const { data: order, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('stripeSessionId', stripeSessionId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }

      if (!order) {
        console.log('OrderService: No order found for Stripe session ID:', stripeSessionId);
        return null;
      }

      console.log('OrderService: Found order:', JSON.stringify(order, null, 2));

      if (order.status === 'cart') {
        const { data: updatedOrder, error: updateError } = await this.supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('privateid', order.privateid  )
          .select()
          .single();

        if (updateError) {
          console.error('Error updating order status:', updateError);
          throw updateError;
        }

        console.log('OrderService: Order updated to paid:', JSON.stringify(updatedOrder, null, 2));
        return updatedOrder as Order;
      } else {
        console.log('OrderService: Order already processed, status:', order.status);
        return order as Order;
      }
    } catch (error) {
      console.error('Error updating order after Stripe return:', error);
      throw new Error('Failed to update order after Stripe return');
    }
  }

  // Add any other business logic methods as needed
}
