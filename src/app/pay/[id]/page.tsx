import { PaymentCard } from "@/components/payment/payment-card";
import {
  setPaymentAsset,
  setPaymentExpired,
  verifyPaymentTransaction,
} from "@/lib/actions";
import { getAssets, getNetworks, getPayment } from "@/lib/getters";
import { getTimeDifference } from "@/lib/helpers";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Pay({ params }: { params: { id: string } }) {
  const payment = await getPayment(params.id);
  const networks = await getNetworks();
  const assets = await getAssets();

  if (!payment || !networks || !assets) throw new Error("Failed to fetch data");

  if (!process.env.MAX_ELAPSED_TIME)
    throw new Error("MAX_ELAPSED_TIME is not set");

  const elapsed = getTimeDifference(new Date(payment.created_on));

  const startingTime = Math.max(
    parseInt(process.env.MAX_ELAPSED_TIME) - elapsed,
    0
  );

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Suspense fallback={<Loading />}>
        {payment.status !== "success" ? (
          <PaymentCard
            price={payment.base_amount}
            networks={networks}
            assets={assets}
            returnUrl={payment.return_url}
            payment={payment}
            startingTime={startingTime}
            onSetup={setPaymentAsset}
            onExpire={setPaymentExpired}
            onVerification={verifyPaymentTransaction}
          />
        ) : (
          <div>Payment status: {payment.status}</div>
        )}
      </Suspense>
    </main>
  );
}
