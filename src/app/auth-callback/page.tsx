"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";

export default function Page() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // user is synced to db
        console.log("success");
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <ReloadIcon className="w-8 h-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl ">Authenticating...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}
