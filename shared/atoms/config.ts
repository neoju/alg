import { atom } from "jotai";

export const DEFAULT_ANIM_SPEED = 59;
export const animSpeedAtom = atom(DEFAULT_ANIM_SPEED);
export const animDurationAtom = atom((get) => 1000 - get(animSpeedAtom) * 10);

export const DEFAULT_TOTAL_ELEMENTS = 10;
export const totalElementsAtom = atom(DEFAULT_TOTAL_ELEMENTS);
