"use client";
import { CurrenciesGridMobile } from "./mobile/CurrenciesGridMobile";
import { CurrenciesGridDesktop } from "./desktop/CurrenciesGridDesktop";

export function CurrenciesGrid() {
  return (
    <>
      <div className="lg:hidden"><CurrenciesGridMobile /></div>
      <div className="hidden lg:block"><CurrenciesGridDesktop /></div>
    </>
  );
}
