"use client";
import { BalanceSectionMobile } from "./mobile/BalanceSectionMobile";
import { BalanceSectionDesktop } from "./desktop/BalanceSectionDesktop";

export function BalanceSection() {
  return (
    <>
      <div className="lg:hidden"><BalanceSectionMobile /></div>
      <div className="hidden lg:block"><BalanceSectionDesktop /></div>
    </>
  );
}
