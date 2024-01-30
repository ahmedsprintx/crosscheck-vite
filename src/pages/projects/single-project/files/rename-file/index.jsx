import React from 'react';
import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';

import cross from 'assets/cross.svg';
import style from './add.module.scss';
import Button from 'components/button';
import { useEffect } from 'react';
import CrossIcon from 'components/icon-component/cross';

const RenameFile = ({
  openRenameModal,
  setOpenRenameModal,
  isLoading,
  defaultValue,
  handleSubmitFile,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setValue,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    handleSubmitFile(data, setError);
  };

  useEffect(() => {
    setValue('name', defaultValue);
  }, [defaultValue]);

  return (
    <Modal
      open={openRenameModal}
      handleClose={() => setOpenRenameModal({})}
      className={style.mainDiv}
      backClass={style.modal}
    >
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Rename File</span>
        <div onClick={() => setOpenRenameModal({})} className={style.hover}>
          <CrossIcon />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          register={(name) => register(name, { required: 'Required' })}
          label="File Name"
          name="name"
          placeholder="File Name"
          errorMessage={errors?.name?.message}
          clearIcon={cross}
        />
        <div className={style.innerFlex}>
          <p onClick={() => setOpenRenameModal({})}>Cancel</p>
          <Button text="Save" type={'submit'} disabled={isLoading} />
        </div>
      </form>
    </Modal>
  );
};

export default RenameFile;
