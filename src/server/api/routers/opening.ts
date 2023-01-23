import { formatISO } from "date-fns";
import { z } from "zod";
import { adminProcedute, createTRPCRouter } from "../trpc";

export const openingRouter = createTRPCRouter({
  changeOpeningHours: adminProcedute
    .input(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          openTime: z.string(),
          closeTime: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const results = await Promise.all(
        input.map(async (day) => {
          const updatedDay = await ctx.prisma.day.update({
            where: { id: day.id },
            data: {
              openTime: day.openTime,
              closeTime: day.closeTime,
            },
          });

          return updatedDay;
        })
      );

      return results;
    }),

  closeDay: adminProcedute.input(z.object({ date: z.date() })).mutation(
    async ({ ctx, input }) =>
      await ctx.prisma.closedDay.create({
        data: {
          date: input.date,
        },
      })
  ),

  openDay: adminProcedute.input(z.object({ date: z.date() })).mutation(
    async ({ ctx, input }) =>
      await ctx.prisma.closedDay.delete({
        where: {
          date: input.date,
        },
      })
  ),

  getClosedDays: adminProcedute.query(async ({ ctx }) => {
    const closedDays = await ctx.prisma.closedDay.findMany();

    return closedDays.map((day) => formatISO(day.date));
  }),
});
