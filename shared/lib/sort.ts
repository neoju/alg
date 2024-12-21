import { SortingItem } from "@/shared/types";

export function swap<T>(array: T[], i: number, j: number): void {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

export function shuffle<T>(array: T[]): T[] {
  const copy = array.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swap(copy, i, j);
  }

  return copy;
}

export function genBarchartData(length: number): SortingItem[] {
  return Array.from({ length }, (_, index) => ({
    // generate random value between 20 and 320
    // 320 is the maximum height of the bar
    value: Math.floor(Math.random() * (320 - 20) + 20),
    key: index,
  }));
}
