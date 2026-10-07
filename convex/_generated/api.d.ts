/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accounts from "../accounts.js";
import type * as actions_wallet_chains from "../actions/wallet/chains.js";
import type * as actions_wallet_derive from "../actions/wallet/derive.js";
import type * as actions_wallet_generate from "../actions/wallet/generate.js";
import type * as actions_wallet_sign from "../actions/wallet/sign.js";
import type * as actions_wallet_verify from "../actions/wallet/verify.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as bank_accounts from "../bank_accounts.js";
import type * as beneficiaries from "../beneficiaries.js";
import type * as bills from "../bills.js";
import type * as constants from "../constants.js";
import type * as creditCards from "../creditCards.js";
import type * as crons from "../crons.js";
import type * as cryptoTransactions from "../cryptoTransactions.js";
import type * as depositAddresses from "../depositAddresses.js";
import type * as http from "../http.js";
import type * as listeners_constants from "../listeners/constants.js";
import type * as listeners_cosmos from "../listeners/cosmos.js";
import type * as listeners_evm from "../listeners/evm.js";
import type * as listeners_polkadot from "../listeners/polkadot.js";
import type * as listeners_poller from "../listeners/poller.js";
import type * as listeners_solana from "../listeners/solana.js";
import type * as listeners_ton from "../listeners/ton.js";
import type * as listeners_tron from "../listeners/tron.js";
import type * as listeners_utxo from "../listeners/utxo.js";
import type * as listeners_xrp from "../listeners/xrp.js";
import type * as loans from "../loans.js";
import type * as notifications from "../notifications.js";
import type * as requestcard from "../requestcard.js";
import type * as savingsGoals from "../savingsGoals.js";
import type * as transactions from "../transactions.js";
import type * as transfers from "../transfers.js";
import type * as user from "../user.js";
import type * as wallet from "../wallet.js";
import type * as walletcore_index from "../walletcore/index.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  "actions/wallet/chains": typeof actions_wallet_chains;
  "actions/wallet/derive": typeof actions_wallet_derive;
  "actions/wallet/generate": typeof actions_wallet_generate;
  "actions/wallet/sign": typeof actions_wallet_sign;
  "actions/wallet/verify": typeof actions_wallet_verify;
  admin: typeof admin;
  auth: typeof auth;
  bank_accounts: typeof bank_accounts;
  beneficiaries: typeof beneficiaries;
  bills: typeof bills;
  constants: typeof constants;
  creditCards: typeof creditCards;
  crons: typeof crons;
  cryptoTransactions: typeof cryptoTransactions;
  depositAddresses: typeof depositAddresses;
  http: typeof http;
  "listeners/constants": typeof listeners_constants;
  "listeners/cosmos": typeof listeners_cosmos;
  "listeners/evm": typeof listeners_evm;
  "listeners/polkadot": typeof listeners_polkadot;
  "listeners/poller": typeof listeners_poller;
  "listeners/solana": typeof listeners_solana;
  "listeners/ton": typeof listeners_ton;
  "listeners/tron": typeof listeners_tron;
  "listeners/utxo": typeof listeners_utxo;
  "listeners/xrp": typeof listeners_xrp;
  loans: typeof loans;
  notifications: typeof notifications;
  requestcard: typeof requestcard;
  savingsGoals: typeof savingsGoals;
  transactions: typeof transactions;
  transfers: typeof transfers;
  user: typeof user;
  wallet: typeof wallet;
  "walletcore/index": typeof walletcore_index;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
};
