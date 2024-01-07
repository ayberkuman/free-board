import Cards from "@/components/dashboard/Cards";
import LatestInvoices from "@/components/dashboard/LatestInvoices";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <h2 className=" mb-4 text-xl md:text-2xl">Total Stats</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Cards />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart />
        <LatestInvoices />
      </div>
    </>
  );
}
