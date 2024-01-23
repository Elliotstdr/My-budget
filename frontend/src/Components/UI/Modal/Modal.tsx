import React from "react";
import "./Modal.scss";
import { Dialog } from "primereact/dialog";

type Props = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  header?: string,
  className?: string,
  width?: string,
  height?: string,
  footer?: any,
  children: any,
  blockScroll?: boolean
  closable?: boolean
}

const Modal = (props: Props) => {
  const RenderFooter = ({ footer }: any) => {
    return <div>{footer}</div>;
  };

  return (
    <Dialog
      appendTo={document.getElementById("app")}
      header={props.header}
      visible={props.visible}
      style={{
        width: props.width ? props.width : "fit-content",
        height: props.height ? props.height : "fit-content",
      }}
      onHide={() => props.setVisible(false)}
      footer={props.footer && <RenderFooter footer={props.footer} />}
      className={props.className}
      blockScroll={props.blockScroll}
      closable={props.closable}
    >
      {props.children}
    </Dialog>
  );
};

Modal.defaultProps = {
  className: "modal",
  closable: false
};

export default Modal;
