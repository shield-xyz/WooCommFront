"use client";

import { copyToClipboard } from "@/lib/helpers";
import { ChevronLeft, ClipboardIcon } from "lucide-react";
import Image from "next/image";

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
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AddressQRCodeCard } from "./address-qr-code-card";

const PaymentProcess = ({
  timer,
  address,
  network,
  asset,
  amount,
  onCancel,
  onPaid,
}: {
  timer: number;
  address: string;
  network: Network;
  asset: Asset;
  amount: string;
  onCancel?: () => void;
  onPaid?: () => void;
}) => {
  return (
    <Card className="sm:w-[500px] w-[350px]">
      <CardHeader className="flex flex-row items-center">
        <div className="flex w-20 items-center justify-start">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Warning</AlertDialogTitle>
                <AlertDialogDescription>
                  Navigating back will discard any transactions made. Are you
                  sure you want to continue?
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
      <CardContent className="flex flex-col space-y-6 items-center">
        <div className="flex flex-col space-y-2 w-full justify-center items-center">
          <AddressQRCodeCard address={address} logo={network.logo} />
        </div>
        <div className="flex items-center w-full space-x-2">
          <Input
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 text-xs overflow-ellipsis"
            value={address}
            readOnly
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              copyToClipboard(address, "Address copied to clipboard!")
            }
          >
            <ClipboardIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <Image src={asset.logo} height="30" width="30" alt={asset.symbol} />
          </div>
          <Label className="text-2xl">{amount}</Label>
          <ClipboardIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() =>
              copyToClipboard(amount, "Amount copied to clipboard!")
            }
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="min-w-full" onClick={onPaid}>
          I have paid!
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PaymentProcess };
