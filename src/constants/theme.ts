export const Colors = {
  primary: "#A30927", // UMM Maroon
  primaryDark: "#7F051C",
  primaryLight: "#FBEAEF",
  secondary: "#0F2042", // Navy
  secondaryLight: "#EEF2F8",

  // Status Colors (Memenuhi WCAG AA contrast)
  status: {
    lulus: {
      text: "#15803D",
      bg: "#DCFCE7",
      border: "#86EFAC",
      badgeText: "#14532D",
    },
    belum_lulus: {
      text: "#B91C1C",
      bg: "#FEE2E2",
      border: "#FCA5A5",
      badgeText: "#7F1D1D",
    },
    ditempuh: {
      text: "#B45309",
      bg: "#FEF3C7",
      border: "#FDE68A",
      badgeText: "#78350F",
    },
  },

  // Tag & Badges
  badgeWajib: {
    text: "#6B21A8",
    bg: "#F3E8FF",
    border: "#D8B4FE",
  },
  badgePilihan: {
    text: "#374151",
    bg: "#F3F4F6",
    border: "#E5E7EB",
  },
  badgePrasyarat: {
    text: "#0369A1",
    bg: "#E0F2FE",
    border: "#BAE6FD",
  },

  // Neutral Colors
  background: "#F8FAFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E2E8F0",
  divider: "#EDF2F7",

  // Text Colors
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",
  textInverse: "#FFFFFF",

  // Interactive feedback
  cardPressed: "#F1F5F9",
};
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Typography = {
  header: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
  },
};
