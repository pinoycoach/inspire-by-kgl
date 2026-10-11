// Inspire library — every line carries its provenance.
// SAMPLE PACK: these are Cash's own KGL lines, gathered from his stated decisions.
// Cash confirms or replaces each one before public launch (status: "sample").

export type Theme = "keep" | "give" | "live" | "enough" | "rest" | "gratitude";

export interface Line {
  id: string;
  text: string;
  source: string; // who said it, and where
  translation: string | null; // null for original English
  publicDomain: boolean; // true = free to print; own lines are owned by KGL
  proofUrl: string | null; // link proving attribution; null for own lines
  themes: Theme[];
  status: "sample" | "approved";
}

export const LIBRARY: Line[] = [
  {
    id: "kgl-001",
    text: "Keep. Give. Live.",
    source: "House creed",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["keep", "give", "live"],
    status: "sample",
  },
  {
    id: "kgl-002",
    text: "Stop when you have enough.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["enough", "keep"],
    status: "sample",
  },
  {
    id: "kgl-003",
    text: "Keep is where it starts.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["keep"],
    status: "sample",
  },
  {
    id: "kgl-004",
    text: "Give now, not tomorrow.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["give"],
    status: "sample",
  },
  {
    id: "kgl-005",
    text: "Live is the direction.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["live"],
    status: "sample",
  },
  {
    id: "kgl-006",
    text: "Not all giving must be announced.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["give", "gratitude"],
    status: "sample",
  },
  {
    id: "kgl-007",
    text: "Doing one without the others leads to chaos.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["keep", "give", "live"],
    status: "sample",
  },
  {
    id: "kgl-008",
    text: "Choosing, not chasing.",
    source: "Keep. Give. Live.",
    translation: null,
    publicDomain: false,
    proofUrl: null,
    themes: ["enough", "rest"],
    status: "sample",
  },
];

export const THEMES: Theme[] = ["keep", "give", "live", "enough", "rest", "gratitude"];

// The five shades. Offered as a choice; never assigned to a person.
export const SHADES = {
  bamboo: { name: "Bamboo", hex: "#3E7A4E" },
  cinnabar: { name: "Cinnabar", hex: "#B8412C" },
  loess: { name: "Loess", hex: "#C79A3E" },
  frost: { name: "Frost", hex: "#ECEDEC" },
  pine: { name: "Pine ink", hex: "#1D2026" },
} as const;
export type ShadeId = keyof typeof SHADES;
export const SHADE_IDS = Object.keys(SHADES) as ShadeId[];

export function lineForDate(isoDate: string): Line {
  // Deterministic: everyone sees the same line on the same day.
  const days = Math.floor(Date.parse(isoDate + "T00:00:00Z") / 86_400_000);
  const i = ((days % LIBRARY.length) + LIBRARY.length) % LIBRARY.length;
  return LIBRARY[i];
}

export function findLines(theme?: Theme, query?: string, limit = 5): Line[] {
  const q = query?.trim().toLowerCase();
  return LIBRARY.filter(
    (l) =>
      (!theme || l.themes.includes(theme)) &&
      (!q || l.text.toLowerCase().includes(q) || l.themes.some((t) => t.includes(q))),
  ).slice(0, limit);
}

export function getLine(id: string): Line | undefined {
  return LIBRARY.find((l) => l.id === id);
}
