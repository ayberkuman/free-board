"use client";
import { trpc } from "@/app/_trpc/client";
import { AddCustomerDrawer } from "@/components/dashboard/AddCustomerDrawer";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Customers() {
  const { data, refetch, isLoading } = trpc.getUserCustomers.useQuery();

  async function onAddCustomer() {
    await refetch();
  }
  return (
    <div>
      <AddCustomerDrawer onAddCustomer={onAddCustomer} />
      {data && data.length !== 0 ? (
        data?.map((customer) => <div key={customer.id}>{customer.name}</div>)
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
