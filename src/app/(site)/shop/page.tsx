import type { Metadata } from "next";
import { ShopInProgress } from "@/components/shop/ShopInProgress/ShopInProgress";

export const metadata: Metadata = {
  title: "Shop — Yurix",
  description: "Prints, originals and custom pieces by Yurix — the shop is in progress.",
};

export default function ShopPage() {
  return (
    <ShopInProgress
      label="prints · originals · custom pieces"
      heading="shop"
      intro="In progress. The shop is being set up — prints, originals and custom objects are on their way. Want something now? Say hi."
      button={{ label: "say hi →", href: "/contact" }}
    />
  );
}
