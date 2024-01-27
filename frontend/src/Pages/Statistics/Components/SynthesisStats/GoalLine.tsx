import { Label, ReferenceLine } from "recharts";

interface Props {
  y: number | string
  labelValue: string
}

const GoalLine = (props: Props) => {
  return (
    <ReferenceLine
      y={props.y}
      strokeWidth={2}
      stroke="var(--main-color)"
    >
      <Label
        value={props.labelValue}
        position={"insideBottomLeft"}
        width={16}
        fill='var(--main-color)'
        fontSize={"0.7rem"}
        fontWeight={500}
      ></Label>
    </ReferenceLine>
  );
};

export default GoalLine;