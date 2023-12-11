import "./Box.scss";

interface Props {
  icon?: any,
  text: string,
  width?: string,
  height?: string,
  action?: React.MouseEventHandler<HTMLDivElement>
}

const Box = (props: Props) => {
  return (
    <div
      className='boite'
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "fit-content"
      }}
      onClick={props.action}
    >
      {props.icon}
      <span>{props.text}</span>
    </div>
  );
};

export default Box;