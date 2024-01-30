import React, { useRef } from 'react';

// NOTE: components
import Modal from 'components/modal';

// NOTE: utils
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

// NOTE: styles
import style from './style-modal.module.scss';
import BugsType from '..';

const ExpandModal = ({ open, setOpen, className, data }) => {
  const componentRef = useRef();

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }
    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };
  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <BugsType data={data} modalMode />
    </Modal>
  );
};

export default ExpandModal;
