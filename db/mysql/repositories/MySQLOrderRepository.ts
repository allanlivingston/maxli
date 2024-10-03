import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { DBOrder, OrderStatus } from '../../../types/Order';
import mysql from 'mysql2/promise';

export class MySQLOrderRepository implements IOrderRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      connectionLimit: 10,
    });
  }

  async create(order: Omit<DBOrder, '_id' | 'createdAt'>): Promise<DBOrder> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO orders (stripe_session_id, user_id, total, status) VALUES (?, ?, ?, ?)',
        [order.stripeSessionId, order.userId, order.total, order.status]
      );

      const orderId = (result as mysql.ResultSetHeader).insertId;

      for (const item of order.items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.id, item.name, item.quantity, item.price]
        );
      }

      if (order.shippingAddress) {
        await connection.execute(
          'INSERT INTO shipping_addresses (order_id, line1, line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [orderId, order.shippingAddress.line1, order.shippingAddress.line2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postal_code, order.shippingAddress.country]
        );
      }

      await connection.commit();

      const createdOrder: DBOrder = {
        _id: orderId.toString(),
        ...order,
        createdAt: new Date(),
      };

      return createdOrder;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(id: string): Promise<DBOrder | null> {
    const [rows] = await this.pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) return null;

    const order = (rows as any[])[0];
    const [items] = await this.pool.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
    const [address] = await this.pool.execute('SELECT * FROM shipping_addresses WHERE order_id = ?', [id]);

    return {
      _id: order.id.toString(),
      stripeSessionId: order.stripe_session_id,
      userId: order.user_id,
      items: items as any[],
      total: order.total,
      status: order.status as OrderStatus,
      shippingAddress: address[0] || undefined,
      createdAt: order.created_at,
    };
  }

  async findByStripeSessionId(sessionId: string): Promise<DBOrder | null> {
    const [rows] = await this.pool.execute('SELECT * FROM orders WHERE stripe_session_id = ?', [sessionId]);
    if ((rows as any[]).length === 0) return null;

    const order = (rows as any[])[0];
    return this.findById(order.id.toString());
  }

  async update(id: string, orderData: Partial<DBOrder>): Promise<DBOrder | null> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      if (orderData.status) {
        await connection.execute('UPDATE orders SET status = ? WHERE id = ?', [orderData.status, id]);
      }

      if (orderData.shippingAddress) {
        await connection.execute(
          'UPDATE shipping_addresses SET line1 = ?, line2 = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE order_id = ?',
          [orderData.shippingAddress.line1, orderData.shippingAddress.line2, orderData.shippingAddress.city, orderData.shippingAddress.state, orderData.shippingAddress.postal_code, orderData.shippingAddress.country, id]
        );
      }

      await connection.commit();

      return this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id]);
      await connection.execute('DELETE FROM shipping_addresses WHERE order_id = ?', [id]);
      const [result] = await connection.execute('DELETE FROM orders WHERE id = ?', [id]);

      await connection.commit();

      return (result as mysql.ResultSetHeader).affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findAll(limit?: number): Promise<DBOrder[]> {
    let query = 'SELECT * FROM orders ORDER BY created_at DESC';
    if (limit) {
      query += ' LIMIT ?';
    }

    const [rows] = await this.pool.execute(query, limit ? [limit] : []);
    const orders = [];

    for (const row of rows as any[]) {
      const order = await this.findById(row.id.toString());
      if (order) orders.push(order);
    }

    return orders;
  }
}
