import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { menuRouter } from "./routers/menu";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  menu: menuRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
