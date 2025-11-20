// These elements are the ones that are going to be sent from Booking container to Payment container
//
// PaymentInfoVo
// - Shared shape for data exchanged between Booking and Payment domains.
export interface PaymentInfoVo {
  totalAmount: number;
  tourId?: string;
  packageId?: string;
  touristId: string;
  name: string;
}
