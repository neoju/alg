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

const abortId = "insertion-sort";
const description =
  "Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time by comparisons. " +
  "It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.";

export function InsertionSortPage() {
  const animSpeed = useAtomValue(animSpeedAtom);
  const animDuration = useAtomValue(animDurationAtom);
  const totalElements = useAtomValue(totalElementsAtom);

  const [isSorting, setIsSorting] = useState(false);
  const [elements, setElements] = useState<SortingItem[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [keyIndex, setKeyIndex] = useState<number | null>(null);

  const randomElements = useCallback(() => {
    setCursor(null);
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

    for (let step = 1; step < elements.length; step++) {
      const key = elements[step];
      let prev = step - 1;
      setCursor(step);
      await sleep(animDuration / 2);
      setKeyIndex(step);
      await sleep(animDuration);

      while (prev >= 0 && key.value < elements[prev].value) {
        if (window.algoVisualizer__abortId == abortId) {
          setKeyIndex(null);
          setCursor(null);
          return;
        }

        setCursor(prev);
        await sleep(animDuration);

        swap(elements, prev, prev + 1);
        setElements([...elements]);
        prev -= 1;
        await sleep(animDuration);
      }

      setElements([...elements]);
      await sleep(animDuration);
    }

    setKeyIndex(null);
    setCursor(null);
    setIsSorting(false);
  }

  function getClassName(index: number) {
    return cn(
      animSpeed <= 90 && {
        "bg-primary": index === keyIndex,
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Insertion Sort" description={description}>
        <p className="text-slate-300 text-sm mt-2">
          Visit the following resource to learn more:{" "}
          <Link href="https://roadmap.sh/computer-science" target="_blank">
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
          itemDes={[{ background: "bg-primary", text: "Key" }]}
          getElClassName={getClassName}
        />
      </Card>
    </div>
  );
}
