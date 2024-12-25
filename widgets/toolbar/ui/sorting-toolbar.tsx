import { useAtom } from "jotai";
import { Button } from "@nextui-org/button";
import { Slider } from "@nextui-org/slider";

import { animSpeedAtom, totalElementsAtom } from "@/shared/atoms/config";

type Props = {
  isSorting?: boolean;
  onPressRandom: () => void;
  onPressSort: () => void;
};

export function SortingToolbar(props: Props) {
  const [animSpeed, setAnimSpeed] = useAtom(animSpeedAtom);
  const [totalElements, setTotalElements] = useAtom(totalElementsAtom);

  return (
    <div className="bg-default-200 p-2 flex flex-wrap rounded-xl gap-4 justify-end">
      <div className="flex flex-grow gap-4">
        <Slider
          isDisabled={props.isSorting}
          className="max-w-sm"
          defaultValue={animSpeed}
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
          defaultValue={totalElements}
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
