import { DBOrder, ShippingAddress } from '../../types/Order';

export interface IOrderRepository {
  create(order: Omit<DBOrder, '_id' | 'created_at'>): Promise<DBOrder>;
  findById(id: string): Promise<DBOrder | null>;
  findByStripeSessionId(sessionId: string): Promise<DBOrder | null>;
  update(id: string, orderData: Partial<DBOrder>): Promise<DBOrder | null>;
  delete(id: string): Promise<boolean>;
  findAll(limit?: number): Promise<DBOrder[]>;
}
