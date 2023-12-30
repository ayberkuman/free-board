"use client";
import { trpc } from "@/app/_trpc/client";
import InvoicesTable from "@/components/dashboard/InvoicesTable";

export default function Invoices() {
  const {
    data: invoicesData,
    isLoading,
    isError,
  } = trpc.getAllInvoices.useQuery();

  const formattedData = invoicesData?.map(({ id, amount, status }) => ({
    id,
    amount,
    status,
  }));

  return <div>{formattedData && <InvoicesTable data={formattedData} />}</div>;
}
