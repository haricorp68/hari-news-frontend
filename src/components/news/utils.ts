// Hàm tạo id từ content (đơn giản hóa, có thể cải tiến)
export const slugify = (str: string) =>
  (str ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u1EF9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-"); 