"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import { Timer } from "../timer";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

const PaymentVerify = ({
  timer,
  onBack,
  onValidate,
  validating,
}: {
  timer: number;
  onBack: () => void;
  onValidate: () => void;
  validating: boolean;
}) => {
  const [transactionHash, setTransactionHash] = useState("");

  return (
    <Card className="sm:w-[500px] w-[350px]">
      <CardHeader className="flex flex-row items-center">
        <div className="flex w-20 items-center justify-start">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <p className="w-full text-center font-semibold">
          Complete the payment in:
        </p>
        <div className="flex w-20 items-center justify-end">
          <Timer seconds={timer} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6 items-center">
        <div className="flex flex-col items-center w-full space-x-2 space-y-2">
          <Input
            placeholder="Transaction hash"
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 text-xs overflow-ellipsis"
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)}
          />
          <Label className="text-xs">
            Please paste your transaction hash in the field above and press the
            button to initiate the validation process.
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="min-w-full"
          onClick={onValidate}
          disabled={!transactionHash}
        >
          {validating ? <Spinner invert /> : "Validate transaction"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PaymentVerify };
