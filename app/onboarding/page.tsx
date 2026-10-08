"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation, useAction, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { AuthGuard } from "@/app/components/auth/AuthGuard";
import RiIcon from "../components/ui/RiIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import PhoneInput from "../components/ui/PhoneInput";
import CountrySelect from "../components/ui/CountrySelect";
import CurrencySelect from "../components/ui/CurrencySelect";
import LanguageSelect from "../components/ui/LanguageSelect";

const NameSchema = type("string >= 1").and(type("string <= 40"));
const PhoneSchema = type(/^\d{7,15}$/);
const DobSchema = type(/^\d{4}-\d{2}-\d{2}$/);
const CountrySchema = type("string >= 2").and(type("string <= 56"));
const CitySchema = type("string >= 1").and(type("string <= 56"));
const AddressSchema = type("string >= 3").and(type("string <= 120"));
const ZipSchema = type("string >= 3").and(type("string <= 16"));
const OccupationSchema = type("string >= 2").and(type("string <= 60"));
const CurrencySchema = type(
  /^(USD|EUR|GBP|JPY|CNY|INR|CAD|AUD|CHF|NGN|BRL|RUB|KRW|ZAR|SEK|NOK|DKK|SGD|HKD|NZD|MXN|ARS|TRY|AED|SAR)$/,
);
const LanguageSchema = type(
  /^(English|Spanish|French|German|Chinese|Japanese|Korean|Italian|Portuguese|Russian|Arabic|Hindi|Turkish|Dutch|Swedish|Indonesian|Vietnamese|Thai)$/,
);

const normalizePhone = (value: string) =>
  value.replace(/[^\d]/g, "").slice(0, 15);

