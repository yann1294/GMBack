// All allowed booking status values
export const status = ['in-process', 'full', 'completed', 'canceled'] as const;
// Type-safe union of the status values
export type BookingStatus = (typeof status)[number];
