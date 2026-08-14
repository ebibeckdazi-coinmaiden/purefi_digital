import {
  Card,
  CardReceive,
  GraphUp,
  Home,
  MoneyBag,
  Settings,
  TransferHorizontal,
  UsersGroupRounded,
  Wallet,
} from "@solar-icons/react-perf/BoldDuotone";

export const primaryNavigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Cards", href: "/cards", icon: Card },
  { name: "Transfers", href: "/transfers", icon: TransferHorizontal },
  { name: "Activity", href: "/transactions", icon: GraphUp },
] as const;

export const moreNavigation = [
  { name: "Convert", href: "/convert", icon: CardReceive },
  { name: "Loans", href: "/loans", icon: MoneyBag },
  { name: "Support", href: "/support", icon: UsersGroupRounded },
  { name: "Settings", href: "/settings", icon: Settings },
] as const;

export const mobileNavigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Transfers", href: "/transfers", icon: TransferHorizontal },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Cards", href: "/cards", icon: Card },
  { name: "Settings", href: "/settings", icon: Settings },
] as const;
