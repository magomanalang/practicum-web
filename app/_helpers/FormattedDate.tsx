export function toFormattedDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";

  const parts = dateStr.split("/");

  if (parts.length !== 3) return dateStr;

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
}