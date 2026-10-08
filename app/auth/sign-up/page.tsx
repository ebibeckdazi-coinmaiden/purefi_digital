"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "@solar-icons/react-perf/Broken";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RiIcon from "@/app/components/ui/RiIcon";
import GoogleIcon from "@/app/components/icons/GoogleIcon";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation, useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";

export const PasswordSchema = type("string >= 8")
  .describe("Password must be at least 8 characters long")
  .and(
    type(/[A-Z]/).describe(
      "Password must contain at least one uppercase letter",
    ),
  )
  .and(
    type(/[a-z]/).describe(
      "Password must contain at least one lowercase letter",
    ),
  )
  .and(type(/[0-9]/).describe("Password must contain at least one number"))
  .and(
    type(/[^A-Za-z0-9]/).describe("Password must contain at least one symbol"),
  );

const UserSignUpSchema = type({
  email: "string.email",
  password: PasswordSchema,
  check: "boolean",
});

export default function SignUpPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createUser = useMutation(api.user.createUser);
  const ensureLinkedUser = useMutation(api.user.ensureLinkedUser);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      check: false,
    },
    onSubmit: async ({ value }) => {
      if (isSubmitting || isGoogleLoading) return;
      setIsSubmitting(true);
      try {
        await authClient.signUp.email(
          {
            name: value.email.split("@")[0],
            email: value.email,
            password: value.password,
          },
          {
            onSuccess: async () => {
              await createUser({ email: value.email });
              await authClient.sendVerificationEmail({
                email: value.email,
                callbackURL: "/onboarding",
              });
              router.push("/verify-email");
              setIsSubmitting(false);
            },
            onError: (ctx) => {
              setError(ctx.error.message);
              setIsSubmitting(false);
            },
          },
        );
      } catch {
        setIsSubmitting(false);
      }
    },
    validators: {
      onChange: ({ value }) => {
        const result = UserSignUpSchema(value);
        const Errors =
          result instanceof type.errors
            ? result.summary
                .split("\n")
                .map((s) => s.replace(/^◦\s*/, "").trim())
            : [];
        return result instanceof type.errors ? Errors : undefined;
      },
    },
  });

  const existingEmail = useQuery(api.user.checkExistingEmail, {
    email: email,
  });

  const signInWithGoogle = async () => {
    if (isSubmitting || isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google",
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-col gap-5 text-foreground">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-h2 font-bold text-foreground tracking-tight">
          Create Account
        </h1>
        <p className="text-small text-muted-foreground">
          Enter your personal data to create your account.
        </p>
      </div>
      <div className="w-full">
        <button
          onClick={() => signInWithGoogle()}
          type="button"
          disabled={isSubmitting || isGoogleLoading}
          aria-busy={isGoogleLoading}
          className="w-full relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary/60 text-foreground text-small font-medium hover:bg-surface hover:border-primary active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isGoogleLoading ? (
              <>
                <RiIcon className="ri-loader-4-line animate-spin text-lg shrink-0" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5 shrink-0 block" />
                <span>Google</span>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 text-muted-foreground">Or register with</span>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1">
          <form.Field
            name="email"
            listeners={{
              onChangeDebounceMs: 700,
              onChange: ({ value }) => {
                setEmail(value);
                form.setFieldValue("email", value);
              },
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <input
                  type="email"
                  value={field.state.value}
                  disabled={isSubmitting || isGoogleLoading}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="email"
                  className="w-full pl-4 pr-12 py-2.5 bg-input border border-primary/40 hover:border-primary/70 rounded-xl text-body text-foreground focus:outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-muted-foreground/70"
                  required
                />
                <p className="mt-1 text-xs text-red-500">
                  {(field.state.value.length === 0 &&
                    "Please enter an email address") ||
                    (!field.state.value.match(
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    ) &&
                      "Please enter a valid email address") ||
                    (existingEmail === true && "Email address already exists")}
                </p>
              </div>
            )}
          </form.Field>
        </div>
        <form.Field name="password">
          {(field) => (
            <div className="space-y-1 relative">
              <input
                type={isVisible ? "text" : "password"}
                value={field.state.value}
                disabled={isSubmitting || isGoogleLoading}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="password"
                className="w-full pl-4 pr-12 py-2.5 bg-input border border-primary/40 hover:border-primary/70 rounded-xl text-body text-foreground focus:outline-none focus:border-primary focus:bg-surface transition-all placeholder:text-muted-foreground/70"
                required
              />
              <span
                className="absolute inset-y-0 bottom-3 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => toggleVisibility()}
              >
                {isVisible ? (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <EyeClosed className="w-5 h-5 text-muted-foreground" />
                )}
              </span>
              <p className="mt-1 text-xs text-red-500">
                {(field.state.value.length < 8 &&
                  "Password must be at least 8 characters") ||
                  (field.state.value.match(/[a-z]/) === null &&
                    "Password must contain at least one lowercase letter") ||
                  (field.state.value.match(/[A-Z]/) === null &&
                    "Password must contain at least one uppercase letter") ||
                  (field.state.value.match(/[0-9]/) === null &&
                    "Password must contain at least one number") ||
                  (field.state.value.match(/[!@#$%^&*(),.?":{}|<>]/) === null &&
                    "Password must contain at least one special character")}
              </p>
            </div>
          )}
        </form.Field>
        <form.Field name="check">
          {(field) => (
            <div className="flex items-start gap-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  disabled={isSubmitting || isGoogleLoading}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="peer h-4 w-4 bg-input cursor-pointer appearance-none rounded border border-primary/40 checked:bg-primary transition-all"
                  required
                />
                <RiIcon className="ri-check-line absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 pointer-events-none text-xs font-bold" />
              </div>
              <label
                htmlFor="terms"
                className="text-xs text-muted-foreground cursor-pointer select-none"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground hover:underline underline-offset-2"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.values.check]}>
          {([check]) => (
            <button
              type="submit"
              disabled={!check || isSubmitting || isGoogleLoading}
              aria-busy={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(159,232,112,0.3)]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <RiIcon className="ri-loader-4-line animate-spin text-lg shrink-0" />
                  Creating account...
                </span>
              ) : isGoogleLoading ? (
                <span className="inline-flex items-center justify-center gap-2 opacity-70">
                  <RiIcon className="ri-loader-4-line animate-spin text-lg shrink-0" />
                  Please wait...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          )}
        </form.Subscribe>
      </form>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-small rounded-lg border border-destructive/20 text-center">
          {error}
        </div>
      )}

      <p className="text-center text-small text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="text-foreground font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
