
export enum OrderStatus {
  PENDIENTE = 'Pendiente',
  EN_CORTE = 'En corte',
  DESPACHADO = 'Despachado',
  RECIBIDO = 'Recibido',
  CANCELADO = 'Cancelado',
  POR_CORREGIR = 'Pedido por corregir'
}

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta de Crédito';

export interface OrderItem {
  productType: string;
  size: string;
  color: string;
  material?: string; // For pillows (Bramante/Acolchada)
  fillingType?: string; // For Rellenos Nórdicos
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  location: string;
  idCard: string;
  whatsapp: string;
  wantsInvoice: boolean;
  email?: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  salesPerson: string;
  specialDescription?: string;
  history: {
    status: OrderStatus;
    timestamp: string;
  }[];
}

export type Tab = 'new' | 'list';
