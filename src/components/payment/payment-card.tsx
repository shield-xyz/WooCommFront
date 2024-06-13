"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import { useTimer } from "@/hooks/useTimer";
import { Asset, Network } from "@/lib/schemas";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import { toast } from "sonner";
import { PaymentProcess } from "./process";
import { PaymentSetup } from "./setup";
import { PaymentSuccess } from "./success";
import { PaymentVerify } from "./verify";

const PaymentCard = ({
  price,
  networks,
  assets,
  returnUrl,
  paymentId,
  onUpdate,
}: {
  price: number;
  networks: Network[];
  assets: Asset[];
  returnUrl: string;
  paymentId: string;
  onUpdate: (paymentId: string, payload: { [key: string]: any }) => void;
}) => {
  const router = useRouter();

  const [assetAmount, setAssetAmount] = useState<string>(price.toString());
  const [wantToPay, setWantToPay] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [address, setAddress] = useState("");
  const [confettiConductor, setConfettiConductor] =
    useState<TConductorInstance>();
  const [validating, setValidating] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { seconds, start } = useTimer(300);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (!seconds) {
      setPaymentExpired(true);
      toast.error("Payment expired!");
    }
  }, [seconds]);

  function onSubmit(values: any) {
    if (paymentExpired) {
      router.back();
      return;
    }

    const network = networks.find(
      (network) => network.networkId === values.network
    );
    const asset = assets.find((asset) => asset.assetId === values.asset);

    if (!network || !asset) {
      toast.error("Invalid network or asset");
      return;
    }

    setSelectedNetwork(network);
    setSelectedAsset(asset);
    setAssetAmount(values.amount);
    setAddress(network.deposit_address);
    setWantToPay(true);

    onUpdate(paymentId, {
      status: "pending",
    });
    console.log(values);
  }

  function validateTransaction() {
    setValidating(true);
    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
      setValidating(false);
      confettiConductor?.shoot();
      setPaymentSuccess(true);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32">
      <Fireworks
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
        onInit={(instance) => {
          setConfettiConductor(instance.conductor);
        }}
      />
      {paymentSuccess ? (
        <PaymentSuccess returnUrl={returnUrl} />
      ) : alreadyPaid ? (
        <PaymentVerify
          timer={seconds}
          onBack={() => {
            setWantToPay(true);
            setAlreadyPaid(false);
          }}
          onValidate={validateTransaction}
          validating={validating}
        />
      ) : wantToPay && assetAmount && selectedAsset && selectedNetwork ? (
        <PaymentProcess
          timer={seconds}
          address={address}
          network={selectedNetwork}
          asset={selectedAsset}
          amount={assetAmount}
          onCancel={() => setWantToPay(false)}
          onPaid={() => {
            setAlreadyPaid(true);
            setWantToPay(false);
          }}
        />
      ) : (
        <PaymentSetup
          networks={networks}
          assets={assets}
          price={price}
          timer={seconds}
          expired={paymentExpired}
          onSubmit={onSubmit}
          onCancel={() => router.back()}
        />
      )}
    </main>
  );
};

export { PaymentCard };
