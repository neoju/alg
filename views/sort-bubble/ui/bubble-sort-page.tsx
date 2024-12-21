"use client";

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { Card, Link } from "@nextui-org/react";

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

export function BubbleSortPage() {
  const animSpeed = useAtomValue(animSpeedAtom);
  const animDuration = useAtomValue(animDurationAtom);
  const totalElements = useAtomValue(totalElementsAtom);

  const [isSorting, setIsSorting] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [elements, setElements] = useState<SortingItem[]>([]);

  const [colorful, setColorful] = useState(true);

  const randomElements = useCallback(() => {
    setCursor(null);
    setNextCursor(null);
    setElements(shuffle(genBarchartData(totalElements)));
  }, [totalElements]);

  useEffect(() => {
    setColorful(animSpeed <= 90);
  }, [animSpeed]);

  useEffect(() => {
    randomElements();
  }, [randomElements]);

  const abortId = "bubble-sort";

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
      setNextCursor(null);
      setCursor(null);

      for (let j = 0; j < elements.length - i - 1; j++) {
        // abort sorting if the user presses the stop button
        if (window.algoVisualizer__abortId == abortId) {
          setIsSorting(false);
          setNextCursor(null);
          setCursor(null);
          return;
        }

        // highlight the current element
        setCursor(j);
        await sleep(animDuration);

        if (elements[j].value > elements[j + 1].value) {
          // highlight the next element if it's going to be swapped
          setNextCursor(j + 1);

          swap(elements, j, j + 1);

          // wait for the user to see the swap
          await sleep(animDuration);
          setElements([...elements]);
          setNextCursor(j);

          swapped = true;
        } else {
          setNextCursor(null);
        }
      }

      // if there is no swap in the current pass, the array is already sorted
      if (!swapped) break;
    }

    setIsSorting(false);
  }

  function getClassName(index: number) {
    return classNames(
      "rounded-md rounded-b-none bg-default-500",
      colorful && {
        "bg-primary": index === cursor,
        "bg-success": index === nextCursor,
      },
    );
  }

  const description =
    "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order." +
    "The pass through the list is repeated until the list is sorted." +
    'The algorithm, which is a comparison sort, is named for the way smaller elements "bubble" to the top of the list.' +
    "Although the algorithm is simple, it is too slow and impractical for most problems even when compared to insertion sort." +
    "It can be practical if the input is usually in sort order.";

  return (
    <div>
      <PageHeader title="Bubble Sort" description={description}>
        <p className="text-slate-300 text-sm mt-2">
          Visit the following resource to learn more:{" "}
          <Link href="https://roadmap.sh/computer-science" target="_blank">
            https://roadmap.sh/computer-science
          </Link>
        </p>
      </PageHeader>

      <Card className="p-2 mt-5">
        <SortingToolbar
          isSorting={isSorting}
          onPressRandom={randomElements}
          onPressSort={sort}
        />

        <AnimatedBarChart
          elements={elements}
          animDuration={animDuration}
          getElClassName={getClassName}
        />
      </Card>
    </div>
  );
}
