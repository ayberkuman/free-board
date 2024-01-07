"use client";
import { trpc } from "@/app/_trpc/client";
import { formatCurrency } from "@/lib/utils";
import { Clock, FileText, Loader2, Receipt, Users } from "lucide-react";

const iconMap = {
  collected: Receipt,
  customers: Users,
  pending: Clock,
  invoices: FileText,
};

export default function Cards() {
  const { data, isLoading } = trpc.getDashboardCardStats.useQuery();

  return data ? (
    <>
      <Card title="Collected" value={data.totalRevenue} type="collected" />
      <Card title="Pending" value={data.totalPendingAmount} type="pending" />
      <Card title="Total Invoices" value={data.totalInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={data.totalCustomers}
        type="customers"
      />
    </>
  ) : isLoading ? (
    <div className="col-span-full pt-8">
      <Loader2 className="animate-spin mx-auto" />
    </div>
  ) : (
    <div>Failed to load</div>
  );
}

function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <Icon className="h-5 w-5 text-gray-700" />
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={
          "truncate rounded-xl bg-white px-4 py-8 text-center text-2xl"
        }
      >
        {type === "collected"
          ? formatCurrency(value)
          : type === "pending"
          ? formatCurrency(value)
          : value}
      </p>
    </div>
  );
}
