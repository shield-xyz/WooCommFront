import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-start justify-center pt-32">
      <Skeleton className="sm:w-[500px] w-[350px] h-1/2" />
    </div>
  );
}
