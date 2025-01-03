"use client";

import { useCallback, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { Card } from "@nextui-org/card";
import { cn } from "@nextui-org/theme";

import { PageHeader } from "@/widgets/header";
import { SortingToolbar } from "@/widgets/toolbar";
import { AnimatedBarChart } from "@/widgets/visualizer";

import { SortingItem } from "@/shared/types";
import { sleep } from "@/shared/lib/promise";
import { genBarchartData, shuffle, swap } from "@/shared/lib/sort";
import {
  animDurationAtom,
  animSpeedAtom,
  totalElementsAtom,
} from "@/shared/atoms/config";
import Link from "next/link";

const abortId = "bubble-sort";
const description =
  "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order." +
  "The pass through the list is repeated until the list is sorted." +
  'The algorithm, which is a comparison sort, is named for the way smaller elements "bubble" to the top of the list.' +
  "Although the algorithm is simple, it is too slow and impractical for most problems even when compared to insertion sort." +
  "It can be practical if the input is usually in sort order.";

export function BubbleSortPage() {
  const animSpeed = useAtomValue(animSpeedAtom);
  const animDuration = useAtomValue(animDurationAtom);
  const totalElements = useAtomValue(totalElementsAtom);

  const [isSorting, setIsSorting] = useState(false);
  const [elements, setElements] = useState<SortingItem[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [itemToSwapIdx, setItemToSwapIdx] = useState<number | null>(null);

  const randomElements = useCallback(() => {
    setCursor(null);
    setItemToSwapIdx(null);
    setElements(shuffle(genBarchartData(totalElements)));
  }, [totalElements]);

  useEffect(() => {
    randomElements();
  }, [randomElements]);

  async function sort() {
    if (isSorting) {
      window.algoVisualizer__abortId = abortId;
      return;
    }

    if (window.algoVisualizer__abortId == abortId) {
      window.algoVisualizer__abortId = null;
    }

    setIsSorting(true);

    for (let i = 0; i < elements.length; i++) {
      let swapped = false;

      for (let j = 0; j < elements.length - i - 1; j++) {
        // abort sorting if the user presses the stop button
        if (window.algoVisualizer__abortId == abortId) {
          setIsSorting(false);
          setItemToSwapIdx(null);
          setCursor(null);
          return;
        }

        setCursor(j);
        await sleep(animDuration);
        setItemToSwapIdx(null);

        if (elements[j].value > elements[j + 1].value) {
          setCursor(j + 1);
          await sleep(animDuration);
          setItemToSwapIdx(j + 1);
          await sleep(animDuration);

          // wait for the user to see the swap
          swap(elements, j, j + 1);
          swapped = true;
          setItemToSwapIdx(j);
          setElements([...elements]);
          await sleep(animDuration);
        }
      }

      await sleep(animDuration);
      // if there is no swap in the current pass, the array is already sorted
      if (!swapped) break;
    }

    setCursor(null);
    setItemToSwapIdx(null);
    setIsSorting(false);
  }

  function getClassName(index: number) {
    return cn(
      animSpeed <= 90 && {
        // "bg-secondary": index === cursor,
        "bg-success": index === itemToSwapIdx,
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Bubble Sort" description={description}>
        <p className="text-slate-300 text-sm mt-2">
          Visit the following resource to learn more:{" "}
          <Link
            className=""
            href="https://roadmap.sh/computer-science"
            target="_blank"
          >
            https://roadmap.sh/computer-science
          </Link>
        </p>
      </PageHeader>

      <Card className="p-2">
        <SortingToolbar
          isSorting={isSorting}
          onPressRandom={randomElements}
          onPressSort={sort}
        />

        <AnimatedBarChart
          cursor={cursor}
          elements={elements}
          animDuration={animDuration}
          itemDes={[{ background: "bg-success", text: "Element to swap" }]}
          getElClassName={getClassName}
        />
      </Card>
    </div>
  );
}
