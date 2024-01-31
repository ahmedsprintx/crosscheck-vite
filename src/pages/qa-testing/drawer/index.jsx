import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import goIcon from 'assets/cross.svg';

import style from './drawer.module.scss';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import { validateDescription } from 'utils/validations';

import _ from 'lodash';
import Checkbox from 'components/checkbox';
import TextEditor from 'components/editor/text-editor';
import RangeInput from 'components/range-input/range-input';
import { EditorState, convertFromRaw } from 'draft-js';
import CrossIcon from 'components/icon-component/cross';
import { useGetBugById } from 'hooks/api-hooks/bugs/bugs.hook';

const Drawer = ({
  submitHandler,
  setDrawerOpen,
  resetHandler,
  setEditRecord,
  setViewBug,
  editRecord,
  _createIsLoading,
  _updateIsLoading,
  addMore = false,
  noHeader = false,
}) => {
  const {
    control,
    watch,
    register,
    formState: { errors },
    handleSubmit,
    setValue,

    reset,
  } = useForm();

  const { data: _bugDetailsData = {} } = useGetBugById(editRecord?.id);

  useEffect(() => {
    if (_bugDetailsData?.bug && !_.isEmpty(_bugDetailsData?.bug)) {
      let values = _.pick(_bugDetailsData?.bug, [
        'preConditions',
        'bugId',
        'projectId',
        'milestoneId',
        'featureId',
        'reproduceSteps',
        'idealBehaviour',
        'feedback',
        'bugType',
        'weightage',
      ]);
      const idealBehaviour = values?.idealBehaviour?.description && JSON.parse(values?.idealBehaviour?.description);
      const feedback = values?.feedback?.description && JSON.parse(values?.feedback?.description);
      const reproduceSteps = values?.reproduceSteps?.description && JSON.parse(values?.reproduceSteps?.description);

      const projectId = values?.projectId?._id;
      const testType = values?.bugType;
      const relatedTicketId = values?.bugId;
      const featureId = values?.featureId?._id;
      const milestoneId = values?.milestoneId?._id;

      values = {
        ...values,
        projectId,
        featureId,
        relatedTicketId,
        testType,
        milestoneId,
        expectedResults: {
          ...values?.idealBehaviour,
          description: idealBehaviour,
          editorState: EditorState.createWithContent(convertFromRaw(idealBehaviour)),
        },
        testSteps: {
          ...values?.reproduceSteps,
          description: reproduceSteps,
          editorState: EditorState.createWithContent(convertFromRaw(reproduceSteps)),
        },
        testObjective: {
          ...values?.feedback,
          description: feedback,
          editorState: EditorState.createWithContent(convertFromRaw(feedback)),
        },
      };

      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_bugDetailsData]);

  const onSubmit = (data) => {
    submitHandler(data, reset);
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <span className={style.headerText}>{'Add'} Test Case</span>
          <div
            src={goIcon}
            alt=""
            onClick={() => {
              setEditRecord(null);
              setViewBug(false);
              reset();
              setDrawerOpen(false);
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
          <div
            className={style.body}
            style={{
              height: noHeader ? '78vh' : '100vh',
              overflowY: 'auto',
            }}
          >
            <div className={style.contentDiv}>
              <TextEditor
                label={'Test Objective'}
                name="testObjective"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                watch={watch}
                errorMessage={errors?.testObjective?.message}
              />
            </div>
            <div className={style.contentDiv}>
              <TextEditor
                label={'Pre Conditions'}
                name="preConditions"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                watch={watch}
                errorMessage={errors?.preConditions?.message}
              />
            </div>
            <div className={style.contentDiv}>
              <TextEditor
                label={'Test Steps'}
                name="testSteps"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                watch={watch}
                errorMessage={errors?.testSteps?.message}
              />
            </div>
            <div className={style.contentDiv}>
              <TextEditor
                label={'Expected Results'}
                name="expectedResults"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                watch={watch}
                errorMessage={errors?.expectedResults?.message}
              />
            </div>

            <div className={style.flex}>
              <div
                className={style.rangeContainer}
                style={{
                  flex: '1',
                }}
              >
                <RangeInput
                  label={'Weightage'}
                  watch={watch}
                  rules={{ required: 'Required' }}
                  control={control}
                  setValue={setValue}
                  name={'weightage'}
                  errorMessage={errors?.weightage?.message}
                />
              </div>
              <div
                style={{
                  width: '185px',
                }}
              >
                <SelectBox
                  control={control}
                  watch={watch}
                  name={'testType'}
                  label={'Test Type'}
                  options={[
                    { label: 'Functionality Testing', value: 'Functionality' },
                    { label: 'Performance Testing', value: 'Performance' },
                    { label: 'UI Testing', value: 'UI' },
                    { label: 'Security Testing', value: 'Security' },
                  ]}
                  isSearchable={false}
                  placeholder="Select"
                  rules={{ required: 'Required' }}
                  errorMessage={errors?.testType?.message}
                  isClearable={false}
                />
              </div>
            </div>
            <div className={style.relatedDiv}>
              <TextField
                label={'Related Ticket ID'}
                placeholder={'Enter Ticket ID'}
                name={'relatedTicketId'}
                register={register}
                errors={errors?.relatedTicketId?.message}
              />
            </div>
            <div className={style.btnFlex}>
              {addMore && (
                <Checkbox
                  name={'addAnother'}
                  label={'Add another'}
                  register={register}
                  handleChange={(e) => {
                    e.preventDefault();
                  }}
                />
              )}
              <Button
                text={'Discard'}
                type={'button'}
                btnClass={style.btn}
                handleClick={(e) => {
                  e.preventDefault();
                  resetHandler();
                  setEditRecord(null);
                  !watch('addAnother') && setDrawerOpen(false);
                }}
              />
              <Button text={'Save'} type={'submit'} disabled={_createIsLoading || _updateIsLoading} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Drawer;
