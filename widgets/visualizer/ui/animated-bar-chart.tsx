import { SortingItem } from "@/shared/types";
import { motion } from "framer-motion";

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
  return (
    <div className="text-xs">
      <ul className="bg-default-200 p-2 flex rounded-xl mt-2 justify-center items-end h-96">
        {props.elements.map((element, index) => (
          <motion.li
            key={element.key}
            layout
            className={props.getElClassName(index)}
            style={{
              height: element.value,
              width: `${100 / props.elements.length}%`,
              margin: `0 ${100 / props.elements.length}px`,
            }}
            transition={{
              ...spring,
              duration: props.animDuration,
            }}
          />
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
