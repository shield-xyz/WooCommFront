"use client";

import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Spinner } from "../ui/spinner";

const PaymentSuccess = ({ returnUrl }: { returnUrl: string }) => {
  const router = useRouter();

  const [redirecting, setRedirecting] = useState(false);

  const handleRedirect = () => {
    setRedirecting(true);
    router.push(returnUrl);
  };

  return (
    <Card className="sm:w-[500px] w-[350px]">
      <CardHeader></CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-col items-center space-y-3">
          <CircleCheck className="h-20 w-20 text-green-500" />
          <p className="text-center font-semibold">Payment successful!</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="min-w-full" onClick={handleRedirect}>
          {redirecting ? <Spinner invert /> : "Back to site"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PaymentSuccess };
