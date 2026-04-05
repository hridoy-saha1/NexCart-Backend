import { Injectable } from '@nestjs/common';
import { AddToCartDto, PlaceOrderDto, UpdateProfileDto } from './customer.dto';

@Injectable()
export class CustomerService {
  getProducts(category?: string): object {
    return {
      message: 'Product list fetched successfully',
      category,
      products: [
        { id: '1', name: 'Rice', price: 60 },
        { id: '2', name: 'Oil', price: 180 },
      ],
    };
  }

  getProductById(id: string): object {
    return {
      message: `Product ${id} fetched successfully`,
      product: {
        id,
        name: 'Rice',
        price: 60,
      },
    };
  }

  addToCart(dto: AddToCartDto): object {
    return {
      message: 'Product added to cart successfully',
      cartItem: dto,
    };
  }

  getCart(): object {
    return {
      message: 'Cart fetched successfully',
      cartItems: [{ productId: '1', quantity: 2 }],
    };
  }

  removeCartItem(id: string): object {
    return {
      message: `Cart item ${id} removed successfully`,
    };
  }

  placeOrder(dto: PlaceOrderDto): object {
    return {
      message: 'Order placed successfully',
      orderDetails: dto,
    };
  }

  getOrders(status?: string): object {
    return {
      message: 'Order history fetched successfully',
      status,
      orders: [],
    };
  }

  updateProfile(dto: UpdateProfileDto): object {
    return {
      message: 'Profile updated successfully',
      updatedProfile: dto,
    };
  }
}
