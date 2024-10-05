import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { DBOrder } from '../../../types/Order';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseOrderRepository implements IOrderRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async create(order: Omit<DBOrder, 'id' | 'created_at'>): Promise<DBOrder> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order) // Remove the spread and id assignment
      .select()
      .single();

    if (error) throw error;
    return data as DBOrder;
  }

  async findById(id: string): Promise<DBOrder | null> {
    const { data, error } = await this.supabase
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
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('stripeSessionId', sessionId)
      .single();

    if (error) {
      console.error('Error finding order by Stripe session ID:', error);
      throw error;
    }

    return data as DBOrder | null;
  }

  async update(id: string, updateData: Partial<DBOrder>): Promise<DBOrder | null> {
    const { data, error } = await this.supabase
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
    const { error } = await this.supabase
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
    let query = this.supabase
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
      .eq('userid', userId);

    if (error) throw error;
    return data || [];
  }
}
