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
  | "detail" | "contribute" | "predictions"
  | "search" | "compare" | "settings" | "empty"
  | "feedback" | "live" | "transport" | "radar";

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
      {screen === "search" && <SearchScreen />}
      {screen === "compare" && <CompareScreen />}
      {screen === "settings" && <AlertSettingsScreen />}
      {screen === "empty" && <EmptyStatesScreen />}
      {screen === "feedback" && <FeedbackScreen />}
      {screen === "live" && <LiveActivityScreen />}
      {screen === "transport" && <TransportScreen />}
      {screen === "radar" && <RadarScreen />}
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
          <h1 className="font-display text-[40px] font-semibold tracking-tight text-ink">LiveQ</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">See the wait before you go.</p>
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
  const [step, setStep] = useState(0);

  const slides = [
    {
      tone: "live" as const,
      eyebrow: "Step 1 of 3",
      title: <>See live wait<br />times near you.</>,
      body: "Check how long the queue is — at hospitals, banks, cafés, gyms and bus stops nearby. Updated every few seconds.",
      art: (
        <>
          <div className="absolute left-6 top-6 rounded-2xl bg-paper p-3 ql-shadow">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-q-live-foreground" />
              <span className="text-[12px] font-semibold text-ink">LIVE NOW</span>
            </div>
            <div className="mt-2 text-[24px] font-semibold text-ink">12 min wait</div>
            <div className="mt-2 h-1.5 w-28 rounded-full bg-q-live-foreground/40">
              <div className="ql-bar-anim h-full rounded-full bg-q-live-foreground" style={{ width: "55%" }} />
            </div>
          </div>
          <div className="absolute bottom-6 right-6 rounded-2xl bg-ink p-3 text-paper ql-shadow">
            <Users className="h-4 w-4" />
            <div className="mt-1.5 text-[12px] font-medium opacity-70">Crowd</div>
            <div className="text-[18px] font-semibold">Low</div>
          </div>
          <div className="absolute right-10 top-10 grid h-12 w-12 place-items-center rounded-full bg-paper ql-shadow">
            <MapPin className="h-5 w-5 text-ink" />
          </div>
        </>
      ),
    },
    {
      tone: "ai" as const,
      eyebrow: "Step 2 of 3",
      title: <>Know the best<br />time to visit.</>,
      body: "LiveQ predicts when a place will be quiet — so you can avoid the rush and skip long waits.",
      art: (
        <>
          <div className="absolute inset-x-6 top-7 rounded-2xl bg-paper p-3 ql-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-q-ai-foreground">Quietest soon</span>
              <span className="text-[11px] font-medium text-muted-foreground">92% sure</span>
            </div>
            <div className="mt-2 text-q-ai-foreground"><Sparkline tone="ai" /></div>
          </div>
          <div className="absolute bottom-6 left-6 rounded-2xl bg-ink p-3 text-paper ql-shadow">
            <Sparkles className="h-4 w-4" />
            <div className="mt-1.5 text-[12px] font-medium opacity-70">Best in</div>
            <div className="text-[18px] font-semibold">28 min</div>
          </div>
        </>
      ),
    },
    {
      tone: "free" as const,
      eyebrow: "Step 3 of 3",
      title: <>Easy to read<br />at a glance.</>,
      body: "Green means short wait, orange means busy, red means very crowded. Just tap any card to see more.",
      art: (
        <>
          <div className="absolute left-6 top-6 rounded-2xl bg-paper p-3 ql-shadow">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ink" /><span className="text-[12px] font-semibold text-ink">3 places nearby</span></div>
            <div className="mt-2 flex gap-1.5">
              <span className="rounded-full bg-q-free-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-q-free-foreground">3 min</span>
              <span className="rounded-full bg-q-medium-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-q-medium-foreground">9 min</span>
              <span className="rounded-full bg-q-busy-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-q-busy-foreground">47 min</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 rounded-2xl bg-ink p-3 text-paper ql-shadow">
            <Navigation className="h-4 w-4" />
            <div className="mt-1.5 text-[12px] font-medium opacity-70">Walk</div>
            <div className="text-[18px] font-semibold">6 min</div>
          </div>
        </>
      ),
    },
  ];

  const s = slides[step];
  const isLast = step === slides.length - 1;
  const toneBg = s.tone === "live" ? "bg-q-live" : s.tone === "ai" ? "bg-q-ai" : "bg-q-free";

  return (
    <div className="relative flex h-full flex-col bg-paper px-6 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative grid h-7 w-7 place-items-center rounded-[8px] bg-ink text-paper">
            <div className="h-1.5 w-1.5 rounded-full bg-paper" />
          </div>
          <span className="font-display text-[18px] font-semibold tracking-tight text-ink">LiveQ</span>
        </div>
        <button onClick={() => go("home")} className="text-[13px] font-medium text-muted-foreground underline-offset-2 hover:underline">Skip intro</button>
      </div>

      <div className="mt-6 flex-1">
        <div className={`relative h-[44%] min-h-[260px] w-full overflow-hidden rounded-[28px] ${toneBg} ql-ring`}>
          <div className="absolute inset-0 ql-grid-bg opacity-50" />
          {s.art}
        </div>

        <div className="mt-7">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <span key={i} className={i === step ? "h-1.5 w-6 rounded-full bg-ink" : "h-1.5 w-1.5 rounded-full bg-ink/20"} />
            ))}
          </div>
          <div className="mt-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{s.eyebrow}</div>
          <h2 className="mt-2 font-display text-[30px] font-semibold leading-[1.1] tracking-tight text-ink">{s.title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
        </div>
      </div>

      <button
        onClick={() => (isLast ? go("home") : setStep((n) => n + 1))}
        className="mt-6 flex items-center justify-between rounded-2xl bg-ink px-5 py-5 text-paper active:scale-[0.98] transition-transform"
      >
        <span className="text-[16px] font-semibold">{isLast ? "Start using LiveQ" : "Next"}</span>
        <ArrowRight className="h-5 w-5" />
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

        <button onClick={() => go("search")} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-paper px-4 py-4 ql-ring active:bg-beige transition-colors">
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-[15px] text-muted-foreground">Search a place, area or service</span>
        </button>

        <button onClick={() => go("live")} className="mt-3 flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3 text-paper ql-shadow active:scale-[0.99] transition-transform">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex">
              <span className="absolute inset-0 animate-ping rounded-full bg-q-busy opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-q-busy" />
            </span>
            <div className="leading-tight">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Live activity</div>
              <div className="text-[13px] font-semibold">SBI · 12 min left in queue</div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 opacity-70" />
        </button>

        <button onClick={() => go("predictions")} className="mt-3 flex w-full items-start gap-3 rounded-2xl bg-q-ai px-4 py-3 text-left active:opacity-90">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-q-ai-foreground text-paper">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-q-ai-foreground/70">AI Suggestion · 92% conf.</div>
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

        <div className="-mx-5 mt-3 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ToolPill icon={Gauge} label="Compare" onClick={() => go("compare")} />
            <ToolPill icon={Radar} label="Forecast radar" onClick={() => go("radar")} />
            <ToolPill icon={Train} label="Transport" onClick={() => go("transport")} />
            <ToolPill icon={SlidersHorizontal} label="Alert prefs" onClick={() => go("settings")} />
            <ToolPill icon={Inbox} label="Empty states" onClick={() => go("empty")} />
          </div>
        </div>
      </div>

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-5 pb-28 pt-3">
        <div className="rounded-2xl bg-paper p-4 ql-ring">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">How to read this</div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-ink">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-q-free px-2.5 py-1 font-medium text-q-free-foreground"><span className="h-2 w-2 rounded-full bg-q-free-foreground" /> Short wait</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-q-medium px-2.5 py-1 font-medium text-q-medium-foreground"><span className="h-2 w-2 rounded-full bg-q-medium-foreground" /> Busy</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-q-busy px-2.5 py-1 font-medium text-q-busy-foreground"><span className="h-2 w-2 rounded-full bg-q-busy-foreground" /> Very crowded</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Tap any card below to see live details, walking time and the best time to visit.</p>
        </div>
        <QueueCard tone="busy" name="Apollo Hospital" meta="Hospital · 2.3 km" wait="47 min" trend="up" trendLabel="Crowd increasing" onClick={() => go("detail")} />
        <QueueCard tone="medium" name="Third Wave Coffee" meta="Café · 0.4 km" wait="9 min" trend="up" trendLabel="Filling up" onClick={() => go("contribute")} />
        <QueueCard tone="free" name="SBI · 12th Main Branch" meta="Bank · 1.1 km" wait="3 min" trend="down" trendLabel="Crowd easing" onClick={() => go("detail")} />
        <QueueCard tone="free" name="Cult Fit Koramangala" meta="Gym · 1.8 km" wait="6 min" trend="down" trendLabel="Quiet hour" onClick={() => go("detail")} />
        <QueueCard tone="medium" name="500D · Silk Board" meta="Bus · 0.2 km" wait="4 min" trend="up" trendLabel="ETA stable" onClick={() => go("transport")} />
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
  const { back, go } = useNav();
  return (
    <div className="relative flex h-full flex-col bg-paper">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-beige"><ArrowLeft className="h-4 w-4 text-ink" /></button>
          <span className="text-[12px] font-semibold text-ink">AI Predictions</span>
          <button onClick={() => go("radar")} className="grid h-10 w-10 place-items-center rounded-full bg-beige active:bg-stone"><Radar className="h-4 w-4 text-q-ai-foreground" /></button>
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
  const { back, go } = useNav();
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
        <button onClick={() => go("feedback")} className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-[13px] font-semibold text-paper active:scale-[0.99] transition-transform">
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
          <button onClick={() => go("settings")} className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring active:bg-beige"><Settings className="h-4 w-4 text-ink" /></button>
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

/* ---------- shared atoms (new) ---------- */

function ToolPill({ icon: Icon, label, onClick }: { icon: typeof Zap; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex shrink-0 items-center gap-1.5 rounded-full bg-paper px-3.5 py-2 text-[12px] font-medium text-ink ql-ring active:bg-beige transition-colors">
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function ScreenHeader({ title, right }: { title: string; right?: ReactNode }) {
  const { back } = useNav();
  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring active:bg-beige"><ArrowLeft className="h-4 w-4 text-ink" /></button>
      <span className="text-[12px] font-semibold text-ink">{title}</span>
      <div className="h-10 w-10">{right}</div>
    </div>
  );
}

function LiveDot({ tone = "busy" }: { tone?: "busy" | "live" | "free" }) {
  const c = tone === "busy" ? "bg-q-busy-foreground" : tone === "live" ? "bg-q-live-foreground" : "bg-q-free-foreground";
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inset-0 animate-ping rounded-full ${c} opacity-60`} />
      <span className={`relative h-2 w-2 rounded-full ${c}`} />
    </span>
  );
}

function Timestamp({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      <span className="h-1 w-1 rounded-full bg-q-live-foreground" /> {children}
    </span>
  );
}

/* ---------- search ---------- */

function SearchScreen() {
  const { back, go } = useNav();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Nearest");
  const filters = ["Nearest", "Lowest wait", "Least crowded", "Open now"];
  const recents = ["Apollo Hospital", "Cult Fit Koramangala", "SBI 12th Main"];
  const trending = [
    { tone: "free" as const, name: "BMTC Kempegowda", meta: "Bus stand · 1.4 km", wait: "2 min", occ: 18 },
    { tone: "medium" as const, name: "Blue Tokai · HSR", meta: "Café · 0.8 km", wait: "11 min", occ: 56 },
    { tone: "busy" as const, name: "Manipal Hospital", meta: "Hospital · 3.1 km", wait: "52 min", occ: 88 },
  ];

  return (
    <div className="relative flex h-full flex-col bg-paper">
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-beige active:bg-stone"><ArrowLeft className="h-4 w-4 text-ink" /></button>
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-beige px-4 py-3 ql-ring">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search places, queues, transit…"
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted-foreground focus:outline-none"
            />
            {q && <button onClick={() => setQ("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
          </div>
        </div>

        <div className="-mx-5 mt-4 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => (
              <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-5 overflow-y-auto px-5 pb-10">
        {!q && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</span>
              <button className="text-[11px] font-medium text-muted-foreground">Clear</button>
            </div>
            <div className="space-y-2">
              {recents.map((r) => (
                <button key={r} onClick={() => setQ(r)} className="flex w-full items-center justify-between rounded-2xl bg-beige px-4 py-3 active:bg-stone">
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[13px] font-medium text-ink">{r}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{q ? "Results" : "Trending nearby"}</span>
            <Timestamp>Updated 12 sec ago</Timestamp>
          </div>
          <div className="space-y-2">
            {trending.map((t) => (
              <button key={t.name} onClick={() => go("detail")} className="flex w-full items-center justify-between rounded-[20px] bg-paper p-3.5 ql-ring active:bg-beige">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t.meta}</div>
                  <div className="mt-0.5 truncate text-[14px] font-semibold text-ink">{t.name}</div>
                  <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-ink/10">
                    <div className={`h-full rounded-full ${t.tone === "free" ? "bg-q-free-foreground" : t.tone === "medium" ? "bg-q-medium-foreground" : "bg-q-busy-foreground"}`} style={{ width: `${t.occ}%` }} />
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <div className="font-display text-[18px] font-semibold tracking-tight text-ink">{t.wait}</div>
                  <div className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wider ${t.tone === "free" ? "text-q-free-foreground" : t.tone === "medium" ? "text-q-medium-foreground" : "text-q-busy-foreground"}`}>{t.tone === "free" ? "Free" : t.tone === "medium" ? "Filling" : "Busy"}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- compare ---------- */

function CompareScreen() {
  const a = { name: "Third Wave Coffee", meta: "Café · 0.4 km", wait: "9", occ: 56, trend: "up" as const, comfort: "8.1", tone: "medium" as const };
  const b = { name: "Blue Tokai HSR", meta: "Café · 0.8 km", wait: "4", occ: 28, trend: "down" as const, comfort: "9.0", tone: "free" as const };

  return (
    <div className="relative flex h-full flex-col bg-beige">
      <ScreenHeader title="Compare" right={<button className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring"><Plus className="h-4 w-4 text-ink" /></button>} />

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-5 pb-10 pt-2">
        <div className="grid grid-cols-2 gap-2">
          {[a, b].map((p) => (
            <div key={p.name} className={`rounded-[22px] p-4 ${p.tone === "free" ? "bg-q-free" : "bg-q-medium"}`}>
              <div className={`text-[10px] font-semibold uppercase tracking-wider ${p.tone === "free" ? "text-q-free-foreground" : "text-q-medium-foreground"} opacity-70`}>{p.meta}</div>
              <div className="mt-1 font-display text-[15px] font-semibold leading-tight tracking-tight text-ink">{p.name}</div>
              <div className="mt-3 font-display text-[28px] font-semibold leading-none tracking-tight text-ink">{p.wait}<span className="ml-1 text-[12px] font-medium opacity-60">min</span></div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink/10">
                <div className={`ql-bar-anim h-full rounded-full ${p.tone === "free" ? "bg-q-free-foreground" : "bg-q-medium-foreground"}`} style={{ width: `${p.occ}%` }} />
              </div>
            </div>
          ))}
        </div>

        <CompareRow label="Distance" left="0.4 km" right="0.8 km" winner="left" />
        <CompareRow label="Live wait" left="9 min" right="4 min" winner="right" />
        <CompareRow label="Occupancy" left="56%" right="28%" winner="right" />
        <CompareRow label="Comfort score" left="8.1 / 10" right="9.0 / 10" winner="right" />

        <div className="rounded-[22px] bg-paper p-4 ql-ring">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Prediction · next 1h</span>
            <span className="text-[10px] font-medium text-muted-foreground">92% conf.</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-medium text-ink">{a.name}</div>
              <div className="text-q-medium-foreground"><Sparkline /></div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-ink">{b.name}</div>
              <div className="text-q-free-foreground"><Sparkline /></div>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-ink p-4 text-paper">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider opacity-60">
            <Sparkles className="h-3 w-3" /> Recommendation
          </div>
          <p className="mt-2 text-[14px] font-medium leading-snug">Head to <span className="font-semibold">Blue Tokai HSR</span>. You'll save ~7 min including travel.</p>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, left, right, winner }: { label: string; left: string; right: string; winner: "left" | "right" }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-paper px-4 py-3 ql-ring">
      <div className={`text-left text-[14px] font-semibold ${winner === "left" ? "text-ink" : "text-muted-foreground"}`}>{left}</div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className={`text-right text-[14px] font-semibold ${winner === "right" ? "text-ink" : "text-muted-foreground"}`}>{right}</div>
    </div>
  );
}

/* ---------- alert preferences ---------- */

function AlertSettingsScreen() {
  const [threshold, setThreshold] = useState(15);
  const [prefs, setPrefs] = useState({
    smart: true, transport: true, gym: false, ai: true, quiet: false,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="relative flex h-full flex-col bg-paper">
      <ScreenHeader title="Alert preferences" />

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-5 pb-10 pt-2">
        <div className="rounded-[22px] bg-beige p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notify me when wait drops below</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-display text-[34px] font-semibold leading-none tracking-tight text-ink">{threshold}</span>
            <span className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">min</span>
          </div>
          <input type="range" min={5} max={60} step={5} value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} className="ql-range mt-4 w-full" />
          <div className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>5</span><span>30</span><span>60</span>
          </div>
        </div>

        <ToggleRow icon={Zap} tone="free" title="Smart crowd alerts" body="Ping me when a saved place becomes free." on={prefs.smart} onChange={() => toggle("smart")} />
        <ToggleRow icon={Bus} tone="live" title="Transport congestion" body="Live updates for routes you take." on={prefs.transport} onChange={() => toggle("transport")} />
        <ToggleRow icon={Dumbbell} tone="medium" title="Gym crowd alerts" body="Best windows for low occupancy." on={prefs.gym} onChange={() => toggle("gym")} />
        <ToggleRow icon={Sparkles} tone="ai" title="AI predictions" body="Daily 4-hour forecast for nearby places." on={prefs.ai} onChange={() => toggle("ai")} />
        <ToggleRow icon={Volume2} tone="busy" title="Quiet hours" body="Mute non-critical alerts 10PM – 8AM." on={prefs.quiet} onChange={() => toggle("quiet")} />

        <div className="rounded-[22px] bg-ink p-4 text-paper">
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Preview</div>
          <div className="mt-2 flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-q-free"><Zap className="h-4 w-4 text-q-free-foreground" /></div>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold">SBI · 12th Main now under {threshold} min</div>
              <div className="mt-0.5 text-[11px] opacity-70">Tap to navigate · just now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, tone, title, body, on, onChange }: { icon: typeof Zap; tone: "free" | "medium" | "busy" | "ai" | "live"; title: string; body: string; on: boolean; onChange: () => void }) {
  const bg = { free: "bg-q-free", medium: "bg-q-medium", busy: "bg-q-busy", ai: "bg-q-ai", live: "bg-q-live" }[tone];
  const fg = { free: "text-q-free-foreground", medium: "text-q-medium-foreground", busy: "text-q-busy-foreground", ai: "text-q-ai-foreground", live: "text-q-live-foreground" }[tone];
  return (
    <div className="flex items-start gap-3 rounded-[20px] bg-paper p-4 ql-ring">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${bg}`}>
        <Icon className={`h-4 w-4 ${fg}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-ink">{title}</div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{body}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-ink/15"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

/* ---------- empty states ---------- */

function EmptyStatesScreen() {
  return (
    <div className="relative flex h-full flex-col bg-beige">
      <ScreenHeader title="Empty states" />
      <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-5 pb-10 pt-2">
        <EmptyCard
          icon={Bookmark}
          title="No saved places yet"
          body="Bookmark places to track their live wait and crowd levels here."
          cta="Browse nearby"
          tone="ai"
        />
        <EmptyCard
          icon={History}
          title="No recent activity"
          body="Your check-ins and contributions will appear once you start using QueueLess."
          cta="Make a check-in"
          tone="live"
        />
        <EmptyCard
          icon={Wifi}
          title="No crowd data available"
          body="We don't have enough signals here yet. Help others by sending the first report."
          cta="Be the first"
          tone="medium"
        />
      </div>
    </div>
  );
}

function EmptyCard({ icon: Icon, title, body, cta, tone }: { icon: typeof Zap; title: string; body: string; cta: string; tone: "ai" | "live" | "medium" }) {
  const bg = { ai: "bg-q-ai", live: "bg-q-live", medium: "bg-q-medium" }[tone];
  const fg = { ai: "text-q-ai-foreground", live: "text-q-live-foreground", medium: "text-q-medium-foreground" }[tone];
  return (
    <div className="rounded-[24px] bg-paper p-5 ql-ring">
      <div className={`relative grid h-20 w-20 place-items-center rounded-[24px] ${bg}`}>
        <Icon className={`h-7 w-7 ${fg}`} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-paper ql-ring" />
      </div>
      <div className="mt-4 font-display text-[18px] font-semibold tracking-tight text-ink">{title}</div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{body}</p>
      <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-paper active:scale-[0.98] transition-transform">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ---------- feedback ---------- */

function FeedbackScreen() {
  const { go } = useNav();
  const [accurate, setAccurate] = useState<null | boolean>(null);
  const [rating, setRating] = useState(4);

  return (
    <div className="relative flex h-full flex-col bg-paper px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <button onClick={() => go("home")} className="grid h-10 w-10 place-items-center rounded-full bg-beige"><X className="h-4 w-4 text-ink" /></button>
        <span className="text-[12px] font-semibold text-ink">Wait completed</span>
        <span className="rounded-full bg-q-ai px-2.5 py-1 text-[10px] font-semibold text-q-ai-foreground">+18 pts</span>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-q-free">
          <Check className="h-9 w-9 text-q-free-foreground" />
        </div>
        <h2 className="mt-5 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink">You're done waiting.</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Thanks for using QueueLess at Third Wave Coffee.</p>
      </div>

      <div className="mt-8 rounded-[24px] bg-beige p-5">
        <div className="text-[12px] font-semibold text-ink">Was the prediction accurate?</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setAccurate(true)}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-semibold transition-colors ${accurate === true ? "bg-q-free text-q-free-foreground" : "bg-paper text-ink ql-ring"}`}
          >
            <ThumbsUp className="h-4 w-4" /> Spot on
          </button>
          <button
            onClick={() => setAccurate(false)}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-semibold transition-colors ${accurate === false ? "bg-q-busy text-q-busy-foreground" : "bg-paper text-ink ql-ring"}`}
          >
            <ThumbsDown className="h-4 w-4" /> Off
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-[24px] bg-beige p-5">
        <div className="text-[12px] font-semibold text-ink">Rate your visit</div>
        <div className="mt-3 flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} className="p-1">
              <Star className={`h-7 w-7 ${n <= rating ? "fill-ink text-ink" : "text-ink/25"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-[1fr_2fr] gap-2 pt-6">
        <button onClick={() => go("home")} className="rounded-2xl bg-beige px-4 py-3.5 text-[13px] font-semibold text-ink ql-ring">Later</button>
        <button onClick={() => go("home")} className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-[13px] font-semibold text-paper active:scale-[0.99] transition-transform">
          Submit feedback <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------- live activity / dynamic widget ---------- */

function LiveActivityScreen() {
  const { back } = useNav();
  return (
    <div className="relative flex h-full flex-col" style={{ background: "linear-gradient(180deg, oklch(0.18 0.008 60), oklch(0.12 0.008 60))" }}>
      <div className="flex items-center justify-between px-5 pt-6 text-paper">
        <button onClick={back} className="grid h-10 w-10 place-items-center rounded-full bg-paper/10 active:bg-paper/20"><ArrowLeft className="h-4 w-4" /></button>
        <span className="text-[12px] font-semibold opacity-90">Live Activity</span>
        <div className="h-10 w-10" />
      </div>

      <div className="px-5 pt-10 text-paper">
        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Lock screen preview</div>
      </div>

      <div className="mt-3 space-y-3 px-5 pb-8">
        {/* Dynamic island compact */}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-black px-4 py-2 text-paper">
          <LiveDot tone="live" />
          <span className="text-[12px] font-semibold">12:34</span>
          <span className="text-[12px] opacity-70">·</span>
          <span className="text-[12px] font-medium">SBI · 12 min</span>
        </div>

        {/* Expanded live activity card */}
        <div className="rounded-[26px] bg-black/90 p-5 text-paper ring-1 ring-paper/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-q-live">
                <Building2 className="h-4 w-4 text-q-live-foreground" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">In queue</div>
                <div className="text-[13px] font-semibold">SBI · 12th Main</div>
              </div>
            </div>
            <LiveDot tone="live" />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Wait left</div>
              <div className="font-display text-[44px] font-semibold leading-none tracking-tight">12<span className="ml-1 text-[14px] font-medium opacity-60">min</span></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Position</div>
              <div className="font-display text-[22px] font-semibold tracking-tight">#3</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] opacity-70">
              <span>You joined at 12:18</span>
              <span>ETA 12:46</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-paper/15">
              <div className="ql-bar-anim h-full rounded-full bg-q-live-foreground" style={{ width: "62%" }} />
            </div>
          </div>
        </div>

        {/* Update notification */}
        <div className="rounded-[22px] bg-black/80 p-4 text-paper ring-1 ring-paper/10">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-q-free">
              <ArrowDownRight className="h-4 w-4 text-q-free-foreground" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold">Occupancy dropped to 38%</span>
                <span className="text-[10px] opacity-60">just now</span>
              </div>
              <div className="mt-0.5 text-[11px] opacity-70">Counter 3 freed up — wait may shorten.</div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="rounded-[22px] bg-black/80 p-4 text-paper ring-1 ring-paper/10">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-q-ai">
              <Sparkles className="h-4 w-4 text-q-ai-foreground" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold">Smart alert · 92% conf.</span>
                <span className="text-[10px] opacity-60">2m</span>
              </div>
              <div className="mt-0.5 text-[11px] opacity-70">A nearby branch has only 3 min wait.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- transport detail ---------- */

function TransportScreen() {
  return (
    <div className="relative flex h-full flex-col bg-beige">
      <ScreenHeader title="Transport" right={<button className="grid h-10 w-10 place-items-center rounded-full bg-paper ql-ring"><Bookmark className="h-4 w-4 text-ink" /></button>} />

      <div className="mt-2 flex-1 space-y-3 overflow-y-auto px-5 pb-10 pt-2">
        <div className="rounded-[24px] bg-q-live p-5 text-q-live-foreground">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Route 500D · Silk Board → ITPL</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"><LiveDot tone="live" /> Live</span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-[44px] font-semibold leading-none tracking-tight text-ink">4</span>
            <span className="mb-1.5 text-[12px] font-medium opacity-70">min to arrival</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
            <Bus className="h-3.5 w-3.5" /> KA-01-F-3421 · AC
            <span className="opacity-50">·</span>
            <span>2 stops away</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[20px] bg-paper p-4 ql-ring">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bus occupancy</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-[22px] font-semibold tracking-tight text-ink">68%</span>
              <span className="mb-1 text-[10px] font-semibold uppercase text-q-medium-foreground">Filling</span>
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className={`h-3 rounded-sm ${i < 12 ? "bg-q-medium-foreground/70" : "bg-ink/10"}`} />
              ))}
            </div>
          </div>
          <div className="rounded-[20px] bg-paper p-4 ql-ring">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Platform crowd</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-[22px] font-semibold tracking-tight text-ink">Low</span>
            </div>
            <div className="mt-3 flex -space-x-1.5">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="h-5 w-5 rounded-full bg-q-free-foreground/80 ring-2 ring-paper" />
              ))}
              <div className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[9px] font-semibold text-paper ring-2 ring-paper">+3</div>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-paper p-4 ql-ring">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Congestion forecast · 1h</span>
            <span className="text-[10px] font-medium text-muted-foreground">87% conf.</span>
          </div>
          <div className="mt-3 text-q-live-foreground"><Sparkline tone="live" /></div>
          <div className="mt-1 flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>now</span><span>+15m</span><span>+30m</span><span>+45m</span><span>+1h</span>
          </div>
        </div>

        <div className="rounded-[22px] bg-paper p-4 ql-ring">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-ink">Next arrivals</span>
            <Timestamp>Updated 8 sec ago</Timestamp>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { route: "500D", eta: "4 min", occ: "Filling", tone: "medium" as const, icon: Bus },
              { route: "Purple Line", eta: "7 min", occ: "Low", tone: "free" as const, icon: Train },
              { route: "335E", eta: "12 min", occ: "Packed", tone: "busy" as const, icon: Bus },
            ].map((r) => (
              <div key={r.route} className="flex items-center justify-between rounded-2xl bg-beige px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl ${r.tone === "free" ? "bg-q-free" : r.tone === "medium" ? "bg-q-medium" : "bg-q-busy"}`}>
                    <r.icon className={`h-4 w-4 ${r.tone === "free" ? "text-q-free-foreground" : r.tone === "medium" ? "text-q-medium-foreground" : "text-q-busy-foreground"}`} />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-semibold text-ink">{r.route}</div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{r.occ}</div>
                  </div>
                </div>
                <div className="font-display text-[16px] font-semibold tracking-tight text-ink">{r.eta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- crowd forecast radar ---------- */

function RadarScreen() {
  const hours = ["now", "+1h", "+2h", "+3h", "+4h", "+5h", "+6h"];
  const intensity = [40, 62, 78, 88, 70, 55, 42];
  return (
    <div className="relative flex h-full flex-col bg-paper">
      <ScreenHeader title="Forecast Radar" right={<button className="grid h-10 w-10 place-items-center rounded-full bg-beige"><Sparkles className="h-4 w-4 text-q-ai-foreground" /></button>} />

      <div className="px-5 pt-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Indiranagar · 1.2 km radius</div>
        <h2 className="mt-1 font-display text-[24px] font-semibold leading-tight tracking-tight text-ink">Crowd will peak at <span className="text-q-ai-foreground">5 PM</span>.</h2>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto px-5 pb-10">
        <div className="relative h-56 overflow-hidden rounded-[24px] bg-stone ql-ring">
          <div className="absolute inset-0 ql-grid-bg opacity-60" />
          {/* heat zones */}
          <div className="absolute left-[20%] top-[24%] h-32 w-32 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-busy) 90%, transparent), transparent 70%)" }} />
          <div className="absolute right-[12%] top-[18%] h-24 w-24 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-medium) 90%, transparent), transparent 70%)" }} />
          <div className="absolute left-[36%] bottom-[14%] h-28 w-28 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-ai) 90%, transparent), transparent 70%)" }} />
          <div className="absolute right-[26%] bottom-[20%] h-20 w-20 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--q-free) 90%, transparent), transparent 70%)" }} />
          {/* radar sweep rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-3 w-3 rounded-full text-q-ai-foreground ql-pulse">
              <div className="absolute inset-0 rounded-full bg-q-ai-foreground ring-4 ring-paper" />
            </div>
          </div>
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 ql-shadow">
            <LiveDot tone="busy" />
            <span className="text-[10px] font-semibold text-ink">Live heatmap</span>
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-paper px-3 py-1.5 ql-shadow">
            <span className="text-[10px] font-medium text-muted-foreground">Updated 12 sec ago</span>
          </div>
        </div>

        <div className="rounded-[22px] bg-beige p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Density timeline</span>
            <span className="text-[10px] font-medium text-muted-foreground">92% conf.</span>
          </div>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {intensity.map((v, i) => {
              const tone = v > 80 ? "bg-q-busy-foreground" : v > 60 ? "bg-q-medium-foreground" : v > 40 ? "bg-q-ai-foreground" : "bg-q-free-foreground";
              return <div key={i} className={`flex-1 rounded-md ${tone}`} style={{ height: `${v}%`, opacity: i === 3 ? 1 : 0.55 }} />;
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-medium text-muted-foreground">
            {hours.map((h) => <span key={h}>{h}</span>)}
          </div>
        </div>

        <div className="rounded-[22px] bg-q-ai p-5">
          <div className="flex items-center justify-between text-q-ai-foreground">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-80">
              <Flame className="h-3 w-3" /> Hotspots forming
            </span>
            <span className="text-[11px] font-semibold">+34%</span>
          </div>
          <p className="mt-2 font-display text-[18px] font-semibold leading-snug tracking-tight text-q-ai-foreground">
            100ft Road & CMH Junction will get crowded around 5–6 PM.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-paper/70 px-3 py-1 text-[10px] font-semibold text-q-ai-foreground">Avoid 5–6 PM</span>
            <span className="rounded-full bg-paper/70 px-3 py-1 text-[10px] font-semibold text-q-ai-foreground">Best 3:30 PM</span>
          </div>
        </div>

        <div className="rounded-[22px] bg-paper p-4 ql-ring">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI recommendations</div>
          <div className="mt-3 space-y-2">
            {[
              { tone: "free" as const, icon: Coffee, t: "Visit cafés now", b: "Wait at Blue Tokai is under 5 min." },
              { tone: "medium" as const, icon: Building2, t: "Banks calm at 3 PM", b: "Apollo branch should clear by then." },
              { tone: "busy" as const, icon: Bus, t: "Skip 500D 5–6 PM", b: "Expected 88% occupancy on platform." },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-3 rounded-2xl bg-beige px-3 py-2.5">
                <div className={`grid h-9 w-9 place-items-center rounded-xl ${r.tone === "free" ? "bg-q-free" : r.tone === "medium" ? "bg-q-medium" : "bg-q-busy"}`}>
                  <r.icon className={`h-4 w-4 ${r.tone === "free" ? "text-q-free-foreground" : r.tone === "medium" ? "text-q-medium-foreground" : "text-q-busy-foreground"}`} />
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="text-[12.5px] font-semibold text-ink">{r.t}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.b}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
