import { Headline, ScreenShell, Subtext, CTAButton } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

export function FirstLiveMomentScreen() {
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <ScreenShell footer={<CTAButton label="Start saving time →" onClick={nextStep} />}>
      <div className="flex-1 flex flex-col justify-center">
        <Headline>Right now near you</Headline>

        <div className="mt-12 bg-white rounded-[24px] border border-[#E5E3DC] p-8">
          <div className="text-[18px] font-semibold text-[#1A1A1A]">Apollo Hospital</div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-[15px] text-[#9CA3AF]">Wait:</span>
            <span className="text-[24px] font-bold text-[#16A34A]">8 min</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-[15px] text-[#9CA3AF]">Best time:</span>
            <span className="text-[18px] font-semibold text-[#2563EB]">7:15 PM</span>
          </div>
        </div>

        <Subtext>This is what Qpeek does.</Subtext>
      </div>
    </ScreenShell>
  );
}
