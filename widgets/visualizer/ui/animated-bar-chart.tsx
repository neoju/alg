"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@nextui-org/theme";

import { throttle } from "@/shared/_";
import { SortingItem } from "@/shared/types";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

type Props = {
  cursor: number | null;
  elements: SortingItem[];
  animDuration: number;
  itemDes?: { background: string; text: string }[];
  getElClassName: (index: number) => string;
};

export function AnimatedBarChart(props: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showNumbers, setShowNumbers] = useState(true);
  const elementWidth = 100 / props.elements.length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(throttle(updateUI, 333), [props.elements]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.elements, handleResize]);

  function updateUI() {
    if (wrapperRef.current) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      setShowNumbers(width / props.elements.length > 30);
    }
  }

  return (
    <div ref={wrapperRef} className="text-xs">
      <div className="bg-default-200 p-2 pb-7 flex rounded-xl mt-2 justify-center items-end h-96 relative">
        {props.elements.map((element, index) => (
          <div
            key={element.key}
            style={{ width: `${elementWidth}%`, textAlign: "center" }}
          >
            <motion.div
              layout
              className={cn(
                "text-black flex justify-center items-end rounded-t-md bg-default-500",
                props.getElClassName(index),
              )}
              style={{
                height: element.value,
                margin: `0 ${Math.min(elementWidth, 3)}px`,
              }}
              transition={{ ...spring, duration: props.animDuration }}
            />
            <span>{showNumbers ? element.value : ""}</span>
          </div>
        ))}

        <motion.div
          layout
          className={cn(
            "h-4 w-14 bg-default-400 absolute bottom-2 rounded text-center",
            props.animDuration >= 200 && "bg-primary h-4 w-4",
          )}
          style={{
            left:
              props.animDuration >= 200
                ? `calc((100% - 16px) / ${props.elements.length} * ${props.cursor! + 1} - ${elementWidth / 2}%)`
                : `50%`,
          }}
        >
          {props.animDuration < 200 ? "¯\\_(ツ)_/¯" : ""}
        </motion.div>
      </div>

      {props.itemDes && (
        <>
          <div className="flex justify-center gap-4 mt-2">
            {props.itemDes.map((item) => (
              <div className="flex items-center gap-2" key={item.background}>
                <span
                  className={cn(
                    "h-4 w-4 inline-block rounded",
                    item.background,
                  )}
                ></span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            To enable colorful mode please keep animation speed between 0-90
          </div>
        </>
      )}
    </div>
  );
}
