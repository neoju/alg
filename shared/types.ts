export {};

declare global {
  interface Window {
    algoVisualizer__abortId: string | null | undefined;
  }
}

export type SortingItem = {
  value: number;
  key: number;
};
