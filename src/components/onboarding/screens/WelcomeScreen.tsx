import { motion } from "framer-motion";
import { Hourglass, Sparkle } from "@phosphor-icons/react";
import { ScreenShell, Headline, Subtext, GhostButton, GoogleG } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

export function WelcomeScreen() {
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <ScreenShell
      serif
      footer={
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
            onClick={nextStep}
            className="w-full h-14 rounded-[28px] bg-[#1A1A1A] text-white text-[16px] font-medium inline-flex items-center justify-center gap-2"
          >
            <GoogleG /> Continue with Google
          </motion.button>
          <div className="grid grid-cols-2 gap-3">
            <GhostButton label="Apple" onClick={nextStep} />
            <GhostButton label="Phone number" onClick={nextStep} />
          </div>
          <p className="text-[11px] text-[#9CA3AF] text-center pt-4">Privacy first</p>
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative mb-12">
          <div className="w-[88px] h-[88px] rounded-[24px] bg-[#1A1A1A] flex items-center justify-center">
            <Hourglass size={40} weight="duotone" color="#F5F4EF" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center">
            <Sparkle size={14} weight="fill" color="white" />
          </div>
        </div>

        <Headline serif>Know before you go.</Headline>
        <Subtext>Skip the queue. Save your time.</Subtext>

        <div className="mt-12 px-4 py-2 rounded-full bg-white border border-[#E5E3DC] text-[12px] text-[#9CA3AF]">
          3.8h saved / month by 12,000 users
        </div>
      </div>
    </ScreenShell>
  );
}
