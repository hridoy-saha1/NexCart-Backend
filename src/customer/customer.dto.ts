export class AddToCartDto {
  productId: string;
  quantity: number;
}

export class PlaceOrderDto {
  address: string;
  paymentMethod: 'COD' | 'ONLINE';
}

export class UpdateProfileDto {
  name?: string;
  phone?: string;
  address?: string;
}
