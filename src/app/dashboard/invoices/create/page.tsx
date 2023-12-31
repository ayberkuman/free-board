"use client";
import { trpc } from "@/app/_trpc/client";
import { AmountInput } from "@/components/ui/amount-input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceStatus } from "@prisma/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowLeft, CheckSquare, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  customerId: z.string({
    required_error: "Please select a customer.",
  }),
  amount: z.string({
    required_error: "Please enter an amount.",
  }),
  status: z.nativeEnum(InvoiceStatus),
});

export default function Page() {
  const { data: customers } = trpc.getUserCustomers.useQuery();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate, isLoading, isSuccess } = trpc.addInvoice.useMutation();

  console.log(isSuccess, "isSuccess");
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitabbleData = {
      ...data,
      amount: Number(data.amount),
    };

    mutate(submitabbleData, {
      onSuccess: async () => {
        router.back();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 md:mx-0 mx-auto space-y-6"
      >
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customers</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <AmountInput placeholder="60" type="number" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Set the invoice status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2 items-center"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PAID" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      Paid
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PENDING" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-2">
                      Pending
                      <Clock className="h-4 w-4 text-slate-400" />
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-12">
          <Link
            href="/dashboard/invoices"
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <Button aria-disabled={isLoading} disabled={isLoading} type="submit">
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Create Invoice
          </Button>
        </div>
      </form>
    </Form>
  );
}
