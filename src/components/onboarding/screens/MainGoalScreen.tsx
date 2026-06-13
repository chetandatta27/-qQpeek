import { Headline, ScreenShell, Subtext, CTAButton, PillOption, MutedNote } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

const QUICK_GOALS = [
  { id: "save", label: "⚡ Save time" },
  { id: "crowds", label: "👥 Avoid crowds" },
  { id: "errands", label: "📍 Plan errands" },
];

const FULL_GOALS = [
  ...QUICK_GOALS,
  { id: "quiet", label: "✨ Discover quiet places" },
  { id: "productivity", label: "🎯 Daily productivity" },
  { id: "alerts", label: "🔔 Smart alerts" },
];

export function MainGoalScreen() {
  const setupPath = useOnboardingStore((s) => s.setupPath);
  const selectedGoal = useOnboardingStore((s) => s.selectedGoal);
  const setSelectedGoal = useOnboardingStore((s) => s.setSelectedGoal);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const goals = setupPath === "full" ? FULL_GOALS : QUICK_GOALS;

  return (
    <ScreenShell
      footer={<CTAButton label="Continue →" onClick={nextStep} />}
    >
      <div className="flex-1 flex flex-col justify-center">
        <Headline>What matters to you?</Headline>

        <div className="mt-12 space-y-3">
          {goals.map(({ id, label }) => (
            <PillOption
              key={id}
              label={label}
              selected={selectedGoal === id}
              onClick={() => setSelectedGoal(id)}
            />
          ))}
        </div>

        <MutedNote>Your AI adapts to this</MutedNote>
      </div>
    </ScreenShell>
  );
}
