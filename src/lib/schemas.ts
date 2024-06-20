import { z } from "zod";

export const createResponseSchema = <T extends z.ZodType<any>>(schema: T) =>
  z.object({
    response: schema,
    status: z.string(),
  });

export const paymentSchema = z.object({
  _id: z.string(),
  base_amount: z.number(),
  quote_amount: z.number(),
  status: z.string(),
  return_url: z.string(),
  assetId: z.string(),
  userId: z.string(),
  created_on: z.string(),
});

export const paymentResponseSchema = createResponseSchema(paymentSchema);

export const networkSchema = z.object({
  _id: z.string(),
  name: z.string(),
  logo: z.string(),
  deposit_address: z.string(),
  networkId: z.string(),
});

export const networksResponseSchema = createResponseSchema(
  z.array(networkSchema)
);

export const assetSchema = z.object({
  _id: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  logo: z.string(),
  active: z.boolean(),
  networkId: z.string(),
  assetId: z.string(),
});

export const assetsResponseSchema = createResponseSchema(z.array(assetSchema));

export type Network = z.infer<typeof networkSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type Payment = z.infer<typeof paymentSchema>;

export const priceResponseSchema = z.strictObject({
  data: z.strictObject({
    amount: z.string(),
    base: z.string(),
    currency: z.string(),
  }),
});
