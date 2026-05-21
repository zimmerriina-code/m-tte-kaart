// Decision-mapping store: lives in sessionStorage only.
// Cleared by browser when tab/window closes — never persisted to disk.

export type Slider = number; // 1..5

export interface SelectedItem {
  key: string;       // option key or "muu:<text>"
  label: string;     // display label
  note: string;      // user explanation (follow-up answer)
}

export interface DecisionData {
  area: string;            // step 1
  areaCustom: string;
  weight: Slider;          // step 2
  confusion: Slider;
  decision: string;        // step 3 — "Ma mõtlen, kas..."
  attractions: SelectedItem[];   // step 4
  holdBacks: SelectedItem[];     // step 5
  affected: SelectedItem[];      // step 6
  values: SelectedItem[];        // step 7 (max 3)
  nonNegotiable: string[]; // step 8
  flexible: string[];
  needsDiscussion: string[];
  ratings: {               // step 9
    valuesFit: Slider;
    intrinsic: Slider;
    longTerm: Slider;
    realism: Slider;
    capability: Slider;
    relationships: Slider;
    testability: Slider;
    stress: Slider;
    regret: Slider;
    info: Slider;
  };
}

export const emptyData = (): DecisionData => ({
  area: "",
  areaCustom: "",
  weight: 3,
  confusion: 3,
  decision: "",
  attractions: [],
  holdBacks: [],
  affected: [],
  values: [],
  nonNegotiable: [],
  flexible: [],
  needsDiscussion: [],
  ratings: {
    valuesFit: 3, intrinsic: 3, longTerm: 3, realism: 3, capability: 3,
    relationships: 3, testability: 3, stress: 3, regret: 3, info: 3,
  },
});

const KEY = "otsuse-kaart-data";

export function loadData(): DecisionData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return emptyData();
    return { ...emptyData(), ...JSON.parse(raw) };
  } catch {
    return emptyData();
  }
}

export function saveData(d: DecisionData) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(d));
}

export function clearData() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
