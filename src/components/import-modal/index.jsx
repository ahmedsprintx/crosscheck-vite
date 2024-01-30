import React from 'react';
import { useForm } from 'react-hook-form';
import { CSVLink } from 'react-csv';

import Modal from 'components/modal';
import DragDrop from 'components/drag-drop';
import Button from 'components/button';

import cross from 'assets/cross.svg';
import style from './import.module.scss';

const ImportModal = ({
  backClass,
  openImportModal,
  setOpenImportModal,
  clickHandler,
  name,
  onSubmit: _onSubmit,
  sampleData,
}) => {
  const { control, watch, setValue, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    clickHandler && clickHandler(data);
    _onSubmit && _onSubmit(data);
    reset();
  };

  return (
    <>
      {' '}
      <Modal
        open={openImportModal}
        handleClose={() => setOpenImportModal(false)}
        className={style.mainDiv}
        backClass={backClass}
      >
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Import</span>
          <img src={cross} alt="" onClick={() => setOpenImportModal(false)} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Upload File</label>
          <DragDrop
            control={control}
            name={name}
            setValue={setValue}
            watch={watch}
            type="file"
            accept={{
              'application/*': ['.csv'],
            }}
          />

          {sampleData && (
            <p className={style.p}>
              You can also download a{' '}
              <CSVLink data={sampleData} filename={`Test Cases import Sample`}>
                <span>sample file</span>{' '}
              </CSVLink>
              with instructions.
            </p>
          )}
          <div className={style.mainBtnDiv}>
            <Button
              text={'Discard'}
              type={'button'}
              btnClass={style.btnClassUncheckModal}
              handleClick={() => setOpenImportModal(false)}
            />
            <Button text={`Yes, Import test cases`} type={'onSubmit'} />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ImportModal;
