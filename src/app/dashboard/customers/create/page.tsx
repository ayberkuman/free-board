"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  customerName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  imageUrl: z.string().optional(),
});

export default function CreateCustomer() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customerName: "",
    },
  });

  const { mutate, isLoading } = trpc.addCustomer.useMutation();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        name: data.customerName,
        imageUrl: data.imageUrl,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
