import { Timestamp } from 'firebase/firestore';

export interface UserModel {
  uid: string;
  email: string;
  name: string;
  role: 'client' | 'employee';
}

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
}

export interface CartItemModel {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface OrderModel {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItemModel[];
  totalPrice: number;
  status: 'Pendente' | 'Preparando' | 'Enviado' | 'Entregue';
  createdAt: Timestamp | string; // Firebase Timestamp or ISO String for local fallback
}
