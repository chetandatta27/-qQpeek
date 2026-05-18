import { createFileRoute } from "@tanstack/react-router";
import {
  Search, MapPin, Bell, Settings, ChevronRight, Clock, TrendingUp, TrendingDown,
  Activity, Users, Coffee, Building2, Stethoscope, Dumbbell, Bus, Scissors,
  Sparkles, Navigation, ArrowRight, ArrowUpRight, Check, Plus, Minus, Heart,
  BellRing, X, ArrowLeft, CircleDot, Volume2, Smile, Trophy, History, Bookmark,
  Zap, Star, Inbox, Radar, Train, Wifi, Flame, ArrowDownRight, SlidersHorizontal,
  ThumbsUp, ThumbsDown, Gauge
} from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

/* ---------- navigation ---------- */

type Screen =
  | "splash" | "onboarding"
  | "home" | "map" | "alerts" | "me"
  | "detail" | "contribute" | "predictions";

type NavCtx = {
  screen: Screen;
  go: (s: Screen) => void;
  back: () => void;
};
const Nav = createContext<NavCtx>({ screen: "splash", go: () => {}, back: () => {} });
const useNav = () => useContext(Nav);

function App() {
  const [stack, setStack] = useState<Screen[]>(["splash"]);
  const screen = stack[stack.length - 1];

  const go = (s: Screen) => setStack((st) => [...st, s]);
  const back = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));

  // auto-advance splash
  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setStack(["onboarding"]), 1600);
      return () => clearTimeout(t);
    }
  }, [screen]);

  return (
    <Nav.Provider value={{ screen, go, back }}>
      <div className="min-h-screen w-full bg-stone">
        {/* Mobile: fills screen. Desktop: phone frame centered. */}
        <div className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-paper md:my-6 md:min-h-0 md:rounded-[44px] md:border md:border-ink/10 md:p-[6px] md:ql-shadow">
          <div className="relative flex-1 overflow-hidden bg-paper md:rounded-[38px]" style={{ minHeight: "100dvh" }}>
            <ScreenRouter screen={screen} />
          </div>
        </div>
      </div>
    </Nav.Provider>
  );
}

function ScreenRouter({ screen }: { screen: Screen }) {
  const key = screen;
  return (
    <div key={key} className="ql-screen h-full w-full" style={{ height: "100dvh" }}>
      {screen === "splash" && <SplashScreen />}
      {screen === "onboarding" && <OnboardingScreen />}
      {screen === "home" && <HomeScreen />}
      {screen === "map" && <MapScreen />}
      {screen === "alerts" && <NotificationsScreen />}
      {screen === "me" && <ProfileScreen />}
      {screen === "detail" && <DetailScreen />}
      {screen === "contribute" && <ContributeScreen />}
      {screen === "predictions" && <PredictionScreen />}
    </div>
  );
}

/* ---------- atoms ---------- */

