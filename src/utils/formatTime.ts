function toVNDate(date: Date | string): Date {
  let d = typeof date === "string" ? new Date(date) : date;
  // Nếu chuỗi không có timezone (không có Z hoặc offset), sẽ bị UTC, cần cộng thêm 7 tiếng
  if (
    typeof date === "string" &&
    !date.match(/[zZ]|[+-][0-9]{2}:[0-9]{2}$/) &&
    d.getTimezoneOffset() === 0
  ) {
    d = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  }
  return d;
}

export function formatRelativeTime(date: Date | string): string {
  const now = toVNDate(new Date());
  const d = toVNDate(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000); // seconds
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} tuần`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng`;
  return `${Math.floor(diff / 31536000)} năm`;
}

export function formatFullTime(date: Date | string): string {
  const d = toVNDate(date);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
} 