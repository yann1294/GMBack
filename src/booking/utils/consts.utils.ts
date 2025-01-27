export const status = ["in-process", "full", "completed", "canceled"] as const;
export type BookingStatus = (typeof status)[number];