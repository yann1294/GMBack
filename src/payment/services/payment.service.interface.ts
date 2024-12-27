import { PaymentVO } from "../vo/payment.master.vo";

export interface IPaymentService {
    processPayment(payment: PaymentVO): Promise<string>;
    getTransactionHistory(): Promise<void>;
    confirmPayment(): Promise<void>;
    generatePaymentReceipt(): Promise<void>;
    // getBookingFees(): Promise<void>;
    savePaymentDetails(): Promise<void>;
}