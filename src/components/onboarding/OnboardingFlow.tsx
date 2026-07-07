import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import { CaretLeft, Check, Hourglass, MapPin } from "@phosphor-icons/react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { screenTransition, screenVariants } from "./ui";

const TOTAL_STEPS = 5;

export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const reset = useOnboardingStore((s) => s.reset);
  const [step, setStep] = useState(0);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  const next = () => setStep((current) => Math.min(TOTAL_STEPS - 1, current + 1));
  const back = () => setStep((current) => Math.max(0, current - 1));
  const togglePlace = (place: string) => {
    setSelectedPlaces((current) => {
      const nextPlaces = new Set(current);
      if (nextPlaces.has(place)) nextPlaces.delete(place);
      else if (nextPlaces.size < 5) nextPlaces.add(place);
      return nextPlaces;
    });
  };
  const finish = () => {
    reset();
    onDone();
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-white text-[#111111]">
      <ProgressHeader step={step} onBack={back} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          className="flex-1 min-h-0 flex flex-col px-7 pb-7 overflow-hidden"
        >
          {step === 0 && <WelcomeScreen onContinue={() => next()} />}
          {step === 1 && (
            <InterestsScreen selected={selectedPlaces} toggle={togglePlace} onContinue={next} />
          )}
          {step === 2 && <LocationScreen onAllow={next} onSkip={next} />}
          {step === 3 && <NotificationsScreen onEnable={next} onSkip={next} />}
          {step === 4 && <ValuePreviewScreen onDone={finish} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProgressHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <div className="shrink-0 px-7 pt-12 pb-4">
      <div className="h-9 grid grid-cols-[36px_1fr_36px] items-center">
        {step > 0 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#F8F8F6", color: "#111111" }}
            aria-label="Back"
          >
            <CaretLeft size={17} weight="regular" />
          </motion.button>
        ) : (
          <div />
        )}
        <div className="text-center text-[12px] font-semibold tabular-nums text-[#7A7A76]">
          Step {step + 1} of {TOTAL_STEPS}
        </div>
      </div>
      <div className="mt-4 h-[3px] rounded-full overflow-hidden bg-[#ECEBE7]">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%`, background: "var(--color-accent)" }}
        />
      </div>
    </div>
  );
}

function Header({ title, body, centered = false }: { title: string; body: string; centered?: boolean }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h1 className="text-[32px] leading-[1.05] font-bold tracking-tight text-[#111111]">{title}</h1>
      <p className="mt-3 text-[16px] leading-[1.45] font-medium text-[#777773]">{body}</p>
    </div>
  );
}

function PremiumButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "text";
}) {
  const styles =
    variant === "primary"
      ? { background: "#111111", color: "#FFFFFF", border: "1px solid #111111" }
      : variant === "secondary"
        ? { background: "#FFFFFF", color: "#111111", border: "1px solid #E8E7E2" }
        : { background: "transparent", color: "#777773", border: "1px solid transparent" };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      className="w-full h-14 rounded-[24px] text-[16px] font-semibold inline-flex items-center justify-center gap-2"
      style={styles}
    >
      {children}
    </motion.button>
  );
}

function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  const trust = [
    { value: "12k+", label: "Users" },
    { value: "94%", label: "Accuracy" },
    { value: "3.8h", label: "Saved Monthly" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-[30px] flex items-center justify-center mb-6 bg-[#111111]">
          <Hourglass size={42} weight="duotone" color="#FFFFFF" />
        </div>
        <div className="text-[18px] font-semibold text-[#111111]">Qpeek</div>
        <div className="mt-2 text-[15px] font-medium text-[#777773]">Peek at the queue before you go.</div>
        <div className="mt-10">
          <Header title="Save time, every day." body="Know the best time to visit before you leave." centered />
        </div>
        <div className="mt-9 grid w-full grid-cols-3 gap-3">
          {trust.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-[17px] font-bold text-[#111111]">{item.value}</div>
              <div className="mt-1 text-[11px] font-medium text-[#777773]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-5">
        <PremiumButton onClick={onContinue}>Get Started</PremiumButton>
      </div>
    </div>
  );
}

function InterestsScreen({
  selected,
  toggle,
  onContinue,
}: {
  selected: Set<string>;
  toggle: (place: string) => void;
  onContinue: () => void;
}) {
  const interests = [
    "🏥 Hospitals",
    "🏦 Banks",
    "💪 Gyms",
    "💊 Pharmacies",
    "☕ Cafés",
    "🍽 Restaurants",
    "🛍 Shopping",
    "⛽ Petrol",
    "🏢 Government Offices",
  ];

  return (
    <div className="flex h-full flex-col">
      <Header title="What places matter most?" body="Choose up to 5." />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {interests.map((item) => {
          const isSelected = selected.has(item);
          return (
            <motion.button
              key={item}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggle(item)}
              className="h-[68px] rounded-[24px] px-4 text-left text-[15px] font-semibold transition-all"
              style={{
                background: isSelected ? "#111111" : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "#111111",
                border: isSelected ? "1px solid #111111" : "1px solid #E8E7E2",
                boxShadow: isSelected ? "0 12px 30px -20px rgba(17,17,17,0.5)" : "none",
              }}
            >
              {item}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-auto pt-6">
        <PremiumButton onClick={onContinue}>Continue</PremiumButton>
      </div>
    </div>
  );
}

function LocationScreen({ onAllow, onSkip }: { onAllow: () => void; onSkip: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="Find the best time nearby."
        body="Allow location to discover nearby places and smarter recommendations."
        centered
      />
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-[#F8F8F6]">
          <div className="absolute w-20 h-20 rounded-full bg-[rgba(59,130,246,0.1)]" />
          <MapPin size={54} weight="duotone" color="var(--color-accent)" />
        </div>
        <div className="mt-10 w-full space-y-4">
          {["Never shared publicly", "Used only for recommendations", "Delete anytime"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[15px] font-medium text-[#555550]">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#ECFDF3] text-[#16A34A]">
                <Check size={13} weight="bold" />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3 pt-5">
        <PremiumButton onClick={onAllow}>Allow Location</PremiumButton>
        <PremiumButton onClick={onSkip} variant="text">Not Now</PremiumButton>
      </div>
    </div>
  );
}

function NotificationsScreen({ onEnable, onSkip }: { onEnable: () => void; onSkip: () => void }) {
  const cards = [
    { emoji: "🏥", place: "Apollo Hospital", main: "42 min → 8 min", meta: "Save 34 min" },
    { emoji: "💪", place: "FitZone Gym", main: "Quiet right now", meta: "Save 15 min" },
    { emoji: "🏦", place: "HDFC Bank", main: "Best time starts in 15 min", meta: "" },
  ];

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Never miss the best moment to go."
        body="Get notified when wait times drop and places become quieter."
      />
      <div className="mt-9 space-y-3">
        {cards.map((card) => (
          <div key={card.place} className="rounded-[24px] p-4 bg-[#F8F8F6]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[21px] bg-white">
                {card.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold text-[#111111]">{card.place}</div>
                <div className="mt-1 text-[14px] font-semibold text-[#555550]">{card.main}</div>
              </div>
              {card.meta && <div className="text-[13px] font-bold text-[#16A34A]">{card.meta}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-3 pt-6">
        <PremiumButton onClick={onEnable}>Enable Notifications</PremiumButton>
        <PremiumButton onClick={onSkip} variant="text">Maybe Later</PremiumButton>
      </div>
    </div>
  );
}

function ValuePreviewScreen({ onDone }: { onDone: () => void }) {
  const opportunities = [
    { emoji: "🏥", place: "Apollo Hospital", save: "Save 18 min", best: "7:15 PM" },
    { emoji: "🏦", place: "HDFC Bank", save: "Save 9 min", best: "2:15 PM" },
    { emoji: "💪", place: "FitZone Gym", save: "Save 14 min", best: "Now" },
  ];

  return (
    <div className="flex h-full flex-col">
      <Header title="Here's what Qpeek found nearby." body="You could save time today." />
      <div className="mt-6 rounded-[24px] p-5 text-white bg-[#111111]">
        <div className="text-[13px] font-semibold opacity-70">Potential Savings Today</div>
        <div className="mt-2 text-[48px] leading-none font-bold tracking-tight">41 min</div>
      </div>
      <div className="mt-4 space-y-2.5">
        {opportunities.map((item) => (
          <div key={item.place} className="flex items-center gap-3 rounded-[24px] p-3 bg-[#F8F8F6]">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-[21px] bg-white">
              {item.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-[#111111]">{item.place}</div>
              <div className="mt-1 text-[13px] font-medium text-[#777773]">Best time: {item.best}</div>
            </div>
            <div className="text-[14px] font-bold text-[#16A34A]">{item.save}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <PremiumButton onClick={onDone}>Start Exploring</PremiumButton>
      </div>
    </div>
  );
}
