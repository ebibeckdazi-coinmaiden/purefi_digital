import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { render } from "@react-email/components";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import ResetPassword from "../app/emails/reset-password";
import VerifyEmail from "../app/emails/verify-email";
import { getResend } from "../lib/resend";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { internalAction, query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    verbose: false,
  },
);

const siteUrl = process.env.SITE_URL!;
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    trustedOrigins: [
      "http://localhost:3000",
      "https://purefidigital.com",
      "https://www.purefidigital.com",
    ],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await getResend().emails.send({
          from: "Purefi <info@purefidigital.com>",
          to: user.email,
          subject: "Reset your password",
          html: await render(
            ResetPassword({ email: user.email, name: user.name, url }),
          ),
        });
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await getResend().emails.send({
          from: "Purefi <info@purefidigital.com>",
          to: user.email,
          subject: "Verify your email",
          html: await render(
            VerifyEmail({ email: user.email, name: user.name, url }),
          ),
        });
      },
    },
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

export const { getAuthUser } = authComponent.clientApi();

export const rotateKeys = internalAction({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    return auth.api.rotateKeys();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});
