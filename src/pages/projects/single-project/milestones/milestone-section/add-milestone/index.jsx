import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';

import cross from 'assets/cross.svg';
import style from './add.module.scss';
import Button from 'components/button';
import { toast } from 'react-toastify';
import { useToaster } from 'hooks/use-toaster';
import CrossIcon from 'components/icon-component/cross';

const AddMilestone = ({ openAddModal, setOpenAddModal, id, clickHandler, defaultValue }) => {
  const { toastError } = useToaster();
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
        backClass={style.backBack}
      >
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{id ? 'Rename' : 'Add'} Milestone</span>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            data-cy="add-milestone-input"
            register={() => register('name', { required: 'Required' })}
            label="Milestone Name"
            name="name"
            placeholder="Milestone Name"
            errorMessage={errors.name && errors.name.message}
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
            <Button text="Save" type={'submit'} data-cy="add-milestone-save-btn" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddMilestone;
