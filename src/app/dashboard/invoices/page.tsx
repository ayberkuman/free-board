"use client";
import { trpc } from "@/app/_trpc/client";
import InvoicesTable from "@/components/dashboard/InvoicesTable";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Invoices() {
  const { data: invoicesData, isLoading } = trpc.getAllInvoices.useQuery();

  const formattedData = invoicesData?.map(
    ({ id, amount, status, createdAt, customerName }) => ({
      id,
      amount,
      status,
      createdAt,
      customerName,
    })
  );

  return (
    <div>
      <Link
        href="/dashboard/invoices/create"
        className={buttonVariants({ variant: "default" })}
      >
        <PlusCircledIcon className="mr-2 h-5 w-5" />
        Create Invoice
      </Link>
      {formattedData && formattedData.length !== 0 ? (
        <InvoicesTable data={formattedData} />
      ) : isLoading ? (
        <ReloadIcon className="animate-spin h-5 w-5" />
      ) : (
        <div>
          <p>You don&apos;t have any invoices yet.</p>
          <p>Click the button above to add your first invoice.</p>
        </div>
      )}
    </div>
  );
}
