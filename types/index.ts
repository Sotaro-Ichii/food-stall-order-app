export interface Order {
  id: string;
  itemName: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface DailyStats {
  date: string;
  items: {
    [itemName: string]: number;
  };
  totalOrders: number;
} 