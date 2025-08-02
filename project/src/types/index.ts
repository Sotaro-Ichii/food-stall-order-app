export interface Order {
  id: string;
  itemName: string;
  quantity: number;
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
}

export interface DailySales {
  itemName: string;
  quantity: number;
  date: string;
}