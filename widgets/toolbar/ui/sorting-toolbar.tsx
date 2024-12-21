import { useSetAtom } from "jotai";
import { Slider, Button } from "@nextui-org/react";

import {
  animSpeedAtom,
  totalElementsAtom,
  DEFAULT_ANIM_SPEED,
  DEFAULT_TOTAL_ELEMENTS,
} from "@/shared/atoms/config";

type Props = {
  isSorting?: boolean;
  onPressRandom: () => void;
  onPressSort: () => void;
};

export function SortingToolbar(props: Props) {
  const setAnimSpeed = useSetAtom(animSpeedAtom);
  const setTotalElements = useSetAtom(totalElementsAtom);

  return (
    <div className="bg-default-200 p-2 flex flex-wrap rounded-xl gap-4 justify-end">
      <div className="flex flex-grow gap-4">
        <Slider
          isDisabled={props.isSorting}
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
          isDisabled={props.isSorting}
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
          onPress={props.onPressRandom}
          isDisabled={props.isSorting}
        >
          random elements
        </Button>

        <Button
          className="capitalize"
          color="primary"
          size="md"
          onPress={props.onPressSort}
        >
          {props.isSorting ? "stop" : "sort"}
        </Button>
      </div>
    </div>
  );
}
