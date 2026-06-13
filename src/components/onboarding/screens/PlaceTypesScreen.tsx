import { Headline, ScreenShell, CTAButton } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { motion } from "framer-motion";

const PLACES = [
  { id: "Hospital", emoji: "🏥", label: "Hospital" },
  { id: "Bank", emoji: "🏦", label: "Bank" },
  { id: "Gym", emoji: "💪", label: "Gym" },
  { id: "Pharmacy", emoji: "💊", label: "Pharmacy" },
  { id: "Café", emoji: "☕", label: "Café" },
];

export function PlaceTypesScreen() {
  const selectedPlaceTypes = useOnboardingStore((s) => s.selectedPlaceTypes);
  const togglePlaceType = useOnboardingStore((s) => s.togglePlaceType);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <ScreenShell footer={<CTAButton label="Continue →" onClick={nextStep} />}>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4">
          <Headline>Pick your go-to places</Headline>
          <span className="text-[14px] font-medium text-[#9CA3AF] pt-2 shrink-0">
            {selectedPlaceTypes.length} / 5
          </span>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3">
          {PLACES.map(({ id, emoji, label }) => {
            const selected = selectedPlaceTypes.includes(id);
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
                onClick={() => togglePlaceType(id)}
                className={`h-[72px] rounded-[20px] text-[16px] font-medium transition-colors ${
                  selected
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-white text-[#1A1A1A] border border-[#E5E3DC]"
                }`}
              >
                {emoji} {label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
