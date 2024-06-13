import { PaymentCard } from "@/components/payment/payment-card";
import { updatePayment } from "@/lib/actions";
import { getAssets, getNetworks, getPayment } from "@/lib/getters";
import { Suspense } from "react";

export default async function Pay({ params }: { params: { id: string } }) {
  const payment = await getPayment(params.id);
  const networks = await getNetworks();
  const assets = await getAssets();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        {!payment ? (
          <div>Payment not found</div>
        ) : !networks ? (
          <div>Error fetching networks</div>
        ) : !assets ? (
          <div>Error fetching assets</div>
        ) : payment.status === "created" ? (
          <PaymentCard
            price={payment.base_amount}
            networks={networks}
            assets={assets}
            returnUrl={payment.return_url}
            paymentId={payment._id}
            onUpdate={updatePayment}
          />
        ) : (
          <div>Payment status: {payment.status}</div>
        )}
      </Suspense>
    </main>
  );
}
