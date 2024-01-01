"use client";
import { trpc } from "@/app/_trpc/client";
import CustomersGrid from "@/components/dashboard/CustomersGrid";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Customers() {
  const { data, isLoading, refetch } = trpc.getUserCustomers.useQuery();

  async function afterDelete() {
    await refetch();
  }

  return (
    <div>
      <Link
        href="/dashboard/customers/create"
        className={buttonVariants({ variant: "default" })}
      >
        <PlusCircledIcon className="mr-2 h-5 w-5" />
        Create Customer
      </Link>
      {data && data.length !== 0 ? (
        <CustomersGrid customers={data} afterDelete={afterDelete} />
      ) : isLoading ? (
        <ReloadIcon className="animate-spin h-5 w-5" />
      ) : (
        <div>
          <p>You don&apos;t have any customers yet.</p>
          <p>Click the button above to add your first customer.</p>
        </div>
      )}
    </div>
  );
}
