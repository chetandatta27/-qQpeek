import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  House, MapTrifold, Bell, BookmarkSimple, User,
  MagnifyingGlass, X, CaretLeft, CaretRight, MapPin, ArrowsClockwise,
  TrendUp, TrendDown, Minus, Heart, Phone, NavigationArrow, Check, Trash,
  Plus, Star, Clock, Sparkle, ShareNetwork, Pulse, Lightning,
  ClockCountdown, Path, Trophy, ShieldCheck, Users, Brain, Target,
  Confetti, ChartLineUp, MapPinLine, Hourglass,
} from "@phosphor-icons/react";

const Activity = Pulse;

export const Route = createFileRoute("/")({ component: App });

/* ============================== DATA ============================== */
type Trend = "up" | "down" | "stable";
type Category = "Hospital" | "Bank" | "Café" | "Restaurant" | "Gym" | "Pharmacy" | "Shopping" | "Govt";
type Place = {
  id: string; name: string; category: Category; emoji: string;
  distance: string; distanceNum: number; wait: number; crowd: number;
  trend: Trend; open: boolean; closes: string; rating: number;
  address: string; phone: string; reports: number;
  bestTime: string; bestWait: number; verifiedBy: number; confidence: number; hereNow: number;
};

const CATS: { key: Category | "All"; label: string; emoji: string }[] = [
  { key: "All", label: "All", emoji: "✦" },
  { key: "Hospital", label: "Hospital", emoji: "🏥" },
  { key: "Bank", label: "Bank", emoji: "🏦" },
  { key: "Café", label: "Café", emoji: "☕" },
  { key: "Restaurant", label: "Restaurant", emoji: "🍽️" },
  { key: "Gym", label: "Gym", emoji: "💪" },
  { key: "Pharmacy", label: "Pharmacy", emoji: "💊" },
  { key: "Shopping", label: "Shopping", emoji: "🛍️" },
  { key: "Govt", label: "Govt", emoji: "🏛️" },
];

const SEED: Place[] = [
  { id: "p1", name: "Apollo Hospital", category: "Hospital", emoji: "🏥", distance: "1.2 km", distanceNum: 1.2, wait: 28, crowd: 78, trend: "up", open: true, closes: "24h", rating: 4.6, address: "Jubilee Hills, Hyderabad", phone: "+914023607777", reports: 18, bestTime: "10:30 AM", bestWait: 9, verifiedBy: 42, confidence: 94, hereNow: 31 },
  { id: "p2", name: "HDFC Bank — Banjara", category: "Bank", emoji: "🏦", distance: "0.6 km", distanceNum: 0.6, wait: 12, crowd: 42, trend: "down", open: true, closes: "4:00 PM", rating: 4.2, address: "Road No. 12, Banjara Hills", phone: "+914023456789", reports: 9, bestTime: "2:15 PM", bestWait: 4, verifiedBy: 23, confidence: 89, hereNow: 8 },
  { id: "p3", name: "Roastery Coffee House", category: "Café", emoji: "☕", distance: "0.4 km", distanceNum: 0.4, wait: 5, crowd: 28, trend: "stable", open: true, closes: "11:00 PM", rating: 4.8, address: "Road No. 36, Jubilee Hills", phone: "+919876543210", reports: 14, bestTime: "Now", bestWait: 5, verifiedBy: 31, confidence: 96, hereNow: 11 },
  { id: "p4", name: "FitZone Gym", category: "Gym", emoji: "💪", distance: "0.9 km", distanceNum: 0.9, wait: 3, crowd: 22, trend: "down", open: true, closes: "10:00 PM", rating: 4.5, address: "Madhapur Main Rd", phone: "+919812345678", reports: 6, bestTime: "Now", bestWait: 3, verifiedBy: 17, confidence: 91, hereNow: 6 },
  { id: "p5", name: "MedPlus Pharmacy", category: "Pharmacy", emoji: "💊", distance: "0.3 km", distanceNum: 0.3, wait: 4, crowd: 31, trend: "stable", open: true, closes: "11:00 PM", rating: 4.4, address: "Filmnagar", phone: "+914049000000", reports: 11, bestTime: "Now", bestWait: 4, verifiedBy: 19, confidence: 93, hereNow: 5 },
  { id: "p6", name: "Paradise Biryani", category: "Restaurant", emoji: "🍽️", distance: "2.1 km", distanceNum: 2.1, wait: 35, crowd: 88, trend: "up", open: true, closes: "11:30 PM", rating: 4.3, address: "Secunderabad", phone: "+914027840000", reports: 24, bestTime: "3:30 PM", bestWait: 10, verifiedBy: 56, confidence: 95, hereNow: 44 },
  { id: "p7", name: "Inorbit Mall", category: "Shopping", emoji: "🛍️", distance: "3.4 km", distanceNum: 3.4, wait: 0, crowd: 55, trend: "stable", open: true, closes: "10:00 PM", rating: 4.4, address: "Cyberabad", phone: "+914040000000", reports: 7, bestTime: "Now", bestWait: 0, verifiedBy: 14, confidence: 87, hereNow: 22 },
  { id: "p8", name: "RTA Office", category: "Govt", emoji: "🏛️", distance: "4.0 km", distanceNum: 4.0, wait: 52, crowd: 92, trend: "up", open: true, closes: "5:00 PM", rating: 3.4, address: "Khairatabad", phone: "+914023220000", reports: 31, bestTime: "Tomorrow 9:15 AM", bestWait: 14, verifiedBy: 71, confidence: 96, hereNow: 38 },
];

const HOURLY = [22, 30, 45, 60, 72, 55, 40, 38, 50, 70, 82, 65, 48];
const HOURS = ["9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p"];
const CURRENT_HOUR_IDX = 5;

/* ========================== UTILITIES ========================== */
function waitColor(w: number) {
  if (w < 15) return { bg: "var(--q-free-bg)", text: "var(--q-free-text)", solid: "var(--q-free)" };
  if (w < 30) return { bg: "var(--q-medium-bg)", text: "var(--q-medium-text)", solid: "var(--q-medium)" };
  return { bg: "var(--q-busy-bg)", text: "var(--q-busy-text)", solid: "var(--q-busy)" };
}
function crowdLabel(c: number) {
  if (c < 40) return "Quiet";
  if (c < 70) return "Moderate";
  return "Busy";
}
function TrendIcon({ t, className = "" }: { t: Trend; className?: string }) {
  if (t === "up") return <TrendUp weight="bold" className={className} />;
  if (t === "down") return <TrendDown weight="bold" className={className} />;
  return <Minus weight="bold" className={className} />;
}

/* ============================== APP ============================== */
type Stage = "splash" | "onboarding" | "loading" | "app";
type Tab = "today" | "map" | "alerts" | "saved" | "profile";

function App() {
  const [stage, setStage] = useState<Stage>("splash");
  
  const [tab, setTab] = useState<Tab>("today");
  const [places, setPlaces] = useState<Place[]>(SEED);
  const [saved, setSaved] = useState<Set<string>>(new Set(["p3", "p4"]));
  const [alerts, setAlerts] = useState<{ id: string; placeId: string; threshold: number; on: boolean }[]>([
    { id: "a1", placeId: "p1", threshold: 15, on: true },
  ]);
  const [detail, setDetail] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [alertModalFor, setAlertModalFor] = useState<string | null>(null);
  const [plannerOpen, setPlannerOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("onboarding"), 1700);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setPlaces(p => p.map(x => ({ ...x, wait: Math.max(0, x.wait + Math.round((Math.random() - 0.5) * 4)) })));
    }, 60000);
    return () => clearInterval(i);
  }, []);

  function showToast(m: string) { setToast(m); setTimeout(() => setToast(null), 2600); }
  function toggleSave(id: string) {
    setSaved(s => { const n = new Set(s); if (n.has(id)) { n.delete(id); showToast("Removed from Saved"); } else { n.add(id); showToast("Saved to favourites"); } return n; });
  }
  function addAlert(placeId: string, threshold: number) {
    setAlerts(a => [...a, { id: `a${Date.now()}`, placeId, threshold, on: true }]);
    const p = places.find(x => x.id === placeId);
    showToast(`Alert set for ${p?.name}`);
  }

  const detailPlace = detail ? places.find(p => p.id === detail) : null;

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center" style={{ background: "#0B0B0B" }}>
      <div className="relative w-full max-w-[430px] min-h-screen overflow-hidden" style={{ background: "var(--color-background)" }}>
        {stage === "splash" && <Splash />}
        {stage === "onboarding" && (
          <Onboarding onDone={() => setStage("loading")} />
        )}
        {stage === "loading" && (
          <LoadingScreen onDone={() => setStage("app")} />
        )}
        {stage === "app" && (
          <>
            <div className="pb-[88px]">
              {tab === "today" && <TodayScreen places={places} saved={saved} toggleSave={toggleSave} openDetail={setDetail} showToast={showToast} openPlanner={() => setPlannerOpen(true)} />}
              {tab === "map" && <MapScreen places={places} openDetail={setDetail} />}
              {tab === "alerts" && <AlertsScreen alerts={alerts} places={places} setAlerts={setAlerts} openDetail={setDetail} switchTab={setTab} showToast={showToast} />}
              {tab === "saved" && <SavedScreen places={places} saved={saved} toggleSave={toggleSave} openDetail={setDetail} switchTab={setTab} />}
              {tab === "profile" && <ProfileScreen savedCount={saved.size} alertCount={alerts.length} />}
            </div>
            {tab === "today" && (
              <button onClick={() => setPlannerOpen(true)} className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-40 px-5 h-12 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 wl-shadow-lg wl-fade-up" style={{ background: "var(--color-accent)", color: "white" }}>
                <Path size={16} weight="bold" /> Plan my day
              </button>
            )}
            <BottomNav tab={tab} setTab={setTab} alertCount={alerts.filter(a => a.on).length} savedCount={saved.size} />
          </>
        )}

        {detailPlace && (
          <Detail place={detailPlace} places={places} saved={saved.has(detailPlace.id)} onClose={() => setDetail(null)} onToggleSave={() => toggleSave(detailPlace.id)} onAlert={() => setAlertModalFor(detailPlace.id)} openDetail={setDetail} showToast={showToast} />
        )}
        {alertModalFor && (
          <AlertModal place={places.find(p => p.id === alertModalFor)!} onClose={() => setAlertModalFor(null)} onSet={(th) => { addAlert(alertModalFor, th); setAlertModalFor(null); }} />
        )}
        {plannerOpen && (
          <Planner places={places} onClose={() => setPlannerOpen(false)} showToast={showToast} />
        )}
        {toast && (
          <div className="wl-toast fixed bottom-[104px] left-1/2 z-[120] px-4 py-2.5 rounded-full text-[13px] font-medium" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ SPLASH ============================ */
function Splash() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "var(--color-background)" }}>
      <div className="wl-logo-in flex flex-col items-center">
        <div className="w-20 h-20 rounded-[26px] flex items-center justify-center mb-6" style={{ background: "var(--color-primary)" }}>
          <Hourglass size={36} weight="duotone" color="#F7F5EF" />
        </div>
        <div className="text-[34px] font-extrabold tracking-tight">WaitLess</div>
        <div className="serif-italic text-[18px] mt-2" style={{ color: "var(--color-muted-foreground)" }}>
          Know before you go.
        </div>
      </div>
      <div className="absolute bottom-12 flex gap-1.5">
        {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full wl-dot-pulse" style={{ background: "var(--color-primary)", animationDelay: `${i*0.18}s` }} />)}
      </div>
    </div>
  );
}

