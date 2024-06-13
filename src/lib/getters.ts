import {
  Asset,
  assetsResponseSchema,
  Network,
  networksResponseSchema,
  Payment,
  paymentResponseSchema,
} from "./schemas";

async function getFromAPI<T>(url: string): Promise<T | undefined> {
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === "error") return;
  return data;
}

export async function getPayment(id: string): Promise<Payment | undefined> {
  const data = await getFromAPI<Payment>(
    `${process.env.PAYBACKEND_BASE_URL}/api/payments/${id}`
  );

  const { response, status } = paymentResponseSchema.parse(data);

  if (status !== "success") return;

  return response;
}

export async function getNetworks(): Promise<Network[] | undefined> {
  const data = await getFromAPI<Network[]>(
    `${process.env.PAYBACKEND_BASE_URL}/api/networks/`
  );

  const { response, status } = networksResponseSchema.parse(data);

  if (status !== "success") return;

  return response;
}

export async function getAssets(): Promise<Asset[] | undefined> {
  const data = await getFromAPI<Asset[]>(
    `${process.env.PAYBACKEND_BASE_URL}/api/assets/`
  );

  const { response, status } = assetsResponseSchema.parse(data);

  if (status !== "success") return;

  return response;
}
