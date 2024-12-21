"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

import { throttle } from "@/shared/_";
import { SortingItem } from "@/shared/types";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

type Props = {
  elements: SortingItem[];
  animDuration: number;
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
      <div className="bg-default-200 p-2 flex rounded-xl mt-2 justify-center items-end h-96">
        {props.elements.map((element, index) => (
          <div
            key={element.key}
            style={{
              width: `${elementWidth}%`,
              textAlign: "center",
            }}
          >
            <motion.div
              layout
              className={classNames(
                props.getElClassName(index),
                "text-black flex justify-center items-end rounded-t-md bg-default-500",
              )}
              style={{
                height: element.value,
                margin: `0 ${Math.min(elementWidth, 3)}px`,
              }}
              transition={{
                ...spring,
                duration: props.animDuration,
              }}
            ></motion.div>
            <span>{showNumbers ? element.value : ""}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-4 w-4 inline-block rounded"></span>
          <span>current item</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-success h-4 w-4 inline-block rounded"></span>
          <span> item to swap</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <p>
          To enable colorful mode please keep animation speed lowser than 91
        </p>
      </div>
    </div>
  );
}
