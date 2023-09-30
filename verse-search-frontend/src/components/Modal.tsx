import { ReactNode } from "react";

import "./Modal.css";

interface ModalProps {
  toggleModal: any;
  children: ReactNode;
}

function Modal(props: ModalProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={props.toggleModal}>
          &times;
        </span>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