/* ========================== ONBOARDING ========================== */
type GoalKey = "save" | "crowds" | "errands" | "quiet" | "productivity" | "alerts";
type AuthMethod = "google" | "apple" | "phone";

const TOTAL_STEPS = 11;

function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [, setAuth] = useState<AuthMethod | null>(null);
  const [goals, setGoals] = useState<Set<GoalKey>>(new Set(["save"]));
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [phone, setPhone] = useState("");
  const [otpMode, setOtpMode] = useState(false);

  const next = () => setStep(s => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => {
    if (otpMode) { setOtpMode(false); return; }
    setStep(s => Math.max(0, s - 1));
  };
  const toggle = <T,>(set: Set<T>, setter: (s: Set<T>) => void, v: T, max?: number) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v); else { if (max && n.size >= max) return; n.add(v); }
    setter(n);
  };

  const pct = Math.round(((step + 1) / TOTAL_STEPS) * 100);
  const showTopBar = !(step === 0 && !otpMode);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "var(--color-background)" }}>
      {/* Top bar */}
      {showTopBar && (
        <div className="px-5 pt-12 pb-2 flex items-center gap-3 shrink-0">
          <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--color-card)" }}>
            <CaretLeft size={16} weight="bold" />
          </button>
          <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--color-primary)" }} />
          </div>
          <div className="text-[11px] font-semibold tabular-nums w-10 text-right" style={{ color: "var(--color-muted-foreground)" }}>{pct}%</div>
          {step > 0 && step < TOTAL_STEPS - 1 && !otpMode ? (
            <button onClick={onDone} className="text-[12px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>Skip</button>
          ) : <div className="w-7" />}
        </div>
      )}

      {/* Content (flex; no scroll) */}
      <div className="flex-1 min-h-0 flex flex-col px-5 pb-5 wl-fade-up overflow-hidden" key={`${step}-${otpMode ? "otp" : "main"}`}>
        {step === 0 && <Welcome onAuth={(m) => { setAuth(m); if (m === "phone") setOtpMode(true); else next(); }} otpMode={otpMode} phone={phone} setPhone={setPhone} onPhoneDone={() => { setOtpMode(false); next(); }} />}
        {step === 1 && <HowItWorks onContinue={next} />}
        {step === 2 && <GoalsStep goals={goals} toggle={(g) => toggle(goals, setGoals, g)} onContinue={next} />}
        {step === 3 && <LocationStep onAllow={next} onSkip={next} />}
        {step === 4 && <NotifStep onEnable={next} onSkip={next} />}
        {step === 5 && <CategoriesStep cats={cats} toggle={(c) => toggle(cats, setCats, c, 5)} onContinue={next} />}
        {step === 6 && <FavoritesStep favs={favs} toggle={(f) => toggle(favs, setFavs, f)} onContinue={next} />}
        {step === 7 && <AIPreviewStep onContinue={next} favCount={favs.size} />}
        {step === 8 && <CommunityStep onContinue={next} />}
        {step === 9 && <DailyGoalStep onContinue={next} />}
        {step === 10 && <SuccessStep onDone={onDone} />}
      </div>
    </div>
  );
}

/* ----- Screen 1: Welcome ----- */
function Welcome({ onAuth, otpMode, phone, setPhone, onPhoneDone }: {
  onAuth: (m: AuthMethod) => void; otpMode: boolean; phone: string; setPhone: (s: string) => void; onPhoneDone: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [phoneEntered, setPhoneEntered] = useState(false);

  if (otpMode) {
    return (
      <div className="flex flex-col h-full pt-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "var(--color-card)" }}>
          <Phone size={26} weight="duotone" />
        </div>
        <h1 className="text-[26px] leading-[1.1] font-bold mb-2">{phoneEntered ? "Verify your number" : "Enter your number"}</h1>
        <p className="text-[13px] mb-5" style={{ color: "var(--color-muted-foreground)" }}>
          {phoneEntered ? `We sent a 6-digit code to ${phone}.` : "We'll text you a 6-digit code to confirm it's you."}
        </p>
        {!phoneEntered ? (
          <>
            <div className="flex items-center gap-2 h-14 rounded-2xl px-4" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
              <span className="text-[15px] font-semibold" style={{ color: "var(--color-muted-foreground)" }}>+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="98765 43210" className="flex-1 bg-transparent text-[16px] font-semibold outline-none" />
            </div>
            <button onClick={() => phone.length >= 6 && setPhoneEntered(true)} disabled={phone.length < 6} className="mt-3 w-full h-14 rounded-2xl text-[15px] font-semibold disabled:opacity-40" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Send code</button>
          </>
        ) : (
          <>
            <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="• • • • • •" className="w-full h-14 rounded-2xl px-5 text-center text-[22px] tracking-[0.4em] font-semibold outline-none" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
            <button onClick={onPhoneDone} disabled={otp.length < 4} className="mt-3 w-full h-14 rounded-2xl text-[15px] font-semibold disabled:opacity-40" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Continue your journey</button>
            <button className="mt-2 text-[12px] mx-auto" style={{ color: "var(--color-muted-foreground)" }}>Resend code</button>
          </>
        )}
        <div className="mt-auto pb-2 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>
          <ShieldCheck size={12} weight="fill" /> Secure authentication
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pt-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-[112px] h-[112px] mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.22), transparent 70%)" }} />
          <div className="relative w-[84px] h-[84px] rounded-[26px] flex items-center justify-center wl-shadow-lg wl-logo-in" style={{ background: "var(--color-primary)" }}>
            <Hourglass size={40} weight="duotone" color="#F7F5EF" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-accent)" }}>
            <Sparkle size={14} weight="fill" color="white" />
          </div>
        </div>
        <h1 className="text-[26px] leading-[1.05] font-bold tracking-tight">Save time, every day</h1>
        <p className="serif-italic text-[14px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>
          Know the best time to go — before you leave.
        </p>
      </div>

      {/* Trust + value proof */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <Users size={11} weight="fill" /> 12,000+ users
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <Lightning size={11} weight="fill" /> 3.8h saved / mo
        </div>
      </div>

      {/* Mini AI preview */}
      <div className="mt-3 wl-card p-3">
        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1" style={{ color: "var(--color-accent)" }}>
          <Sparkle size={10} weight="fill" /> Today you could save
        </div>
        {[
          { p: "HDFC Bank", m: 13 },
          { p: "Apollo Hospital", m: 22 },
          { p: "FitZone Gym", m: 8 },
        ].map(({ p, m }) => (
          <div key={p} className="flex items-center justify-between py-1">
            <span className="text-[12px] font-medium">{p}</span>
            <span className="text-[12px] font-bold" style={{ color: "var(--q-free)" }}>−{m} min</span>
          </div>
        ))}
      </div>

      {/* Auth buttons */}
      <div className="mt-3 space-y-2">
        <button onClick={() => onAuth("google")} className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
          <GoogleG /> Continue with Google
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onAuth("apple")} className="h-12 rounded-2xl flex items-center justify-center gap-1.5 text-[13px] font-semibold" style={{ background: "var(--color-card)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}>
            <AppleLogo /> Apple
          </button>
          <button onClick={() => onAuth("phone")} className="h-12 rounded-2xl flex items-center justify-center gap-1.5 text-[13px] font-semibold" style={{ background: "var(--color-card)", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}>
            <Phone size={15} weight="bold" /> Phone
          </button>
        </div>
      </div>

      <div className="mt-auto pt-3 flex items-center justify-center gap-1.5 text-[10px]" style={{ color: "var(--color-muted-foreground)" }}>
        <ShieldCheck size={11} weight="fill" /> Privacy first · Secure authentication
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.9 36 44 30.5 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
function AppleLogo() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 2 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.5.7-.9 1.3-1.9 1.7-3-3-1.1-3.2-4.7-3.2-4.9zM13.8 4.3c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.6.8-1.2 2-1 3.2 1.1.1 2.2-.6 2.9-1.4z"/>
    </svg>
  );
}

function StepHeader({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="pt-1 pb-4">
      <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--color-accent)" }}>{tag}</div>
      <h1 className="text-[24px] leading-[1.1] font-bold tracking-tight">{title}</h1>
      <p className="text-[13px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>{body}</p>
    </div>
  );
}

function PrimaryCTA({ label, onClick, icon }: { label: string; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} className="w-full h-14 rounded-2xl text-[15px] font-semibold inline-flex items-center justify-center gap-2" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
      {label} {icon}
    </button>
  );
}

