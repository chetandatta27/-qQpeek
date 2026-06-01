import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home as IconHome, Map as IconMap, Bell, Bookmark, User as IconUser,
  Search, X, ChevronLeft, MapPin, RefreshCw, TrendingUp, TrendingDown,
  Minus, Heart, Phone, Navigation, Check, Trash2, Plus, Star, Clock,
  Sparkles, Share2, AlertCircle, Activity, Zap, ChevronRight, Filter,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

/* ============================== DATA ============================== */
type Trend = "up" | "down" | "stable";
type Category = "Hospital" | "Bank" | "Café" | "Restaurant" | "Gym" | "Pharmacy" | "Shopping" | "Govt";
type Place = {
  id: string; name: string; category: Category; emoji: string;
  distance: string; distanceNum: number; wait: number; crowd: number;
  trend: Trend; open: boolean; closes: string; rating: number;
  address: string; phone: string; reports: number;
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
  { id: "p1", name: "Apollo Hospital", category: "Hospital", emoji: "🏥", distance: "1.2 km", distanceNum: 1.2, wait: 28, crowd: 78, trend: "up", open: true, closes: "24h", rating: 4.6, address: "Jubilee Hills, Hyderabad", phone: "+914023607777", reports: 18 },
  { id: "p2", name: "HDFC Bank — Banjara", category: "Bank", emoji: "🏦", distance: "0.6 km", distanceNum: 0.6, wait: 12, crowd: 42, trend: "down", open: true, closes: "4:00 PM", rating: 4.2, address: "Road No. 12, Banjara Hills", phone: "+914023456789", reports: 9 },
  { id: "p3", name: "Roastery Coffee House", category: "Café", emoji: "☕", distance: "0.4 km", distanceNum: 0.4, wait: 5, crowd: 28, trend: "stable", open: true, closes: "11:00 PM", rating: 4.8, address: "Road No. 36, Jubilee Hills", phone: "+919876543210", reports: 14 },
  { id: "p4", name: "FitZone Gym", category: "Gym", emoji: "💪", distance: "0.9 km", distanceNum: 0.9, wait: 3, crowd: 22, trend: "down", open: true, closes: "10:00 PM", rating: 4.5, address: "Madhapur Main Rd", phone: "+919812345678", reports: 6 },
  { id: "p5", name: "MedPlus Pharmacy", category: "Pharmacy", emoji: "💊", distance: "0.3 km", distanceNum: 0.3, wait: 4, crowd: 31, trend: "stable", open: true, closes: "11:00 PM", rating: 4.4, address: "Filmnagar", phone: "+914049000000", reports: 11 },
  { id: "p6", name: "Paradise Biryani", category: "Restaurant", emoji: "🍽️", distance: "2.1 km", distanceNum: 2.1, wait: 35, crowd: 88, trend: "up", open: true, closes: "11:30 PM", rating: 4.3, address: "Secunderabad", phone: "+914027840000", reports: 24 },
  { id: "p7", name: "Inorbit Mall", category: "Shopping", emoji: "🛍️", distance: "3.4 km", distanceNum: 3.4, wait: 0, crowd: 55, trend: "stable", open: true, closes: "10:00 PM", rating: 4.4, address: "Cyberabad", phone: "+914040000000", reports: 7 },
  { id: "p8", name: "RTA Office", category: "Govt", emoji: "🏛️", distance: "4.0 km", distanceNum: 4.0, wait: 52, crowd: 92, trend: "up", open: true, closes: "5:00 PM", rating: 3.4, address: "Khairatabad", phone: "+914023220000", reports: 31 },
];

const HOURLY = [22, 30, 45, 60, 72, 55, 40, 38, 50, 70, 82, 65, 48];
const HOURS = ["9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p"];
const CURRENT_HOUR_IDX = 5;

