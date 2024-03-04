import { twMerge } from "tailwind-merge"

export const firstLetterUpperCase = (string = "") => {
  const [fl, ...rest] = string?.split("")
  return [fl?.toUpperCase(), ...rest].join("")
}

export function css(...args) {
  return twMerge(args)
}
