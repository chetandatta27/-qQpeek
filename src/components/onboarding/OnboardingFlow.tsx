import type { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnboardingStore, getStepSequence } from "@/stores/onboardingStore";
import { ProgressDots, screenTransition, screenVariants } from "./ui";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { HowItWorksScreen } from "./screens/HowItWorksScreen";
import { SetupPathScreen } from "./screens/SetupPathScreen";
import { MainGoalScreen } from "./screens/MainGoalScreen";
import { TimeOfDayScreen } from "./screens/TimeOfDayScreen";
import { PlaceTypesScreen } from "./screens/PlaceTypesScreen";
import { LocationScreen } from "./screens/LocationScreen";
import { NearbyPlacesScreen } from "./screens/NearbyPlacesScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { DailyGoalScreen } from "./screens/DailyGoalScreen";
import { FirstLiveMomentScreen } from "./screens/FirstLiveMomentScreen";
import { ReadyScreen } from "./screens/ReadyScreen";

const SCREENS: Record<number, ComponentType<{ onDone?: () => void }>> = {
  0: WelcomeScreen,
  1: HowItWorksScreen,
  2: SetupPathScreen,
  3: MainGoalScreen,
  4: TimeOfDayScreen,
  5: PlaceTypesScreen,
  6: LocationScreen,
  7: NearbyPlacesScreen,
  8: NotificationsScreen,
  9: DailyGoalScreen,
  10: FirstLiveMomentScreen,
  11: ReadyScreen,
};

export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const setupPath = useOnboardingStore((s) => s.setupPath);
  const reset = useOnboardingStore((s) => s.reset);

  const sequence = getStepSequence(setupPath);
  const progressIndex = sequence.indexOf(currentStep);
  const showProgress = currentStep !== 0 && currentStep !== 1;
  const Screen = SCREENS[currentStep];

  const handleDone = () => {
    reset();
    onDone();
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#F5F4EF]">
      {showProgress && (
        <ProgressDots total={sequence.length} current={progressIndex} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          className="flex-1 min-h-0 flex flex-col"
        >
          {currentStep === 11 ? <ReadyScreen onDone={handleDone} /> : Screen && <Screen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
