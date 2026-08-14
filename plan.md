# PureFi Customer Dashboard Redesign

## Goal

Deliver one calm, responsive customer banking experience across every user-facing route in `app/(auth)`, inspired by the supplied light dashboard reference. Preserve PureFi identity, existing routes, Convex data calls and all financial, security, approval and authentication behaviour. The `/admin` workspace remains on its existing interface.

## Architecture

- `app/(auth)/layout.tsx` authenticates the user and mounts one `CustomerShell` for customer routes only. It owns the desktop sidebar, sticky header, constrained content area and one mobile bottom navigation.
- `app/components/feature/nav/customer-navigation.ts` is the single source of truth for primary, more-menu and mobile destinations. It contains only routes that exist today.
- Legacy page headers and page-level mobile nav components are retained for the admin surface, but are visually suppressed within `CustomerShell` so customer routes cannot render duplicate navigation during migration.
- The customer compatibility layer is scoped to `[data-customer-shell]`. It translates legacy dark utility colours into the new light system without affecting `/admin` or authentication screens.

## Visual System

- Canvas: soft off-white; surfaces: white; primary text: forest green; supporting text: muted slate; separators: quiet neutral grey.
- Primary actions use lime `#9FE870` with dark green text. Lime is never used as body text on white. Destructive, warning and successful states retain dedicated accessible colours.
- Cards use 16–20px radii, low-elevation shadows and compact spacing. Use Solar icons and existing flag assets; do not add Wise logos or branding.
- All interactive elements have 44px minimum touch targets, visible keyboard focus, labelled icon buttons, reduced-motion support, loading, empty, validation and error states.

## Reusable Components

- Foundation: `Button`, `Card`, `PageHeader`, `SectionHeader`, `MoneyAmount`, `StatusBadge`, `EmptyState`, `LoadingCard`, and `IconButton`.
- Banking: `AccountCurrencyCard`, `BalanceOverview`, `QuickActions`, `TransactionRow`, `RecipientRow`, `TaskRow`, `ActivityFilters`, `AccountPicker`, and chart containers.
- Components take real data and explicit loading/empty states. Do not replace unavailable data with invented bank activity.

## Route Migration

1. Home: balance/action hierarchy, horizontally scrollable account cards, tasks, spending chart, transactions and recipients.
2. Money management: accounts/detail, cards, transactions, convert, deposit and transfers use the shared page, card, action, list, form and feedback patterns while retaining every current mutation and verification step.
3. Growth: investments and loans use the same hierarchy for performance, purchase, application and calculation states without changing financial logic.
4. Account care: profile, settings, notifications and support use settings sections, badges, dialogs and destructive-action confirmation patterns while retaining uploads, 2FA, freezes, sessions and account deletion.

## Navigation

- Primary desktop: Home, Accounts, Cards, Transfers and Activity.
- More menu: Add money, Convert, Investments, Loans, Support, Settings and Profile.
- Mobile: Home, Transfers, Accounts, Invest and Profile; secondary destinations remain reachable through More/Profile.
- Notifications are a header action. Sign-out must invoke the existing authentication client rather than remain a decorative button.

## Verification Checklist

- Check every customer route at mobile, tablet and desktop widths; confirm only the shared customer navigation is visible.
- Exercise navigation, notifications, sign-out, account/card actions, transfer types and OTP/approval states, deposit, conversion, loan, investment, profile and security workflows.
- Confirm query loading, empty, error and mutation-pending states remain meaningful.
- Run lint/build checks and compare Home desktop/mobile against the supplied reference for hierarchy, spacing, card density, contrast and action placement.
