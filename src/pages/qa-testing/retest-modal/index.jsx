import { useRef } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import TextArea from 'components/text-area';
import GenericTable from 'components/generic-table';
import { columnsData } from './helper';

import style from './retest.module.scss';
import { useForm } from 'react-hook-form';
import { useGetBugById, useRetestBug } from 'hooks/api-hooks/bugs/bugs.hook';
import UploadAttachment from 'components/upload-attachments/upload-attachment';
import { useToaster } from 'hooks/use-toaster';
import CrossIcon from 'components/icon-component/cross';
import RetestRevert from 'components/icon-component/retest-revert';

const RetestModal = ({ openRetestModal, setOpenRetestModal, options, refetch }) => {
  const { ref } = useRef;

  const { toastError, toastSuccess } = useToaster();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    setError,
  } = useForm();

  const { data: _bugDetails, refetch: _refetchBug } = useGetBugById(openRetestModal?.id);
  const { statusOptions } = options;

  const { mutateAsync: _retestHandler, isLoading: _isLoading } = useRetestBug();
  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        reTestEvidence: data?.reTestEvidence?.base64,
      };
      const res = await _retestHandler({
        id: openRetestModal?.id,
        body: formData,
      });
      toastSuccess(res.msg);
      refetch(openRetestModal?.id, 'edit', res?.bugData);
      await _refetchBug();
      openRetestModal?.refetch && (await openRetestModal?.refetch());
      reset();
      setOpenRetestModal();
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <Modal
      open={!!openRetestModal?.open}
      handleClose={() => {
        reset();
        setOpenRetestModal(false);
      }}
      className={style.mainDiv}
      backClass={style.modal}
    >
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Retest</span>
        <div
          onClick={() => {
            reset();
            setOpenRetestModal(false);
          }}
          className={style.hover}
        >
          <CrossIcon />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.grid}>
          <div className={style.input}>
            <SelectBox
              name="reTestStatus"
              control={control}
              badge
              options={statusOptions?.filter((x) => x.value !== 'Open')}
              label={'Status'}
              placeholder={'Select'}
              numberBadgeColor={'#39695b'}
              showNumber
              rules={{ required: { value: true, message: 'Required' } }}
              errorMessage={errors?.reTestStatus?.message}
              id="bugretest-status"
            />
          </div>
          <TextField
            register={() => register('reTestVersion')}
            label="Tested Version"
            name="reTestVersion"
            placeholder="Write you text here"
            wraperClass={style.input}
            errorMessage={errors?.reTestVersion?.message}
            data-cy="retestbug-modal-testedversion"
          />
          <UploadAttachment
            control={control}
            name={'reTestEvidence'}
            rules={{
              required: 'Required',
              validate: (e) => {
                if (!e.base64) {
                  return 'Required';
                }
                try {
                  new URL(e.base64);
                  return true;
                } catch (err) {
                  return 'Not a valid URL';
                }
              },
            }}
            onTextChange={(e) => {
              setValue('reTestEvidence', {
                base64: e.target.value,
                url: e.target.value,
              });
            }}
            placeholder="Attach Test Evidence"
            label="Test Evidence"
            setValue={setValue}
            errorMessage={errors?.reTestEvidence?.message}
          />
        </div>
        <div width={'100%'}>
          <TextArea
            register={() => register('remarks')}
            label={'Notes'}
            name={'remarks'}
            placeholder={'Write your text here'}
            errorMessage={errors?.remarks?.message}
            dataCy={'retest-notes'}
          />
        </div>
        <div className={style.flex}>
          <RetestRevert />
          <p>Retest History</p>
        </div>
        <div className={style.tableWidth}>
          <GenericTable
            ref={ref}
            columns={columnsData}
            dataSource={_bugDetails?.bug?.history || []}
            height={'300px'}
            classes={{
              test: style.test,
              table: style.table,
              thead: style.thead,
              th: style.th,
              containerClass: style.checkboxContainer,
              tableBody: style.tableRow,
            }}
          />
        </div>
        <div className={style.innerFlex}>
          <Button
            text="Discard"
            handleClick={() => {
              reset();
              setOpenRetestModal();
            }}
            btnClass={style.discardBtn}
            dataCy="retest-discard-btn"
          />
          <Button
            text="Save"
            type={'submit'}
            disabled={_isLoading}
            btnClass={style.saveBtn}
            data-cy="retest-save-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default RetestModal;
