import copy from "copy-to-clipboard";
import QRCode from "qrcode";
import { toast } from "sonner";
import { priceResponseSchema } from "./schemas";

export function copyToClipboard(text: string, message: string) {
  copy(text);
  toast.success(message);
}

export function createQRCode(address: string) {
  return new Promise<string>((resolve, reject) => {
    QRCode.toDataURL(address, {
      type: "image/png",
      errorCorrectionLevel: "H",
      margin: 0,
    })
      .then(resolve)
      .catch(reject);
  });
}

function formatNumberToPrice(value: number, decimals: number) {
  const strValue = value.toString();
  const [integerPart, decimalPart] = strValue.split(".");

  if (!decimalPart) return strValue;

  const match = decimalPart.match(/0+(?=[^0]|$)/);

  if (!match) return integerPart + "." + decimalPart.slice(0, decimals);

  const zeroCount = match[0].length;

  const significantDecimal = decimalPart
    .slice(0, zeroCount + 4)
    .replace(/0+$/, "")
    .slice(0, decimals);

  return `${integerPart}.${significantDecimal}`;
}

export async function convertCurrency(
  amount: number,
  base: string,
  currency: string,
  decimals: number
) {
  const response = await fetch(
    `https://api.coinbase.com/v2/prices/${base}-${currency}/spot`
  );

  const json = await response.json();

  if (!response.ok) throw new Error(json.errors[0].message);

  const { data } = priceResponseSchema.parse(json);

  const convertedAmount = parseFloat(data.amount) * amount;

  return formatNumberToPrice(convertedAmount, decimals);
}

export function getTimeDifference(date: Date) {
  return Math.floor((new Date().getTime() - date.getTime()) / 1000);
}
