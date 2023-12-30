"use client";
import { trpc } from "@/app/_trpc/client";
import { AddCustomerDrawer } from "@/components/dashboard/AddCustomerDrawer";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Customers() {
  const { data, refetch, isLoading, isError } =
    trpc.getUserCustomers.useQuery();

  async function onAddCustomer() {
    await refetch();
  }
  return (
    <div>
      <AddCustomerDrawer onAddCustomer={onAddCustomer} />
      {isLoading ? <ReloadIcon className="animate-spin" /> : null}
      {!isError && !data ? <div>no data</div> : null}
      {data?.map((customer) => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  );
}
