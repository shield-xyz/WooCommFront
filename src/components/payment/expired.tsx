"use client";

import { ShieldX } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const PaymentExpired = () => {
  return (
    <Card className="sm:w-[500px] w-[350px]">
      <CardHeader></CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-col items-center space-y-3">
          <ShieldX className="h-20 w-20 text-red-500" />
          <p className="text-center font-semibold">Payment expired!</p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export { PaymentExpired };
