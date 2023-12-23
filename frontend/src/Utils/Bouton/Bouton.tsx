import React from "react";
import "./Bouton.scss";

type Props = {
  className?: string,
  btnAction?: React.MouseEventHandler<HTMLButtonElement>,
  children?: any,
  btnTexte?: string,
  disable: boolean,
  style?: object,
  color: string
}

const Bouton = (props: Props) => {
  return (
    <button
      className={`bouton ${props.className} ${props.color}`}
      onClick={props.btnAction}
      style={props.style ?? {}}
      disabled={props.disable}
    >
      {props.children}
      {props.btnTexte}
    </button>
  );
};

Bouton.defaultProps = {
  className: "",
  disable: false,
  color: "blue"
};

export default Bouton;
