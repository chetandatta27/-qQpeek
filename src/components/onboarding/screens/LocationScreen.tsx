import { MapPin } from "@phosphor-icons/react";
import { Headline, ScreenShell, Subtext, CTAButton, TextLink } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

export function LocationScreen() {
  const setLocationEnabled = useOnboardingStore((s) => s.setLocationEnabled);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const allow = () => {
    setLocationEnabled(true);
    nextStep();
  };

  const skip = () => {
    setLocationEnabled(false);
    nextStep();
  };

  return (
    <ScreenShell
      footer={
        <>
          <CTAButton label="Allow location" onClick={allow} />
          <TextLink label="Not now" onClick={skip} />
        </>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <MapPin size={64} weight="duotone" color="#2563EB" className="mb-12" />
        <Headline>Find places near you</Headline>
        <Subtext>We never share your location.</Subtext>
      </div>
    </ScreenShell>
  );
}
