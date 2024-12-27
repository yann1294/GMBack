import { ResponseObject } from "src/shared/types";
import { PaymentVO } from "../vo/payment.master.vo";

export interface IPaymentService {
    processPayment(payment: PaymentVO): Promise<ResponseObject>;
    getTransactionHistory(): Promise<ResponseObject>;
    confirmPayment(): Promise<ResponseObject>;
    generatePaymentReceipt(): Promise<ResponseObject>;
    // getBookingFees(): Promise<ResponseObject>;
    savePaymentDetails(): Promise<ResponseObject>;
}