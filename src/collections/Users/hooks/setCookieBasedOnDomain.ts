import type { CollectionAfterLoginHook } from "payload";

import { mergeHeaders } from "@payloadcms/next/utilities";
import { generateCookie, getCookieExpiration } from "payload";
import { z } from "zod";

const hostSchema = z.string().pipe(
  z
    .string()
    .refine((val) => ["gold", "silver", "bronze"].some((medal) => val.includes(medal)), {
      message: "Must include 'gold', 'silver', or 'bronze'",
    })
    .transform((val) => {
      if (val.includes("gold")) return "gold.test" as const;
      if (val.includes("silver")) return "silver.test" as const;
      return "bronze.test" as const;
    })
);

const userSchema = z.object({
  id: z.number(),
  roles: z.array(z.string()),
  username: z.string(),
  tenants: z.array(
    z.object({
      id: z.string(),
      tenant: z.number(),
      roles: z.array(z.string()),
    })
  ),
  updatedAt: z.string(),
  createdAt: z.string(),
  email: z.string(),
  resetPasswordToken: z.string().nullable(),
  resetPasswordExpiration: z.string().nullable(),
  salt: z.string(),
  hash: z.string(),
  loginAttempts: z.number(),
  lockUntil: z.string().nullable(),
  collection: z.string(),
});

const docSchema = z.object({
  docs: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        domain: z.string(),
        slug: z.string(),
        allowPublicRead: z.boolean(),
        updatedAt: z.string(),
        createdAt: z.string(),
      })
    )
    .nonempty()
    .transform((docs) => {
      if (docs.length === 0) throw new Error("Docs array cannot be empty");
      return docs;
    }),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
  limit: z.number(),
  nextPage: z.string().nullable(),
  page: z.number(),
  pagingCounter: z.number(),
  prevPage: z.string().nullable(),
  totalDocs: z.number(),
  totalPages: z.number(),
});

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  const parsedHost = hostSchema.safeParse(req.headers.get("host"));
  const parsedUser = userSchema.safeParse(user);

  if (!parsedHost.success || !parsedUser.success) {
    console.log("Invalid host or user data");
    return user;
  }

  const relatedOrg = await req.payload.find({
    collection: "tenants",
    depth: 0,
    limit: 1,
    where: {
      domain: {
        equals: parsedHost.data,
      },
    },
  });

  const parsedRelatedOrg = docSchema.safeParse(relatedOrg);
  if (!parsedRelatedOrg.success || parsedRelatedOrg.data.docs.length === 0) {
    console.log("Failed to parse related org or no docs found");
    return user;
  }

  const tenantMatch = parsedUser.data.tenants.some(
    (tenant) => tenant.tenant === parsedRelatedOrg.data.docs[0].id
  );

  console.log("Tenant match status:", tenantMatch ? "true" : "false");

  const tenantCookie = generateCookie({
    name: `tenant-match-${tenantMatch ? "true" : "false"}-payload-tenant`,
    expires: getCookieExpiration({ seconds: 7200 }),
    path: "/",
    returnCookieAsObject: false,
    value: parsedRelatedOrg.data.docs[0].id.toString(),
  });

  // Merge existing responseHeaders with the new Set-Cookie header
  const newHeaders = new Headers({
    "Set-Cookie": tenantCookie as string,
  });

  req.responseHeaders = req.responseHeaders
    ? mergeHeaders(req.responseHeaders, newHeaders)
    : newHeaders;

  return user;
};
