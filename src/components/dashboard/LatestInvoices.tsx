"use client";
import { trpc } from "@/app/_trpc/client";
import { cn, formatCurrency } from "@/lib/utils";
import tinydate from "tinydate";
export default function LatestInvoices() {
  const { data: latestInvoices, isLoading } = trpc.getLatestInvoices.useQuery();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className=" mb-4 text-xl md:text-2xl">Latest Invoices</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestInvoices?.map((invoice, i) => {
            const date = new Date(invoice.createdAt);
            const stamp = tinydate("{DD} {MMMM} {YYYY}", {
              MMMM: (d) => d.toLocaleString("default", { month: "short" }),
              DD: (d) => d.getDate(),
            });
            return (
              <div
                key={invoice.id}
                className={cn(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.Customer.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {stamp(date)}
                    </p>
                  </div>
                </div>
                <p className="truncate text-sm md:text-base">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
