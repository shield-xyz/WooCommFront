"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import { useTimer } from "@/hooks/useTimer";
import { Asset, Network, Payment, paymentResponseSchema } from "@/lib/schemas";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { PaymentExpired } from "./expired";
import { PaymentProcess } from "./process";
import { PaymentSetup } from "./setup";
import { PaymentSuccess } from "./success";
import { PaymentVerify } from "./verify";

const PaymentCard = ({
  price,
  networks,
  assets,
  returnUrl,
  payment,
  startingTime,
  onSetup,
  onExpire,
  onVerification,
}: {
  price: number;
  networks: Network[];
  assets: Asset[];
  returnUrl: string;
  payment: Payment;
  startingTime: number;
  onSetup: (paymentId: string, asset: Asset | undefined) => Promise<Payment>;
  onExpire: (paymentId: string) => Promise<Payment>;
  onVerification: (payload: {
    paymentId: string;
    networkId: string;
    hash: string;
  }) => Promise<{
    response: string;
    status: string;
  }>;
}) => {
  const router = useRouter();

  const [assetAmount, setAssetAmount] = useState<string>("0");
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [address, setAddress] = useState("");
  const [confettiConductor, setConfettiConductor] =
    useState<TConductorInstance>();
  const [validating, setValidating] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(payment);
  const [isLoading, setIsLoading] = useState(false);
  const [wantToVerify, setWantToVerify] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const { seconds, start } = useTimer(startingTime);

  const getNetworkById = useCallback(
    (id: string) => {
      return networks.find((network) => network.networkId === id);
    },
    [networks]
  );

  const getAssetById = useCallback(
    (id: string) => {
      return assets.find((asset) => asset.assetId === id);
    },
    [assets]
  );

  useEffect(() => {
    if (startingTime > 0 && seconds === startingTime) start();

    if (payment.status === "pending") {
      const network = getNetworkById(payment.assetId.split("-")[1]);
      const asset = getAssetById(payment.assetId);

      if (!network || !asset) throw new Error("Invalid network or asset");

      setSelectedNetwork(network);
      setSelectedAsset(asset);
      setAssetAmount(payment.quote_amount.toString());
      setAddress(network.deposit_address);
    }
  }, [start, startingTime, payment, getNetworkById, getAssetById, seconds]);

  useEffect(() => {
    if (!seconds) {
      setPaymentExpired(true);
      toast.error("Payment expired!");
      onExpire(payment._id).then(setCurrentPayment);
    }
  }, [seconds, payment, onExpire]);

  function onSubmit(values: any) {
    setIsLoading(true);

    if (paymentExpired) {
      router.back();
      return;
    }

    const network = getNetworkById(values.network);
    const asset = getAssetById(values.asset);

    if (!network || !asset) {
      toast.error("Invalid network or asset");
      return;
    }

    setSelectedNetwork(network);
    setSelectedAsset(asset);
    setAssetAmount(values.amount);
    setAddress(network.deposit_address);

    onSetup(payment._id, asset)
      .then(setCurrentPayment)
      .finally(() => setIsLoading(false));
  }

  function handleVerification() {
    setValidating(true);

    if (!selectedNetwork) throw new Error("Invalid network");

    onVerification({
      paymentId: currentPayment._id,
      networkId: selectedNetwork.networkId,
      hash: transactionHash,
    })
      .then((data) => {
        if (data.response === "failed") {
          toast.error("Transaction verification failed");
        } else {
          const { response } = paymentResponseSchema.parse(data);
          toast.success("Transaction verified successfully");
          setCurrentPayment(response);
          confettiConductor?.shoot();
        }
      })
      .finally(() => setValidating(false));
  }

  return (
    <main className="flex flex-col h-screen w-full items-center justify-start p-32">
      <Fireworks
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
        onInit={(instance) => {
          setConfettiConductor(instance.conductor);
        }}
      />
      {currentPayment.status === "pending" ? (
        selectedNetwork && selectedAsset ? (
          wantToVerify ? (
            <PaymentVerify
              timer={seconds}
              transactionHash={transactionHash}
              onTransactionHashChange={setTransactionHash}
              onBack={() => setWantToVerify(false)}
              onValidate={handleVerification}
              validating={validating}
            />
          ) : (
            <PaymentProcess
              timer={seconds}
              address={address}
              network={selectedNetwork}
              asset={selectedAsset}
              amount={assetAmount}
              onCancel={() => {
                setSelectedNetwork(undefined);
                setSelectedAsset(undefined);
                onSetup(payment._id, undefined).then(setCurrentPayment);
              }}
              onPaid={() => setWantToVerify(true)}
            />
          )
        ) : (
          <Skeleton className="sm:w-[500px] w-[350px] h-1/2" />
        )
      ) : currentPayment.status === "created" ? (
        <PaymentSetup
          networks={networks}
          assets={assets}
          price={price}
          timer={seconds}
          expired={paymentExpired}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onCancel={() => router.back()}
        />
      ) : currentPayment.status === "success" ? (
        <PaymentSuccess returnUrl={returnUrl} />
      ) : (
        <PaymentExpired />
      )}
    </main>
  );
};

export { PaymentCard };
