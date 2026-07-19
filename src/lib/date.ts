const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2025-10" -> "Oct 2025" */
export function formatMonth(iso: string) {
  const [year, month] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/**
 * Formats a role's date span. Durations are deliberately not computed:
 * the page is statically generated, so a derived "9 mos" would silently
 * go stale between deploys.
 */
export function formatRange(start: string, end: string | null) {
  return `${formatMonth(start)} - ${end ? formatMonth(end) : "Present"}`;
}
