import { cn } from "@/lib/utils";
import Image from "next/image";

const Spinner = ({ invert }: { invert?: boolean }) => {
  return (
    <div>
      <Image
        src="/spinner.svg"
        height="24"
        width="24"
        alt="spinner"
        className={cn(invert && "filter invert")}
      />
    </div>
  );
};

export { Spinner };
