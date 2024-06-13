"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { createQRCode } from "@/lib/helpers";

const AddressQRCodeCard = ({
  address,
  logo,
}: {
  address: string;
  logo: string;
}) => {
  const [qrCode, setQrCode] = useState<string>();

  useEffect(() => {
    createQRCode(address).then(setQrCode).catch(console.error);
  }, [address]);

  return (
    <div className="p-2 max-w-fit rounded-lg border bg-card text-card-foreground relative">
      {qrCode ? (
        <Image
          src={qrCode}
          height={250}
          width={250}
          alt="qr-code"
          draggable={false}
        />
      ) : null}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full w-14 h-14 flex items-center justify-center">
        <div className="relative flex w-12 h-12 items-center justify-center bg-white rounded-full">
          <Image
            src={logo}
            alt="network"
            className="p-1 w-full h-full object-cover"
            fill={true}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export { AddressQRCodeCard };
