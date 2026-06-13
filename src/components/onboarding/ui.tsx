import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const screenVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export const screenTransition = { duration: 0.28, ease: [0, 0, 0.2, 1] as const };

export function ScreenShell({
  children,
  footer,
  serif = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  serif?: boolean;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 px-8 pt-12 pb-8">
      <div className={`flex-1 flex flex-col min-h-0 ${serif ? "font-qpeek-serif" : ""}`}>{children}</div>
      {footer && <div className="shrink-0 pt-12">{footer}</div>}
    </div>
  );
}

export function Headline({ children, serif = false }: { children: ReactNode; serif?: boolean }) {
  return (
    <h1
      className={`text-[32px] font-bold leading-[1.15] tracking-tight text-[#1A1A1A] ${serif ? "font-qpeek-serif" : ""}`}
    >
      {children}
    </h1>
  );
}

export function Subtext({ children }: { children: ReactNode }) {
  return <p className="text-[15px] font-normal text-[#9CA3AF] mt-3">{children}</p>;
}

export function MutedNote({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-[#9CA3AF] text-center mt-12">{children}</p>;
}

export function CTAButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      className="w-full h-14 rounded-[28px] bg-[#1A1A1A] text-white text-[16px] font-medium"
    >
      {label}
    </motion.button>
  );
}

export function GhostButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      className="w-full h-14 rounded-[28px] bg-transparent text-[#1A1A1A] text-[16px] font-medium border border-[#1A1A1A]/50"
    >
      {label}
    </motion.button>
  );
}

export function TextLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-3 text-[15px] text-[#9CA3AF] font-medium">
      {label}
    </button>
  );
}

export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-12 pb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i <= current ? "bg-[#1A1A1A]" : "border border-[#D1D5DB] bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

export function PillOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      className={`w-full h-14 rounded-[28px] text-[16px] font-medium transition-colors ${
        selected ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] border border-[#E5E3DC]"
      }`}
    >
      {label}
    </motion.button>
  );
}

export function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.9 36 44 30.5 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export function AppleLogo() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 2 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.5.7-.9 1.3-1.9 1.7-3-3-1.1-3.2-4.7-3.2-4.9zM13.8 4.3c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.6.8-1.2 2-1 3.2 1.1.1 2.2-.6 2.9-1.4z" />
    </svg>
  );
}
