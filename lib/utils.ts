import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import markdownToTxt from "markdown-to-txt";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Shanghai");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date) {
  // TZ为上海
  return dayjs(date).add(8, "hour").format("YYYY-MM-DD HH:mm:ss");
}

export function getText(text: string) {
  if (!text) return "";
  return markdownToTxt(text);
}
