export interface Camera {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  price12h: number;
  price24h: number;
  available: boolean;
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  price12h: number;
  price24h: number;
  available: boolean;
}

export interface CartItem {
  id: string;
  itemId: string;
  itemType: 'camera' | 'accessory';
  name: string;
  imageUrl: string;
  price: number;
  duration: '12h' | '24h';
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}