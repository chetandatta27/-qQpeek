import { motion } from "framer-motion";
import { Headline, ScreenShell } from "../ui";
import { useOnboardingStore, type SetupPath } from "@/stores/onboardingStore";

const OPTIONS: { path: SetupPath; title: string; sub: string }[] = [
  { path: "quick", title: "2 minutes", sub: "Just the basics" },
  { path: "full", title: "5 minutes", sub: "Full personalization" },
];

export function SetupPathScreen() {
  const setSetupPath = useOnboardingStore((s) => s.setSetupPath);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const choose = (path: SetupPath) => {
    setSetupPath(path);
    nextStep();
  };

  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col justify-center">
        <Headline>How much time do you have?</Headline>

        <div className="mt-12 space-y-4">
          {OPTIONS.map(({ path, title, sub }) => (
            <motion.button
              key={path}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
              onClick={() => choose(path)}
              className="w-full rounded-[28px] bg-white border border-[#E5E3DC] px-8 py-6 text-left"
            >
              <div className="text-[18px] font-semibold text-[#1A1A1A]">{title}</div>
              <div className="text-[15px] text-[#9CA3AF] mt-1">{sub}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
