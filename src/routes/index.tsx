import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home as IconHome,
  Map as IconMap,
  Bell,
  Bookmark,
  Search,
  X,
  ChevronLeft,
  MapPin,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Phone,
  Navigation,
  Check,
  Trash2,
  Plus,
  Minus as IconMinus,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

/* ------------------------------ DATA ------------------------------ */

type Trend = "up" | "down" | "stable";
type Category = "Hospital" | "Bank" | "Gym" | "Café" | "Transit" | "Salon" | "Supermarket";

type Place = {
  id: string;
  name: string;
  category: Category;
  distance: string;
  distanceNum: number;
  wait: number;
  crowd: number;
  trend: Trend;
  hours: string;
  address: string;
  phone: string;
  reports: number;
  reportedAgo: number; // minutes
};

const CATEGORIES: { key: Category | "All"; emoji: string; label: string }[] = [
  { key: "All", emoji: "✨", label: "All" },
  { key: "Hospital", emoji: "🏥", label: "Hospital" },
  { key: "Bank", emoji: "🏦", label: "Bank" },
  { key: "Gym", emoji: "💪", label: "Gym" },
  { key: "Café", emoji: "☕", label: "Café" },
  { key: "Transit", emoji: "🚌", label: "Transit" },
  { key: "Salon", emoji: "✂️", label: "Salon" },
];

const PLACES: Place[] = [
  { id: "p1", name: "Apollo Hospital", category: "Hospital", distance: "0.8 km", distanceNum: 0.8, wait: 28, crowd: 72, trend: "up", hours: "Open 24 hrs", address: "Jubilee Hills, Hyderabad", phone: "+91 40 2360 7777", reports: 18, reportedAgo: 5 },
  { id: "p2", name: "Axis Bank", category: "Bank", distance: "1.2 km", distanceNum: 1.2, wait: 12, crowd: 45, trend: "down", hours: "Open · closes 5 PM", address: "Banjara Hills Rd 12", phone: "+91 40 6611 2233", reports: 9, reportedAgo: 3 },
  { id: "p3", name: "FitZone Gym", category: "Gym", distance: "0.5 km", distanceNum: 0.5, wait: 3, crowd: 18, trend: "down", hours: "Open · closes 10 PM", address: "Madhapur Main Rd", phone: "+91 90000 12121", reports: 22, reportedAgo: 2 },
  { id: "p4", name: "Café Coffee Day", category: "Café", distance: "0.3 km", distanceNum: 0.3, wait: 5, crowd: 30, trend: "stable", hours: "Open · closes 11 PM", address: "HITEC City Phase 2", phone: "+91 40 1234 5678", reports: 12, reportedAgo: 6 },
  { id: "p5", name: "SBI Bank", category: "Bank", distance: "2.1 km", distanceNum: 2.1, wait: 35, crowd: 85, trend: "up", hours: "Open · closes 4 PM", address: "Ameerpet Branch", phone: "+91 40 2374 5566", reports: 24, reportedAgo: 4 },
  { id: "p6", name: "Manipal Hospital", category: "Hospital", distance: "3.4 km", distanceNum: 3.4, wait: 8, crowd: 25, trend: "down", hours: "Open 24 hrs", address: "Tadbund X Rd", phone: "+91 40 6600 0000", reports: 7, reportedAgo: 9 },
  { id: "p7", name: "Gold's Gym", category: "Gym", distance: "1.8 km", distanceNum: 1.8, wait: 0, crowd: 10, trend: "stable", hours: "Open · closes 10 PM", address: "Kondapur", phone: "+91 90000 22233", reports: 5, reportedAgo: 11 },
  { id: "p8", name: "Starbucks", category: "Café", distance: "0.9 km", distanceNum: 0.9, wait: 7, crowd: 55, trend: "up", hours: "Open · closes 10 PM", address: "Inorbit Mall", phone: "+91 40 4455 7788", reports: 14, reportedAgo: 1 },
];

const CATEGORY_EMOJI: Record<Category, string> =
  { Hospital: "🏥", Bank: "🏦", Gym: "💪", Café: "☕", Transit: "🚌", Salon: "✂️", Supermarket: "🛒" };

/* ----------------------------- HELPERS ---------------------------- */

