/* eslint-disable react-hooks/exhaustive-deps */
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

  const handleResize = useCallback(throttle(updateUI, 333), [props.elements]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    updateUI();
  }, [props.elements]);

  function updateUI() {
    if (wrapperRef.current) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      setShowNumbers(width / props.elements.length > 30);
    }
  }

  return (
    <div ref={wrapperRef} className="text-xs">
      <ul className="bg-default-200 p-2 flex rounded-xl mt-2 justify-center items-end h-96">
        {props.elements.map((element, index) => (
          <motion.li
            key={element.key}
            layout
            className={classNames(
              props.getElClassName(index),
              "text-black flex justify-center items-end",
            )}
            style={{
              height: element.value,
              width: `${elementWidth}%`,
              margin: `0 ${Math.min(elementWidth, 3)}px`,
            }}
            transition={{
              ...spring,
              duration: props.animDuration,
            }}
          >
            <span>{showNumbers ? element.value : ""}</span>
          </motion.li>
        ))}
      </ul>

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
