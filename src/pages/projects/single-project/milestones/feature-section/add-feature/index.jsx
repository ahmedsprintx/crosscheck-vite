import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';

import cross from 'assets/cross.svg';
import style from './add.module.scss';
import Button from 'components/button';
import CrossIcon from 'components/icon-component/cross';

const AddFeature = ({ openAddModal, setOpenAddModal, id, clickHandler, defaultValue, name }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    clickHandler(data, id, setError);
    reset();
  };

  useEffect(() => {
    if (defaultValue) {
      setValue('name', defaultValue);
    }
  }, [defaultValue]);

  return (
    <div>
      <Modal
        open={openAddModal}
        handleClose={() => {
          reset();
          setOpenAddModal(false);
        }}
        className={style.mainDiv}
      >
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{id ? 'Rename' : 'Add'} Feature</span>
          <div
            src={cross}
            alt=""
            onClick={() => {
              reset();
              setOpenAddModal(false);
            }}
            className={style.hover}
          >
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <p className={style.p}>{name}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            register={() => register('name', { required: 'Required' })}
            label="Feature Name"
            name="name"
            placeholder="Enter feature name"
            errorMessage={errors.name && errors.name.message}
            data-cy="feature-name-input"
          />
          <div className={style.innerFlex}>
            <p
              onClick={() => {
                reset();
                setOpenAddModal(false);
              }}
            >
              Cancel
            </p>
            <Button text="Save" type={'submit'} data-cy="feature-name-save-btn" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddFeature;