/* ========================== UTILITIES ========================== */
function waitColor(w: number) {
  if (w === 0) return { bg: "var(--q-free-bg)", text: "var(--q-free-text)", solid: "var(--q-free)" };
  if (w < 15) return { bg: "var(--q-free-bg)", text: "var(--q-free-text)", solid: "var(--q-free)" };
  if (w < 30) return { bg: "var(--q-medium-bg)", text: "var(--q-medium-text)", solid: "var(--q-medium)" };
  return { bg: "var(--q-busy-bg)", text: "var(--q-busy-text)", solid: "var(--q-busy)" };
}
function crowdLabel(c: number) {
  if (c < 40) return "Quiet";
  if (c < 70) return "Moderate";
  return "Busy";
}
function trendIcon(t: Trend) {
  if (t === "up") return <TrendingUp className="w-3.5 h-3.5" />;
  if (t === "down") return <TrendingDown className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
}

/* ============================== APP ============================== */
type Stage = "splash" | "onboarding" | "app";
type Tab = "home" | "explore" | "alerts" | "saved" | "profile";

function App() {
  const [stage, setStage] = useState<Stage>("splash");
  const [obStep, setObStep] = useState(0);
  const [tab, setTab] = useState<Tab>("home");
  const [places, setPlaces] = useState<Place[]>(SEED);
  const [saved, setSaved] = useState<Set<string>>(new Set(["p3", "p4"]));
  const [alerts, setAlerts] = useState<{ id: string; placeId: string; threshold: number; on: boolean }[]>([
    { id: "a1", placeId: "p1", threshold: 15, on: true },
  ]);
  const [detail, setDetail] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [alertModalFor, setAlertModalFor] = useState<string | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("onboarding"), 1900);
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
    setSaved(s => { const n = new Set(s); if (n.has(id)) { n.delete(id); showToast("Removed from Saved"); } else { n.add(id); showToast("❤ Saved"); } return n; });
  }
  function addAlert(placeId: string, threshold: number) {
    setAlerts(a => [...a, { id: `a${Date.now()}`, placeId, threshold, on: true }]);
    const p = places.find(x => x.id === placeId);
    showToast(`🔔 Alert set for ${p?.name}`);
  }

  const detailPlace = detail ? places.find(p => p.id === detail) : null;

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center" style={{ background: "#0B0B0B" }}>
      <div className="relative w-full max-w-[430px] min-h-screen overflow-hidden" style={{ background: "var(--color-background)" }}>
        {stage === "splash" && <Splash />}
        {stage === "onboarding" && (
          <Onboarding step={obStep} onNext={() => setObStep(s => s + 1)} onDone={() => setStage("app")} />
        )}
        {stage === "app" && (
          <>
            <div className="pb-[88px]">
              {tab === "home" && <HomeScreen places={places} saved={saved} toggleSave={toggleSave} openDetail={setDetail} showToast={showToast} />}
              {tab === "explore" && <ExploreScreen places={places} openDetail={setDetail} />}
              {tab === "alerts" && <AlertsScreen alerts={alerts} places={places} setAlerts={setAlerts} openDetail={setDetail} switchTab={setTab} showToast={showToast} />}
              {tab === "saved" && <SavedScreen places={places} saved={saved} toggleSave={toggleSave} openDetail={setDetail} switchTab={setTab} />}
              {tab === "profile" && <ProfileScreen savedCount={saved.size} alertCount={alerts.length} />}
            </div>
            <BottomNav tab={tab} setTab={setTab} alertCount={alerts.filter(a => a.on).length} savedCount={saved.size} />
          </>
        )}

        {detailPlace && (
          <Detail place={detailPlace} saved={saved.has(detailPlace.id)} onClose={() => setDetail(null)} onToggleSave={() => toggleSave(detailPlace.id)} onAlert={() => setAlertModalFor(detailPlace.id)} showToast={showToast} />
        )}
        {alertModalFor && (
          <AlertModal place={places.find(p => p.id === alertModalFor)!} onClose={() => setAlertModalFor(null)} onSet={(th) => { addAlert(alertModalFor, th); setAlertModalFor(null); }} />
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
          <div className="relative">
            <div className="w-9 h-9 rounded-full border-[3px]" style={{ borderColor: "#F7F5EF", borderRightColor: "transparent" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: "var(--color-accent)" }} />
          </div>
        </div>
        <div className="text-[34px] font-extrabold tracking-tight">WaitLess</div>
        <div className="serif-italic text-[18px] mt-2" style={{ color: "var(--color-muted-foreground)" }}>
          Skip the wait. Go when it's quiet.
        </div>
      </div>
      <div className="absolute bottom-12 flex gap-1.5">
        {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full wl-dot-pulse" style={{ background: "var(--color-primary)", animationDelay: `${i*0.18}s` }} />)}
      </div>
    </div>
  );
}

/* ========================== ONBOARDING ========================== */
function Onboarding({ step, onNext, onDone }: { step: number; onNext: () => void; onDone: () => void }) {
  const slides = [
    { tag: "Real-time", title: "See the crowd, before you go", body: "Live wait times and crowd levels at hospitals, banks, cafés, gyms and more — updated every minute by people like you.", emoji: "📡" },
    { tag: "Predictive", title: "AI predicts the best time", body: "We forecast the next 12 hours so you can choose the quietest window for your visit.", emoji: "🧠" },
    { tag: "Smart alerts", title: "We tell you when it's clear", body: "Set a wait threshold once. We'll ping you the moment it drops — no more refreshing.", emoji: "🔔" },
    { tag: "Your time back", title: "Save hours every week", body: "An average WaitLess user reclaims 3h 20m a week. That's a whole movie. Every single week.", emoji: "⏳" },
  ];
  const last = step >= slides.length - 1;
  const s = slides[Math.min(step, slides.length - 1)];

  return (
    <div className="absolute inset-0 flex flex-col px-6 pt-16 pb-10 wl-fade-up" key={step}>
      <div className="flex items-center justify-between mb-12">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--color-muted-foreground)" }}>{s.tag}</span>
        <button onClick={onDone} className="text-[13px] font-medium" style={{ color: "var(--color-muted-foreground)" }}>Skip</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-28 h-28 rounded-[32px] flex items-center justify-center text-[56px] mb-10 wl-shadow-lg" style={{ background: "var(--color-card)" }}>{s.emoji}</div>
        <h1 className="text-[32px] leading-[1.1] font-bold max-w-[320px]">{s.title}</h1>
        <p className="serif-italic text-[18px] mt-4 max-w-[320px]" style={{ color: "var(--color-muted-foreground)" }}>{s.body}</p>
      </div>
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 28 : 8, background: i === step ? "var(--color-primary)" : "var(--color-border)" }} />
        ))}
      </div>
      <button onClick={() => (last ? onDone() : onNext())} className="w-full h-14 rounded-2xl text-[15px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
        {last ? "Get started" : "Continue"}
      </button>
    </div>
  );
}

