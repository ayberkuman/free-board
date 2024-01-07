"use client";

import { cn } from "@/lib/utils";
import { FileText, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
];

export default function SideNavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-accent text-accent-foreground": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-5" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
