export async function updatePayment(
  paymentId: string,
  payload: { [key: string]: any }
) {
  "use server";

  if (!process.env.PAYBACKEND_API_KEY) {
    throw new Error("PAYBACKEND_API_KEY is not set");
  }

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

  if (!response.ok) {
    throw new Error("Failed to update payment");
  }

  const data = response.json();

  console.log(data);

  return data;
}
