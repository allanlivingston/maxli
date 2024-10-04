export interface DBOrder {
  _id: string;
  stripeSessionId: string;
  userid: string;  // Ensure this matches the column name in Supabase
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  created_at: Date;
}

export interface Order {
  id: string;
  stripeSessionId: string;
  userid: string;  // Ensure this matches the column name in Supabase
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  created_at?: Date;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  capacity?: string;
  icon?: any;
  type?: string;
  imageName?: string;
  imagePath?: string;
  // Keep the price_data structure for compatibility with existing code
  price_data?: {
    product_data?: {
      name?: string;
    };
    unit_amount?: number;
  };
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
