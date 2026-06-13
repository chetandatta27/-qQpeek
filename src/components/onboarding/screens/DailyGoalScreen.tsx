import { motion } from "framer-motion";
import { Headline, ScreenShell, CTAButton } from "../ui";
import { useOnboardingStore, type DailyGoalMinutes } from "@/stores/onboardingStore";

const GOALS: DailyGoalMinutes[] = [15, 30, 60];

export function DailyGoalScreen() {
  const dailyGoalMinutes = useOnboardingStore((s) => s.dailyGoalMinutes);
  const setDailyGoalMinutes = useOnboardingStore((s) => s.setDailyGoalMinutes);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <ScreenShell footer={<CTAButton label="Set goal →" onClick={nextStep} />}>
      <div className="flex-1 flex flex-col justify-center">
        <Headline>Set your daily goal</Headline>

        <div className="mt-12 space-y-3">
          {GOALS.map((minutes) => {
            const selected = dailyGoalMinutes === minutes;
            return (
              <motion.button
                key={minutes}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
                onClick={() => setDailyGoalMinutes(minutes)}
                className={`w-full h-14 rounded-[28px] text-[16px] font-medium bg-white transition-colors ${
                  selected
                    ? "border-2 border-[#1A1A1A] text-[#1A1A1A]"
                    : "border border-[#E5E3DC] text-[#1A1A1A]"
                }`}
              >
                {minutes} min / day
              </motion.button>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
