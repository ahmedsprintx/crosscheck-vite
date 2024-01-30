import React, { useState } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';

import delIcon from 'assets/Delete.svg';
import style from './remove-confirm-modal.module.scss';
import DelIcon from 'components/icon-component/del-icon';

const DeleteModal = ({
  openDelModal,
  setOpenDelModal,
  name,
  backClass,
  clickHandler,
  trashMode,
  cancelText,
  isLoading,
}) => {
  return (
    <Modal
      open={openDelModal}
      handleClose={() => setOpenDelModal(false)}
      className={style.mainDiv}
      backClass={backClass}
    >
      <div className={style.iconRefresh}>
        <DelIcon />
      </div>

      <p className={style.modalTitle}>Are you sure you wantto delete this forever?</p>

      <p className={style.modalSubtitle}>
        This action cannot be undone and the item will be deleted forever
      </p>

      <div className={style.mainBtnDiv}>
        <Button text={'Delete, forever'} onClick={clickHandler} disabled={isLoading} />

        <Button
          text={cancelText ? cancelText : 'No, Keep it'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setOpenDelModal(false)}
        />
      </div>
    </Modal>
  );
};

export default DeleteModal;
