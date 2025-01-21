import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// 判断是否是设置页面
export function isValidSettingPage() {
  const metaTags = document.getElementsByTagName('meta')
  const list = Array.from(metaTags)
  return list.some(meta => meta.name === 'author' && meta.content === 'erioifpud')
}