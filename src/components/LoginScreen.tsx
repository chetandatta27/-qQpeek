import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { Sparkle, ArrowRight } from "@phosphor-icons/react";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const login = useUserStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim());
      onLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ background: "var(--color-background)" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            <Sparkle size={32} weight="fill" />
          </div>
          <h1 className="text-[28px] font-bold leading-tight">Welcome to Qpeek</h1>
          <p className="text-[16px] mt-2" style={{ color: "var(--color-muted-foreground)" }}>
            Enter your name to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full h-14 px-5 rounded-2xl text-[15px] font-medium outline-none transition-all"
              style={{
                background: "var(--color-muted)",
                border: "2px solid transparent",
                color: "var(--color-foreground)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-accent)";
                e.target.style.background = "var(--color-card)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "transparent";
                e.target.style.background = "var(--color-muted)";
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full h-14 rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            Get Started
            <ArrowRight size={18} weight="bold" />
          </button>
        </form>

        <p className="text-center text-[12px] mt-6" style={{ color: "var(--color-muted-foreground)" }}>
          Your name will be displayed in your profile
        </p>
      </div>
    </div>
  );
}
