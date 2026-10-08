export const ONBOARDING_FIELDS = [
  "firstName",
  "lastName",
  "country",
  "city",
  "address",
  "zipCode",
  "occupation",
  "currency",
  "language",
] as const;

export type OnboardingProfile = Record<string, unknown> | null | undefined;

/**
 * Single source of truth for "account already created" (onboarding complete).
 * A profile counts as onboarded only when every required field is a non-empty string.
 */
export function isOnboardedProfile(user: OnboardingProfile): boolean {
  return (
    !!user &&
    ONBOARDING_FIELDS.every((k) => {
      const value = (user as Record<string, unknown>)[k];
      return typeof value === "string" && value.trim().length > 0;
    })
  );
}
