/** Format decimal hours as `7h 30m`. */
export function formatHoursMinutes(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

/** Format a timestamp's time as `15h 05m` (24h clock). */
export function formatClockHoursMinutes(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
