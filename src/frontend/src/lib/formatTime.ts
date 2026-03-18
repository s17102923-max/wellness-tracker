// IC timestamps are nanoseconds since epoch
export function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