/* ----- Screen 2: How it works ----- */
function HowItWorks({ onContinue }: { onContinue: () => void }) {
  const cards = [
    { tag: "Current wait", v: "52", u: "min", c: "var(--q-busy)", bg: "var(--q-busy-bg)" },
    { tag: "Best time", v: "7:15", u: "PM", c: "var(--color-accent)", bg: "rgba(245,158,11,0.12)" },
    { tag: "Expected wait", v: "4", u: "min", c: "var(--q-free)", bg: "var(--q-free-bg)" },
  ];
  const steps = [
    { i: Brain, t: "We predict wait times", d: "AI analyzes patterns in real time" },
    { i: Target, t: "We find the best time", d: "Personalized to your day" },
    { i: Lightning, t: "You save time", d: "Hours back every month" },
  ];
  return (
    <div className="flex flex-col h-full">
      <StepHeader tag="How it works" title="From busy to brilliant" body="Three steps turn waiting into time reclaimed." />
      <div className="grid grid-cols-3 gap-2">
        {cards.map(c => (
          <div key={c.tag} className="rounded-2xl p-2.5 text-center wl-card">
            <div className="text-[9px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--color-muted-foreground)" }}>{c.tag}</div>
            <div className="mt-1.5 rounded-xl py-2" style={{ background: c.bg }}>
              <div className="text-[20px] font-extrabold leading-none" style={{ color: c.c }}>{c.v}</div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: c.c }}>{c.u}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {steps.map(({ i: Ic, t, d }, idx) => (
          <div key={t} className="flex items-center gap-3 p-3 rounded-2xl wl-card">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>{idx + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold leading-tight">{t}</div>
              <div className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{d}</div>
            </div>
            <Ic size={18} weight="duotone" style={{ color: "var(--color-accent)" }} />
          </div>
        ))}
      </div>
      <div className="mt-3 text-center text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>
        Average user saves <span className="font-bold" style={{ color: "var(--color-foreground)" }}>2–5 hours</span> every month.
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label="Continue" onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 3: Goals ----- */
function GoalsStep({ goals, toggle, onContinue }: { goals: Set<GoalKey>; toggle: (g: GoalKey) => void; onContinue: () => void }) {
  const opts: { k: GoalKey; t: string; i: React.ComponentType<any>; msg: string }[] = [
    { k: "save", t: "Save Time", i: Lightning, msg: "We'll prioritize recommendations that maximize time saved." },
    { k: "crowds", t: "Avoid Crowds", i: Users, msg: "We'll surface the quietest moments to visit." },
    { k: "errands", t: "Plan Errands", i: Path, msg: "We'll order your stops the smart way." },
    { k: "quiet", t: "Discover Quiet Places", i: Sparkle, msg: "We'll spotlight calmer spots nearby." },
    { k: "productivity", t: "Daily Productivity", i: Target, msg: "We'll help you fit more into less time." },
    { k: "alerts", t: "Smart Alerts", i: Bell, msg: "We'll ping you the moment it's the right time." },
  ];
  const primary = opts.find(o => goals.has(o.k));
  return (
    <div className="flex flex-col h-full">
      <StepHeader tag="Personalize" title="What matters to you?" body="Pick any — your AI tunes to your goals." />
      <div className="grid grid-cols-2 gap-2">
        {opts.map(({ k, t, i: Ic }) => {
          const on = goals.has(k);
          return (
            <button key={k} onClick={() => toggle(k)} className="relative flex flex-col items-start gap-1.5 p-3 rounded-2xl text-left transition-all" style={{ background: "var(--color-card)", border: `1.5px solid ${on ? "var(--color-primary)" : "var(--color-border)"}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: on ? "var(--color-primary)" : "var(--color-muted)", color: on ? "var(--color-primary-foreground)" : "var(--color-foreground)" }}>
                <Ic size={15} weight="duotone" />
              </div>
              <div className="text-[13px] font-semibold leading-tight">{t}</div>
              {on && <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary)" }}><Check size={9} weight="bold" color="var(--color-primary-foreground)" /></div>}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: "var(--color-muted)" }}>
        <Brain size={15} weight="duotone" className="mt-0.5 shrink-0" />
        <span className="text-[11px] leading-snug" style={{ color: "var(--color-muted-foreground)" }}>
          {primary ? primary.msg : "Pick at least one to personalize your assistant."}
        </span>
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label="Continue" onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 4: Location ----- */
function LocationStep({ onAllow, onSkip }: { onAllow: () => void; onSkip: () => void }) {
  const privacy = [
    "Location never shared publicly",
    "Used only for recommendations",
    "Used for nearby places",
    "Used for smart route planning",
    "Delete your data anytime",
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.22), transparent 70%)" }} />
          <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-card)" }}>
            <NavigationArrow size={28} weight="duotone" color="var(--color-accent)" />
          </div>
        </div>
        <h1 className="text-[22px] leading-[1.1] font-bold tracking-tight">Enable smart recommendations</h1>
        <p className="text-[12px] mt-1.5 max-w-[300px]" style={{ color: "var(--color-muted-foreground)" }}>
          Used to find nearby places and predict the best time to visit.
        </p>
      </div>
      <div className="wl-card p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={14} weight="fill" style={{ color: "var(--q-free)" }} />
          <div className="text-[12px] font-bold">Privacy First</div>
          <div className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--q-free-bg)", color: "var(--q-free-text)" }}>Encrypted</div>
        </div>
        {privacy.map(t => (
          <div key={t} className="flex items-center gap-2 py-1">
            <Check size={12} weight="bold" style={{ color: "var(--q-free)" }} />
            <span className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>{t}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label="Allow location" onClick={onAllow} />
        <button onClick={onSkip} className="w-full h-11 mt-1 rounded-2xl text-[13px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>Not now</button>
      </div>
    </div>
  );
}

/* ----- Screen 5: Notifications ----- */
function NotifStep({ onEnable, onSkip }: { onEnable: () => void; onSkip: () => void }) {
  const examples = [
    { p: "Apollo Hospital", t: "Wait dropped to 8 min", c: "var(--q-free)", bg: "var(--q-free-bg)" },
    { p: "FitZone Gym", t: "Quiet right now", c: "var(--q-free)", bg: "var(--q-free-bg)" },
    { p: "HDFC Bank", t: "Best time starts in 15 min", c: "var(--color-accent)", bg: "rgba(245,158,11,0.12)" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(245,158,11,0.22), transparent 70%)" }} />
          <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-card)" }}>
            <Bell size={28} weight="duotone" color="var(--color-accent)" />
          </div>
        </div>
        <h1 className="text-[22px] leading-[1.1] font-bold tracking-tight">Stay ahead of the crowd</h1>
        <p className="text-[12px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>
          Never miss the best moment to go.
        </p>
      </div>
      <div className="space-y-2">
        {examples.map((e, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl wl-card">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: e.bg }}>
              <Bell size={14} weight="fill" style={{ color: e.c }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{e.p}</div>
              <div className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{e.t}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label="Enable notifications" onClick={onEnable} />
        <button onClick={onSkip} className="w-full h-11 mt-1 rounded-2xl text-[13px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>Maybe later</button>
      </div>
    </div>
  );
}

/* ----- Screen 6: Categories ----- */
function CategoriesStep({ cats, toggle, onContinue }: { cats: Set<string>; toggle: (c: string) => void; onContinue: () => void }) {
  const recommended = new Set(["Hospital", "Bank", "Gym"]);
  const items = [
    { k: "Hospital", e: "🏥" }, { k: "Bank", e: "🏦" }, { k: "Gym", e: "💪" }, { k: "Café", e: "☕" },
    { k: "Pharmacy", e: "💊" }, { k: "Restaurant", e: "🍽️" }, { k: "Govt", e: "🏛️" }, { k: "Shopping", e: "🛍️" },
    { k: "University", e: "🎓" }, { k: "Petrol", e: "⛽" },
  ];
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="pt-1 pb-2 shrink-0">
        <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: "var(--color-accent)" }}>Your places</div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-[22px] leading-[1.1] font-bold tracking-tight">What matters most?</h1>
          <span className="text-[11px] font-semibold tabular-nums" style={{ color: "var(--color-muted-foreground)" }}>{cats.size}/5</span>
        </div>
        <p className="text-[11.5px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Choose up to 5 — recommended highlighted.</p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto -mx-5 px-5">
        <div className="grid grid-cols-3 gap-2">
          {items.map(({ k, e }) => {
            const on = cats.has(k);
            const rec = recommended.has(k);
            return (
              <button key={k} onClick={() => toggle(k)} className="relative h-[78px] rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all" style={{ background: "var(--color-card)", border: `1.5px solid ${on ? "var(--color-primary)" : rec ? "color-mix(in oklab, var(--color-accent) 50%, transparent)" : "var(--color-border)"}` }}>
                <div className="text-[20px] leading-none">{e}</div>
                <div className="text-[10.5px] font-semibold">{k}</div>
                {rec && !on && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded-full text-[8px] font-bold uppercase tracking-wider" style={{ background: "var(--color-accent)", color: "white" }}>Top</div>}
                {on && <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                  <Check size={8} weight="bold" color="var(--color-primary-foreground)" />
                </div>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="shrink-0 pt-2">
        <div className="mb-2 flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--color-muted)" }}>
          <Brain size={13} weight="duotone" className="mt-0.5 shrink-0" />
          <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{cats.size > 0 ? `Prioritizing ${cats.size} ${cats.size === 1 ? "category" : "categories"} in your feed.` : "We'll prioritize these in your recommendations."}</span>
        </div>
        <PrimaryCTA label="Continue" onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 9 (new): Community ----- */
function CommunityStep({ onContinue }: { onContinue: () => void }) {
  const stats = [
    { v: "94%", l: "Accuracy" },
    { v: "12k+", l: "Active users" },
    { v: "87k+", l: "Reports" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.22), transparent 70%)" }} />
          <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-card)" }}>
            <Users size={28} weight="duotone" color="var(--color-accent)" />
          </div>
        </div>
        <h1 className="text-[22px] leading-[1.1] font-bold tracking-tight">Help thousands save time</h1>
        <p className="text-[12px] mt-1.5 max-w-[300px]" style={{ color: "var(--color-muted-foreground)" }}>One tap helps improve recommendations for everyone.</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {stats.map(s => (
          <div key={s.l} className="wl-card p-3 text-center">
            <div className="text-[18px] font-extrabold leading-none" style={{ color: "var(--color-accent)" }}>{s.v}</div>
            <div className="text-[9px] uppercase tracking-wider mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="wl-card p-3.5">
        <div className="text-[11px] font-bold mb-1.5">When you confirm wait times</div>
        {["Predictions improve", "Community benefits", "Local accuracy increases"].map(t => (
          <div key={t} className="flex items-center gap-2 py-1">
            <Check size={12} weight="bold" style={{ color: "var(--q-free)" }} />
            <span className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>{t}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label="Join the community" onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 10 (new): Daily Goal ----- */
function DailyGoalStep({ onContinue }: { onContinue: () => void }) {
  const [goal, setGoal] = useState(30);
  const opts = [15, 30, 60];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(245,158,11,0.22), transparent 70%)" }} />
          <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-card)" }}>
            <Target size={28} weight="duotone" color="var(--color-accent)" />
          </div>
        </div>
        <h1 className="text-[22px] leading-[1.1] font-bold tracking-tight">Choose your daily goal</h1>
        <p className="text-[12px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>How many minutes do you want to reclaim each day?</p>
      </div>
      <div className="space-y-2">
        {opts.map(o => {
          const on = goal === o;
          const rec = o === 30;
          return (
            <button key={o} onClick={() => setGoal(o)} className="relative w-full flex items-center gap-3 p-3.5 rounded-2xl text-left" style={{ background: "var(--color-card)", border: `1.5px solid ${on ? "var(--color-primary)" : "var(--color-border)"}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: on ? "var(--color-primary)" : "var(--color-muted)", color: on ? "var(--color-primary-foreground)" : "var(--color-foreground)" }}>
                <Clock size={18} weight="duotone" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold leading-tight">{o} min saved / day</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>≈ {Math.round(o * 30 / 60 * 10) / 10}h every month</div>
              </div>
              {rec && <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: "var(--color-accent)", color: "white" }}>Top pick</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: "var(--color-muted)" }}>
        <Brain size={14} weight="duotone" className="mt-0.5 shrink-0" />
        <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>Most users reclaim <span className="font-bold" style={{ color: "var(--color-foreground)" }}>3–5 hours</span> every month.</span>
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label={`Set ${goal} min daily goal`} onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 7: Favorite places ----- */
function FavoritesStep({ favs, toggle, onContinue }: { favs: Set<string>; toggle: (f: string) => void; onContinue: () => void }) {
  const recommended = [
    { n: "Apollo Hospital", d: "1.2 km", w: 24, b: "7:15 PM" },
    { n: "HDFC Bank", d: "0.6 km", w: 12, b: "2:15 PM" },
    { n: "FitZone Gym", d: "0.9 km", w: 3, b: "Now" },
    { n: "MedPlus Pharmacy", d: "0.3 km", w: 4, b: "Now" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="pt-1 pb-3">
        <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--color-accent)" }}>Recommended near you</div>
        <h1 className="text-[24px] leading-[1.1] font-bold tracking-tight">Save places you visit</h1>
        <p className="text-[12px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Faster alerts, smarter planning.</p>
      </div>
      <div className="space-y-2">
        {recommended.map(p => {
          const on = favs.has(p.n);
          const wc = waitColor(p.w);
          return (
            <div key={p.n} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "var(--color-card)", border: `1.5px solid ${on ? "var(--color-primary)" : "var(--color-border)"}` }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--color-muted)" }}>
                <MapPin size={14} weight="duotone" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{p.n}</div>
                <div className="text-[10.5px] flex items-center gap-2" style={{ color: "var(--color-muted-foreground)" }}>
                  <span>{p.d}</span>
                  <span>·</span>
                  <span style={{ color: wc.text }} className="font-semibold">{p.w}m now</span>
                  <span>·</span>
                  <span className="font-semibold" style={{ color: "var(--color-accent)" }}>Best {p.b}</span>
                </div>
              </div>
              <button onClick={() => toggle(p.n)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: on ? "var(--color-primary)" : "transparent", border: on ? "none" : "1.5px solid var(--color-border)", color: on ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)" }}>
                {on ? <Heart size={14} weight="fill" /> : <Plus size={14} weight="bold" />}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label={favs.size > 0 ? `Continue with ${favs.size} saved` : "Continue"} onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 8: AI Preview ----- */
function AIPreviewStep({ onContinue, favCount }: { onContinue: () => void; favCount: number }) {
  const checks = [
    `${Math.max(favCount, 8)} nearby places tracked`,
    "Smart alerts enabled",
    "AI planner activated",
    "Recommendations personalized",
  ];
  const ops = [
    { p: "Apollo Hospital", s: 18 },
    { p: "HDFC Bank", s: 9 },
    { p: "FitZone Gym", s: 14 },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full wl-pulse-ring" style={{ color: "var(--color-accent)" }} />
          <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-primary)" }}>
            <Brain size={28} weight="duotone" color="#F7F5EF" />
          </div>
        </div>
        <h1 className="text-[22px] leading-[1.1] font-bold tracking-tight">Your AI assistant is ready</h1>
        <p className="serif-italic text-[13px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Based on your setup</p>
      </div>
      <div className="wl-card p-3 grid grid-cols-2 gap-1.5">
        {checks.map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <Check size={12} weight="bold" style={{ color: "var(--q-free)" }} />
            <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{t}</span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1" style={{ color: "var(--color-accent)" }}>
          <Sparkle size={10} weight="fill" /> Today's opportunities
        </div>
        <div className="space-y-1.5">
          {ops.map(o => (
            <div key={o.p} className="flex items-center justify-between px-3 py-2.5 rounded-xl wl-card">
              <span className="text-[13px] font-semibold">{o.p}</span>
              <span className="text-[12px] font-bold" style={{ color: "var(--q-free)" }}>Save {o.s} min</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-2xl p-3 text-center" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-70">Estimated monthly savings</div>
        <div className="text-[24px] font-extrabold mt-0.5 leading-none">3–5 hours</div>
      </div>
      <div className="mt-auto pt-3">
        <PrimaryCTA label="Continue" onClick={onContinue} icon={<CaretRight size={15} weight="bold" />} />
      </div>
    </div>
  );
}

/* ----- Screen 9: Success ----- */
function SuccessStep({ onDone }: { onDone: () => void }) {
  const ready = [
    { i: Brain, t: "AI Planner Ready" },
    { i: Bell, t: "Smart Alerts Active" },
    { i: MapPinLine, t: "Nearby Recommendations" },
    { i: Users, t: "Community Insights" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center pt-2 pb-3">
        <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full wl-pulse-ring" style={{ color: "var(--q-free)" }} />
          <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--q-free)" }}>
            <Check size={32} weight="bold" color="#F7F5EF" />
          </div>
        </div>
        <h1 className="text-[26px] leading-[1.05] font-bold tracking-tight">You're ready</h1>
        <p className="serif-italic text-[14px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>
          Your time starts coming back today.
        </p>
      </div>

      <div className="rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, var(--color-primary), color-mix(in oklab, var(--color-primary) 70%, var(--color-accent)))", color: "var(--color-primary-foreground)" }}>
        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-75 flex items-center justify-center gap-1">
          <Lightning size={11} weight="fill" /> Potential monthly savings
        </div>
        <div className="text-[44px] font-extrabold mt-1 leading-none tracking-tight">4h 12m</div>
        <div className="text-[11px] mt-1 opacity-75">Time reclaimed for you</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {[
          { e: "💪", t: "5 gym sessions" },
          { e: "🎬", t: "2 movie nights" },
          { e: "🌿", t: "1 weekend outing" },
          { e: "❤️", t: "Family time" },
        ].map(x => (
          <div key={x.t} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: "var(--color-muted)" }}>
            <span className="text-[14px]">{x.e}</span>
            <span className="text-[11px] font-medium leading-tight">{x.t}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 wl-card p-3 grid grid-cols-2 gap-2">
        {ready.map(({ i: Ic, t }) => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--q-free-bg)" }}>
              <Ic size={13} weight="duotone" style={{ color: "var(--q-free)" }} />
            </div>
            <span className="text-[11.5px] font-medium leading-tight">{t}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-3">
        <PrimaryCTA label="Start saving time" onClick={onDone} icon={<CaretRight size={15} weight="bold" />} />
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px]" style={{ color: "var(--color-muted-foreground)" }}>
          <ShieldCheck size={11} weight="fill" /> Privacy first · Community verified · Delete data anytime
        </div>
      </div>
    </div>
  );
}

/* ----- Post-onboarding loading transition ----- */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const lines = [
    "Scanning hospitals nearby",
    "Indexing banks & ATMs",
    "Mapping cafés and gyms",
    "Loading government offices",
    "Building your AI dashboard",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const ticks = lines.map((_, idx) => setTimeout(() => setI(idx + 1), 280 * (idx + 1)));
    const done = setTimeout(onDone, 2000);
    return () => { ticks.forEach(clearTimeout); clearTimeout(done); };
  }, []);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8" style={{ background: "var(--color-background)" }}>
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full wl-pulse-ring" style={{ color: "var(--color-accent)" }} />
        <div className="absolute inset-2 rounded-full wl-pulse-ring" style={{ color: "var(--color-primary)", animationDelay: "300ms" }} />
        <div className="relative w-16 h-16 rounded-[22px] flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-primary)" }}>
          <Brain size={28} weight="duotone" color="#F7F5EF" />
        </div>
      </div>
      <div className="text-[20px] font-bold tracking-tight text-center">Analyzing your area…</div>
      <p className="serif-italic text-[13px] mt-1.5 text-center" style={{ color: "var(--color-muted-foreground)" }}>Generating personalized recommendations.</p>
      <div className="mt-6 w-full max-w-[280px] space-y-1.5">
        {lines.map((l, idx) => {
          const done = idx < i;
          const active = idx === i;
          return (
            <div key={l} className="flex items-center gap-2 text-[12px] transition-opacity" style={{ opacity: done || active ? 1 : 0.35 }}>
              {done ? (
                <Check size={13} weight="bold" style={{ color: "var(--q-free)" }} />
              ) : (
                <div className="w-[13px] h-[13px] rounded-full border-2" style={{ borderColor: active ? "var(--color-accent)" : "var(--color-border)", borderTopColor: active ? "transparent" : undefined, animation: active ? "wl-spin 0.8s linear infinite" : undefined }} />
              )}
              <span style={{ color: done ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}>{l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}





/* =========================== TODAY (was HOME) =========================== */
function TodayScreen({ places, saved, toggleSave, openDetail, showToast, openPlanner }: {
  places: Place[]; saved: Set<string>; toggleSave: (id: string) => void;
  openDetail: (id: string) => void; showToast: (m: string) => void; openPlanner: () => void;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [refreshing, setRefreshing] = useState(false);
  const [updated, setUpdated] = useState("just now");

  useEffect(() => {
    const i = setInterval(() => setUpdated(t => t === "just now" ? "1 min ago" : "2 min ago"), 60000);
    return () => clearInterval(i);
  }, []);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setUpdated("just now"); showToast("Updated"); }, 1100);
  }

  const filtered = useMemo(() => places.filter(p =>
    (cat === "All" || p.category === cat) &&
    (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  ), [places, cat, q]);

  // AI: "Best Decision Right Now" — closest of low-wait places
  const bestNow = useMemo(() => {
    const candidates = [...places].filter(p => p.wait < 20);
    candidates.sort((a, b) => (a.wait * 1.2 + a.distanceNum * 3) - (b.wait * 1.2 + b.distanceNum * 3));
    return candidates[0] || places[0];
  }, [places]);
  const avgWait = Math.round(places.reduce((s, p) => s + p.wait, 0) / places.length);
  const timeSaved = Math.max(8, avgWait - bestNow.wait);

  // Top 3 opportunities
  const opportunities = useMemo(() => {
    return [...places]
      .map(p => ({ ...p, savings: Math.max(0, avgWait - p.wait) }))
      .filter(p => p.savings > 5)
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 3);
  }, [places, avgWait]);

  const efficiency = 78;
  const minutesSavedToday = 47;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* Sticky top header — Apple-style frosted */}
      <div className="sticky top-0 z-30 px-5 pt-12 pb-3" style={{ background: "color-mix(in oklab, var(--color-background) 78%, transparent)", backdropFilter: "saturate(180%) blur(20px)", borderBottom: "1px solid color-mix(in oklab, var(--color-border) 60%, transparent)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[13px]" style={{ color: "var(--color-muted-foreground)" }}>{greet}, Ravi</div>
            <div className="text-[26px] font-bold leading-tight">Here's your day</div>
            <button onClick={refresh} className="mt-1 inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>
              <ArrowsClockwise size={12} weight="bold" className={refreshing ? "wl-spin" : ""} /> Updated {refreshing ? "…" : updated}
            </button>
          </div>
          <button onClick={() => showToast("Hyderabad")} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium wl-card">
            <MapPin size={14} weight="fill" /> Hyderabad
          </button>
        </div>
      </div>

      <div className="px-5 pt-4">


      {/* Minutes Saved hero with Daily Goal */}
      {(() => {
        const goal = 60;
        const pct = Math.min(100, Math.round((minutesSavedToday / goal) * 100));
        const remaining = Math.max(0, goal - minutesSavedToday);
        const r = 26, circ = 2 * Math.PI * r;
        const off = circ - (pct / 100) * circ;
        return (
          <div className="wl-card p-5 mb-4 wl-fade-up" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase opacity-70 mb-2">
                  <Lightning size={12} weight="fill" /> Minutes saved today
                </div>
                <div className="text-[48px] leading-none font-extrabold">{minutesSavedToday}<span className="text-[16px] font-semibold ml-1.5 opacity-70">min</span></div>
                <div className="text-[11px] opacity-70 mt-2">Reclaimed today · ≈ {Math.round(minutesSavedToday/60*10)/10}h this week</div>
              </div>
              <div className="relative w-[72px] h-[72px] shrink-0">
                <svg viewBox="0 0 72 72" className="-rotate-90 w-full h-full">
                  <circle cx="36" cy="36" r={r} stroke="rgba(255,255,255,0.18)" strokeWidth="6" fill="none" />
                  <circle cx="36" cy="36" r={r} stroke="var(--color-accent)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 800ms" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[14px] font-extrabold leading-none">{pct}%</div>
                  <div className="text-[8px] opacity-70 uppercase tracking-wider mt-0.5">Goal</div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-[12px]">
              <span className="opacity-80">{minutesSavedToday} / {goal} min goal</span>
              <span className="font-semibold">{remaining === 0 ? "Goal achieved 🎉" : `${remaining} min to go`}</span>
            </div>
          </div>
        );
      })()}

      {/* Efficiency Score */}
      <div className="wl-card p-4 mb-4 flex items-center gap-4 wl-fade-up" style={{ animationDelay: "60ms" }}>
        <ScoreRing value={efficiency} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "var(--color-muted-foreground)" }}>Efficiency score</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[22px] font-extrabold leading-none">{efficiency}</span>
            <span className="text-[11px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>/ 100</span>
            <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: "var(--color-success)" }}>
              <TrendUp size={11} weight="bold" /> +5
            </span>
          </div>
          <div className="text-[11px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Top 18% of users this week</div>
        </div>
      </div>

      {/* Best Decision Right Now — hero card */}
      <div className="wl-card p-5 mb-5 wl-fade-up" style={{ animationDelay: "120ms", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "var(--color-muted-foreground)" }}>
          <Sparkle size={12} weight="fill" color="var(--color-accent)" /> Best decision right now
        </div>
        <button onClick={() => openDetail(bestNow.id)} className="w-full text-left flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] shrink-0" style={{ background: "var(--color-muted)" }}>{bestNow.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-bold leading-tight">{bestNow.name}</div>
            <div className="text-[12px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{bestNow.category} · {bestNow.distance} · {crowdLabel(bestNow.crowd).toLowerCase()}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[20px] font-extrabold leading-none" style={{ color: "var(--color-accent)" }}>−{timeSaved}<span className="text-[10px] font-semibold ml-0.5">min</span></div>
            <div className="text-[9px] uppercase tracking-wider mt-1" style={{ color: "var(--color-muted-foreground)" }}>Saved</div>
          </div>
        </button>

        {/* Reasoning checklist */}
        <div className="mt-4 p-3.5 rounded-2xl space-y-2" style={{ background: "var(--color-muted)" }}>
          <div className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "var(--color-muted-foreground)" }}>Recommended because</div>
          {[
            `Lowest wait nearby — only ${bestNow.wait} min`,
            bestNow.open ? "Open now" : "Opens soon",
            `${timeSaved} min faster than alternatives`,
            bestNow.trend === "down" ? "Crowd clearing in the next 30 min" : "Quiet for the next 45 minutes",
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px] leading-snug">
              <Check size={14} weight="bold" color="var(--color-success)" className="shrink-0 mt-0.5" />
              <span>{r}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button onClick={() => { window.open(`https://maps.google.com/?q=${encodeURIComponent(bestNow.address)}`); }} className="col-span-2 h-12 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            <NavigationArrow size={14} weight="fill" /> Go now
          </button>
          <button onClick={() => openDetail(bestNow.id)} className="h-12 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            Why? <CaretRight size={12} weight="bold" />
          </button>
        </div>
      </div>

      {/* Top 3 Opportunities */}
      <SectionTitle>Top opportunities right now</SectionTitle>
      <div className="flex flex-col gap-2 mb-6">
        {opportunities.map((p, i) => (
          <button key={p.id} onClick={() => openDetail(p.id)} className="wl-card p-3.5 flex items-center gap-3 text-left wl-fade-up" style={{ animationDelay: `${200 + i*40}ms` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px]" style={{ background: "var(--color-foreground)", color: "var(--color-background)" }}>{i+1}</div>
            <div className="text-[22px]">{p.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold leading-tight truncate">{p.name}</div>
              <div className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{p.wait} min · {crowdLabel(p.crowd).toLowerCase()}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[15px] font-extrabold leading-none" style={{ color: "var(--color-accent)" }}>−{p.savings}<span className="text-[10px] font-semibold ml-0.5">min</span></div>
              <div className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>vs avg</div>
            </div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MagnifyingGlass size={16} weight="regular" className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-foreground)" }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search places, categories…" className="w-full h-14 pl-11 pr-12 rounded-2xl text-[14px] outline-none" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
        {q && <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--color-muted)" }}><X size={14} weight="bold" /></button>}
      </div>

      {/* Categories — sticky under header */}
      <div className="sticky top-[112px] z-20 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-3 mb-3" style={{ background: "color-mix(in oklab, var(--color-background) 78%, transparent)", backdropFilter: "saturate(180%) blur(20px)" }}>
        {CATS.map(c => {
          const active = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)} className="shrink-0 px-4 h-10 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all" style={{ background: active ? "var(--color-primary)" : "var(--color-card)", color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)", border: active ? "none" : "1px solid var(--color-border)" }}>
              <span>{c.emoji}</span> {c.label}
            </button>
          );
        })}
      </div>

      {/* Nearby list */}
      <div className="flex items-end justify-between mb-3">
        <SectionTitle>Nearby places</SectionTitle>
        <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{filtered.length} found</span>
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((p, i) => (
          <div key={p.id} className="wl-fade-up" style={{ animationDelay: `${i*40}ms` }}>
            <PlaceCard place={p} saved={saved.has(p.id)} onTap={() => openDetail(p.id)} onSave={() => toggleSave(p.id)} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="wl-card p-8 text-center">
            <MagnifyingGlass size={28} weight="duotone" className="mx-auto mb-2" style={{ color: "var(--color-muted-foreground)" }} />
            <div className="text-[14px] font-semibold mb-1">No results</div>
            <div className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>Try a different search or category.</div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 22, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative w-[60px] h-[60px]">
      <svg viewBox="0 0 60 60" className="-rotate-90 w-full h-full">
        <circle cx="30" cy="30" r={r} stroke="var(--color-muted)" strokeWidth="5" fill="none" />
        <circle cx="30" cy="30" r={r} stroke="var(--color-accent)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 800ms" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[15px] font-extrabold">{value}</div>
    </div>
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-[11px] font-semibold tracking-[0.18em] uppercase mb-3 ${className}`} style={{ color: "var(--color-muted-foreground)" }}>{children}</h2>;
}

/* ========================= PLACE CARD ========================= */
function PlaceCard({ place: p, saved, onTap, onSave }: { place: Place; saved: boolean; onTap: () => void; onSave: () => void }) {
  const c = waitColor(p.wait);
  return (
    <div className="wl-card p-4 active:scale-[0.99] transition-transform">
      <button onClick={onTap} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px] shrink-0" style={{ background: "var(--color-muted)" }}>{p.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[15px] font-semibold leading-tight truncate">{p.name}</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{p.category} · {p.distance}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onSave(); }} className="shrink-0 -m-2 p-2">
                <Heart size={20} weight={saved ? "fill" : "regular"} color={saved ? "var(--color-danger)" : "var(--color-muted-foreground)"} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold" style={{ background: c.bg, color: c.text }}>
                {p.wait === 0 ? "No wait" : <>{p.wait} min <TrendIcon t={p.trend} className="w-3 h-3" /></>}
              </div>
              <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{crowdLabel(p.crowd)}</span>
              <span className="ml-auto inline-flex items-center gap-0.5 text-[10px]" style={{ color: "var(--color-muted-foreground)" }}>
                <ShieldCheck size={11} weight="fill" /> {p.verifiedBy}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3.5">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
            <div className="h-full wl-bar-grow rounded-full" style={{ width: `${p.crowd}%`, background: c.solid }} />
          </div>
          <div className="text-[11px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>{p.crowd}% full · Best time today: <span className="font-semibold" style={{ color: "var(--color-foreground)" }}>{p.bestTime}</span></div>
          <div className="mt-2.5 pt-2.5 flex items-center gap-2 text-[10px]" style={{ borderTop: "1px dashed var(--color-border)", color: "var(--color-muted-foreground)" }}>
            <span className="inline-flex items-center gap-0.5"><ArrowsClockwise size={10} weight="bold" /> 2 min ago</span>
            <span>·</span>
            <span className="inline-flex items-center gap-0.5"><ShieldCheck size={10} weight="fill" color="var(--color-success)" /> {p.verifiedBy} verified</span>
            <span className="ml-auto inline-flex items-center gap-0.5 font-semibold" style={{ color: "var(--color-foreground)" }}><Brain size={10} weight="duotone" /> {p.confidence}%</span>
          </div>
        </div>
      </button>
    </div>
  );
}

function WaitPill({ wait, trend, className = "" }: { wait: number; trend: Trend; className?: string }) {
  const c = waitColor(wait);
  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${className}`} style={{ background: c.bg, color: c.text }}>
      {wait === 0 ? "No wait" : <>{wait} min <TrendIcon t={trend} className="w-3 h-3" /></>}
    </div>
  );
}

/* ============================ MAP ============================ */
function MapScreen({ places, openDetail }: { places: Place[]; openDetail: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | "All">("All");
  const list = filter === "All" ? places : places.filter(p => p.category === filter);
  const sel = selected ? places.find(p => p.id === selected) : null;

  return (
    <div className="relative h-[calc(100vh-88px)]">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59,130,246,0.08), transparent 40%),
          radial-gradient(circle at 80% 60%, rgba(34,197,94,0.08), transparent 40%),
          linear-gradient(180deg, #EFEBE0 0%, #E6E0D2 100%)
        `,
      }}>
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B8B0A0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M 0 200 Q 200 180 430 220" stroke="#B8B0A0" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 100 0 Q 140 300 200 700" stroke="#B8B0A0" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 0 450 Q 200 420 430 470" stroke="#B8B0A0" strokeWidth="2" fill="none" opacity="0.6" />
        </svg>
      </div>

      <div className="absolute top-0 inset-x-0 z-10 px-5 pt-12 pb-3" style={{ background: "linear-gradient(180deg, rgba(247,245,239,0.95) 0%, rgba(247,245,239,0) 100%)" }}>
        <div className="text-[22px] font-bold mb-3">Map</div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {CATS.slice(0, 7).map(c => {
            const active = filter === c.key;
            return (
              <button key={c.key} onClick={() => setFilter(c.key)} className="shrink-0 px-3.5 h-9 rounded-full text-[12px] font-medium flex items-center gap-1.5" style={{ background: active ? "var(--color-primary)" : "rgba(255,255,255,0.9)", color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)", border: active ? "none" : "1px solid var(--color-border)", backdropFilter: "blur(8px)" }}>
                <span>{c.emoji}</span> {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {list.map((p, i) => {
        const c = waitColor(p.wait);
        const top = 130 + (i * 73) % 380;
        const left = 30 + (i * 97) % 320;
        const isBusy = p.wait >= 30;
        return (
          <button key={p.id} onClick={() => setSelected(p.id)} className="absolute z-[5]" style={{ top, left }}>
            <div className="relative">
              {isBusy && <div className="absolute inset-0 wl-pulse-ring rounded-full" style={{ color: c.solid }} />}
              <div className="relative w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold text-white wl-shadow-lg" style={{ background: c.solid }}>{p.wait}</div>
            </div>
          </button>
        );
      })}

      <button className="absolute bottom-5 right-5 z-10 w-12 h-12 rounded-full flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-card)" }}>
        <NavigationArrow size={20} weight="fill" color="var(--color-accent)" />
      </button>

      {sel && (
        <div className="absolute bottom-5 left-5 right-20 z-10 wl-slide-up wl-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[20px]" style={{ background: "var(--color-muted)" }}>{sel.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold leading-tight truncate">{sel.name}</div>
              <div className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{sel.category} · {sel.distance}</div>
            </div>
            <WaitPill wait={sel.wait} trend={sel.trend} />
          </div>
          <button onClick={() => openDetail(sel.id)} className="mt-3 w-full h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            View details <CaretRight size={14} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================ ALERTS ============================ */
function AlertsScreen({ alerts, places, setAlerts, openDetail, switchTab, showToast }: {
  alerts: { id: string; placeId: string; threshold: number; on: boolean }[];
  places: Place[]; setAlerts: (a: any) => void; openDetail: (id: string) => void;
  switchTab: (t: Tab) => void; showToast: (m: string) => void;
}) {
  const triggered = alerts.filter(a => {
    const p = places.find(x => x.id === a.placeId);
    return a.on && p && p.wait <= a.threshold;
  });

  return (
    <div className="px-5 pt-12">
      <div className="text-[26px] font-bold leading-tight">Alerts</div>
      <p className="serif-italic text-[16px] mt-1 mb-6" style={{ color: "var(--color-muted-foreground)" }}>We watch the crowd so you don't have to.</p>

      {triggered.map(a => {
        const p = places.find(x => x.id === a.placeId)!;
        return (
          <div key={a.id} className="wl-card p-4 mb-3 wl-fade-up" style={{ background: "var(--q-free-bg)", border: "1px solid color-mix(in oklab, var(--q-free) 30%, transparent)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--q-free)" }}>
                <Check size={18} weight="bold" color="white" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold" style={{ color: "var(--q-free-text)" }}>{p.name} — wait dropped to {p.wait} min</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--q-free-text)", opacity: 0.8 }}>Just now · go now</div>
                <button onClick={() => openDetail(p.id)} className="mt-2 text-[12px] font-semibold inline-flex items-center gap-1" style={{ color: "var(--q-free-text)" }}>View details <CaretRight size={13} weight="bold" /></button>
              </div>
            </div>
          </div>
        );
      })}

      {alerts.length === 0 ? (
        <div className="wl-card p-10 text-center mt-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-muted)" }}>
            <Bell size={28} weight="duotone" color="var(--color-muted-foreground)" />
          </div>
          <div className="text-[16px] font-semibold">No alerts yet</div>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Open any place and tap <span className="font-semibold">Alert me</span> to get started.</p>
          <button onClick={() => switchTab("today")} className="mt-5 inline-flex items-center gap-1 px-5 h-11 rounded-full text-[13px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            Explore places <CaretRight size={14} weight="bold" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map(a => {
            const p = places.find(x => x.id === a.placeId);
            if (!p) return null;
            const pct = Math.min(100, (a.threshold / Math.max(p.wait, a.threshold)) * 100);
            const ready = p.wait <= a.threshold;
            const eta = ready ? "Ready now" : `Likely in ~${Math.max(5, p.wait - a.threshold) * 4} min`;
            return (
              <div key={a.id} className="wl-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[20px]" style={{ background: "var(--color-muted)" }}>{p.emoji}</div>
                  <button onClick={() => openDetail(p.id)} className="flex-1 text-left min-w-0">
                    <div className="text-[14px] font-semibold leading-tight truncate">{p.name}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>Notify when wait &lt; {a.threshold} min</div>
                  </button>
                  <Toggle on={a.on} onChange={v => setAlerts((all: any) => all.map((x: any) => x.id === a.id ? { ...x, on: v } : x))} />
                </div>
                <div className="mt-3">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
                    <div className="h-full rounded-full wl-bar-grow" style={{ width: `${pct}%`, background: ready ? "var(--q-free)" : p.wait > a.threshold * 2 ? "var(--q-busy)" : "var(--q-medium)" }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>Now {p.wait} min · target {a.threshold} min · <span className="font-semibold" style={{ color: ready ? "var(--q-free-text)" : "var(--color-foreground)" }}>{eta}</span></span>
                    <button onClick={() => { setAlerts((all: any) => all.filter((x: any) => x.id !== a.id)); showToast("Alert removed"); }} className="text-[11px] font-medium inline-flex items-center gap-1" style={{ color: "var(--color-danger)" }}>
                      <Trash size={12} weight="bold" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Smart suggestions */}
      {alerts.length > 0 && (
        <>
          <SectionTitle className="mt-7">Smart suggestions</SectionTitle>
          <div className="wl-card p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-accent)", color: "white" }}>
              <Brain size={18} weight="duotone" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">Add a daily best-time ping</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>We'll notify you each morning when the quietest hour is approaching.</div>
              <button onClick={() => showToast("Daily ping enabled")} className="mt-2.5 px-3 h-8 rounded-full text-[11px] font-semibold inline-flex items-center gap-1" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
                Enable <Plus size={12} weight="bold" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background: on ? "var(--color-accent)" : "var(--color-border)" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: on ? 22 : 2 }} />
    </button>
  );
}

/* ============================ SAVED ============================ */
function SavedScreen({ places, saved, toggleSave, openDetail, switchTab }: {
  places: Place[]; saved: Set<string>; toggleSave: (id: string) => void;
  openDetail: (id: string) => void; switchTab: (t: Tab) => void;
}) {
  const list = places.filter(p => saved.has(p.id));
  return (
    <div className="px-5 pt-12">
      <div className="text-[26px] font-bold leading-tight">Saved</div>
      <p className="serif-italic text-[16px] mt-1 mb-6" style={{ color: "var(--color-muted-foreground)" }}>Quick access to your favourites.</p>

      {list.length === 0 ? (
        <div className="wl-card p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-muted)" }}>
            <Heart size={28} weight="duotone" color="var(--color-muted-foreground)" />
          </div>
          <div className="text-[16px] font-semibold">Nothing saved yet</div>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Tap the heart on any place to save it.</p>
          <button onClick={() => switchTab("today")} className="mt-5 inline-flex items-center gap-1 px-5 h-11 rounded-full text-[13px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            Browse places <CaretRight size={14} weight="bold" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {list.map((p, i) => {
            const c = waitColor(p.wait);
            return (
              <button key={p.id} onClick={() => openDetail(p.id)} className="wl-card p-4 text-left wl-fade-up" style={{ animationDelay: `${i*40}ms` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-[24px]">{p.emoji}</div>
                  <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }}>
                    <Heart size={16} weight="fill" color="var(--color-danger)" />
                  </button>
                </div>
                <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{p.category}</div>
                <WaitPill wait={p.wait} trend={p.trend} className="mt-2.5" />
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
                  <div className="h-full wl-bar-grow rounded-full" style={{ width: `${p.crowd}%`, background: c.solid }} />
                </div>
                <div className="text-[10px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>
                  Best: <span className="font-semibold" style={{ color: "var(--color-foreground)" }}>{p.bestTime}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================ PROFILE ============================ */
function ProfileScreen({ savedCount, alertCount }: { savedCount: number; alertCount: number }) {
  const badges = [
    { Icon: Lightning, t: "Early Bird", earned: true },
    { Icon: Brain, t: "Smart Planner", earned: true },
    { Icon: Users, t: "Community Hero", earned: true },
    { Icon: Trophy, t: "Streak ×7", earned: true },
    { Icon: Target, t: "Time Wizard", earned: false },
    { Icon: Confetti, t: "Local Legend", earned: false },
  ];
  const [reportOpen, setReportOpen] = useState(false);
  // suppress unused warnings
  void savedCount; void alertCount;

  return (
    <div className="px-5 pt-12">
      <div className="text-[26px] font-bold leading-tight">Profile</div>
      <p className="serif-italic text-[16px] mt-1 mb-6" style={{ color: "var(--color-muted-foreground)" }}>Your time, reclaimed.</p>

      {/* Identity */}
      <div className="wl-card p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] font-bold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>RA</div>
        <div className="flex-1">
          <div className="text-[16px] font-semibold">Ravi A.</div>
          <div className="text-[12px] flex items-center gap-1.5" style={{ color: "var(--color-muted-foreground)" }}>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: "var(--color-muted)", color: "var(--color-foreground)" }}>
              <Trophy size={10} weight="fill" /> Time Saver
            </span>
            Rank #248
          </div>
        </div>
        <CaretRight size={18} weight="bold" style={{ color: "var(--color-muted-foreground)" }} />
      </div>

      {/* Lifetime Impact hero */}
      <div className="wl-card p-5 mb-5" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
        <div className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-70 mb-2 flex items-center gap-1.5">
          <ChartLineUp size={12} weight="fill" /> Lifetime impact
        </div>
        <div className="text-[44px] leading-none font-extrabold">14<span className="text-[16px] font-semibold opacity-70 ml-1">h</span> 22<span className="text-[16px] font-semibold opacity-70 ml-1">m</span></div>
        <div className="text-[12px] opacity-70 mt-2">Total time you've saved with WaitLess</div>
        <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[18px] font-bold leading-none">37</div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1">Visits</div>
          </div>
          <div>
            <div className="text-[18px] font-bold leading-none">12</div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1">Helped</div>
          </div>
          <div>
            <div className="text-[18px] font-bold leading-none">94%</div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Community Impact */}
      <SectionTitle>Community impact</SectionTitle>
      <div className="wl-card p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "var(--color-accent)", color: "white" }}>
            <Users size={20} weight="duotone" />
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-bold leading-tight">Community Hero</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>Trusted contributor · Level 3</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl" style={{ background: "var(--color-muted)" }}>
            <div className="text-[20px] font-extrabold leading-none" style={{ color: "var(--color-accent)" }}>1,240</div>
            <div className="text-[9px] uppercase tracking-wider mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>People helped</div>
          </div>
          <div className="p-3 rounded-2xl" style={{ background: "var(--color-muted)" }}>
            <div className="text-[20px] font-extrabold leading-none">87</div>
            <div className="text-[9px] uppercase tracking-wider mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>Reports</div>
          </div>
          <div className="p-3 rounded-2xl" style={{ background: "var(--color-muted)" }}>
            <div className="text-[20px] font-extrabold leading-none" style={{ color: "var(--color-success)" }}>94%</div>
            <div className="text-[9px] uppercase tracking-wider mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>Accuracy</div>
          </div>
        </div>
      </div>

      {/* Weekly Report CTA */}
      <button onClick={() => setReportOpen(true)} className="w-full wl-card p-4 mb-6 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "var(--color-foreground)", color: "var(--color-background)" }}>
          <ChartLineUp size={20} weight="duotone" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[14px] font-semibold leading-tight">This week's report</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>4h 21m saved · share your impact</div>
        </div>
        <CaretRight size={18} weight="bold" style={{ color: "var(--color-muted-foreground)" }} />
      </button>

      {/* Badges */}
      <div className="flex items-end justify-between mb-3">
        <SectionTitle className="!mb-0">Badges</SectionTitle>
        <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{badges.filter(b => b.earned).length} / {badges.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {badges.map(b => (
          <div key={b.t} className="wl-card p-4 text-center" style={{ opacity: b.earned ? 1 : 0.4 }}>
            <div className="w-10 h-10 mx-auto rounded-2xl flex items-center justify-center mb-2" style={{ background: b.earned ? "var(--color-foreground)" : "var(--color-muted)", color: b.earned ? "var(--color-background)" : "var(--color-muted-foreground)" }}>
              <b.Icon size={20} weight={b.earned ? "fill" : "regular"} />
            </div>
            <div className="text-[10px] font-semibold leading-tight">{b.t}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <SectionTitle>Settings</SectionTitle>
      <div className="wl-card overflow-hidden">
        {["Notifications", "Privacy", "Theme", "Account", "Help & support"].map((l, i, arr) => (
          <button key={l} className="w-full px-5 py-4 flex items-center justify-between text-[14px] font-medium" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
            {l} <CaretRight size={16} weight="bold" style={{ color: "var(--color-muted-foreground)" }} />
          </button>
        ))}
      </div>

      {reportOpen && <WeeklyReport onClose={() => setReportOpen(false)} />}
    </div>
  );
}

function WeeklyReport({ onClose }: { onClose: () => void }) {
  const stats = [
    { label: "Hours saved", value: "4h 21m", accent: "var(--color-accent)" },
    { label: "Places visited", value: "8" },
    { label: "Alerts triggered", value: "12" },
    { label: "Community helped", value: "124", accent: "var(--color-success)" },
  ];
  return (
    <div className="fixed inset-0 z-[110] flex justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="relative w-full max-w-[430px] h-full overflow-y-auto wl-slide-in-right" style={{ background: "var(--color-background)" }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 pt-12 pb-3" style={{ background: "var(--color-background)" }}>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center wl-card"><CaretLeft size={18} weight="bold" /></button>
          <div className="text-[14px] font-semibold">Weekly report</div>
          <div className="w-10" />
        </div>
        <div className="px-5 pb-32">
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--color-muted-foreground)" }}>This week</div>
          <h1 className="text-[28px] font-bold leading-tight mt-1">You reclaimed <span style={{ color: "var(--color-accent)" }}>4h 21m</span></h1>
          <p className="serif-italic text-[16px] mt-2 mb-6" style={{ color: "var(--color-muted-foreground)" }}>That's more than half a workday — back to you.</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {stats.map(s => (
              <div key={s.label} className="wl-card p-4">
                <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{s.label}</div>
                <div className="text-[22px] font-extrabold leading-none mt-1.5" style={{ color: s.accent || "var(--color-foreground)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="wl-card p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Efficiency score</div>
              <span className="text-[11px] font-semibold inline-flex items-center gap-0.5" style={{ color: "var(--color-success)" }}><TrendUp size={11} weight="bold" /> +4</span>
            </div>
            <div className="flex items-baseline gap-2"><span className="text-[40px] font-extrabold leading-none">82</span><span className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>/ 100</span></div>
            <div className="text-[11px] mt-2" style={{ color: "var(--color-muted-foreground)" }}>Most efficient day: <span className="font-semibold" style={{ color: "var(--color-foreground)" }}>Wednesday</span></div>
          </div>

          <div className="wl-card p-5 mb-5 flex items-center gap-3" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <Trophy size={22} weight="duotone" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70">Top achievement</div>
              <div className="text-[16px] font-bold leading-tight mt-0.5">Early Bird</div>
              <div className="text-[11px] opacity-70">Beat the morning rush 5 days in a row</div>
            </div>
          </div>

          {/* Share card */}
          <div className="wl-card p-5 mb-5" style={{ background: "var(--color-accent)", color: "white" }}>
            <div className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-80 mb-2">Share your impact</div>
            <div className="text-[18px] font-bold leading-snug">"I saved 4h 21m this week using WaitLess."</div>
            <div className="text-[11px] opacity-80 mt-2">Score 82 · Early Bird badge</div>
            <button className="mt-4 w-full h-12 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "white", color: "var(--color-accent)" }}>
              <ShareNetwork size={16} weight="bold" /> Share card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function BigStat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="wl-card p-4">
      <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{label}</div>
      <div className="text-[22px] font-bold mt-1.5 leading-none" style={{ color: accent || "var(--color-foreground)" }}>{value}</div>
      {sub && <div className="text-[10px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>{sub}</div>}
    </div>
  );
}

/* ============================ DETAIL ============================ */
function Detail({ place: p, places, saved, onClose, onToggleSave, onAlert, openDetail, showToast }: {
  place: Place; places: Place[]; saved: boolean; onClose: () => void; onToggleSave: () => void;
  onAlert: () => void; openDetail: (id: string) => void; showToast: (m: string) => void;
}) {
  const c = waitColor(p.wait);
  const [reportCount, setReportCount] = useState(p.reports);
  const [reportedRecently, setReportedRecently] = useState(false);
  const [actualWait, setActualWait] = useState("");

  function imHere() {
    if (reportedRecently) { showToast("Already reported recently"); return; }
    setReportCount(n => n + 1); setReportedRecently(true);
    showToast("+1 person confirmed");
  }
  function confirmWait() {
    if (!actualWait) return;
    showToast("Thanks! Your report helps everyone");
    setActualWait("");
  }

  const alternatives = useMemo(() =>
    places.filter(x => x.id !== p.id && x.category === p.category).sort((a,b) => a.wait - b.wait).slice(0, 3),
  [places, p]);

  return (
    <div className="fixed inset-0 z-[100] flex justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="relative w-full max-w-[430px] h-full overflow-y-auto wl-slide-in-right" style={{ background: "var(--color-background)" }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 pt-12 pb-3" style={{ background: "var(--color-background)" }}>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center wl-card"><CaretLeft size={18} weight="bold" /></button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center wl-card"><ShareNetwork size={16} weight="regular" /></button>
            <button onClick={onToggleSave} className="w-10 h-10 rounded-full flex items-center justify-center wl-card">
              <Heart size={16} weight={saved ? "fill" : "regular"} color={saved ? "var(--color-danger)" : "var(--color-foreground)"} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-32">
          {/* Hero */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-[32px]" style={{ background: "var(--color-muted)" }}>{p.emoji}</div>
            <div className="flex-1 pt-1">
              <h1 className="text-[24px] font-bold leading-tight">{p.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>
                <span className="inline-flex items-center gap-0.5"><Star size={11} weight="fill" color="var(--color-warning)" />{p.rating}</span>
                <span>·</span><span>{p.category}</span><span>·</span><span>{p.distance}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[12px] font-medium">
                <span className="w-2 h-2 rounded-full wl-dot-pulse" style={{ background: p.open ? "var(--q-free)" : "var(--q-busy)" }} />
                {p.open ? `Open · closes ${p.closes}` : "Closed"}
              </div>
            </div>
          </div>

          {/* Trust signals row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <TrustChip Icon={ShieldCheck} value={`${p.verifiedBy}`} label="Verified by" />
            <TrustChip Icon={Brain} value={`${p.confidence}%`} label="AI confidence" />
            <TrustChip Icon={Users} value={`${p.hereNow}`} label="Here now" />
          </div>

          {/* Status banner */}
          <div className="rounded-2xl px-4 py-3 mb-5 flex items-center gap-2 text-[13px] font-semibold" style={{ background: c.bg, color: c.text }}>
            <Activity size={16} weight="bold" />
            {crowdLabel(p.crowd)} — {p.crowd > 70 ? "expect a wait" : p.crowd > 40 ? "moderate flow" : "great time to visit"}
          </div>

          {/* Wait time hero */}
          <div className="wl-card p-6 mb-4 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>Estimated wait</div>
            <div className="text-[64px] leading-none font-extrabold" style={{ color: c.solid }}>{p.wait}<span className="text-[20px] font-semibold ml-1" style={{ color: "var(--color-muted-foreground)" }}>min</span></div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: p.trend === "up" ? "var(--color-danger)" : p.trend === "down" ? "var(--color-success)" : "var(--color-muted-foreground)" }}>
              <TrendIcon t={p.trend} className="w-3.5 h-3.5" /> {p.trend === "up" ? "Getting busier" : p.trend === "down" ? "Clearing up" : "Holding steady"}
            </div>
            <div className="mt-1 text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>Based on {reportCount} reports · 3 min ago</div>
          </div>

          {/* AI Insight */}
          <div className="wl-card p-4 mb-4 flex items-start gap-3" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
              <Brain size={20} weight="duotone" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70 mb-1">AI insight</div>
              <div className="text-[13px] leading-relaxed">
                Best time today is <span className="font-semibold">{p.bestTime}</span> — expected wait <span className="font-semibold">~{p.bestWait} min</span>. In the next hour wait likely climbs to <span className="font-semibold">{Math.round(p.wait * 1.15)} min</span>.
              </div>
            </div>
          </div>

          {/* Forecast card */}
          <div className="wl-card p-5 mb-4">
            <div className="text-[13px] font-semibold mb-1">Forecast</div>
            <div className="text-[11px] mb-4" style={{ color: "var(--color-muted-foreground)" }}>Expected wait over the next 3 hours</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "In 1 hour", w: Math.max(0, Math.round(p.wait * 0.65)) },
                { label: "In 2 hours", w: Math.max(0, Math.round(p.wait * 0.42)) },
                { label: "In 3 hours", w: Math.max(0, Math.round(p.wait * 0.22)) },
              ].map(f => {
                const fc = waitColor(f.w);
                return (
                  <div key={f.label} className="rounded-2xl p-3 text-center" style={{ background: "var(--color-muted)" }}>
                    <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-muted-foreground)" }}>{f.label}</div>
                    <div className="text-[22px] font-extrabold leading-none mt-1.5" style={{ color: fc.solid }}>{f.w}<span className="text-[10px] font-semibold ml-0.5" style={{ color: "var(--color-muted-foreground)" }}>min</span></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best time card */}
          <div className="wl-card p-5 mb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "var(--q-free-bg)" }}>
              <Clock size={24} weight="duotone" color="var(--q-free-text)" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Best time today</div>
              <div className="text-[24px] font-extrabold leading-tight mt-0.5">{p.bestTime}</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Expected wait ~{p.bestWait} min · {p.confidence}% confidence</div>
            </div>
            <button onClick={onAlert} className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              <Bell size={16} weight="fill" />
            </button>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={onAlert} className="h-14 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              <Bell size={16} weight="fill" /> Alert me
            </button>
            <button onClick={() => { window.open(`https://maps.google.com/?q=${encodeURIComponent(p.address)}`); }} className="h-14 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
              <NavigationArrow size={16} weight="fill" /> Directions
            </button>
          </div>

          {/* Busy times chart */}
          <div className="wl-card p-5 mb-4">
            <div className="text-[13px] font-semibold mb-1">Busy times today</div>
            <div className="text-[11px] mb-4" style={{ color: "var(--color-muted-foreground)" }}>Hourly forecast · {p.confidence}% confidence</div>
            <div className="flex items-end gap-1.5 h-32">
              {HOURLY.map((v, i) => {
                const col = v < 40 ? "var(--q-free)" : v < 70 ? "var(--q-medium)" : "var(--q-busy)";
                const cur = i === CURRENT_HOUR_IDX;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md wl-bar-grow origin-bottom" style={{ height: `${v}%`, background: col, transformOrigin: "bottom", outline: cur ? "2px solid var(--color-accent)" : "none", outlineOffset: 2 }} />
                    <div className="text-[9px]" style={{ color: cur ? "var(--color-accent)" : "var(--color-muted-foreground)", fontWeight: cur ? 700 : 400 }}>{HOURS[i]}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 px-3 py-2.5 rounded-xl text-[12px] flex items-start gap-2" style={{ background: "var(--color-muted)" }}>
              <Sparkle size={14} weight="fill" color="var(--color-accent)" className="mt-0.5 shrink-0" />
              <span><span className="font-semibold">Best time:</span> {p.bestTime} — predicted wait ~{p.bestWait} min.</span>
            </div>
          </div>

          {/* Alternative nearby */}
          {alternatives.length > 0 && (
            <>
              <SectionTitle>Faster nearby alternatives</SectionTitle>
              <div className="flex flex-col gap-2 mb-5">
                {alternatives.map(alt => (
                  <button key={alt.id} onClick={() => openDetail(alt.id)} className="wl-card p-3.5 flex items-center gap-3 text-left">
                    <div className="text-[22px]">{alt.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold leading-tight truncate">{alt.name}</div>
                      <div className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{alt.distance} away · {crowdLabel(alt.crowd).toLowerCase()}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <WaitPill wait={alt.wait} trend={alt.trend} />
                      {alt.wait < p.wait && <div className="text-[10px] mt-1 font-semibold" style={{ color: "var(--color-accent)" }}>−{p.wait - alt.wait} min</div>}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Report */}
          <div className="wl-card p-5 mb-4">
            <div className="text-[13px] font-semibold mb-1">Help your community</div>
            <div className="text-[11px] mb-4" style={{ color: "var(--color-muted-foreground)" }}>One tap. Two seconds. Helps thousands.</div>
            <button onClick={imHere} disabled={reportedRecently} className="w-full h-12 rounded-xl text-[14px] font-semibold mb-3 disabled:opacity-50 flex items-center justify-center gap-1.5" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              {reportedRecently ? <><Check size={16} weight="bold" /> Reported — thanks!</> : <>I'm here now</>}
            </button>
            <div className="flex gap-2">
              <input type="number" value={actualWait} onChange={e => setActualWait(e.target.value)} placeholder="Actual wait (min)" className="flex-1 h-11 px-3.5 rounded-xl text-[13px] outline-none" style={{ background: "var(--color-muted)" }} />
              <button onClick={confirmWait} className="h-11 px-4 rounded-xl text-[13px] font-semibold" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>Confirm</button>
            </div>
            <div className="text-[11px] mt-3" style={{ color: "var(--color-muted-foreground)" }}>{reportCount} people confirmed in the last hour</div>
          </div>

          {/* Info */}
          <div className="wl-card overflow-hidden">
            <InfoRow icon={<Clock size={16} weight="regular" />} label={p.open ? `Open · closes ${p.closes}` : "Closed"} />
            <InfoRow icon={<Phone size={16} weight="regular" />} label={p.phone} onClick={() => window.open(`tel:${p.phone}`)} />
            <InfoRow icon={<MapPinLine size={16} weight="regular" />} label={p.address} onClick={() => { navigator.clipboard?.writeText(p.address); showToast("Address copied"); }} last />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustChip({ Icon, value, label }: { Icon: any; value: string; label: string }) {
  return (
    <div className="wl-card p-3 text-center">
      <Icon size={16} weight="duotone" className="mx-auto mb-1.5" color="var(--color-accent)" />
      <div className="text-[14px] font-bold leading-none">{value}</div>
      <div className="text-[9px] uppercase tracking-wider mt-1" style={{ color: "var(--color-muted-foreground)" }}>{label}</div>
    </div>
  );
}

function InfoRow({ icon, label, onClick, last }: { icon: React.ReactNode; label: string; onClick?: () => void; last?: boolean }) {
  return (
    <button onClick={onClick} className="w-full px-5 py-4 flex items-center gap-3 text-left" style={{ borderBottom: last ? "none" : "1px solid var(--color-border)" }}>
      <div style={{ color: "var(--color-muted-foreground)" }}>{icon}</div>
      <span className="text-[13px] font-medium flex-1">{label}</span>
    </button>
  );
}

/* ========================== ALERT MODAL ========================== */
function AlertModal({ place, onClose, onSet }: { place: Place; onClose: () => void; onSet: (th: number) => void }) {
  const [th, setTh] = useState(15);
  const [busy, setBusy] = useState(false);
  const [daily, setDaily] = useState(false);

  return (
    <div className="fixed inset-0 z-[110] flex justify-center items-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="relative w-full max-w-[430px] rounded-t-[28px] wl-slide-up p-6 pb-10" style={{ background: "var(--color-card)" }} onClick={e => e.stopPropagation()}>
        <div className="mx-auto w-10 h-1.5 rounded-full mb-5" style={{ background: "var(--color-border)" }} />
        <div className="text-[18px] font-bold leading-tight">Set wait alert</div>
        <div className="text-[13px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>For <span className="font-semibold" style={{ color: "var(--color-foreground)" }}>{place.name}</span></div>

        <div className="mt-7">
          <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Notify when wait drops below</div>
          <div className="text-[48px] font-extrabold leading-none mt-2" style={{ color: "var(--color-accent)" }}>{th}<span className="text-[16px] font-semibold ml-1" style={{ color: "var(--color-muted-foreground)" }}>min</span></div>
          <input type="range" min={1} max={60} value={th} onChange={e => setTh(+e.target.value)} className="w-full mt-4 accent-[var(--color-accent)]" />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--color-muted-foreground)" }}><span>1</span><span>60</span></div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <ToggleRow on={busy} onChange={setBusy} title="Also alert if very busy (>70%)" />
          <ToggleRow on={daily} onChange={setDaily} title="Repeat daily at best time" sub="Based on typical quiet hours" />
        </div>

        <button onClick={() => onSet(th)} className="mt-7 w-full h-14 rounded-2xl text-[15px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Set alert</button>
      </div>
    </div>
  );
}
function ToggleRow({ on, onChange, title, sub }: { on: boolean; onChange: (v: boolean) => void; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--color-muted)" }}>
      <div className="flex-1">
        <div className="text-[13px] font-semibold">{title}</div>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{sub}</div>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

/* ========================== PLANNER ========================== */
function Planner({ places, onClose, showToast }: { places: Place[]; onClose: () => void; showToast: (m: string) => void }) {
  const [stops, setStops] = useState<string[]>([]);
  const [optimized, setOptimized] = useState(false);

  function toggleStop(id: string) {
    setOptimized(false);
    setStops(s => s.includes(id) ? s.filter(x => x !== id) : s.length >= 5 ? s : [...s, id]);
  }

  const ordered = useMemo(() => {
    const picked = stops.map(id => places.find(p => p.id === id)!).filter(Boolean);
    if (!optimized) return picked;
    return [...picked].sort((a, b) => (a.wait * 1 + a.distanceNum * 5) - (b.wait * 1 + b.distanceNum * 5));
  }, [stops, places, optimized]);

  const totalWait = ordered.reduce((s, p) => s + p.wait, 0);
  const totalTravel = ordered.reduce((s, p) => s + Math.round(p.distanceNum * 3), 0);
  const naiveWait = stops.map(id => places.find(p => p.id === id)!).reduce((s, p) => s + p.wait, 0);
  const naiveTravel = stops.map(id => places.find(p => p.id === id)!).reduce((s, p) => s + Math.round(p.distanceNum * 4), 0);
  const saved = optimized ? Math.max(0, (naiveWait + naiveTravel) - (totalWait + totalTravel)) : 0;

  return (
    <div className="fixed inset-0 z-[105] flex justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="relative w-full max-w-[430px] h-full overflow-y-auto wl-slide-in-right" style={{ background: "var(--color-background)" }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 pt-12 pb-3" style={{ background: "var(--color-background)" }}>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center wl-card"><CaretLeft size={18} weight="bold" /></button>
          <div className="text-[14px] font-semibold">AI Planner</div>
          <div className="w-10" />
        </div>

        <div className="px-5 pb-32">
          <div className="text-[26px] font-bold leading-tight">Plan your day</div>
          <p className="serif-italic text-[16px] mt-1 mb-5" style={{ color: "var(--color-muted-foreground)" }}>Pick up to 5 stops — we'll order them to save you the most time.</p>

          {/* Selected route */}
          {stops.length > 0 && (
            <div className="wl-card p-5 mb-5" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70 flex items-center gap-1.5">
                  <Path size={12} weight="fill" /> Your route
                </div>
                {optimized && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--color-accent)", color: "white" }}>Optimised</span>}
              </div>
              <div className="space-y-2 mb-4">
                {ordered.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>{i+1}</div>
                    <div className="text-[18px]">{p.emoji}</div>
                    <div className="flex-1 text-[13px] font-semibold truncate">{p.name}</div>
                    <div className="text-[11px] opacity-70">{p.wait}m</div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[18px] font-bold leading-none">{totalWait}<span className="text-[10px] opacity-70 ml-0.5">m</span></div>
                  <div className="text-[9px] uppercase tracking-wider opacity-70 mt-1">Wait</div>
                </div>
                <div>
                  <div className="text-[18px] font-bold leading-none">{totalTravel}<span className="text-[10px] opacity-70 ml-0.5">m</span></div>
                  <div className="text-[9px] uppercase tracking-wider opacity-70 mt-1">Travel</div>
                </div>
                <div>
                  <div className="text-[18px] font-bold leading-none" style={{ color: "var(--color-accent)" }}>−{saved}<span className="text-[10px] opacity-70 ml-0.5">m</span></div>
                  <div className="text-[9px] uppercase tracking-wider opacity-70 mt-1">Saved</div>
                </div>
              </div>
              <button onClick={() => { setOptimized(true); showToast("Route optimised"); }} disabled={optimized || stops.length < 2} className="mt-4 w-full h-12 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50" style={{ background: "var(--color-accent)", color: "white" }}>
                <Brain size={16} weight="duotone" /> {optimized ? "Route optimised" : "Optimise with AI"}
              </button>
            </div>
          )}

          <SectionTitle>Choose stops ({stops.length}/5)</SectionTitle>
          <div className="flex flex-col gap-2">
            {places.map(p => {
              const picked = stops.includes(p.id);
              return (
                <button key={p.id} onClick={() => toggleStop(p.id)} className="wl-card p-3.5 flex items-center gap-3 text-left transition-all" style={{ borderColor: picked ? "var(--color-accent)" : "var(--color-border)", borderWidth: picked ? 2 : 1, borderStyle: "solid" }}>
                  <div className="text-[22px]">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-tight truncate">{p.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{p.distance} · {p.wait} min wait</div>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: picked ? "var(--color-accent)" : "var(--color-muted)" }}>
                    {picked ? <Check size={14} weight="bold" color="white" /> : <Plus size={14} weight="bold" color="var(--color-muted-foreground)" />}
                  </div>
                </button>
              );
            })}
          </div>

          {stops.length === 0 && (
            <div className="wl-card p-8 text-center mt-4">
              <Path size={28} weight="duotone" className="mx-auto mb-2" color="var(--color-muted-foreground)" />
              <div className="text-[14px] font-semibold mb-1">No stops yet</div>
              <div className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>Pick at least 2 to optimise your route.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================== BOTTOM NAV ========================== */
function BottomNav({ tab, setTab, alertCount, savedCount }: { tab: Tab; setTab: (t: Tab) => void; alertCount: number; savedCount: number }) {
  const items: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "today", label: "Today", icon: House },
    { key: "map", label: "Map", icon: MapTrifold },
    { key: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { key: "saved", label: "Saved", icon: BookmarkSimple, badge: savedCount },
    { key: "profile", label: "Profile", icon: User },
  ];
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center" style={{ background: "transparent" }}>
      <div className="w-full max-w-[430px] flex items-stretch px-2 pt-2 pb-3" style={{ background: "var(--color-card)", borderTop: "1px solid var(--color-border)" }}>
        {items.map(it => {
          const Icon = it.icon;
          const active = tab === it.key;
          return (
            <button key={it.key} onClick={() => setTab(it.key)} className="flex-1 flex flex-col items-center gap-1 py-1.5 relative">
              <div className="relative">
                <Icon size={22} weight={active ? "fill" : "regular"} color={active ? "var(--color-foreground)" : "var(--color-muted-foreground)"} />
                {it.badge ? <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "var(--color-danger)" }}>{it.badge}</span> : null}
              </div>
              <span className="text-[10px] font-semibold" style={{ color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
