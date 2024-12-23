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

const abortId = "selection-sort";
const description =
  "Selection sort is a sorting algorithm that selects the smallest unsorted item in the list and swaps it with index 0, " +
  "then finds the next smallest and places it into index 1 and so on.";

export function SelectionSortPage() {
  const animSpeed = useAtomValue(animSpeedAtom);
  const animDuration = useAtomValue(animDurationAtom);
  const totalElements = useAtomValue(totalElementsAtom);

  const [isSorting, setIsSorting] = useState(false);
  const [elements, setElements] = useState<SortingItem[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [itemToSwapIdx, setItemToSwapIdx] = useState<number | null>(null);
  const [minItemIdx, setMinItemIdx] = useState<number | null>(null);

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

    const arr = elements.slice();
    for (let i = 0; i < arr.length - 1; i++) {
      let min = i;
      setCursor(i);
      await sleep(animDuration);
      setItemToSwapIdx(i);

      for (let j = i + 1; j < arr.length; j++) {
        // abort sorting if the user presses the stop button
        if (window.algoVisualizer__abortId == abortId) {
          setIsSorting(false);
          setItemToSwapIdx(null);
          setCursor(null);
          return;
        }

        await sleep(animDuration);
        setCursor(j);
        if (arr[j].value < arr[min].value) {
          min = j;
          await sleep(animDuration);
          setMinItemIdx(min);
        }
      }

      if (min !== i) {
        await sleep(animDuration);
        swap(arr, i, min);
        setElements([...arr]);
      }
      await sleep(animDuration);
      setMinItemIdx(null);
      setItemToSwapIdx(null);
    }

    setCursor(null);
    setItemToSwapIdx(null);
    setMinItemIdx(null);
    setIsSorting(false);
  }

  function getClassName(index: number) {
    return cn(
      animSpeed <= 90 && {
        "bg-success": index === itemToSwapIdx,
        "bg-secondary": index === minItemIdx,
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Selection Sort" description={description}>
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
          itemDes={[
            { background: "bg-success", text: "Element to swap" },
            { background: "bg-secondary", text: "Element with min value" },
          ]}
          getElClassName={getClassName}
        />
      </Card>
    </div>
  );
}
