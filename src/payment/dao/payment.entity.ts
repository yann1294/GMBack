export class Payment {
  constructor(
    public id: string,
    public sessionId: string,
    public gateway: string,
    public paymentId: string,
    public resourceType: string,
    public resourceId: string,
    public amount: number,
    public currency: string,
    public status: string,
    public bookingId: string,
    public userId: string,
    public receipt: string,
    public createdAt: string,
    public updatedAt: string,
  ) {}

  toObject(): object {
    return {
      id: this.id,
      sessionId: this.sessionId,
      gateway: this.gateway,
      paymentId: this.paymentId,
      resourceId: this.resourceId,
      resourceType: this.resourceType,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      bookingId: this.bookingId,
      userId: this.userId,
      receipt: this.receipt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toUpdateObject(): object {
    return { ...this };
  }
}