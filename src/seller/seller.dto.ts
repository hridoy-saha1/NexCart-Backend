export class CreateProductDto {
  productName: string;
  description: string;
  price: number;
  stock: number;
}

export class UpdateProductDto {
  productName?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  status: OrderStatus;
}

export class PayoutRequestDto {
  amount: number;
  bankAccount: string;
}
