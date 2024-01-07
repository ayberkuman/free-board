import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/db";
import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),

  getUserCustomers: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.customer.findMany({
      where: {
        userId,
      },
      include: {
        invoices: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }),

  getAllInvoices: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const invoices = await db.invoice.findMany({
      where: {
        Customer: {
          userId,
        },
      },
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
      },
    });
    return invoices.map((invoice) => ({
      ...invoice,
      customerName: invoice.Customer.name,
    }));
  }),

  addCustomer: privateProcedure
    .input(
      z.object({
        name: z.string(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { name, imageUrl } = input;

      const dbUser = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const newCustomer = await db.customer.create({
        data: {
          name,
          imageUrl,
          userId: dbUser.id,
        },
      });

      return newCustomer;
    }),

  addInvoice: privateProcedure
    .input(
      z.object({
        customerId: z.string(),
        amount: z.number(),
        status: z.nativeEnum(InvoiceStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { customerId, amount, status } = input;

      const dbUser = await db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          customers: true,
        },
      });

      if (!dbUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const invoice = await db.invoice.create({
        data: {
          amount,
          status,
          customerId,
        },
      });

      return invoice;
    }),

  deleteCustomer: privateProcedure
    .input(
      z.object({
        customerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { customerId } = input;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.customer.delete({
        where: {
          id: customerId,
        },
      });
    }),

  getDashboardCardStats: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const totalRevenue = await db.invoice.aggregate({
      where: {
        Customer: {
          userId,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalPendingAmount = await db.invoice.aggregate({
      where: {
        Customer: {
          userId,
        },
        status: InvoiceStatus.PENDING,
      },
      _sum: {
        amount: true,
      },
    });

    const totalCustomers = await db.customer.count({
      where: {
        userId,
      },
    });

    const totalInvoices = await db.invoice.count({
      where: {
        Customer: {
          userId,
        },
      },
    });

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      totalPendingAmount: totalPendingAmount._sum.amount || 0,
      totalCustomers,
      totalInvoices,
    };
  }),

  getLatestInvoices: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const invoices = await db.invoice.findMany({
      where: {
        Customer: {
          userId,
        },
      },
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    return invoices;
  }),
  
  getMonthlyRevenue: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const result = await db.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        SUM(amount) as revenue
      FROM Invoice
      WHERE customerId IN (
        SELECT id FROM Customer WHERE userId = ${userId}
      ) AND createdAt >= ${startDate}
      GROUP BY month
      ORDER BY month;
    `;

    return result;
  }),
});

export type AppRouter = typeof appRouter;
