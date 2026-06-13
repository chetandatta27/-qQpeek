import { Headline, ScreenShell, CTAButton, PillOption } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

const TIMES = [
  { id: "morning", label: "🌅 Morning" },
  { id: "afternoon", label: "☀️ Afternoon" },
  { id: "evening", label: "🌆 Evening" },
  { id: "flexible", label: "🔀 Flexible" },
];

export function TimeOfDayScreen() {
  const selectedTimes = useOnboardingStore((s) => s.selectedTimes);
  const toggleTime = useOnboardingStore((s) => s.toggleTime);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <ScreenShell footer={<CTAButton label="Continue →" onClick={nextStep} />}>
      <div className="flex-1 flex flex-col justify-center">
        <Headline>When do you usually go out?</Headline>

        <div className="mt-12 space-y-3">
          {TIMES.map(({ id, label }) => (
            <PillOption
              key={id}
              label={label}
              selected={selectedTimes.includes(id)}
              onClick={() => toggleTime(id)}
            />
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
