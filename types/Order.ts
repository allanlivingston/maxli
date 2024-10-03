export interface DBOrder {
  _id: string;
  stripeSessionId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  createdAt: Date;
}

export interface Order {
  id: string;
  stripeSessionId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'shipped' | 'delivered';

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}
