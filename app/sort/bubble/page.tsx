"use client";

import { motion } from "framer-motion";
import { shuffle } from "@/lib/sort";
import { Button, Card, Slider } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  animSpeedAtom,
  DEFAULT_ANIM_SPEED,
  DEFAULT_TOTAL_ELEMENTS,
  totalElementsAtom,
} from "@/atoms/config";
import { sleep } from "@/utils";
import Header from "./header";
import Footer from "./footer";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

export default function BubbleSort() {
  const [isSorting, setIsSorting] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [elements, setElements] = useState<Record<string, number>[]>([]);
  const [animSpeed, setAnimSpeed] = useAtom(animSpeedAtom);
  const [totalElements, setTotalElements] = useAtom(totalElementsAtom);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const [colorful, setColorful] = useState(true);
  const animDuration = 1000 - animSpeed * 10;

  useEffect(() => {
    setColorful(animSpeed <= 90);
  }, [animSpeed]);

  useEffect(() => {
    randomElements();
  }, [totalElements]);

  async function sort() {
    if (isSorting) {
      return;
    }

    if (window.neoju_stop_sorting) {
      window.neoju_stop_sorting = false;
    }

    setIsSorting(true);

    const copy = elements.slice();

    const start = performance.now();
    for (let i = 0; i < copy.length; i++) {
      let swapped = false;
      for (let j = 0; j < copy.length - i - 1; j++) {
        if (window.neoju_stop_sorting) {
          setIsSorting(false);
          setNextCursor(null);
          setCursor(null);
          return;
        }

        setCursor(j);
        await sleep(animDuration);

        if (copy[j].value > copy[j + 1].value) {
          setNextCursor(j + 1);
          const temp = copy[j];
          copy[j] = copy[j + 1];
          copy[j + 1] = temp;

          await sleep(animDuration);

          setElements([...copy]);
          setNextCursor(j);
          swapped = true;
        } else {
          setNextCursor(null);
        }
      }

      setNextCursor(null);
      setCursor(null);

      if (!swapped) {
        break;
      }
    }

    const end = performance.now();

    setTimeTaken(end - start);
    setIsSorting(false);
  }

  function randomElements() {
    const arr = Array.from({ length: totalElements }, (_, index) => ({
      value: Math.floor(Math.random() * 320),
      key: index,
    }));

    setTimeTaken(null);
    setCursor(null);
    setNextCursor(null);
    setElements(shuffle(arr));
  }

  function getClassName(index: number) {
    if (!colorful) {
      return "rounded-t-md bg-default-500";
    }

    if (cursor === index) {
      return "rounded-t-md bg-primary";
    }
    if (nextCursor === index) {
      return "rounded-t-md bg-success";
    }
    return "rounded-t-md bg-default-500";
  }

  return (
    <div>
      <Header />
      <Card className="p-2 mt-5">
        <div className="bg-default-200 p-2 flex flex-wrap rounded-xl gap-4 justify-end">
          <div className="flex flex-grow gap-4">
            <Slider
              isDisabled={isSorting}
              className="max-w-sm"
              defaultValue={DEFAULT_ANIM_SPEED}
              step={1}
              minValue={0}
              maxValue={100}
              size="sm"
              label="Animation Speed"
              onChangeEnd={(speed) => setAnimSpeed(speed as number)}
            />

            <Slider
              isDisabled={isSorting}
              className="max-w-sm"
              defaultValue={DEFAULT_TOTAL_ELEMENTS}
              step={1}
              minValue={5}
              maxValue={100}
              size="sm"
              label="Total Elements"
              onChangeEnd={(total) => setTotalElements(total as number)}
            />
          </div>

          <div className="flex gap-4">
            <Button
              className="capitalize"
              color="secondary"
              size="md"
              onPress={randomElements}
              isDisabled={isSorting}
            >
              random elements
            </Button>

            <Button
              className="capitalize"
              color="primary"
              size="md"
              onPress={() =>
                isSorting ? (window.neoju_stop_sorting = true) : sort()
              }
            >
              {isSorting ? "stop" : "sort"}
            </Button>
          </div>
        </div>

        <ul className="bg-default-200 p-2 flex rounded-xl mt-2 justify-center items-end h-96 relative">
          {elements.map((element, index) => (
            <motion.li
              key={element.key}
              layout
              className={getClassName(index)}
              style={{
                height: element.value,
                width: `${100 / totalElements}%`,
                margin: `0 ${100 / totalElements}px`,
              }}
              transition={{
                ...spring,
                duration: animDuration / 1000,
              }}
            />
          ))}
        </ul>

        <div className="absolute bottom-2 right-2">
          <p className="text-sm">
            {timeTaken ? `Time taken: ${timeTaken.toFixed(2)}ms` : ""}
          </p>
        </div>

        <Footer />
      </Card>
    </div>
  );
}