const getStringError = (result: unknown, fallback: string) => {
  if (result instanceof type.errors) {
    return (
      result.summary.split("\n")[0]?.replace(/^◦\s*/, "").trim() || fallback
    );
  }
  return null;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [showStepErrors, setShowStepErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const identity = useQuery(api.auth.getCurrentUser);
  const isAdminIdentity = useQuery(api.admin.isAdmin);
  const createUser = useMutation(api.user.createUser);
  const ensureUserAccounts = useMutation(api.accounts.ensureUserAccounts);
  const ensureDefaultCard = useMutation(api.creditCards.ensureDefaultCard);
  const provisionUserCryptoVault = useAction(
    api.actions.wallet.generate.provisionUserCryptoVault,
  );

  useEffect(() => {
    if (isAdminIdentity === undefined) return;
    if (isAdminIdentity) router.replace("/admin");
  }, [isAdminIdentity, router]);

  console.log(identity);
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dob: "2004-04-04",
      country: "",
      city: "",
      address: "",
      zipCode: "",
      occupation: "",
      currency: "USD",
      language: "English",
    },
    onSubmit: async ({ value }) => {
      if (!identity?.email) return;
      const phoneDigits = normalizePhone(value.phoneNumber);
      const phonenumber = phoneDigits ? Number(phoneDigits) : undefined;
      await createUser({
        email: identity?.email,
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        phonenumber,
        dob: value.dob,
        country: value.country.trim(),
        city: value.city.trim(),
        address: value.address.trim(),
        zipCode: value.zipCode.trim(),
        occupation: value.occupation.trim(),
        currency: value.currency,
        language: value.language,
      });
      await Promise.all([
        ensureUserAccounts({}),
        ensureDefaultCard({}),
        provisionUserCryptoVault({}),
      ]);
      router.push("/home");
    },
  });

  const validateStep = (nextStep: number) => {
    const v = form.state.values;
    if (nextStep === 2) {
      const phoneDigits = normalizePhone(v.phoneNumber);
      const phoneError = phoneDigits
        ? getStringError(PhoneSchema(phoneDigits), "Enter a valid phone number")
        : "Phone number is required";
      const errors = [
        getStringError(
          NameSchema(v.firstName.trim()),
          "First name is required",
        ),
        getStringError(NameSchema(v.lastName.trim()), "Last name is required"),
        phoneError,
        getStringError(DobSchema(v.dob), "Enter a valid date of birth"),
        getStringError(
          OccupationSchema(v.occupation.trim()),
          "Occupation is required",
        ),
      ].filter(Boolean);
      return errors.length === 0;
    }
    if (nextStep === 3) {
      const errors = [
        getStringError(CountrySchema(v.country.trim()), "Country is required"),
        getStringError(CitySchema(v.city.trim()), "City is required"),
        getStringError(ZipSchema(v.zipCode.trim()), "Zip code is required"),
        getStringError(AddressSchema(v.address.trim()), "Address is required"),
      ].filter(Boolean);
      return errors.length === 0;
    }
    if (nextStep === 4) {
      const errors = [
        getStringError(CurrencySchema(v.currency), "Select a currency"),
        getStringError(LanguageSchema(v.language), "Select a language"),
      ].filter(Boolean);
      return errors.length === 0;
    }
    return true;
  };

  const handleNext = () => {
    const nextStep = step + 1;
    const ok = validateStep(nextStep);

    if (!ok) {
      setShowStepErrors(true);
      return;
    }

    setShowStepErrors(false);

    if (step < totalSteps) {
      setStep(nextStep);
    } else if (step === totalSteps) {
      setLoading(true);
      void form.handleSubmit();
    } else {
      return;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowStepErrors(false);
    }
  };

  // Signed-in users can't just Link back to /auth/sign-in (AuthLayout
  // bounces verified users to onboarding/home), so sign out first.
  const handleSwitchAccount = async (
    destination: "/auth/sign-in" | "/auth/sign-up",
  ) => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut();
    } catch {
      // Still navigate even if sign-out fails; guards will handle it.
    } finally {
      router.replace(destination);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-5 relative z-10"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field name="firstName">
                {(field) => {
                  const error = getStringError(
                    NameSchema(field.state.value.trim()),
                    "First name is required",
                  );
                  const showError =
                    showStepErrors || Boolean(field.state.meta.isTouched);
                  return (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-small font-medium text-foreground/85">
                        First Name
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="John"
                          className="w-full rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      {showError && error && (
                        <p className="pl-1 text-caption text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
              <form.Field name="lastName">
                {(field) => {
                  const error = getStringError(
                    NameSchema(field.state.value.trim()),
                    "Last name is required",
                  );
                  const showError =
                    showStepErrors || Boolean(field.state.meta.isTouched);
                  return (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-small font-medium text-foreground/85">
                        Last Name
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Doe"
                          className="w-full rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      {showError && error && (
                        <p className="pl-1 text-caption text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="phoneNumber">
              {(field) => {
                const digits = normalizePhone(field.state.value);
                const error = digits
                  ? getStringError(
                      PhoneSchema(digits),
                      "Enter a valid phone number",
                    )
                  : "Phone number is required";
                const showError =
                  showStepErrors || Boolean(field.state.meta.isTouched);
                return (
                  <div>
                    <PhoneInput
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                    />
                    {showError && error && (
                      <p className="mt-1 pl-1 text-caption text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field name="dob">
                {(field) => {
                  const error = getStringError(
                    DobSchema(field.state.value),
                    "Enter a valid date of birth",
                  );
                  const showError =
                    showStepErrors || Boolean(field.state.meta.isTouched);
                  return (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-small font-medium text-foreground/85">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-calendar-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                        <input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full appearance-none rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none scheme-light [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                      {showError && error && (
                        <p className="pl-1 text-caption text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="occupation">
                {(field) => {
                  const error = getStringError(
                    OccupationSchema(field.state.value.trim()),
                    "Occupation is required",
                  );
                  const showError =
                    showStepErrors || Boolean(field.state.meta.isTouched);
                  return (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-small font-medium text-foreground/85">
                        Occupation
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-briefcase-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Software Engineer"
                          className="w-full rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      {showError && error && (
                        <p className="pl-1 text-caption text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-5 relative z-10"
          >
            <form.Field name="country">
              {(field) => {
                const error = getStringError(
                  CountrySchema(field.state.value.trim()),
                  "Country is required",
                );
                const showError =
                  showStepErrors || Boolean(field.state.meta.isTouched);
                return (
                  <div>
                    <CountrySelect
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                    />
                    {showError && error && (
                      <p className="mt-1 pl-1 text-caption text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.Field name="city">
                {(field) => {
                  const error = getStringError(
                    CitySchema(field.state.value.trim()),
                    "City is required",
                  );
                  const showError =
                    showStepErrors || Boolean(field.state.meta.isTouched);
                  return (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-small font-medium text-foreground/85">
                        City
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-building-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="New York"
                          className="w-full rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      {showError && error && (
                        <p className="pl-1 text-caption text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="zipCode">
                {(field) => {
                  const error = getStringError(
                    ZipSchema(field.state.value.trim()),
                    "Zip code is required",
                  );
                  const showError =
                    showStepErrors || Boolean(field.state.meta.isTouched);
                  return (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-small font-medium text-foreground/85">
                        Zip Code
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="10001"
                          className="w-full rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none"
                        />
                      </div>
                      {showError && error && (
                        <p className="pl-1 text-caption text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="address">
              {(field) => {
                const error = getStringError(
                  AddressSchema(field.state.value.trim()),
                  "Address is required",
                );
                const showError =
                  showStepErrors || Boolean(field.state.meta.isTouched);
                return (
                  <div className="space-y-1.5">
                    <label className="pl-1 text-small font-medium text-foreground/85">
                      Address
                    </label>
                    <div className="relative">
                      <RiIcon className="ri-home-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="123 Main St, Apt 4B"
                        className="w-full rounded-xl border border-primary/40 hover:border-primary/70 bg-input py-2.5 pr-4 pl-11 text-body text-foreground transition-all placeholder:text-muted-foreground/70 focus:bg-surface focus:border-primary focus:outline-none"
                      />
                    </div>
                    {showError && error && (
                      <p className="pl-1 text-caption text-red-500">{error}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-5 relative z-10"
          >
            <form.Field name="currency">
              {(field) => {
                const error = getStringError(
                  CurrencySchema(field.state.value),
                  "Select a currency",
                );
                const showError =
                  showStepErrors || Boolean(field.state.meta.isTouched);
                return (
                  <div>
                    <CurrencySelect
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                    />
                    {showError && error && (
                      <p className="mt-1 pl-1 text-caption text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="language">
              {(field) => {
                const error = getStringError(
                  LanguageSchema(field.state.value),
                  "Select a language",
                );
                const showError =
                  showStepErrors || Boolean(field.state.meta.isTouched);
                return (
                  <div>
                    <LanguageSelect
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                    />
                    {showError && error && (
                      <p className="mt-1 pl-1 text-caption text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 items-start mt-6">
              <RiIcon className="ri-shield-check-line text-primary text-xl mt-0.5" />
              <div>
                <h4 className="text-small font-medium text-foreground">
                  Data Privacy
                </h4>
                <p className="mt-1 text-caption text-muted-foreground">
                  Your information is securely stored and used only for account
                  verification purposes in compliance with financial
                  regulations.
                </p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard requireAuth requireVerified>
      <main className="flex min-h-dvh w-full justify-center bg-white text-foreground">
        <ScrollArea className="w-full">
          <div className="relative w-full max-w-3xl overflow-hidden mx-auto py-8">
            <div className="flex items-center justify-start mb-6 relative z-10">
              <button
                type="button"
                onClick={() => handleSwitchAccount("/auth/sign-in")}
                disabled={signingOut}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/60 hover:border-primary px-4 py-2 text-small font-medium text-foreground transition-all hover:bg-input active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {signingOut ? (
                  <RiIcon className="ri-loader-4-line animate-spin" />
                ) : (
                  <RiIcon className="ri-arrow-left-line" />
                )}
                {signingOut ? "Signing out..." : "Back to sign in"}
              </button>
            </div>
            <div className="flex flex-col gap-1 text-center mb-6 relative z-10">
              <h1 className="text-h2 font-bold tracking-tight text-foreground">
                Complete Profile
              </h1>
              <p className="text-small text-muted-foreground">
                Step {step} of {totalSteps} • Tell us a bit more about yourself
              </p>
            </div>

            <div className="mb-8 relative z-10">
              <div className="h-1.5 w-full bg-input rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            <div className="flex gap-4 pt-6 relative">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 rounded-xl border border-primary/60 hover:border-primary py-3 text-small font-medium text-foreground transition-all hover:bg-input active:scale-95"
                >
                  Back
                </button>
              )}
              {step === totalSteps ? (
                <button
                  type="button"
                  onClick={() => handleNext()}
                  disabled={form.state.isSubmitting}
                  className={`flex-1 rounded-xl bg-primary py-3 text-small font-semibold text-primary-foreground shadow-premium transition-all hover:bg-primary/90 active:scale-95 ${form.state.isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
                >
                  {loading ? "Saving..." : "Finish Setup"}
                </button>
              ) : (
                <button
                  onClick={() => handleNext()}
                  disabled={step === totalSteps}
                  className="flex-1 rounded-xl bg-primary py-3 text-small font-semibold text-primary-foreground shadow-premium transition-all hover:bg-primary/90 active:scale-95"
                >
                  Continue
                </button>
              )}
            </div>

            <p className="relative z-10 mt-6 text-center text-caption text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <p className="relative z-10 mt-4 text-center text-caption text-muted-foreground">
              {identity?.email ? (
                <>
                  Signed in as{" "}
                  <span className="font-medium text-foreground">
                    {identity.email}
                  </span>
                  . Wrong account?{" "}
                </>
              ) : (
                <>Wrong account? </>
              )}
              <button
                type="button"
                onClick={() => handleSwitchAccount("/auth/sign-in")}
                disabled={signingOut}
                className="font-semibold text-foreground hover:underline disabled:opacity-70"
              >
                Back to sign in
              </button>{" "}
              or{" "}
              <button
                type="button"
                onClick={() => handleSwitchAccount("/auth/sign-up")}
                disabled={signingOut}
                className="font-semibold text-foreground hover:underline disabled:opacity-70"
              >
                Create a new account
              </button>
              .
            </p>
          </div>
        </ScrollArea>
      </main>
    </AuthGuard>
  );
}
