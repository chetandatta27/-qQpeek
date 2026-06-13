import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";
import { CTAButton, ProgressDots } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

const SLIDES = [
  { value: "52 min", label: "Typical hospital wait today", color: "#DC2626" },
  { value: "7:15 PM", label: "Best time to go today", color: "#2563EB" },
  { value: "4 min", label: "Your expected wait", color: "#16A34A", subtext: "Average user saves 2–5 hours / month" },
];

export function HowItWorksScreen() {
  const [slide, setSlide] = useState(0);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  useEffect(() => {
    if (slide >= SLIDES.length - 1) return;
    const t = setTimeout(() => setSlide((s) => s + 1), 2000);
    return () => clearTimeout(t);
  }, [slide]);

  const skipToEnd = () => setSlide(SLIDES.length - 1);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="flex flex-col h-full min-h-0" onClick={skipToEnd}>
      <ProgressDots total={SLIDES.length} current={slide} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <div
              className="font-qpeek-mono text-[72px] font-bold leading-none tracking-tight"
              style={{ color: current.color }}
            >
              {current.value}
            </div>
            <p className="text-[16px] font-medium text-[#1A1A1A] mt-12">{current.label}</p>
            {current.subtext && (
              <p className="text-[15px] text-[#9CA3AF] mt-6">{current.subtext}</p>
            )}
            {!isLast && (
              <CaretDown size={20} className="mt-12 text-[#9CA3AF]" weight="bold" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isLast && (
        <div className="px-8 pb-8">
          <CTAButton label="Continue →" onClick={nextStep} />
        </div>
      )}
    </div>
  );
}
