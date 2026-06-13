import { create } from "zustand";

export type SetupPath = "quick" | "full";
export type DailyGoalMinutes = 15 | 30 | 60;

const FULL_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const QUICK_STEPS = [0, 1, 2, 3, 6, 7, 8, 9, 10, 11];

export function getStepSequence(setupPath: SetupPath | null): number[] {
  if (setupPath === "quick") return QUICK_STEPS;
  return FULL_STEPS;
}

export function monthlySavingsLabel(minutes: DailyGoalMinutes): string {
  const map: Record<DailyGoalMinutes, string> = {
    15: "2h 15m",
    30: "4h 12m",
    60: "8h 24m",
  };
  return map[minutes];
}

interface OnboardingState {
  setupPath: SetupPath | null;
  selectedGoal: string | null;
  selectedTimes: string[];
  selectedPlaceTypes: string[];
  savedPlaces: string[];
  dailyGoalMinutes: DailyGoalMinutes;
  locationEnabled: boolean;
  notificationsEnabled: boolean;
  currentStep: number;

  setSetupPath: (path: SetupPath) => void;
  setSelectedGoal: (goal: string) => void;
  toggleTime: (time: string) => void;
  togglePlaceType: (type: string) => void;
  toggleSavedPlace: (place: string) => void;
  setDailyGoalMinutes: (minutes: DailyGoalMinutes) => void;
  setLocationEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  setupPath: null,
  selectedGoal: null,
  selectedTimes: [],
  selectedPlaceTypes: [],
  savedPlaces: [],
  dailyGoalMinutes: 30,
  locationEnabled: false,
  notificationsEnabled: false,
  currentStep: 0,

  setSetupPath: (path) => set({ setupPath: path }),
  setSelectedGoal: (goal) => set({ selectedGoal: goal }),
  toggleTime: (time) =>
    set((s) => ({
      selectedTimes: s.selectedTimes.includes(time)
        ? s.selectedTimes.filter((t) => t !== time)
        : [...s.selectedTimes, time],
    })),
  togglePlaceType: (type) =>
    set((s) => {
      if (s.selectedPlaceTypes.includes(type)) {
        return { selectedPlaceTypes: s.selectedPlaceTypes.filter((t) => t !== type) };
      }
      if (s.selectedPlaceTypes.length >= 5) return s;
      return { selectedPlaceTypes: [...s.selectedPlaceTypes, type] };
    }),
  toggleSavedPlace: (place) =>
    set((s) => ({
      savedPlaces: s.savedPlaces.includes(place)
        ? s.savedPlaces.filter((p) => p !== place)
        : [...s.savedPlaces, place],
    })),
  setDailyGoalMinutes: (minutes) => set({ dailyGoalMinutes: minutes }),
  setLocationEnabled: (enabled) => set({ locationEnabled: enabled }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

  nextStep: () => {
    const { currentStep, setupPath } = get();
    const seq = getStepSequence(setupPath);
    const idx = seq.indexOf(currentStep);
    if (idx < seq.length - 1) set({ currentStep: seq[idx + 1] });
  },

  prevStep: () => {
    const { currentStep, setupPath } = get();
    const seq = getStepSequence(setupPath);
    const idx = seq.indexOf(currentStep);
    if (idx > 0) set({ currentStep: seq[idx - 1] });
  },

  goToStep: (step) => set({ currentStep: step }),
  reset: () =>
    set({
      setupPath: null,
      selectedGoal: null,
      selectedTimes: [],
      selectedPlaceTypes: [],
      savedPlaces: [],
      dailyGoalMinutes: 30,
      locationEnabled: false,
      notificationsEnabled: false,
      currentStep: 0,
    }),
}));
