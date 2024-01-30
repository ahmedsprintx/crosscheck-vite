import React from 'react';

import style from './modal.module.scss';
import { HotKeys } from 'react-hotkeys';

const Modal = ({ open, children, className, handleClose, backClass }) => {
  const handleClickWrapper = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    handleClose?.();
  };

  return (
    <>
      {open && (
        <div
          id="generalModal"
          className={`${style.modalWrapper} ${backClass}`}
          onClick={(e) => {
            handleClickWrapper(e);
          }}
        >
          <div
            className={`${style.modalContentWrapper} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};
export default Modal;