const Pill = ({ children, active = false, tone = "default", onClick }: { children: ReactNode; active?: boolean; tone?: "default" | "ink"; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={[
      "shrink-0 rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors",
      active || tone === "ink"
        ? "bg-ink text-paper"
        : "bg-paper text-ink ql-ring active:bg-beige",
    ].join(" ")}
  >
    {children}
  </button>
);

function CrowdBar({ value, tone }: { value: number; tone: "free" | "medium" | "busy" }) {
  const bg = tone === "free" ? "bg-q-free-foreground/80" : tone === "medium" ? "bg-q-medium-foreground/80" : "bg-q-busy-foreground/80";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
      <div className={`${bg} ql-bar-anim h-full rounded-full`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Sparkline({ tone = "ink" }: { tone?: "ink" | "ai" | "live" }) {
  const stroke = tone === "ai" ? "var(--q-ai-foreground)" : tone === "live" ? "var(--q-live-foreground)" : "currentColor";
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full" fill="none">
      <path d="M0 26 L12 22 L24 28 L36 18 L48 22 L60 10 L72 16 L84 6 L96 14 L108 8 L120 12" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 26 L12 22 L24 28 L36 18 L48 22 L60 10 L72 16 L84 6 L96 14 L108 8 L120 12 L120 36 L0 36 Z" fill={stroke} opacity="0.1" />
    </svg>
  );
}

function MiniBars({ tone = "ink" }: { tone?: "ink" | "ai" }) {
  const c = tone === "ai" ? "var(--q-ai-foreground)" : "var(--ink)";
  const heights = [30, 55, 40, 70, 90, 78, 60, 45, 35, 50, 65, 80];
  return (
    <div className="flex h-12 items-end gap-1">
      {heights.map((h, i) => (
        <div key={i} className="w-1.5 rounded-full" style={{ height: `${h}%`, background: c, opacity: i === 4 ? 1 : 0.35 }} />
      ))}
    </div>
  );
}

/* ---------- screens ---------- */

function SplashScreen() {
  return (
    <div className="relative flex h-full flex-col items-center justify-between bg-beige px-8 pb-10 pt-24">
      <div className="flex-1" />
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="ql-pulse absolute inset-0 text-ink" />
          <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-ink text-paper">
            <div className="h-3 w-3 rounded-full bg-paper" />
            <div className="absolute inset-3 rounded-2xl border border-paper/30" />
            <div className="absolute inset-6 rounded-xl border border-paper/15" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-display text-[34px] font-semibold tracking-tight text-ink">QueueLess</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">Save time before you leave.</p>
        </div>
      </div>
      <div className="flex flex-1 items-end">
        <div className="flex gap-1.5">
          <span className="ql-tick h-1.5 w-1.5 rounded-full bg-ink" />
          <span className="ql-tick h-1.5 w-1.5 rounded-full bg-ink" style={{ animationDelay: "0.2s" }} />
          <span className="ql-tick h-1.5 w-1.5 rounded-full bg-ink" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen() {
  const { go } = useNav();
  return (
    <div className="relative flex h-full flex-col bg-paper px-6 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative grid h-7 w-7 place-items-center rounded-[8px] bg-ink text-paper">
            <div className="h-1.5 w-1.5 rounded-full bg-paper" />
          </div>
          <span className="font-display text-[16px] font-semibold tracking-tight text-ink">QueueLess</span>
        </div>
        <button onClick={() => go("home")} className="text-[12px] font-medium text-muted-foreground">Skip</button>
      </div>

      <div className="mt-6 flex-1">
        <div className="relative h-[44%] min-h-[260px] w-full overflow-hidden rounded-[28px] bg-q-live ql-ring">
          <div className="absolute inset-0 ql-grid-bg opacity-50" />
          <div className="absolute left-6 top-6 rounded-2xl bg-paper p-3 ql-shadow">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-q-live-foreground" />
              <span className="text-[11px] font-semibold text-ink">LIVE</span>
            </div>
            <div className="mt-2 text-[22px] font-semibold text-ink">12 min</div>
            <div className="mt-2 h-1 w-24 rounded-full bg-q-live-foreground/40">
              <div className="ql-bar-anim h-full rounded-full bg-q-live-foreground" style={{ width: "55%" }} />
            </div>
          </div>
          <div className="absolute bottom-6 right-6 rounded-2xl bg-ink p-3 text-paper ql-shadow">
            <Users className="h-4 w-4" />
            <div className="mt-1.5 text-[11px] font-medium opacity-70">Crowd</div>
            <div className="text-[16px] font-semibold">Low</div>
          </div>
          <div className="absolute right-10 top-10 grid h-12 w-12 place-items-center rounded-full bg-paper ql-shadow">
            <MapPin className="h-5 w-5 text-ink" />
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-ink" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
          </div>
          <h2 className="mt-4 font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-ink">
            Check live waiting<br />times anywhere.
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            Real-time queues for hospitals, banks, cafés, gyms and transport near you.
          </p>
        </div>
      </div>

      <button
        onClick={() => go("home")}
        className="mt-6 flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-paper active:scale-[0.98] transition-transform"
      >
        <span className="text-[14px] font-semibold">Continue</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function HomeScreen() {
  const { go } = useNav();
  const [cat, setCat] = useState("Hospitals");
  return (
    <div className="relative flex h-full flex-col bg-beige">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> Indiranagar, Bangalore
            </div>
            <h2 className="mt-1 font-display text-[22px] font-semibold tracking-tight text-ink">Hi, Aarav</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => go("alerts")} className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring active:bg-beige">
              <Bell className="h-4 w-4 text-ink" />
            </button>
            <button onClick={() => go("me")} className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper text-[12px] font-semibold">A</button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-paper px-4 py-3 ql-ring">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">Search places, queues, transit…</span>
        </div>

        <button onClick={() => go("predictions")} className="mt-3 flex w-full items-start gap-3 rounded-2xl bg-q-ai px-4 py-3 text-left active:opacity-90">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-q-ai-foreground text-paper">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-q-ai-foreground/70">AI Suggestion</div>
            <div className="text-[12.5px] font-medium text-q-ai-foreground">Best time to visit nearby places: 3PM–5PM</div>
          </div>
        </button>

        <div className="-mx-5 mt-4 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { icon: Stethoscope, label: "Hospitals" },
              { icon: Coffee, label: "Cafés" },
              { icon: Building2, label: "Banks" },
              { icon: Dumbbell, label: "Gyms" },
              { icon: Bus, label: "Transport" },
              { icon: Scissors, label: "Salons" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setCat(label)}
                className={[
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium transition-colors",
                  cat === label ? "bg-ink text-paper" : "bg-paper text-ink ql-ring",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-5 pb-28 pt-3">
        <QueueCard tone="busy" name="Apollo Hospital" meta="Hospital · 2.3 km" wait="47 min" trend="up" trendLabel="Crowd increasing" onClick={() => go("detail")} />
        <QueueCard tone="medium" name="Third Wave Coffee" meta="Café · 0.4 km" wait="9 min" trend="up" trendLabel="Filling up" onClick={() => go("contribute")} />
        <QueueCard tone="free" name="SBI · 12th Main Branch" meta="Bank · 1.1 km" wait="3 min" trend="down" trendLabel="Crowd easing" onClick={() => go("detail")} />
        <QueueCard tone="free" name="Cult Fit Koramangala" meta="Gym · 1.8 km" wait="6 min" trend="down" trendLabel="Quiet hour" onClick={() => go("detail")} />
        <QueueCard tone="medium" name="500D · Silk Board" meta="Bus · 0.2 km" wait="4 min" trend="up" trendLabel="ETA stable" onClick={() => go("detail")} />
      </div>

      <TabBar active="home" />
    </div>
  );
}

function QueueCard({
  tone, name, meta, wait, trend, trendLabel, onClick,
}: {
  tone: "free" | "medium" | "busy";
  name: string; meta: string; wait: string;
  trend: "up" | "down"; trendLabel: string; onClick?: () => void;
}) {
  const bg = tone === "free" ? "bg-q-free" : tone === "medium" ? "bg-q-medium" : "bg-q-busy";
  const fg = tone === "free" ? "text-q-free-foreground" : tone === "medium" ? "text-q-medium-foreground" : "text-q-busy-foreground";
  const Trend = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <button onClick={onClick} className={`${bg} block w-full rounded-[22px] p-4 text-left active:scale-[0.99] transition-transform`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${fg} opacity-70`}>{meta}</div>
          <div className="mt-1 font-display text-[17px] font-semibold tracking-tight text-ink">{name}</div>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/10">
          <ArrowUpRight className={`h-4 w-4 ${fg}`} />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-ink/60">Live wait</div>
          <div className="font-display text-[30px] font-semibold leading-none tracking-tight text-ink">{wait}</div>
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-medium ${fg}`}>
          <Trend className="h-3.5 w-3.5" /> {trendLabel}
        </div>
      </div>

      <div className="mt-3">
        <CrowdBar value={tone === "busy" ? 84 : tone === "medium" ? 55 : 24} tone={tone} />
      </div>
    </button>
  );
}

function TabBar({ active }: { active: "home" | "map" | "alerts" | "me" }) {
  const { go } = useNav();
  const items = [
    { id: "home", icon: Activity, label: "Live" },
    { id: "map", icon: Navigation, label: "Map" },
    { id: "alerts", icon: BellRing, label: "Alerts" },
    { id: "me", icon: Smile, label: "Me" },
  ] as const;
  return (
    <div className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-full bg-ink px-3 py-2.5 text-paper ql-shadow">
      {items.map(({ id, icon: Icon, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => go(id as Screen)}
            className={[
              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-medium transition-colors",
              isActive ? "bg-paper text-ink" : "text-paper/70",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            {isActive && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

function MapScreen() {
  const { go, back } = useNav();
  return (
    <div className="relative flex h-full flex-col bg-stone">
      <div className="relative h-[58%] w-full overflow-hidden">
        <div className="absolute inset-0 ql-grid-bg" style={{ background: "linear-gradient(180deg, oklch(0.93 0.012 80), oklch(0.9 0.015 75))" }} />
        <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
          <path d="M-20 120 Q 200 80 420 180" stroke="oklch(0.78 0.01 75)" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M40 -20 Q 120 220 80 520" stroke="oklch(0.78 0.01 75)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M-20 360 Q 220 320 420 400" stroke="oklch(0.82 0.01 75)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M260 -20 Q 290 220 360 520" stroke="oklch(0.82 0.01 75)" strokeWidth="9" fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute left-[18%] top-[22%] h-28 w-28 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-busy) 85%, transparent), transparent 70%)" }} />
        <div className="absolute right-[10%] top-[40%] h-24 w-24 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-medium) 85%, transparent), transparent 70%)" }} />
        <div className="absolute left-[30%] bottom-[12%] h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-free) 85%, transparent), transparent 70%)" }} />

        <MapPin1 x="22%" y="28%" tone="busy" label="47m" onClick={() => go("detail")} />
        <MapPin1 x="62%" y="44%" tone="medium" label="9m" onClick={() => go("detail")} />
        <MapPin1 x="38%" y="68%" tone="free" label="3m" onClick={() => go("detail")} />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="ql-pulse relative h-4 w-4 rounded-full text-q-live-foreground">
            <div className="absolute inset-0 rounded-full bg-q-live-foreground ring-4 ring-paper" />
          </div>
        </div>

        <div className="absolute inset-x-4 top-6 flex items-center justify-between">
          <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-shadow"><ArrowLeft className="h-4 w-4 text-ink" /></button>
          <div className="flex items-center gap-2 rounded-full bg-paper px-3 py-2 ql-shadow">
            <CircleDot className="h-3.5 w-3.5 text-q-busy-foreground" />
            <span className="text-[11px] font-medium text-ink">Live · 1.2 km radius</span>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-shadow"><Navigation className="h-4 w-4 text-ink" /></button>
        </div>
      </div>

      <div className="relative -mt-6 flex-1 overflow-y-auto rounded-t-[28px] bg-paper px-5 pb-28 pt-4 ql-shadow">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Less crowded nearby</div>
            <div className="font-display text-[20px] font-semibold tracking-tight text-ink">SBI · 12th Main</div>
          </div>
          <span className="rounded-full bg-q-free px-3 py-1 text-[11px] font-semibold text-q-free-foreground">FREE</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat icon={Clock} label="Wait" value="3 min" />
          <Stat icon={Navigation} label="Travel" value="6 min" />
          <Stat icon={Users} label="Occupancy" value="24%" />
        </div>

        <button onClick={() => go("detail")} className="mt-3 flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-paper active:scale-[0.99] transition-transform">
          <span className="text-[13px] font-semibold">Navigate</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <TabBar active="map" />
    </div>
  );
}

function MapPin1({ x, y, tone, label, onClick }: { x: string; y: string; tone: "free" | "medium" | "busy"; label: string; onClick?: () => void }) {
  const bg = tone === "free" ? "bg-q-free-foreground" : tone === "medium" ? "bg-q-medium-foreground" : "bg-q-busy-foreground";
  return (
    <button onClick={onClick} className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-95 transition-transform" style={{ left: x, top: y }}>
      <div className={`${bg} flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-semibold text-paper ql-shadow`}>
        <span className="h-1.5 w-1.5 rounded-full bg-paper" /> {label}
      </div>
    </button>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-beige px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 font-display text-[15px] font-semibold tracking-tight text-ink">{value}</div>
    </div>
  );
}

function DetailScreen() {
  const { back, go } = useNav();
  return (
    <div className="relative flex h-full flex-col bg-beige">
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between">
            <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring"><ArrowLeft className="h-4 w-4 text-ink" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring"><Bookmark className="h-4 w-4 text-ink" /></button>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Hospital · OPD</div>
            <h2 className="mt-1 font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-ink">Apollo Hospital</h2>
            <div className="mt-1.5 flex items-center gap-2 text-[12px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Bannerghatta Road · 2.3 km
            </div>
          </div>

          <div className="mt-4 rounded-[24px] bg-ink p-5 text-paper">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Live wait time</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-q-busy">
                <span className="h-1.5 w-1.5 rounded-full bg-q-busy ql-tick" /> Busy
              </span>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-[56px] font-semibold leading-none tracking-tight">47</span>
              <span className="mb-2 text-[14px] font-medium opacity-70">min</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px]">
              <span className="opacity-70">Occupancy</span>
              <span className="font-semibold">82%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-paper/15">
              <div className="ql-bar-anim h-full rounded-full bg-q-busy" style={{ width: "82%" }} />
            </div>
          </div>
        </div>

        <div className="mt-3 px-5">
          <button onClick={() => go("predictions")} className="block w-full rounded-[24px] bg-q-ai p-4 text-left active:opacity-90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-q-ai-foreground text-paper">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="text-[12px] font-semibold text-q-ai-foreground">AI prediction · next 4h</span>
              </div>
              <span className="text-[11px] font-medium text-q-ai-foreground/70">+12% peak</span>
            </div>
            <div className="mt-3 text-q-ai-foreground"><Sparkline tone="ai" /></div>
            <div className="mt-1 flex justify-between text-[10px] font-medium text-q-ai-foreground/70">
              <span>2PM</span><span>3PM</span><span>4PM</span><span>5PM</span><span>6PM</span>
            </div>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 px-5">
          <InfoTile label="Best time" value="11:30 AM" icon={Clock} />
          <InfoTile label="Peak hours" value="6–8 PM" icon={TrendingUp} />
          <InfoTile label="Noise" value="Moderate" icon={Volume2} />
          <InfoTile label="Comfort" value="8.4 / 10" icon={Smile} />
        </div>

        <div className="mt-3 px-5">
          <div className="rounded-[24px] bg-paper p-4 ql-ring">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-ink">Recent user check-ins</span>
              <span className="text-[11px] text-muted-foreground">24 today</span>
            </div>
            <div className="mt-3 flex -space-x-2">
              {["bg-q-free", "bg-q-medium", "bg-q-ai", "bg-q-live", "bg-q-busy"].map((c, i) => (
                <div key={i} className={`${c} h-8 w-8 rounded-full ring-2 ring-paper`} />
              ))}
              <div className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[10px] font-semibold text-paper ring-2 ring-paper">+19</div>
            </div>
            <div className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              "Counter 3 is moving fastest. Bring water — AC is uneven near reception."
              <span className="ml-1 font-medium text-ink">— Sana, 12m ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-beige via-beige to-transparent px-5 pb-5 pt-8">
        <button onClick={() => go("contribute")} className="flex w-full items-center justify-between rounded-2xl bg-ink px-5 py-4 text-paper ql-shadow active:scale-[0.99] transition-transform">
          <span className="text-[14px] font-semibold">Join virtual queue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function InfoTile({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Clock }) {
  return (
    <div className="rounded-[20px] bg-paper p-3.5 ql-ring">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 font-display text-[16px] font-semibold tracking-tight text-ink">{value}</div>
    </div>
  );
}

function PredictionScreen() {
  const { back } = useNav();
  return (
    <div className="relative flex h-full flex-col bg-paper">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-beige"><ArrowLeft className="h-4 w-4 text-ink" /></button>
          <span className="text-[12px] font-semibold text-ink">AI Predictions</span>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-beige"><Sparkles className="h-4 w-4 text-q-ai-foreground" /></button>
        </div>

        <div className="mt-5">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Today · live insight</div>
          <h2 className="mt-1 font-display text-[26px] font-semibold leading-[1.15] tracking-tight text-ink">
            Smart predictions for<br />the next few hours.
          </h2>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto px-5 pb-28">
        <div className="rounded-[24px] bg-q-ai p-5">
          <div className="flex items-center justify-between text-q-ai-foreground">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-80">
              <Sparkles className="h-3 w-3" /> Cult Fit · Koramangala
            </span>
            <span className="text-[11px] font-semibold">−42%</span>
          </div>
          <p className="mt-2 font-display text-[19px] font-semibold leading-snug tracking-tight text-q-ai-foreground">
            This gym will become less crowded in 18 minutes.
          </p>
          <div className="mt-3 text-q-ai-foreground"><MiniBars tone="ai" /></div>
          <div className="mt-1 flex justify-between text-[10px] font-medium text-q-ai-foreground/70">
            <span>now</span><span>+30m</span><span>+1h</span>
          </div>
        </div>

        <div className="rounded-[24px] bg-q-busy p-5">
          <div className="flex items-center justify-between text-q-busy-foreground">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-80">
              <TrendingUp className="h-3 w-3" /> Apollo Hospital
            </span>
            <span className="text-[11px] font-semibold">+28%</span>
          </div>
          <p className="mt-2 font-display text-[19px] font-semibold leading-snug tracking-tight text-q-busy-foreground">
            Queue expected to increase sharply after 6PM.
          </p>
          <div className="mt-3 text-q-busy-foreground"><Sparkline /></div>
        </div>

        <div className="rounded-[24px] bg-q-live p-5">
          <div className="flex items-center justify-between text-q-live-foreground">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-80">
              <Bus className="h-3 w-3" /> 500D · Silk Board
            </span>
            <span className="text-[11px] font-semibold">ETA 4m</span>
          </div>
          <p className="mt-2 font-display text-[19px] font-semibold leading-snug tracking-tight text-q-live-foreground">
            Next 3 buses are running on schedule.
          </p>
        </div>
      </div>
      <TabBar active="alerts" />
    </div>
  );
}

function NotificationsScreen() {
  const { go } = useNav();
  const [filter, setFilter] = useState("All");
  return (
    <div className="relative flex h-full flex-col bg-beige">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[22px] font-semibold tracking-tight text-ink">Alerts</h2>
          <button className="text-[12px] font-medium text-muted-foreground">Mark all read</button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", "Nearby", "Saved", "Transit"].map((f) => (
            <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>
          ))}
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto px-5 pb-28">
        <NotifCard onClick={() => go("detail")} tone="free" icon={Zap} title="SBI · MG Road" body="Only 5 min waiting now — head over." time="just now" />
        <NotifCard onClick={() => go("predictions")} tone="ai" icon={Sparkles} title="Smart suggestion" body="Skip Apollo OPD until 4:30 PM. Crowd peaks soon." time="3m" />
        <NotifCard onClick={() => go("detail")} tone="live" icon={Bus} title="500D arriving" body="Bus reaches Silk Board in 4 minutes." time="6m" />
        <NotifCard onClick={() => go("detail")} tone="medium" icon={Coffee} title="Third Wave Coffee" body="Queue is forming. 12 min wait expected." time="14m" />
        <NotifCard onClick={() => go("detail")} tone="busy" icon={TrendingUp} title="Cubbon Park Gym" body="Crowd spiking. Wait grew by 18 min." time="22m" />
      </div>
      <TabBar active="alerts" />
    </div>
  );
}

function NotifCard({
  tone, icon: Icon, title, body, time, onClick,
}: { tone: "free" | "medium" | "busy" | "ai" | "live"; icon: typeof Zap; title: string; body: string; time: string; onClick?: () => void }) {
  const bg = { free: "bg-q-free", medium: "bg-q-medium", busy: "bg-q-busy", ai: "bg-q-ai", live: "bg-q-live" }[tone];
  const fg = {
    free: "text-q-free-foreground", medium: "text-q-medium-foreground", busy: "text-q-busy-foreground",
    ai: "text-q-ai-foreground", live: "text-q-live-foreground",
  }[tone];
  return (
    <button onClick={onClick} className="flex w-full items-start gap-3 rounded-[20px] bg-paper p-3.5 text-left ql-ring active:bg-beige transition-colors">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${bg}`}>
        <Icon className={`h-4 w-4 ${fg}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[13px] font-semibold text-ink">{title}</span>
          <span className="shrink-0 text-[10px] font-medium text-muted-foreground">{time}</span>
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{body}</p>
      </div>
    </button>
  );
}

function ContributeScreen() {
  const { back } = useNav();
  const [crowd, setCrowd] = useState(58);
  const [wait, setWait] = useState(9);
  const [vibes, setVibes] = useState<string[]>(["Quiet", "Cozy"]);
  const toggleVibe = (v: string) => setVibes((arr) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]));

  const labels = ["Empty", "Calm", "Filling", "Busy", "Packed"];
  const activeLabel = labels[Math.min(4, Math.floor(crowd / 20))];

  return (
    <div className="relative flex h-full flex-col bg-paper px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-beige"><X className="h-4 w-4 text-ink" /></button>
        <span className="text-[12px] font-semibold text-ink">Quick check-in</span>
        <span className="text-[11px] font-medium text-q-ai-foreground">+12 pts</span>
      </div>

      <div className="mt-6">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">You're at</div>
        <h2 className="mt-1 font-display text-[26px] font-semibold leading-[1.15] tracking-tight text-ink">Third Wave Coffee</h2>
      </div>

      <div className="mt-6">
        <div className="text-[12px] font-semibold text-ink">How crowded is it right now?</div>
        <input
          type="range" min={0} max={100} value={crowd}
          onChange={(e) => setCrowd(parseInt(e.target.value))}
          className="ql-range mt-4 w-full"
        />
        <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {labels.map((l) => (
            <span key={l} className={l === activeLabel ? "text-ink" : ""}>{l}</span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-[12px] font-semibold text-ink">Estimated wait</div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-beige px-3 py-2.5">
          <button onClick={() => setWait((w) => Math.max(0, w - 1))} className="grid h-9 w-9 place-items-center rounded-xl bg-paper ql-ring"><Minus className="h-3.5 w-3.5 text-ink" /></button>
          <div className="text-center">
            <div className="font-display text-[26px] font-semibold leading-none tracking-tight text-ink">{wait}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">minutes</div>
          </div>
          <button onClick={() => setWait((w) => w + 1)} className="grid h-9 w-9 place-items-center rounded-xl bg-paper ql-ring"><Plus className="h-3.5 w-3.5 text-ink" /></button>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-[12px] font-semibold text-ink">Vibe</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Quiet", "Chatty", "Loud", "Cozy", "Cold", "Warm"].map((t) => (
            <button
              key={t} onClick={() => toggleVibe(t)}
              className={[
                "rounded-full px-3.5 py-2 text-[12px] font-medium ql-ring transition-colors",
                vibes.includes(t) ? "bg-q-medium text-q-medium-foreground" : "bg-paper text-ink",
              ].join(" ")}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
        <button onClick={back} className="flex items-center justify-center gap-2 rounded-2xl bg-beige px-4 py-3.5 text-[13px] font-semibold text-ink ql-ring">
          <Check className="h-4 w-4" /> Wait done
        </button>
        <button onClick={back} className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-[13px] font-semibold text-paper active:scale-[0.99] transition-transform">
          Submit <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const { go } = useNav();
  return (
    <div className="relative flex h-full flex-col bg-beige">
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[22px] font-semibold tracking-tight text-ink">Profile</h2>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring"><Settings className="h-4 w-4 text-ink" /></button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-[16px] font-semibold text-paper">A</div>
          <div>
            <div className="font-display text-[18px] font-semibold tracking-tight text-ink">Aarav Mehta</div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Trophy className="h-3 w-3" /> Level 4 · Crowd Scout
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] bg-ink p-5 text-paper">
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Time saved this month</div>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-display text-[44px] font-semibold leading-none tracking-tight">14h 22m</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] opacity-70">
            <span>vs last month</span>
            <span className="flex items-center gap-1 font-semibold text-q-free"><TrendingUp className="h-3 w-3" /> +28%</span>
          </div>
          <div className="mt-3"><MiniBars /></div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat icon={Heart} label="Saved" value="12" />
          <Stat icon={History} label="Visits" value="86" />
          <Stat icon={Sparkles} label="Score" value="1,240" />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-ink">Saved places</span>
            <button className="text-[11px] font-medium text-muted-foreground">See all</button>
          </div>
          <div className="space-y-2">
            {[
              { name: "Third Wave Coffee", meta: "Café · 9 min", tone: "medium" as const },
              { name: "Cult Fit Koramangala", meta: "Gym · 6 min", tone: "free" as const },
              { name: "Apollo Hospital", meta: "Hospital · 47 min", tone: "busy" as const },
            ].map((p) => (
              <button key={p.name} onClick={() => go("detail")} className="flex w-full items-center justify-between rounded-2xl bg-paper p-3.5 ql-ring active:bg-beige">
                <div className="flex items-center gap-3">
                  <span className={[
                    "h-2.5 w-2.5 rounded-full",
                    p.tone === "free" ? "bg-q-free-foreground" : p.tone === "medium" ? "bg-q-medium-foreground" : "bg-q-busy-foreground",
                  ].join(" ")} />
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-ink">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.meta}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="me" />
    </div>
  );
}
