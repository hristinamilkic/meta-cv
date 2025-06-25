import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCSV<T>(
  data: T[],
  columns: { Header: string; accessor: keyof T }[]
): string {
  const header = columns.map((col) => col.Header).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = row[col.accessor];
        if (typeof val === "boolean") return val ? "Yes" : "No";
        if (val === undefined || val === null) return "";
        return String(val).replace(/"/g, '""');
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