function waitLevel(w: number) {
  if (w <= 14) return "free" as const;
  if (w <= 29) return "medium" as const;
  return "busy" as const;
}
function crowdLevel(c: number) {
  if (c < 40) return "free" as const;
  if (c < 70) return "medium" as const;
  return "busy" as const;
}
function levelClasses(l: "free" | "medium" | "busy") {
  if (l === "free") return { bg: "bg-q-free-bg", text: "text-q-free-text", fill: "bg-q-free", solid: "#22c55e" };
  if (l === "medium") return { bg: "bg-q-medium-bg", text: "text-q-medium-text", fill: "bg-q-medium", solid: "#f59e0b" };
  return { bg: "bg-q-busy-bg", text: "text-q-busy-text", fill: "bg-q-busy", solid: "#ef4444" };
}
function statusLabel(c: number) {
  if (c < 40) return "Quiet";
  if (c < 70) return "Moderate";
  if (c < 85) return "Busy";
  return "Very Busy";
}

/* ----------------------------- TOAST ------------------------------ */

let toastSeq = 0;
type Toast = { id: number; msg: string };
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function push(msg: string) {
    const id = ++toastSeq;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(15);
  }
  return { toasts, push };
}

/* ------------------------------ APP ------------------------------- */

type Tab = "home" | "map" | "alerts" | "saved";
type Alert = { id: string; placeId: string; threshold: number; alsoBusy: boolean; daily: boolean; enabled: boolean };

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set(["p3"]));
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "a1", placeId: "p1", threshold: 15, alsoBusy: true, daily: false, enabled: true },
  ]);
  const [triggered, setTriggered] = useState<{ id: string; placeId: string; wait: number; at: string } | null>(
    { id: "t1", placeId: "p3", wait: 3, at: "Just now" }
  );
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const { toasts, push } = useToasts();

  // auto-refresh
  useEffect(() => {
    const t = setInterval(() => setLastRefresh(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(Date.now());
      push("Updated just now");
    }, 700);
  }

  function toggleSave(id: string) {
    setSaved((s) => {
      const n = new Set(s);
      if (n.has(id)) { n.delete(id); push("Removed from saved"); }
      else { n.add(id); push("✅ Saved to your list"); }
      return n;
    });
  }

  function setAlertFor(placeId: string, threshold: number, alsoBusy: boolean, daily: boolean) {
    const p = PLACES.find((x) => x.id === placeId)!;
    setAlerts((a) => {
      const existing = a.find((x) => x.placeId === placeId);
      if (existing) return a.map((x) => x.placeId === placeId ? { ...x, threshold, alsoBusy, daily, enabled: true } : x);
      return [...a, { id: `a${Date.now()}`, placeId, threshold, alsoBusy, daily, enabled: true }];
    });
    push(`🔔 Alert set for ${p.name}`);
  }

  const detailPlace = detailId ? PLACES.find((p) => p.id === detailId) ?? null : null;

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-background pb-24 overflow-hidden">
        {/* Detail overlay */}
        {detailPlace && (
          <PlaceDetail
            place={detailPlace}
            onBack={() => setDetailId(null)}
            saved={saved.has(detailPlace.id)}
            onSave={() => toggleSave(detailPlace.id)}
            onSetAlert={(t, ab, d) => setAlertFor(detailPlace.id, t, ab, d)}
            onReport={() => push("Thanks for your report!")}
          />
        )}

        {!detailPlace && (
          <>
            {tab === "home" && (
              <HomeScreen
                onOpen={setDetailId}
                onSave={toggleSave}
                saved={saved}
                lastRefresh={lastRefresh}
                refreshing={refreshing}
                onRefresh={refresh}
              />
            )}
            {tab === "map" && <MapScreen onOpen={setDetailId} />}
            {tab === "alerts" && (
              <AlertsScreen
                alerts={alerts}
                setAlerts={setAlerts}
                triggered={triggered}
                dismissTriggered={() => setTriggered(null)}
                onOpen={setDetailId}
              />
            )}
            {tab === "saved" && (
              <SavedScreen saved={saved} onOpen={setDetailId} onRemove={toggleSave} onBrowse={() => setTab("home")} />
            )}
          </>
        )}

        {!detailPlace && <TabBar tab={tab} setTab={setTab} alertCount={alerts.filter((a) => a.enabled).length} />}

        {/* Toasts */}
        <div className="fixed bottom-28 left-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none" style={{ transform: "translateX(-50%)" }}>
          {toasts.map((t) => (
            <div key={t.id} className="lq-toast bg-foreground text-background text-[13px] font-medium px-4 py-2.5 rounded-full lq-shadow-lg whitespace-nowrap">
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- TAB BAR ----------------------------- */

function TabBar({ tab, setTab, alertCount }: { tab: Tab; setTab: (t: Tab) => void; alertCount: number }) {
  const items: { key: Tab; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; badge?: number }[] = [
    { key: "home", label: "Home", Icon: IconHome },
    { key: "map", label: "Map", Icon: IconMap },
    { key: "alerts", label: "Alerts", Icon: Bell, badge: alertCount },
    { key: "saved", label: "Saved", Icon: Bookmark },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border z-50">
      <div className="grid grid-cols-4 px-2 pt-2 pb-3">
        {items.map(({ key, label, Icon, badge }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex flex-col items-center gap-1 py-1.5 min-h-[44px] relative"
              aria-label={label}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${active ? "text-accent" : "text-muted-foreground"}`} strokeWidth={active ? 2.4 : 2} />
                {badge ? (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-q-busy text-white text-[10px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[11px] font-semibold ${active ? "text-accent" : "text-muted-foreground"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------- SHARED ATOMS -------------------------- */

function CrowdBar({ pct }: { pct: number }) {
  const l = crowdLevel(pct);
  const c = levelClasses(l);
  return (
    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={`h-full ${c.fill} rounded-full transition-all`} style={{ width: `${Math.max(4, pct)}%` }} />
    </div>
  );
}

function WaitBadge({ wait, trend, size = "md" }: { wait: number; trend?: Trend; size?: "md" | "lg" }) {
  const l = waitLevel(wait);
  const c = levelClasses(l);
  const T = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div className={`inline-flex items-center gap-1 rounded-full font-semibold ${c.bg} ${c.text} ${size === "lg" ? "px-3 py-1.5 text-[14px]" : "px-2.5 py-1 text-[12px]"}`}>
      {wait === 0 ? "No wait" : `${wait} min`}
      {trend && <T className="w-3 h-3" strokeWidth={2.5} />}
    </div>
  );
}

function CategoryIcon({ cat }: { cat: Category }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
      {CATEGORY_EMOJI[cat]}
    </div>
  );
}

function LiveDot({ color = "#ef4444" }: { color?: string }) {
  return (
    <span className="relative inline-block w-2 h-2 rounded-full" style={{ color }}>
      <span className="absolute inset-0 rounded-full" style={{ background: color }} />
      <span className="lq-pulse-dot absolute inset-0 rounded-full" style={{ color }} />
    </span>
  );
}

/* --------------------------- HOME -------------------------------- */

function HomeScreen({
  onOpen, onSave, saved, lastRefresh, refreshing, onRefresh,
}: {
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
  saved: Set<string>;
  lastRefresh: number;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"near" | "short" | "long">("near");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const minsAgo = Math.max(0, Math.floor((Date.now() - lastRefresh) / 60000));

  const list = useMemo(() => {
    let l = PLACES.slice();
    if (cat !== "All") l = l.filter((p) => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === "near") l.sort((a, b) => a.distanceNum - b.distanceNum);
    if (sort === "short") l.sort((a, b) => a.wait - b.wait);
    if (sort === "long") l.sort((a, b) => b.wait - a.wait);
    return l;
  }, [query, cat, sort]);

  // pull to refresh (simple)
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY === 0) startY.current = e.touches[0].clientY;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startY.current != null) {
      const d = e.touches[0].clientY - startY.current;
      if (d > 0) setPull(Math.min(80, d));
    }
  }
  function onTouchEnd() {
    if (pull > 60) onRefresh();
    setPull(0); startY.current = null;
  }

  return (
    <div className="lq-fade-in" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {pull > 0 && (
        <div className="flex justify-center pt-2" style={{ height: pull }}>
          <RefreshCw className={`w-5 h-5 text-accent ${pull > 60 ? "lq-spin" : ""}`} />
        </div>
      )}

      {/* Header */}
      <header className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">LiveQ</h1>
            <button onClick={onRefresh} className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <RefreshCw className={`w-3 h-3 ${refreshing ? "lq-spin" : ""}`} />
              <span>Updated {minsAgo === 0 ? "just now" : `${minsAgo} min ago`} · tap to refresh</span>
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card lq-shadow text-[12px] font-medium min-h-[36px]">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            Hyderabad
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospitals, banks, gyms…"
            className="w-full h-12 pl-10 pr-10 rounded-2xl bg-card border border-border text-[14px] focus:outline-none focus:border-accent placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="pb-3">
        <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => {
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCat(active ? "All" : c.key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium min-h-[36px] transition-colors ${active ? "bg-accent text-accent-foreground" : "bg-card border border-border text-foreground"}`}
              >
                <span className="text-base leading-none">{c.emoji}</span> {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div className="px-5 pb-2 flex items-center gap-3 text-[12px]">
        <span className="text-muted-foreground">Sort by:</span>
        {([
          ["near", "Nearest"],
          ["short", "Shortest wait"],
          ["long", "Longest wait"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            className={`font-medium ${sort === k ? "text-accent underline underline-offset-4" : "text-muted-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-5 pt-3 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="lq-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl lq-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 rounded lq-shimmer" />
                  <div className="h-3 w-1/3 rounded lq-shimmer" />
                </div>
              </div>
              <div className="h-1.5 mt-4 rounded-full lq-shimmer" />
            </div>
          ))
        ) : list.length === 0 ? (
          <div className="lq-card p-8 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <div className="font-semibold text-[15px]">No places found nearby</div>
            <div className="text-[13px] text-muted-foreground mt-1">Try a different category or search.</div>
            <button onClick={() => { setQuery(""); setCat("All"); }} className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-[13px] font-semibold min-h-[40px]">
              <MapPin className="w-4 h-4" /> Change location
            </button>
          </div>
        ) : (
          list.map((p) => (
            <PlaceCard
              key={p.id}
              place={p}
              onOpen={() => onOpen(p.id)}
              saved={saved.has(p.id)}
              onSave={() => onSave(p.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PlaceCard({ place, onOpen, saved, onSave }: { place: Place; onOpen: () => void; saved: boolean; onSave: () => void; }) {
  const cl = crowdLevel(place.crowd);
  const c = levelClasses(cl);
  const isPeak = place.crowd >= 70;
  // swipe-right to save
  const sx = useRef<number | null>(null);
  const lp = useRef<number | null>(null);
  function ts(e: React.TouchEvent) { sx.current = e.touches[0].clientX; lp.current = window.setTimeout(() => { if (!saved) onSave(); }, 550); }
  function te(e: React.TouchEvent) {
    if (lp.current) { clearTimeout(lp.current); lp.current = null; }
    if (sx.current != null) {
      const dx = e.changedTouches[0].clientX - sx.current;
      if (dx > 70 && !saved) onSave();
    }
    sx.current = null;
  }
  return (
    <button
      onClick={onOpen}
      onTouchStart={ts}
      onTouchEnd={te}
      className="lq-card w-full p-4 text-left active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3">
        <CategoryIcon cat={place.category} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-semibold text-[15px] truncate">{place.name}</div>
            {saved && <Heart className="w-3.5 h-3.5 text-q-busy fill-q-busy shrink-0" />}
          </div>
          <div className="text-[12px] text-muted-foreground truncate">{place.category} · {place.distance}</div>
        </div>
        <WaitBadge wait={place.wait} trend={place.trend} />
      </div>
      <div className="mt-3">
        <CrowdBar pct={place.crowd} />
        <div className={`mt-1.5 text-[11px] ${c.text} font-medium`}>
          {place.crowd}% full{isPeak ? " · Peak hours now" : ""}
        </div>
      </div>
    </button>
  );
}

/* ----------------------- PLACE DETAIL ---------------------------- */

function PlaceDetail({
  place, onBack, saved, onSave, onSetAlert, onReport,
}: {
  place: Place;
  onBack: () => void;
  saved: boolean;
  onSave: () => void;
  onSetAlert: (threshold: number, alsoBusy: boolean, daily: boolean) => void;
  onReport: () => void;
}) {
  const status = statusLabel(place.crowd);
  const statusLevel = place.crowd >= 70 ? "busy" : place.crowd >= 40 ? "medium" : "free";
  const sCls = levelClasses(statusLevel);
  const wCls = levelClasses(waitLevel(place.wait));
  const [showAlert, setShowAlert] = useState(false);
  const [actual, setActual] = useState(0);
  const [reported, setReported] = useState(false);

  // peak chart hours
  const hours = [8,9,10,11,12,13,14,15,16,17,18,19,20];
  const heights = [25, 40, 70, 90, 75, 50, 35, 45, 65, 85, 95, 70, 40];
  const nowHour = 14;

  return (
    <div className="absolute inset-0 z-40 bg-background overflow-y-auto pb-28 lq-slide-in-right">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-3 py-3 flex items-center justify-between border-b border-border">
        <button onClick={onBack} className="w-11 h-11 rounded-full flex items-center justify-center bg-card lq-shadow" aria-label="Back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={onSave} className="w-11 h-11 rounded-full flex items-center justify-center bg-card lq-shadow" aria-label="Save">
          <Heart className={`w-5 h-5 ${saved ? "text-q-busy fill-q-busy" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="px-5 pt-4">
        {/* Hero */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-3xl">{CATEGORY_EMOJI[place.category]}</div>
          <div className="flex-1">
            <h1 className="text-[22px] font-bold leading-tight">{place.name}</h1>
            <div className="flex items-center flex-wrap gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded-full bg-muted text-[11px] font-medium">{place.category}</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${sCls.bg} ${sCls.text} text-[11px] font-semibold`}>
                {status === "Very Busy" && <LiveDot color={sCls.solid} />}
                {status}
              </span>
            </div>
            <div className="text-[12px] text-muted-foreground mt-1">{place.distance} · {place.hours}</div>
          </div>
        </div>

        {/* Wait block */}
        <div className="lq-card mt-5 p-6 text-center">
          <div className={`text-[64px] leading-none font-extrabold ${wCls.text}`} style={{ fontFamily: "Outfit" }}>
            {place.wait === 0 ? "0" : place.wait}
          </div>
          <div className="text-[13px] text-muted-foreground mt-1">min estimated wait</div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium">
            {place.trend === "up" ? <><TrendingUp className="w-4 h-4 text-q-busy" /><span className="text-q-busy-text">Getting busier</span></> :
              place.trend === "down" ? <><TrendingDown className="w-4 h-4 text-q-free" /><span className="text-q-free-text">Clearing up</span></> :
              <><Minus className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Holding steady</span></>}
          </div>
          <div className="mt-3 inline-block px-2.5 py-1 rounded-full bg-muted text-[11px] text-muted-foreground">
            Based on {place.reports} reports · {place.reportedAgo} min ago
          </div>
        </div>

        {/* Crowd level */}
        <div className="lq-card mt-3 p-4">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold">Crowd level</div>
            <div className={`text-[14px] font-bold ${sCls.text}`}>{place.crowd}%</div>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
            <div className={`h-full ${sCls.fill} rounded-full`} style={{ width: `${place.crowd}%` }} />
          </div>
          <div className={`mt-2 text-[12px] ${sCls.text}`}>
            {place.crowd >= 70 ? "Nearly full — consider coming back later" :
             place.crowd >= 40 ? "Moderate crowd — manageable wait" :
             "Quiet right now — great time to visit"}
          </div>
        </div>

        {/* Peak hours */}
        <div className="lq-card mt-3 p-4">
          <div className="text-[13px] font-semibold mb-3">Busy times today</div>
          <div className="flex items-end justify-between gap-1 h-24">
            {heights.map((h, i) => {
              const lvl = h >= 75 ? "busy" : h >= 45 ? "medium" : "free";
              const cl = levelClasses(lvl);
              const isNow = hours[i] === nowHour;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className={`w-full rounded-t ${cl.fill} ${isNow ? "ring-2 ring-accent ring-offset-1 ring-offset-card" : ""}`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>8a</span><span>10a</span><span>12p</span><span>2p</span><span>4p</span><span>6p</span><span>8p</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={() => setShowAlert(true)} className="h-12 rounded-lg bg-accent text-accent-foreground font-semibold text-[14px] flex items-center justify-center gap-2 min-h-[44px]">
            <Bell className="w-4 h-4" /> Alert me
          </button>
          <button className="h-12 rounded-lg bg-card border border-border font-semibold text-[14px] flex items-center justify-center gap-2 min-h-[44px]">
            <Navigation className="w-4 h-4 text-accent" /> Directions
          </button>
        </div>

        {/* Report */}
        <div className="lq-card mt-4 p-4">
          <div className="text-[14px] font-semibold">Help others — report your wait</div>
          <div className="text-[12px] text-muted-foreground mt-0.5">One tap confirms you're here right now.</div>
          <button
            onClick={() => { setReported(true); onReport(); }}
            className={`mt-3 w-full h-12 rounded-lg font-semibold text-[14px] flex items-center justify-center gap-2 min-h-[44px] ${reported ? "bg-q-free-bg text-q-free-text" : "bg-foreground text-background"}`}
          >
            {reported ? <><Check className="w-4 h-4" /> Reported — thanks!</> : <>📍 I'm here now</>}
          </button>

          <div className="mt-3 flex items-center gap-2">
            <div className="text-[12px] text-muted-foreground flex-1">Actual wait:</div>
            <button onClick={() => setActual(Math.max(0, actual - 1))} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center"><IconMinus className="w-4 h-4" /></button>
            <div className="w-14 text-center font-semibold">{actual} min</div>
            <button onClick={() => setActual(actual + 1)} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            <button onClick={() => { onReport(); setActual(0); }} className="ml-1 px-3 h-9 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold">Confirm</button>
          </div>
          <div className="text-[11px] text-muted-foreground mt-3">14 people confirmed this in the last hour</div>
        </div>

        {/* Info */}
        <div className="lq-card mt-4 p-4 space-y-3">
          <div className="text-[14px] font-semibold">Info</div>
          <InfoRow label="Hours" value={place.hours} />
          <InfoRow label="Phone" value={place.phone} icon={<Phone className="w-4 h-4 text-accent" />} action={`tel:${place.phone.replace(/\s/g, "")}`} />
          <InfoRow label="Address" value={place.address} icon={<MapPin className="w-4 h-4 text-accent" />} onClick={() => navigator.clipboard?.writeText(place.address)} />
        </div>
      </div>

      {showAlert && (
        <AlertSheet
          place={place}
          onClose={() => setShowAlert(false)}
          onConfirm={(t, ab, d) => { onSetAlert(t, ab, d); setShowAlert(false); }}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value, icon, action, onClick }: { label: string; value: string; icon?: React.ReactNode; action?: string; onClick?: () => void }) {
  const content = (
    <div className="flex items-center justify-between gap-3 min-h-[44px]">
      <div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="text-[13px] font-medium">{value}</div>
      </div>
      {icon}
    </div>
  );
  if (action) return <a href={action} className="block">{content}</a>;
  if (onClick) return <button onClick={onClick} className="w-full text-left">{content}</button>;
  return content;
}

/* ------------------------ ALERT SHEET ---------------------------- */

function AlertSheet({ place, onClose, onConfirm }: { place: Place; onClose: () => void; onConfirm: (t: number, ab: boolean, daily: boolean) => void }) {
  const [threshold, setThreshold] = useState(15);
  const [alsoBusy, setAlsoBusy] = useState(true);
  const [daily, setDaily] = useState(false);
  // swipe down to dismiss
  const sy = useRef<number | null>(null);
  const [dy, setDy] = useState(0);
  return (
    <div className="fixed inset-0 z-[80] flex items-end">
      <div className="absolute inset-0 bg-black/40 lq-fade-in" onClick={onClose} />
      <div
        className="relative w-full max-w-[430px] mx-auto bg-card rounded-t-3xl p-5 pb-8 lq-slide-up lq-shadow-lg"
        style={{ transform: `translateY(${dy}px)` }}
        onTouchStart={(e) => { sy.current = e.touches[0].clientY; }}
        onTouchMove={(e) => { if (sy.current != null) { const d = e.touches[0].clientY - sy.current; if (d > 0) setDy(d); } }}
        onTouchEnd={() => { if (dy > 80) onClose(); else setDy(0); sy.current = null; }}
      >
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />
        <h2 className="text-[18px] font-bold">Set wait alert for {place.name}</h2>
        <p className="text-[12px] text-muted-foreground mt-1">We'll ping you the moment things change.</p>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium">Notify me when wait drops below</span>
            <span className="text-[15px] font-bold text-accent">{threshold} min</span>
          </div>
          <input
            type="range" min={1} max={60} step={1} value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full mt-3 accent-[#0ea5e9]"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>1 min</span><span>60 min</span></div>
        </div>

        <ToggleRow label="Also alert if it gets very busy (>70%)" value={alsoBusy} onChange={setAlsoBusy} />
        <ToggleRow label="Repeat daily at best time" value={daily} onChange={setDaily} />

        <button
          onClick={() => onConfirm(threshold, alsoBusy, daily)}
          className="mt-5 w-full h-12 rounded-lg bg-accent text-accent-foreground font-semibold text-[14px] min-h-[44px]"
        >
          Set Alert
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="mt-4 w-full flex items-center justify-between min-h-[44px]">
      <span className="text-[13px] text-left pr-3">{label}</span>
      <span className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-accent" : "bg-muted"}`}>
        <span className={`absolute top-0.5 ${value ? "left-5" : "left-0.5"} w-5 h-5 rounded-full bg-white lq-shadow transition-all`} />
      </span>
    </button>
  );
}

/* ----------------------------- MAP ------------------------------- */

function MapScreen({ onOpen }: { onOpen: (id: string) => void }) {
  const [cat, setCat] = useState<Category | "All">("All");
  const [activeId, setActiveId] = useState<string | null>(null);
  const list = cat === "All" ? PLACES : PLACES.filter((p) => p.category === cat);
  const active = activeId ? PLACES.find((p) => p.id === activeId) ?? null : null;

  // pseudo-positions (deterministic)
  const positions = useMemo(() => {
    return list.map((p, i) => ({
      id: p.id,
      top: 18 + ((i * 53) % 62),
      left: 12 + ((i * 37) % 72),
    }));
  }, [list]);

  return (
    <div className="lq-fade-in relative h-screen">
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e2eef7] to-[#cfe1ef] dark:from-[#0b1626] dark:to-[#0e1f33]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* fake roads */}
        <div className="absolute top-1/3 left-0 right-0 h-3 bg-card/70 -rotate-3" />
        <div className="absolute top-2/3 left-0 right-0 h-2 bg-card/60 rotate-6" />
        <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-card/60 rotate-12" />
      </div>

      {/* Category chips overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-4 pb-2">
        <div className="px-4">
          <div className="bg-card/90 backdrop-blur rounded-2xl p-2 lq-shadow">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((c) => {
                const active = cat === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setCat(active ? "All" : c.key)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium ${active ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}
                  >
                    <span>{c.emoji}</span>{c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pins */}
      {positions.map(({ id, top, left }) => {
        const p = list.find((x) => x.id === id)!;
        const lvl = waitLevel(p.wait);
        const c = levelClasses(lvl);
        return (
          <button
            key={id}
            onClick={() => setActiveId(id)}
            className="absolute z-10"
            style={{ top: `${top}%`, left: `${left}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className={`relative w-11 h-11 rounded-full ${c.fill} text-white font-bold flex items-center justify-center lq-shadow-lg border-2 border-white text-[12px]`}>
              {p.wait}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent" style={{ borderTopColor: c.solid }} />
            </div>
          </button>
        );
      })}

      {/* My location */}
      <button className="absolute bottom-32 right-5 z-20 w-12 h-12 rounded-full bg-card lq-shadow-lg flex items-center justify-center" aria-label="My location">
        <Navigation className="w-5 h-5 text-accent" />
      </button>
      <div className="absolute top-[55%] left-[45%] z-10">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-accent border-2 border-white lq-shadow" />
          <div className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
        </div>
      </div>

      {/* Mini card */}
      {active && (
        <div className="absolute bottom-24 left-4 right-4 z-30 lq-card p-4 lq-slide-up">
          <div className="flex items-center gap-3">
            <CategoryIcon cat={active.category} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] truncate">{active.name}</div>
              <div className="text-[12px] text-muted-foreground">{active.category} · {active.distance}</div>
            </div>
            <WaitBadge wait={active.wait} trend={active.trend} />
          </div>
          <div className="mt-3"><CrowdBar pct={active.crowd} /></div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setActiveId(null)} className="flex-1 h-10 rounded-lg bg-muted text-[13px] font-semibold">Close</button>
            <button onClick={() => onOpen(active.id)} className="flex-1 h-10 rounded-lg bg-accent text-accent-foreground text-[13px] font-semibold">View details</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- ALERTS ----------------------------- */

function AlertsScreen({
  alerts, setAlerts, triggered, dismissTriggered, onOpen,
}: {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  triggered: { id: string; placeId: string; wait: number; at: string } | null;
  dismissTriggered: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="lq-fade-in pt-5 px-5">
      <h1 className="text-[22px] font-bold">My Alerts</h1>
      <p className="text-[12px] text-muted-foreground mt-0.5">We'll notify you when conditions match.</p>

      {triggered && (() => {
        const p = PLACES.find((x) => x.id === triggered.placeId)!;
        return (
          <div className="mt-4 rounded-2xl bg-q-free-bg p-4 flex items-start gap-3 lq-fade-in">
            <div className="w-9 h-9 rounded-full bg-q-free text-white flex items-center justify-center font-bold">✓</div>
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-q-free-text">{p.name} — wait dropped to {triggered.wait} min</div>
              <div className="text-[11px] text-q-free-text/80 mt-0.5">{triggered.at}</div>
              <button onClick={() => onOpen(p.id)} className="text-[12px] font-semibold text-q-free-text underline mt-2">View place →</button>
            </div>
            <button onClick={dismissTriggered} className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center"><X className="w-4 h-4 text-q-free-text" /></button>
          </div>
        );
      })()}

      <div className="mt-5 space-y-3">
        {alerts.length === 0 ? (
          <div className="lq-card p-8 text-center">
            <div className="text-5xl mb-3">🔔</div>
            <div className="font-semibold">No alerts set yet</div>
            <div className="text-[12px] text-muted-foreground mt-1">Open a place and tap "Alert me" to get notified.</div>
          </div>
        ) : alerts.map((a) => {
          const p = PLACES.find((x) => x.id === a.placeId);
          if (!p) return null;
          const progress = Math.min(100, Math.max(0, ((a.threshold * 2 - p.wait) / (a.threshold * 2)) * 100));
          return <AlertRow key={a.id} place={p} alert={a} progress={progress} onOpen={() => onOpen(p.id)}
            onToggle={() => setAlerts((all) => all.map((x) => x.id === a.id ? { ...x, enabled: !x.enabled } : x))}
            onDelete={() => setAlerts((all) => all.filter((x) => x.id !== a.id))}
          />;
        })}
      </div>
    </div>
  );
}

function AlertRow({ place, alert, progress, onOpen, onToggle, onDelete }: { place: Place; alert: Alert; progress: number; onOpen: () => void; onToggle: () => void; onDelete: () => void; }) {
  const [dx, setDx] = useState(0);
  const sx = useRef<number | null>(null);
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-y-0 right-0 w-24 bg-q-busy flex items-center justify-center">
        <button onClick={onDelete} className="text-white"><Trash2 className="w-5 h-5" /></button>
      </div>
      <div
        className="relative lq-card p-4"
        style={{ transform: `translateX(${dx}px)`, transition: dx === 0 ? "transform 200ms" : "none" }}
        onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
        onTouchMove={(e) => { if (sx.current != null) { const d = e.touches[0].clientX - sx.current; if (d < 0) setDx(Math.max(-96, d)); } }}
        onTouchEnd={() => { if (dx < -60) setDx(-96); else setDx(0); sx.current = null; }}
      >
        <div className="flex items-center gap-3">
          <CategoryIcon cat={place.category} />
          <button onClick={onOpen} className="flex-1 text-left min-w-0">
            <div className="font-semibold text-[15px] truncate">{place.name}</div>
            <div className="text-[12px] text-muted-foreground">Notify when wait &lt; {alert.threshold} min</div>
          </button>
          <button onClick={onToggle} className={`relative w-11 h-6 rounded-full ${alert.enabled ? "bg-accent" : "bg-muted"}`}>
            <span className={`absolute top-0.5 ${alert.enabled ? "left-5" : "left-0.5"} w-5 h-5 rounded-full bg-white lq-shadow transition-all`} />
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span>Current wait {place.wait} min</span>
            <span>Threshold {alert.threshold} min</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- SAVED ----------------------------- */

function SavedScreen({ saved, onOpen, onRemove, onBrowse }: { saved: Set<string>; onOpen: (id: string) => void; onRemove: (id: string) => void; onBrowse: () => void; }) {
  const list = PLACES.filter((p) => saved.has(p.id));
  return (
    <div className="lq-fade-in pt-5 px-5">
      <h1 className="text-[22px] font-bold">Saved places</h1>
      <p className="text-[12px] text-muted-foreground mt-0.5">Quick access to your favourites.</p>

      {list.length === 0 ? (
        <div className="lq-card mt-6 p-8 text-center">
          <div className="text-5xl mb-3">♡</div>
          <div className="font-semibold">Nothing saved yet</div>
          <div className="text-[12px] text-muted-foreground mt-1">Tap ♡ on any place to save it.</div>
          <button onClick={onBrowse} className="mt-4 px-4 h-10 rounded-lg bg-accent text-accent-foreground text-[13px] font-semibold">Browse places</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {list.map((p) => {
            const lp = useRef<number | null>(null);
            return (
              <button
                key={p.id}
                onClick={() => onOpen(p.id)}
                onTouchStart={() => { lp.current = window.setTimeout(() => onRemove(p.id), 600); }}
                onTouchEnd={() => { if (lp.current) clearTimeout(lp.current); }}
                className="lq-card p-3 text-left"
              >
                <div className="flex items-start justify-between">
                  <CategoryIcon cat={p.category} />
                  <WaitBadge wait={p.wait} />
                </div>
                <div className="mt-2 font-semibold text-[13px] truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{p.category} · {p.distance}</div>
                <div className="mt-2"><CrowdBar pct={p.crowd} /></div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
