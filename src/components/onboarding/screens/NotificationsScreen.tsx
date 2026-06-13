import { Bell } from "@phosphor-icons/react";
import { Headline, ScreenShell, Subtext, CTAButton, TextLink } from "../ui";
import { useOnboardingStore } from "@/stores/onboardingStore";

export function NotificationsScreen() {
  const setNotificationsEnabled = useOnboardingStore((s) => s.setNotificationsEnabled);
  const nextStep = useOnboardingStore((s) => s.nextStep);

  const enable = () => {
    setNotificationsEnabled(true);
    nextStep();
  };

  const skip = () => {
    setNotificationsEnabled(false);
    nextStep();
  };

  return (
    <ScreenShell
      footer={
        <>
          <CTAButton label="Turn on notifications" onClick={enable} />
          <TextLink label="Maybe later" onClick={skip} />
        </>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Bell size={64} weight="duotone" color="#2563EB" className="mb-12" />
        <Headline>Be first to know</Headline>
        <Subtext>Get notified when the queue drops.</Subtext>
      </div>
    </ScreenShell>
  );
}
