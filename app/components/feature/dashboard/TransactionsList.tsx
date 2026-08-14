"use client";
import { TransactionsListMobile } from "./mobile/TransactionsListMobile";
import { TransactionsListDesktop } from "./desktop/TransactionsListDesktop";

export function TransactionsList() {
  return (
    <>
      <div className="lg:hidden"><TransactionsListMobile /></div>
      <div className="hidden lg:block"><TransactionsListDesktop /></div>
    </>
  );
}
