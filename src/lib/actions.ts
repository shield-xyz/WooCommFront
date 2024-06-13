import { getPayment } from "./getters";
import { convertCurrency } from "./helpers";
import { Asset, paymentResponseSchema } from "./schemas";

async function updatePayment(
  paymentId: string,
  payload: { [key: string]: any }
) {
  "use server";

  if (!process.env.PAYBACKEND_API_KEY)
    throw new Error("PAYBACKEND_API_KEY is not set");

  const response = await fetch(
    `${process.env.PAYBACKEND_BASE_URL}/api/payments/${paymentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PAYBACKEND_API_KEY,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw new Error("Failed to update payment");

  const data = response.json();

  return data;
}

export async function setPaymentExpired(paymentId: string) {
  "use server";

  await updatePayment(paymentId, {
    status: "expired",
  });
}

export async function setPaymentAsset(
  paymentId: string,
  asset: Asset | undefined
) {
  "use server";

  const payment = await getPayment(paymentId);

  if (!payment) throw new Error("Payment not found");

  if (!asset) {
    const { response } = await updatePayment(paymentId, {
      quote_amount: 0,
      assetId: "",
      status: "created",
    }).then((data) => paymentResponseSchema.parse(data));

    return response;
  }

  const quoteAmount = await convertCurrency(
    payment.base_amount,
    "USD",
    asset.symbol
  );

  const { response } = await updatePayment(paymentId, {
    quote_amount: parseFloat(quoteAmount),
    assetId: asset.assetId,
    status: "pending",
  }).then((data) => paymentResponseSchema.parse(data));

  return response;
}

export async function verifyPaymentTransaction(payload: {
  paymentId: string;
  networkId: string;
  hash: string;
}) {
  "use server";

  if (!process.env.PAYBACKEND_API_KEY)
    throw new Error("PAYBACKEND_API_KEY is not set");

  const response = await fetch(
    `${process.env.PAYBACKEND_BASE_URL}/api/payments/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PAYBACKEND_API_KEY,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw new Error("Failed to update payment");

  return await response.json();
}
