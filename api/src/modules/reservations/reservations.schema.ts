import { z } from "zod";

/**
 * Card details are accepted, validated and then discarded — only the brand and last
 * four digits survive. A real integration would tokenise on the client instead.
 */
export const cardSchema = z.object({
  number: z.string().min(12).max(25),
  holder: z.string().trim().min(2).max(120),
  expiryMonth: z.coerce.number().int().min(1).max(12),
  expiryYear: z.coerce.number().int().min(2000).max(2100),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

export const createReservationSchema = z.object({
  departureId: z.string().min(1).max(60),
  travellers: z.coerce.number().int().min(1).max(20),
  guest: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    phone: z.string().trim().min(5).max(40),
    note: z.string().trim().max(1000).optional(),
  }),
  address: z.object({
    line1: z.string().trim().min(3).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().min(3).max(20),
    country: z
      .string()
      .trim()
      .length(2, "Use an ISO 3166-1 alpha-2 country code")
      .transform((value) => value.toUpperCase()),
  }),
  /** Omit to hold the booking without paying; it stays "pending". */
  payment: z.object({ method: z.literal("card"), card: cardSchema }).optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const lookupReservationSchema = z.object({
  email: z.email(),
});