/* =========================== HOME =========================== */
function HomeScreen({ places, saved, toggleSave, openDetail, showToast }: {
  places: Place[]; saved: Set<string>; toggleSave: (id: string) => void;
  openDetail: (id: string) => void; showToast: (m: string) => void;
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

  const aiPick = useMemo(() => [...places].sort((a, b) => a.wait - b.wait)[0], [places]);
  const trending = useMemo(() => [...places].sort((a,b) => b.reports - a.reports).slice(0, 4), [places]);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="px-5 pt-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[13px]" style={{ color: "var(--color-muted-foreground)" }}>{greet}</div>
          <div className="text-[26px] font-bold leading-tight">Where to, today?</div>
          <button onClick={refresh} className="mt-1 inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>
            <RefreshCw className={`w-3 h-3 ${refreshing ? "wl-spin" : ""}`} /> Updated {refreshing ? "…" : updated}
          </button>
        </div>
        <button onClick={() => showToast("📍 Hyderabad")} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium wl-card">
          <MapPin className="w-3.5 h-3.5" /> Hyderabad
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-muted-foreground)" }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search places, categories…" className="w-full h-14 pl-11 pr-12 rounded-2xl text-[14px] outline-none" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
        {q && <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--color-muted)" }}><X className="w-3.5 h-3.5" /></button>}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mb-5">
        {CATS.map(c => {
          const active = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)} className="shrink-0 px-4 h-10 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all" style={{ background: active ? "var(--color-primary)" : "var(--color-card)", color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)", border: active ? "none" : "1px solid var(--color-border)" }}>
              <span>{c.emoji}</span> {c.label}
            </button>
          );
        })}
      </div>

      {/* AI Recommendation */}
      <div className="wl-card p-5 mb-5 wl-fade-up" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase opacity-70 mb-2">
          <Sparkles className="w-3 h-3" /> AI Recommendation
        </div>
        <div className="serif-italic text-[22px] leading-tight mb-1">Go now to <span className="underline decoration-[var(--color-accent)] underline-offset-4">{aiPick.name}</span></div>
        <div className="text-[13px] opacity-80">Only {aiPick.wait} min wait · {crowdLabel(aiPick.crowd).toLowerCase()} right now · {aiPick.distance} away</div>
        <button onClick={() => openDetail(aiPick.id)} className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: "var(--color-accent)" }}>
          See why <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Live overview */}
      <SectionTitle>Live overview</SectionTitle>
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatTile label="Quiet" value={places.filter(p => p.wait < 15).length} color="var(--q-free)" />
        <StatTile label="Moderate" value={places.filter(p => p.wait >= 15 && p.wait < 30).length} color="var(--q-medium)" />
        <StatTile label="Busy" value={places.filter(p => p.wait >= 30).length} color="var(--q-busy)" />
      </div>

      {/* Nearby */}
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
            <div className="text-[36px] mb-2">🔍</div>
            <div className="text-[14px] font-semibold mb-1">No results</div>
            <div className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>Try a different search or category.</div>
          </div>
        )}
      </div>

      {/* Trending */}
      <SectionTitle className="mt-8">Trending nearby</SectionTitle>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {trending.map(p => (
          <button key={p.id} onClick={() => openDetail(p.id)} className="shrink-0 w-[160px] wl-card p-4 text-left">
            <div className="text-[28px] mb-2">{p.emoji}</div>
            <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.name}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{p.reports} reports</div>
            <WaitPill wait={p.wait} trend={p.trend} className="mt-3" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-[11px] font-semibold tracking-[0.18em] uppercase mb-3 ${className}`} style={{ color: "var(--color-muted-foreground)" }}>{children}</h2>;
}

function StatTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="wl-card p-3.5">
      <div className="flex items-center gap-1.5 mb-2"><span className="w-1.5 h-1.5 rounded-full wl-dot-pulse" style={{ background: color }} /><span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>{label}</span></div>
      <div className="text-[22px] font-bold leading-none">{value}</div>
    </div>
  );
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
                <Heart className="w-5 h-5 transition-all" style={{ fill: saved ? "var(--color-danger)" : "transparent", color: saved ? "var(--color-danger)" : "var(--color-muted-foreground)" }} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold" style={{ background: c.bg, color: c.text }}>
                {p.wait === 0 ? "No wait 🎉" : <>{p.wait} min {trendIcon(p.trend)}</>}
              </div>
              <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>{crowdLabel(p.crowd)}</span>
            </div>
          </div>
        </div>
        <div className="mt-3.5">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
            <div className="h-full wl-bar-grow rounded-full" style={{ width: `${p.crowd}%`, background: c.solid }} />
          </div>
          <div className="text-[11px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>{p.crowd}% full · {p.crowd > 70 ? "Peak hours now" : p.crowd > 40 ? "Steady flow" : "Plenty of room"}</div>
        </div>
      </button>
    </div>
  );
}

function WaitPill({ wait, trend, className = "" }: { wait: number; trend: Trend; className?: string }) {
  const c = waitColor(wait);
  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${className}`} style={{ background: c.bg, color: c.text }}>
      {wait === 0 ? "No wait" : <>{wait} min {trendIcon(trend)}</>}
    </div>
  );
}

