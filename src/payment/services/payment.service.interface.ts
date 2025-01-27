import { ResponseObject } from "src/shared/types";
import { PaymentVO } from "../vo/payment.master.vo";

export interface IPaymentService {
    processPayment(payment: PaymentVO): Promise<ResponseObject>;
    savePaymentDetails(payment: PaymentVO): Promise<ResponseObject>;
    findByPayment(paymentId: string): Promise<ResponseObject>;
    findByBooking(bookingId: string): Promise<ResponseObject>;
    findByResource(resourceId: string): Promise<ResponseObject>;
    findByUser(userId: string): Promise<ResponseObject>;
    // getTransactionHistory(): Promise<ResponseObject>;
    // confirmPayment(): Promise<ResponseObject>;
    // generatePaymentReceipt(): Promise<ResponseObject>;
    // getBookingFees(): Promise<ResponseObject>;
}