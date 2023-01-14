import { s3 } from "@lib/s3";
import { createTRPCRouter, publicProcedure } from "../trpc";

// dummy function for now
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const menuRouter = createTRPCRouter({
  getMenuItems: publicProcedure.query(async ({ ctx }) => {
    const menuItems = await ctx.prisma.menuItem.findMany();

    // Each menu item only contains its AWS key. Extend all items with their actual image url
    const withUrls = await Promise.all(
      menuItems.map(async (menuItem) => ({
        ...menuItem,
        url: await s3.getSignedUrlPromise("getObject", {
          Bucket: "booking-samhain",
          Key: menuItem.imageKey,
        }),
      }))
    );

    return withUrls;
  }),

  checkMenuStatus: publicProcedure.mutation(async () => {
    // Handle menu checking logic
    await sleep(1000);

    return { success: true };
  }),
});
