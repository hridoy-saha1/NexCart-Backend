//accepting delivery
export class CreateRiderDto {
  orderId: string;
}

//updating order status
export class UpdateStatusDto {
  status: string;
}

//updating rider location
export class UpdateLocationDto {
  latitude: number;
  longitude: number;
}

//toggling availability
export class UpdateAvailabilityDto {
  availability: string;
}

//cancelling or rejecting delivery
export class CancelDeliveryDto {
  reason: string;
}

//earnings
export class EarningsDto {
  month: string;
}
