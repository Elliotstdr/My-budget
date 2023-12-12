import React from "react";
import "./Bouton.scss";

interface Props {
  className?: string,
  type: "slide" | "normal",
  btnAction?: React.MouseEventHandler<HTMLButtonElement>,
  children?: any,
  btnTexte?: string,
  disable: boolean,
  style?: object
}

const Bouton = (props: Props) => {
  return (
    <button
      className={`bouton ${props.className} ${props.type}`}
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
  type: "slide",
  className: "",
  disable: false
};

export default Bouton;
