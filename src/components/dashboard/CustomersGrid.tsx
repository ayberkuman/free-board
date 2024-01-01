"use client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CheckSquare, Clock, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Customer, Invoice } from "@prisma/client";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/utils";
import tinydate from "tinydate";
import { useState } from "react";
import { AlertModal } from "../AlertModal";
import { trpc } from "@/app/_trpc/client";
import { ReloadIcon } from "@radix-ui/react-icons";

type CustomersWithLastInvoice = Pick<Customer, "id" | "name"> & {
  invoices: (Pick<Invoice, "id" | "amount" | "status"> & {
    createdAt: string;
  })[];
};

export default function CustomersGrid({
  customers,
  afterDelete,
}: {
  customers: CustomersWithLastInvoice[];
  afterDelete: () => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const { mutate, isLoading } = trpc.deleteCustomer.useMutation();

  const handleDelete = (id: string) => {
    mutate(
      {
        customerId: id,
      },
      {
        onSuccess: () => {
          afterDelete();
        },
      }
    );
  };

  return (
    <ul
      role="list"
      className="grid grid-cols-1 my-4 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
    >
      {isLoading ? (
        <ReloadIcon className="animate-spin" />
      ) : (
        customers.map((customer) => {
          const date = new Date(customer?.invoices[0]?.createdAt);
          const stamp = tinydate("{DD} {MMMM} {YYYY}", {
            MMMM: (d) => d.toLocaleString("default", { month: "short" }),
            DD: (d) => d.getDate(),
          });
          return (
            <li
              key={customer.id}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                {/*  <img
              src={customer.imageUrl}
              alt={customer.name}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            /> */}
                <div className="text-sm font-medium leading-6 text-gray-900 capitalize">
                  {customer.name}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="sr-only">Open options</span>
                    <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCustomer(customer.id);
                        setIsDeleteModalOpen(!isDeleteModalOpen);
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Last invoice</dt>
                  <dd className="text-gray-700">
                    <time>
                      {customer.invoices.length !== 0 ? stamp(date) : "-"}
                    </time>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Amount</dt>
                  <dd className="flex gap-x-2">
                    <span>
                      {customer.invoices.length !== 0
                        ? formatCurrency(customer.invoices[0]?.amount)
                        : "-"}
                    </span>
                    {customer.invoices.length !== 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-transparent pointer-events-none p-0 m-0 grid place-items-center"
                      >
                        {customer.invoices[0]?.status === "PAID" ? (
                          <CheckSquare className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </Badge>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })
      )}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        selected={selectedCustomer}
        onAccept={handleDelete}
      />
    </ul>
  );
}
