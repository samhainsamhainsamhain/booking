import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getJwtSecretKey } from "../../../lib/auth";
import cookie from "cookie";

import { adminProcedute, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { s3 } from "@lib/s3";
import { MAX_FILE_SIZE } from "src/constants";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { res } = ctx;
      const { email, password } = input;

      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        // user is authenticated as admin
        const token = await new SignJWT({})
          .setProtectedHeader({
            alg: "HS256",
          })
          .setJti(nanoid())
          .setIssuedAt()
          .setExpirationTime("1h")
          .sign(new TextEncoder().encode(getJwtSecretKey()));

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("user-token", token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
          })
        );

        return { success: true };
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }),

  sensitive: adminProcedute.mutation(() => {
    return "sensitive";
  }),

  createPresignedUrl: adminProcedute
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ input }) => {
      const id = nanoid();
      const fileExtension = input.fileType.split("/")[1];

      if (fileExtension === undefined)
        throw new Error("File extension is undefined");

      const key = `${id}.${fileExtension}`;

      const { url, fields } = (await new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Bucket: "booking-samhain",
            Fields: { key },
            Expires: 60,
            Conditions: [
              ["content-length-range", 0, MAX_FILE_SIZE],
              ["starts-with", "$Content-type", "image/"],
            ],
          },
          (error, data) => {
            if (error) return reject(error);
            resolve(data);
          }
        );
      })) as any as { url: string; fields: { [key: string]: any } };

      return { url, fields, key };
    }),

  addMenuItem: adminProcedute
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        imageKey: z.string(),
        categories: z.array(
          z.union([
            z.literal("breakfast"),
            z.literal("lunch"),
            z.literal("dinner"),
          ])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, price, categories, imageKey } = input;
      const menuItem = await ctx.prisma.menuItem.create({
        data: {
          name,
          price,
          categories,
          imageKey,
        },
      });

      return menuItem;
    }),

  deleteMenuItem: adminProcedute
    .input(z.object({ imageKey: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete image from S3
      const { id, imageKey } = input;
      await s3
        .deleteObject({
          Bucket: "booking-samhain",
          Key: imageKey,
        })
        .promise();

      // Delete image from db
      const menuItem = await ctx.prisma.menuItem.delete({ where: { id } });

      return menuItem;
    }),
});