/* ============================ EXPLORE ============================ */
function ExploreScreen({ places, openDetail }: { places: Place[]; openDetail: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | "All">("All");
  const list = filter === "All" ? places : places.filter(p => p.category === filter);
  const sel = selected ? places.find(p => p.id === selected) : null;

  return (
    <div className="relative h-[calc(100vh-88px)]">
      {/* Stylised map */}
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

      {/* Top header + filters */}
      <div className="absolute top-0 inset-x-0 z-10 px-5 pt-12 pb-3" style={{ background: "linear-gradient(180deg, rgba(247,245,239,0.95) 0%, rgba(247,245,239,0) 100%)" }}>
        <div className="text-[22px] font-bold mb-3">Explore</div>
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

      {/* Pins */}
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

      {/* My location FAB */}
      <button className="absolute bottom-5 right-5 z-10 w-12 h-12 rounded-full flex items-center justify-center wl-shadow-lg" style={{ background: "var(--color-card)" }}>
        <Navigation className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
      </button>

      {/* Mini card */}
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
            View details <ChevronRight className="w-4 h-4" />
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
      <div className="text-[26px] font-bold leading-tight">My Alerts</div>
      <p className="serif-italic text-[16px] mt-1 mb-6" style={{ color: "var(--color-muted-foreground)" }}>We'll notify you when conditions match.</p>

      {triggered.map(a => {
        const p = places.find(x => x.id === a.placeId)!;
        return (
          <div key={a.id} className="wl-card p-4 mb-3 wl-fade-up" style={{ background: "var(--q-free-bg)", border: "1px solid color-mix(in oklab, var(--q-free) 30%, transparent)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--q-free)" }}>
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold" style={{ color: "var(--q-free-text)" }}>{p.name} — wait dropped to {p.wait} min</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--q-free-text)", opacity: 0.8 }}>Just now</div>
                <button onClick={() => openDetail(p.id)} className="mt-2 text-[12px] font-semibold inline-flex items-center gap-1" style={{ color: "var(--q-free-text)" }}>View details <ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        );
      })}

      {alerts.length === 0 ? (
        <div className="wl-card p-10 text-center mt-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "var(--color-muted)" }}>
            <Bell className="w-7 h-7" style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <div className="text-[16px] font-semibold">No alerts yet</div>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Open any place and tap <span className="font-semibold">Alert me</span> to get started.</p>
          <button onClick={() => switchTab("home")} className="mt-5 inline-flex items-center gap-1 px-5 h-11 rounded-full text-[13px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            Explore places <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map(a => {
            const p = places.find(x => x.id === a.placeId);
            if (!p) return null;
            const pct = Math.min(100, (a.threshold / Math.max(p.wait, a.threshold)) * 100);
            const ready = p.wait <= a.threshold;
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
                    <span className="text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>Now {p.wait} min · target {a.threshold} min</span>
                    <button onClick={() => { setAlerts((all: any) => all.filter((x: any) => x.id !== a.id)); showToast("Alert removed"); }} className="text-[11px] font-medium inline-flex items-center gap-1" style={{ color: "var(--color-danger)" }}>
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
            <Heart className="w-7 h-7" style={{ color: "var(--color-muted-foreground)" }} />
          </div>
          <div className="text-[16px] font-semibold">Nothing saved yet</div>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted-foreground)" }}>Tap the heart on any place to save it.</p>
          <button onClick={() => switchTab("home")} className="mt-5 inline-flex items-center gap-1 px-5 h-11 rounded-full text-[13px] font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            Browse places <ChevronRight className="w-4 h-4" />
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
                    <Heart className="w-4 h-4" style={{ fill: "var(--color-danger)", color: "var(--color-danger)" }} />
                  </button>
                </div>
                <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{p.category}</div>
                <WaitPill wait={p.wait} trend={p.trend} className="mt-2.5" />
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
                  <div className="h-full wl-bar-grow rounded-full" style={{ width: `${p.crowd}%`, background: c.solid }} />
                </div>
                <div className="text-[10px] mt-1.5" style={{ color: "var(--color-muted-foreground)" }}>
                  {p.crowd < 40 ? "Quiet — great time" : p.crowd < 70 ? "Moderate" : "Busy — wait it out"}
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
  return (
    <div className="px-5 pt-12">
      <div className="text-[26px] font-bold leading-tight">Profile</div>
      <p className="serif-italic text-[16px] mt-1 mb-6" style={{ color: "var(--color-muted-foreground)" }}>Your time, reclaimed.</p>

      <div className="wl-card p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] font-bold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>RA</div>
        <div className="flex-1">
          <div className="text-[16px] font-semibold">Ravi A.</div>
          <div className="text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>Time Saver · Rank #248</div>
        </div>
        <ChevronRight className="w-5 h-5" style={{ color: "var(--color-muted-foreground)" }} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <BigStat label="Hours saved" value="14h 22m" accent="var(--color-accent)" />
        <BigStat label="Places visited" value="37" />
        <BigStat label="Alerts active" value={String(alertCount)} accent="var(--color-warning)" />
        <BigStat label="Saved" value={String(savedCount)} accent="var(--color-danger)" />
      </div>

      <SectionTitle>Badges</SectionTitle>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 mb-6">
        {[
          { e: "⚡", t: "Early Bird" }, { e: "🧠", t: "Smart Planner" },
          { e: "🤝", t: "Helper" }, { e: "🏆", t: "Streak ×7" },
        ].map(b => (
          <div key={b.t} className="shrink-0 w-[100px] wl-card p-4 text-center">
            <div className="text-[28px]">{b.e}</div>
            <div className="text-[11px] font-semibold mt-1">{b.t}</div>
          </div>
        ))}
      </div>

      <SectionTitle>Settings</SectionTitle>
      <div className="wl-card overflow-hidden">
        {["Notifications", "Privacy", "Theme", "Account", "Help & support"].map((l, i, arr) => (
          <button key={l} className="w-full px-5 py-4 flex items-center justify-between text-[14px] font-medium" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
            {l} <ChevronRight className="w-4 h-4" style={{ color: "var(--color-muted-foreground)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
function BigStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="wl-card p-4">
      <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--color-muted-foreground)" }}>{label}</div>
      <div className="text-[22px] font-bold mt-1.5" style={{ color: accent || "var(--color-foreground)" }}>{value}</div>
    </div>
  );
}

/* ============================ DETAIL ============================ */
function Detail({ place: p, saved, onClose, onToggleSave, onAlert, showToast }: {
  place: Place; saved: boolean; onClose: () => void; onToggleSave: () => void;
  onAlert: () => void; showToast: (m: string) => void;
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

  return (
    <div className="fixed inset-0 z-[100] flex justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="relative w-full max-w-[430px] h-full overflow-y-auto wl-slide-in-right" style={{ background: "var(--color-background)" }}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 pt-12 pb-3" style={{ background: "var(--color-background)" }}>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center wl-card"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center wl-card"><Share2 className="w-4 h-4" /></button>
            <button onClick={onToggleSave} className="w-10 h-10 rounded-full flex items-center justify-center wl-card">
              <Heart className="w-4 h-4" style={{ fill: saved ? "var(--color-danger)" : "transparent", color: saved ? "var(--color-danger)" : "var(--color-foreground)" }} />
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
                <span className="inline-flex items-center gap-0.5"><Star className="w-3 h-3" style={{ fill: "var(--color-warning)", color: "var(--color-warning)" }} />{p.rating}</span>
                <span>·</span><span>{p.category}</span><span>·</span><span>{p.distance}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[12px] font-medium">
                <span className="w-2 h-2 rounded-full wl-dot-pulse" style={{ background: p.open ? "var(--q-free)" : "var(--q-busy)" }} />
                {p.open ? `Open · closes ${p.closes}` : "Closed"}
              </div>
            </div>
          </div>

          {/* Status banner */}
          <div className="rounded-2xl px-4 py-3 mb-5 flex items-center gap-2 text-[13px] font-semibold" style={{ background: c.bg, color: c.text }}>
            <Activity className="w-4 h-4" />
            {crowdLabel(p.crowd)} — {p.crowd > 70 ? "expect a wait" : p.crowd > 40 ? "moderate flow" : "great time to visit"}
          </div>

          {/* Wait time hero */}
          <div className="wl-card p-6 mb-4 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: "var(--color-muted-foreground)" }}>Estimated wait</div>
            <div className="text-[64px] leading-none font-extrabold" style={{ color: c.solid }}>{p.wait}<span className="text-[20px] font-semibold ml-1" style={{ color: "var(--color-muted-foreground)" }}>min</span></div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: p.trend === "up" ? "var(--color-danger)" : p.trend === "down" ? "var(--color-success)" : "var(--color-muted-foreground)" }}>
              {trendIcon(p.trend)} {p.trend === "up" ? "Getting busier" : p.trend === "down" ? "Clearing up" : "Holding steady"}
            </div>
            <div className="mt-1 text-[11px]" style={{ color: "var(--color-muted-foreground)" }}>Based on {reportCount} reports · 3 min ago</div>
          </div>

          {/* Crowd card */}
          <div className="wl-card p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold">Crowd level</span>
              <span className="text-[18px] font-bold" style={{ color: c.solid }}>{p.crowd}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
              <div className="h-full wl-bar-grow rounded-full" style={{ width: `${p.crowd}%`, background: c.solid }} />
            </div>
            <div className="mt-2 text-[12px]" style={{ color: "var(--color-muted-foreground)" }}>
              {p.crowd > 70 ? "Nearly full — consider coming back later" : p.crowd > 40 ? "Steady — manageable wait" : "Quiet right now — great time to visit"}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={onAlert} className="h-14 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              <Bell className="w-4 h-4" /> Alert me
            </button>
            <button onClick={() => { window.open(`https://maps.google.com/?q=${encodeURIComponent(p.address)}`); }} className="h-14 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-1.5" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
              <Navigation className="w-4 h-4" /> Directions
            </button>
          </div>

          {/* Busy times chart */}
          <div className="wl-card p-5 mb-4">
            <div className="text-[13px] font-semibold mb-1">Busy times today</div>
            <div className="text-[11px] mb-4" style={{ color: "var(--color-muted-foreground)" }}>Hourly forecast · 92% confidence</div>
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
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} />
              <span><span className="font-semibold">Best time to visit:</span> 4:00 PM — predicted wait ~8 min.</span>
            </div>
          </div>

          {/* Report */}
          <div className="wl-card p-5 mb-4">
            <div className="text-[13px] font-semibold mb-1">Help others</div>
            <div className="text-[11px] mb-4" style={{ color: "var(--color-muted-foreground)" }}>Report your wait — community data keeps everyone moving.</div>
            <button onClick={imHere} disabled={reportedRecently} className="w-full h-12 rounded-xl text-[14px] font-semibold mb-3 disabled:opacity-50" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              {reportedRecently ? "✓ Reported — thanks!" : "I'm here now"}
            </button>
            <div className="flex gap-2">
              <input type="number" value={actualWait} onChange={e => setActualWait(e.target.value)} placeholder="Actual wait (min)" className="flex-1 h-11 px-3.5 rounded-xl text-[13px] outline-none" style={{ background: "var(--color-muted)" }} />
              <button onClick={confirmWait} className="h-11 px-4 rounded-xl text-[13px] font-semibold" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>Confirm</button>
            </div>
            <div className="text-[11px] mt-3" style={{ color: "var(--color-muted-foreground)" }}>{reportCount} people confirmed in the last hour</div>
          </div>

          {/* Info */}
          <div className="wl-card overflow-hidden">
            <InfoRow icon={<Clock className="w-4 h-4" />} label={p.open ? `Open · closes ${p.closes}` : "Closed"} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label={p.phone} onClick={() => window.open(`tel:${p.phone}`)} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label={p.address} onClick={() => { navigator.clipboard?.writeText(p.address); showToast("Address copied"); }} last />
          </div>
        </div>
      </div>
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

/* ========================== BOTTOM NAV ========================== */
function BottomNav({ tab, setTab, alertCount, savedCount }: { tab: Tab; setTab: (t: Tab) => void; alertCount: number; savedCount: number }) {
  const items: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "home", label: "Home", icon: IconHome },
    { key: "explore", label: "Explore", icon: IconMap },
    { key: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { key: "saved", label: "Saved", icon: Bookmark, badge: savedCount },
    { key: "profile", label: "Profile", icon: IconUser },
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
                <Icon className="w-[22px] h-[22px]" style={{ color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)", strokeWidth: active ? 2.4 : 1.8 }} />
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
