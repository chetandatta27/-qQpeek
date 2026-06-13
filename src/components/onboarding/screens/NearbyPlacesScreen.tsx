import { Plus } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Headline, ScreenShell, CTAButton } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

const NEARBY = [
  { name: "Apollo Hospital", distance: "1.2 km" },
  { name: "HDFC Bank", distance: "0.6 km" },
  { name: "FitZone Gym", distance: "0.9 km" },
];

export function NearbyPlacesScreen() {
  const savedPlaces = useOnboardingStore((s) => s.savedPlaces);
  const toggleSavedPlace = useOnboardingStore((s) => s.toggleSavedPlace);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <ScreenShell footer={<CTAButton label="Save & continue →" onClick={nextStep} />}>
      <div className="flex-1 flex flex-col justify-center">
        <Headline>Your nearby places</Headline>

        <div className="mt-12 space-y-0">
          {NEARBY.map(({ name, distance }) => {
            const saved = savedPlaces.includes(name);
            return (
              <div
                key={name}
                className="flex items-center justify-between py-5 border-b border-[#E5E3DC] last:border-b-0"
              >
                <div className="text-[16px] font-medium text-[#1A1A1A]">
                  {name} · {distance}
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => toggleSavedPlace(name)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    saved ? "bg-[#1A1A1A] text-white" : "border border-[#E5E3DC] text-[#1A1A1A]"
                  }`}
                >
                  <Plus size={16} weight="bold" />
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
