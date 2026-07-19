/** "https://www.saco.sa/" -> "saco.sa" */
export function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}
