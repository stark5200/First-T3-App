import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";



export const profileRouter = createTRPCRouter({
  getUserByUsername: 
});
