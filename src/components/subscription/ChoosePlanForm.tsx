"use client";

import { useFormStatus } from "react-dom";
import { chooseSubscriptionPlan } from "@/app/subscription/actions";
import type { SubscriptionPlanId } from "@/lib/subscription-plans";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

function ChoosePlanSubmitButton({ accentChooseButton }: { accentChooseButton: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="m-0 inline-flex cursor-pointer items-center justify-center border-2 border-[var(--Black,#000)] disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        marginTop: 16,
        width: 178,
        height: 53,
        padding: "0 16px",
        borderRadius: "var(--Radius-MD, 8px)",
        background: accentChooseButton ? "var(--Purple, #EA83F0)" : "var(--White, #FFF)",
        color: "var(--Text-Primary, #141413)",
        textAlign: "center",
        fontFamily: pangeaFontFamily,
        fontSize: 24,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
      }}
    >
      {pending ? "..." : "CHOOSE"}
    </button>
  );
}

export function ChoosePlanForm({
  planId,
  accentChooseButton = false,
}: {
  planId: SubscriptionPlanId;
  accentChooseButton?: boolean;
}) {
  return (
    <form action={chooseSubscriptionPlan} className="flex flex-col items-center">
      <input type="hidden" name="planId" value={planId} />
      <ChoosePlanSubmitButton accentChooseButton={accentChooseButton} />
    </form>
  );
}
