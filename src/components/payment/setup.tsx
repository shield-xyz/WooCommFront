"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertCurrency } from "@/lib/helpers";
import { Asset, Network } from "@/lib/schemas";
import { Timer } from "../timer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

const PaymentSetup = ({
  networks,
  assets,
  price,
  timer,
  expired,
  onSubmit,
  onCancel,
}: {
  networks: Network[];
  assets: Asset[];
  price: number;
  timer: number;
  expired: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [fetchingAssetPrice, setFetchingAssetPrice] = useState(false);

  const formSchema = z.object({
    network: z
      .string()
      .refine((value) => networks.map((n) => n.networkId).includes(value)),
    asset: z
      .string()
      .refine((value) => assets.map((a) => a.assetId).includes(value)),
    amount: z.string(),
  });

  function getAssetsByNetworkId(networkId: string | undefined): Asset[] {
    return assets.filter((a) => a.networkId === networkId);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      network: networks[0].networkId,
    },
  });

  const updateAssetAmount = useCallback(
    (symbol: string) => {
      setFetchingAssetPrice(true);
      convertCurrency(price, "USD", symbol)
        .then((amount) => form.setValue("amount", amount))
        .finally(() => setFetchingAssetPrice(false));
    },
    [price, form]
  );

  const watchedAsset = form.watch("asset");
  const watchedNetwork = form.watch("network");

  useEffect(() => {
    const getNetworkById = (networkId: string) => {
      return networks.find((n) => n.networkId === networkId);
    };

    const getAssetById = (assetId: string) => {
      return assets.find((a) => a.assetId === assetId);
    };

    setSelectedNetwork(getNetworkById(watchedNetwork));
    setSelectedAsset(getAssetById(watchedAsset));

    if (!watchedAsset || !selectedAsset) {
      form.setValue("amount", price.toString());
      return;
    }

    updateAssetAmount(selectedAsset.symbol);
  }, [
    watchedAsset,
    watchedNetwork,
    selectedAsset,
    selectedNetwork,
    updateAssetAmount,
    price,
    assets,
    networks,
    form,
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
        <Card className="sm:w-[500px] w-[350px]">
          <CardHeader className="flex flex-row items-center">
            <div className="flex w-20 items-center justify-start">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Warning</AlertDialogTitle>
                    <AlertDialogDescription>
                      Navigating back will discard any transactions made. Are
                      you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onCancel}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="w-full text-center font-semibold">
              Complete the payment in:
            </p>
            <div className="flex w-20 items-center justify-end">
              <Timer seconds={timer} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col w-full items-center justify-center space-y-8">
            <div className="flex items-center space-x-4 w-full">
              <div className="flex items-center space-x-2 w-full justify-center">
                <Image
                  src={selectedAsset?.logo ?? "/america.png"}
                  height={25}
                  width={25}
                  alt="currency"
                />
                {fetchingAssetPrice ? (
                  <Spinner />
                ) : (
                  <Label className="text-xl">{form.watch("amount")}</Label>
                )}
              </div>
            </div>
            <div className="flex w-full items-center space-x-4">
              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Network</FormLabel>
                    <FormControl>
                      <Select
                        disabled={expired}
                        onValueChange={(value: any) => {
                          form.setValue("network", value);
                          form.setValue("asset", "");
                        }}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networks.map((n) => (
                            <SelectItem key={n.networkId} value={n.networkId}>
                              <div className="flex items-center">
                                <div className="mr-2">
                                  <Image
                                    src={n.logo}
                                    height="20"
                                    width="20"
                                    alt={n.networkId}
                                  />
                                </div>
                                <span>{n.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Asset</FormLabel>
                    <FormControl>
                      <Select
                        disabled={!selectedNetwork || expired}
                        onValueChange={(value: any) =>
                          form.setValue("asset", value)
                        }
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAssetsByNetworkId(selectedNetwork?.networkId).map(
                            (a) => (
                              <SelectItem
                                key={a.assetId}
                                value={a.assetId}
                                disabled={!a.active}
                              >
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    <Image
                                      src={a.logo}
                                      height="20"
                                      width="20"
                                      alt={a.assetId}
                                    />
                                  </div>
                                  <span>{a.symbol}</span>
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="min-w-full"
              type="submit"
              disabled={(!selectedAsset || !selectedNetwork) && !expired}
            >
              {expired ? "Go back to site" : "Pay"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export { PaymentSetup };
