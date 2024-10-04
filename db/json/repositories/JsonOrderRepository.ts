import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IOrderRepository } from '../../interfaces/IOrderRepository';
import { DBOrder } from '../../../types/Order';

export class JsonOrderRepository implements IOrderRepository {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data', 'orders');
    this.ensureDataDir();
  }

  private async ensureDataDir() {
    await fs.mkdir(this.dataDir, { recursive: true });
  }

  // Add this method to get the data directory
  getDataDir(): string {
    return this.dataDir;
  }

  private getFilePath(id: string): string {
    return path.join(this.dataDir, `${id}.json`);
  }

  async create(order: DBOrder): Promise<DBOrder> {
    const id = uuidv4();
    const orderWithId = { ...order, id };
    const filePath = path.join(this.dataDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(orderWithId, null, 2));
    return orderWithId;
  }

  async findById(id: string): Promise<DBOrder | null> {
    const filePath = path.join(this.dataDir, `${id}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async findByStripeSessionId(sessionId: string): Promise<DBOrder | null> {
    const files = await fs.readdir(this.dataDir);
    for (const file of files) {
      const data = await fs.readFile(path.join(this.dataDir, file), 'utf-8');
      const order = JSON.parse(data) as DBOrder;
      if (order.stripeSessionId === sessionId) {
        return order;
      }
    }
    return null;
  }

  async update(id: string, orderData: Partial<DBOrder>): Promise<DBOrder | null> {
    const filePath = this.getFilePath(id);
    console.log('Updating order file:', filePath);
    console.log('Update data:', orderData);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const order: DBOrder = JSON.parse(data);
      console.log('Existing order data:', order);
      const updatedOrder = { ...order, ...orderData };
      console.log('Updated order data:', updatedOrder);
      await fs.writeFile(filePath, JSON.stringify(updatedOrder, null, 2));
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order file:', error);
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await fs.unlink(this.getFilePath(id));
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async findAll(limit?: number): Promise<DBOrder[]> {
    const files = await fs.readdir(this.dataDir);
    const orders: DBOrder[] = [];
    for (const file of files) {
      if (limit && orders.length >= limit) {
        break;
      }
      const data = await fs.readFile(path.join(this.dataDir, file), 'utf-8');
      orders.push(JSON.parse(data) as DBOrder);
    }
    return orders.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async findByUserId(userId: string): Promise<DBOrder[]> {
    const files = await fs.readdir(this.dataDir);
    const orders: DBOrder[] = [];

    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      const data = await fs.readFile(filePath, 'utf-8');
      const order: DBOrder = JSON.parse(data);

      if (order.userid === userId) {
        orders.push(order);
      }
    }

    return orders;
  }
}
