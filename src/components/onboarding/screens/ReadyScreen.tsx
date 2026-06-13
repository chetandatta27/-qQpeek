import { motion } from "framer-motion";
import { Headline, ScreenShell, CTAButton } from "../ui";
import { useOnboardingStore, monthlySavingsLabel } from "@/stores/onboardingStore";

function CheckmarkIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <motion.circle
        cx="36"
        cy="36"
        r="34"
        stroke="#16A34A"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M22 37 L32 47 L50 27"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      />
    </svg>
  );
}

export function ReadyScreen({ onDone }: { onDone: () => void }) {
  const dailyGoalMinutes = useOnboardingStore((s) => s.dailyGoalMinutes);
  const savings = monthlySavingsLabel(dailyGoalMinutes);

  return (
    <ScreenShell serif footer={<CTAButton label="Open Qpeek →" onClick={onDone} />}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-12">
          <CheckmarkIcon />
        </div>

        <Headline serif>You&apos;re ready.</Headline>

        <p className="text-[15px] text-[#9CA3AF] mt-12">
          You could save{" "}
          <span className="text-[#1A1A1A] font-semibold">{savings}</span> this month.
        </p>
      </div>
    </ScreenShell>
  );
}
