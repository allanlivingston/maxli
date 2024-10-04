import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { DBOrder } from '../../../types/Order';
import { supabase } from '../../../lib/supabaseClient';

export class SupabaseOrderRepository implements IOrderRepository {
  async create(order: Omit<DBOrder, 'id' | 'created_at'>): Promise<DBOrder> {
    try {
      console.log('SupabaseOrderRepository: Attempting to create order:', JSON.stringify(order, null, 2));

      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) {
        console.error('SupabaseOrderRepository: Supabase error:', error);
        throw error;
      }

      console.log('SupabaseOrderRepository: Order created successfully:', JSON.stringify(data, null, 2));
      return data as DBOrder;
    } catch (error) {
      console.error('SupabaseOrderRepository: Error creating order:', error);
      throw new Error('Failed to create order in repository');
    }
  }

  async findById(id: string): Promise<DBOrder | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding order by ID:', error);
      throw error;
    }

    return data as DBOrder | null;
  }

  async findByStripeSessionId(sessionId: string): Promise<DBOrder | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      console.error('Error finding order by Stripe session ID:', error);
      throw error;
    }

    return data as DBOrder | null;
  }

  async update(id: string, updateData: Partial<DBOrder>): Promise<DBOrder | null> {
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }

    return data as DBOrder | null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }

    return true;
  }

  async findAll(limit?: number): Promise<DBOrder[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }

    return data as DBOrder[];
  }

  async findByUserId(userId: string): Promise<DBOrder[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('userid', userId);  // Note the lowercase 'userid'

    if (error) {
      console.error('Error fetching orders by userId:', error);
      throw new Error('Failed to fetch orders by userId');
    }

    return data || [];
  }
}
