import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import CrossIcon from 'components/icon-component/cross';
import Button from 'components/button';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import RangeInput from 'components/range-input/range-input';

import style from './style.module.scss';
import TextEditor from 'components/editor/text-editor';
import CreatableSelectComponent from 'components/select-box/creatable-select';

const Index = ({
  type = 'testCase',
  open,
  handleClose,
  selectedRecords,
  backClass,
  projectId,
  milestoneId,
  featureId,
  options,
  onSubmit,
  isLoading,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm();

  const {
    mileStonesOptions,
    featuresOptions,
    severityOptions,
    bugTypeOptions,
    bugSubtypeOptions,
    testTypeOptions,
    assignedToOptions,
  } = options;

  useEffect(() => {
    milestoneId && setValue('milestoneId', milestoneId);
    featureId && setValue('featureId', featureId);
  }, [milestoneId, featureId]);

  return (
    <Modal open={open} handleClose={handleClose} className={style.mainDiv} backClass={backClass}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Bulk Edit</span>
        <div
          alt=""
          onClick={() => {
            handleClose();
          }}
          className={style.hover}
        >
          <CrossIcon />
          <div className={style.tooltip}>
            <p>Close</p>
          </div>
        </div>
      </div>
      <p className={style.infotext}>
        Update the fields below which you want to update for all the{' '}
        {type === 'bug' ? 'selected bugs' : 'selected test cases'}.
      </p>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmit({ projectId, selectedRecords, ...data }, setError),
        )}
      >
        <div className={style.main}>
          <div className={style.body}>
            {type === 'bug' && (
              <div className={style.flex}>
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'severity'}
                    label={'Severity'}
                    options={severityOptions}
                    placeholder="Select"
                    errorMessage={errors?.severity?.message}
                    isClearable={false}
                  />
                </div>
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'bugType'}
                    label={'Bug Type'}
                    options={bugTypeOptions}
                    placeholder="Select"
                    errorMessage={errors?.bugType?.message}
                    isClearable={false}
                  />
                </div>
              </div>
            )}
            <div className={style.flex}>
              <SelectBox
                options={mileStonesOptions?.filter((x) => x.projectId === projectId)}
                label={'Milestone'}
                name={'milestoneId'}
                placeholder="Select"
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.milestoneId?.message}
              />

              <SelectBox
                options={featuresOptions?.filter((x) => x.milestoneId === watch('milestoneId'))}
                label={'Feature'}
                name={'featureId'}
                placeholder={watch('milestoneId') ? 'Select' : 'Select Milestone First'}
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.featureId?.message}
              />
            </div>
            {type === 'testCase' && (
              <div className={style.flex}>
                <div
                  style={{
                    minWidth: '185px',
                    width: '50%',
                  }}
                >
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'testType'}
                    label={'Test Type'}
                    options={testTypeOptions}
                    placeholder="Select"
                    isSearchable={false}
                    errorMessage={errors?.testType?.message}
                    isClearable={false}
                  />
                </div>
                <div class={style.rangeContainer}>
                  <RangeInput
                    label={'Weightage'}
                    watch={watch}
                    control={control}
                    setValue={setValue}
                    name={'weightage'}
                    errorMessage={errors?.weightage?.message}
                  />
                </div>
              </div>
            )}

            {type === 'bug' && (
              <div className={style.flex}>
                <div className={style.contentDiv}>
                  <CreatableSelectComponent
                    defaultOptions={bugSubtypeOptions}
                    label={'Bug Subtype'}
                    name={'bugSubType'}
                    placeholder="Select or Create"
                    control={control}
                    isClearable
                    watch={watch}
                    rules={{}}
                    errorMessage={errors?.bugSubType?.message}
                  />
                </div>
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'testingType'}
                    label={'Testing Type'}
                    options={testTypeOptions}
                    placeholder="Select"
                    errorMessage={errors?.testingType?.message}
                    isClearable={false}
                  />
                </div>
              </div>
            )}
            <div className={style.flex}>
              <div className={style.contentDiv}>
                <TextField
                  label={type === 'testCase' ? 'Related Ticket ID' : 'Task ID'}
                  placeholder={'Enter Ticket ID'}
                  name={type === 'testCase' ? 'relatedTicketId' : 'taskId'}
                  register={register}
                  errors={
                    type === 'testCase' ? errors?.relatedTicketId?.message : errors?.taskId?.message
                  }
                />
              </div>
              {type === 'testCase' && (
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'state'}
                    label={'State'}
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Obsolete', value: 'Obsolete' },
                    ]}
                    placeholder="Select"
                    errorMessage={errors?.testType?.message}
                    isClearable={false}
                  />
                </div>
              )}
              {type === 'bug' && (
                <div className={style.contentDiv}>
                  <TextField
                    label={'Tested Version'}
                    placeholder={'Enter Ticket ID'}
                    name={'testedVersion'}
                    register={register}
                    errors={
                      type === 'testCase'
                        ? errors?.relatedTicketId?.message
                        : errors?.taskId?.message
                    }
                  />
                </div>
              )}
            </div>
            {type === 'bug' && (
              <div className={style.contentDiv}>
                <SelectBox
                  control={control}
                  watch={watch}
                  name={'developerId'}
                  label={'Developer '}
                  options={assignedToOptions}
                  placeholder="Select"
                  errorMessage={errors?.developerId?.message}
                  isClearable={false}
                />
              </div>
            )}

            {type === 'testCase' && (
              <>
                {' '}
                <div className={style.contentDiv}>
                  <TextEditor
                    label={'Pre Conditions'}
                    name="preConditions"
                    control={control}
                    watch={watch}
                    errorMessage={errors?.preConditions?.message}
                  />
                </div>
                <div className={style.contentDiv}>
                  <TextEditor
                    label={'Test Steps'}
                    name="testSteps"
                    control={control}
                    watch={watch}
                    errorMessage={errors?.testSteps?.message}
                  />
                </div>
              </>
            )}

            <div className={style.btnFlex}>
              <Button
                text={'Cancel'}
                type={'button'}
                btnClass={style.btn1}
                handleClick={(e) => {
                  e.preventDefault();
                  reset();
                  handleClose();
                }}
              />
              <Button text={'Update all'} type={'submit'} disabled={isLoading || !isDirty} />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default Index;
