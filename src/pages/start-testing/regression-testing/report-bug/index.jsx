import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import TextField from 'components/text-field';

import style from './report.module.scss';
import Checkbox from 'components/checkbox';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import TextEditor from 'components/editor/text-editor';
import { validateDescription } from 'utils/validations';
import UploadAttachment from 'components/upload-attachments/upload-attachment';
import { useCreateBug, useGetBugById, useUpdateBug } from 'hooks/api-hooks/bugs/bugs.hook';
import { useToaster } from 'hooks/use-toaster';
import _ from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';
import CrossIcon from 'components/icon-component/cross';
import Loader from 'components/loader';

const ReportBug = ({
  setReportBug,
  options,
  projectId,
  milestoneId,
  featureId,
  taskId,
  refetch,
  setEditRecord,
  editRecord,
  noHeader,
  viewBugId,
  testingType,
}) => {
  const {
    projectOptions,
    mileStonesOptions,
    featuresOptions,
    bugTypeOptions,
    bugSubtypeOptions = [],
    severityOptions,
    testTypeOptions,
    assignedToOptions,
  } = options;

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm();
  const { toastError, toastSuccess } = useToaster();

  useEffect(() => {
    Object.entries({ projectId, milestoneId, featureId, taskId, testingType }).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [projectId, milestoneId, featureId, taskId]);

  const { mutateAsync: _createBugHandler, isLoading: _createIsLoading } = useCreateBug();
  const { mutateAsync: _createUpdateHandler, isLoading: _updateIsLoading } = useUpdateBug();
  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        bugSubType: data?.bugSubType?.value || '',
        feedback: {
          ...data.feedback,
          description: JSON.stringify(data.feedback?.description),
        },
        idealBehaviour: {
          ...data.idealBehaviour,
          description: JSON.stringify(data.idealBehaviour?.description),
        },
        reproduceSteps: {
          ...data.reproduceSteps,
          description: JSON.stringify(data.reproduceSteps?.description),
        },
        testEvidence: data.testEvidence.base64,
        ...(editRecord?.reopen && { issueType: 'Reopened Bug' }),
        ...(editRecord?.reopen && { reOpenId: editRecord?.id }),
      };

      const res =
        editRecord?.id && !editRecord?.reopen
          ? await _createUpdateHandler({ id: editRecord?.id, body: formData })
          : await _createBugHandler(formData);

      toastSuccess(res.msg);
      refetch(editRecord?.id, editRecord?.id && !editRecord?.reopen ? 'edit' : 'add', res?.bugData);
      if (!watch('addAnother')) {
        !viewBugId && setReportBug(null);
        setEditRecord(null);
      }
      reset();

      Object.entries({
        projectId: projectId ? projectId : data.projectId,
        milestoneId: milestoneId ? milestoneId : data.milestoneId,
        featureId: featureId ? featureId : data.featureId,
        taskId,
        testingType,
        reproduceSteps: data.reproduceSteps,
      }).forEach(([key, val]) => {
        setValue(key, val);
      });
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { data: _bugDetails, isLoading } = useGetBugById(editRecord?.id);

  useEffect(() => {
    (async () => {
      if (_bugDetails?.bug && !_.isEmpty(_bugDetails?.bug)) {
        let values = _.pick(_bugDetails?.bug, [
          'feedback',
          'idealBehaviour',
          'reproduceSteps',
          'projectId',
          'milestoneId',
          'featureId',
          'bugType',
          'bugSubType',
          'severity',
          'testingType',
          'testedVersion',
          'taskId',
          'developerId',
          'testEvidence',
        ]);

        const feedback = values?.feedback?.description && JSON.parse(values?.feedback?.description);
        const idealBehaviour = values?.idealBehaviour?.description && JSON.parse(values?.idealBehaviour?.description);
        const reproduceSteps = values?.reproduceSteps?.description && JSON.parse(values?.reproduceSteps?.description);

        const developerId = values?.developerId?._id;
        const projectId = values.projectId?._id;
        const milestoneId = values.milestoneId?._id;
        const featureId = values.featureId?._id;
        const bugType = values.bugType ? values.bugType : values.testType;
        const bugSubType = {
          label: values.bugSubType,
          value: values.bugSubType,
        };

        values = {
          ...values,
          feedback: {
            ...values?.feedback,
            description: feedback,
            editorState: EditorState.createWithContent(convertFromRaw(feedback)),
          },
          idealBehaviour: {
            ...values?.idealBehaviour,
            description: idealBehaviour,
            editorState: EditorState.createWithContent(convertFromRaw(idealBehaviour)),
          },
          reproduceSteps: {
            ...values?.reproduceSteps,
            description: reproduceSteps,
            editorState: EditorState.createWithContent(convertFromRaw(reproduceSteps)),
          },
          developerId,
          testEvidence: {
            url: values.testEvidence,
            base64: values.testEvidence,
          },
          projectId,
          milestoneId,
          featureId,
          bugType,
          bugSubType,
        };

        Object.entries(values).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
    })();
  }, [_bugDetails]);

  return (
    <div className={style.main}>
      <div className={style.mainInnerFlex}>
        <p>Report a bug</p>
        <div
          className={style.img}
          onClick={() => {
            setReportBug(null);
            setEditRecord(null);
          }}
        >
          <CrossIcon />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      {!isLoading ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: noHeader ? '78vh' : '95vh', overflowY: 'auto', paddingBottom: '10px' }}
        >
          <div className={style.bottom}>
            <div className={style.gridTwo}>
              <div>
                <SelectBox
                  options={projectOptions}
                  label={'Project'}
                  name={'projectId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                  }}
                  errorMessage={errors?.projectId?.message}
                />
              </div>
              <div>
                <SelectBox
                  options={mileStonesOptions?.filter((x) => x.projectId === watch('projectId'))}
                  label={'Milestone'}
                  name={'milestoneId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                  }}
                  errorMessage={errors?.milestoneId?.message}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <SelectBox
                options={featuresOptions?.filter((x) => x.milestoneId === watch('milestoneId'))}
                label={'Feature'}
                name={'featureId'}
                placeholder="Select"
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                }}
                errorMessage={errors?.featureId?.message}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <TextEditor
                control={control}
                name={'feedback'}
                label={'Feedback'}
                placeholder="Write your text here"
                watch={watch}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                errorMessage={errors?.feedback?.message}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <TextEditor
                control={control}
                name={'reproduceSteps'}
                label={'Steps to Reproduce'}
                placeholder="Write your text here"
                watch={watch}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                errorMessage={errors?.reproduceSteps?.message}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <TextEditor
                control={control}
                name={'idealBehaviour'}
                label={'Ideal Behavior'}
                placeholder="Write your text here"
                watch={watch}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                errorMessage={errors?.idealBehaviour?.message}
              />
            </div>
            <div
              className={style.gridTwo}
              style={{
                marginTop: '10px',
              }}
            >
              <div>
                <SelectBox
                  options={bugTypeOptions}
                  label={'Bug Type'}
                  name={'bugType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  errorMessage={errors?.bugType?.message}
                />
              </div>
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
              <div>
                <SelectBox
                  options={severityOptions}
                  label={'Severity'}
                  name={'severity'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  errorMessage={errors?.severity?.message}
                />
              </div>
              <div>
                <SelectBox
                  options={testTypeOptions}
                  label={'Testing Type'}
                  name={'testingType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  errorMessage={errors?.testingType?.message}
                />
              </div>
              <TextField
                register={() => register('testedVersion')}
                name={'testedVersion'}
                placeholder="Enter Test Version"
                label="Tested Version"
                errorMessage={errors?.testedVersion?.message}
              />
              <TextField
                register={() => register('taskId')}
                name={'taskId'}
                placeholder="Enter Task ID"
                label="Task ID"
                errorMessage={errors?.taskId?.message}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <SelectBox
                options={assignedToOptions}
                label={'Developer Name'}
                name={'developerId'}
                placeholder="Select"
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
              />
            </div>
            <div className={style.innerFlex}>
              <UploadAttachment
                control={control}
                name={'testEvidence'}
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
                placeholder="Attach Test Evidence"
                label="Test Evidence"
                setValue={setValue}
                onTextChange={(e) => {
                  setValue('testEvidence', {
                    base64: e.target.value,
                    url: e.target.value,
                  });
                }}
                errorMessage={errors?.testEvidence?.message}
              />
            </div>
          </div>

          <div className={style.btnDiv}>
            {!editRecord?.id && <Checkbox register={register} name={'addAnother'} label={'Add another'} />}
            <Button
              text="Discard"
              type={'button'}
              btnClass={style.btn}
              handleClick={(e) => {
                e.preventDefault();
                setEditRecord(null);
                !watch('addAnother') && setReportBug(null);
                reset();
              }}
            />
            <Button text="Save" type={'submit'} disabled={_createIsLoading || _updateIsLoading} />
          </div>
        </form>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 265px)',
          }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
};
ReportBug.propTypes = {
  setReportBug: PropTypes.func.isRequired,
  options: PropTypes.any.isRequired,
  projectId: PropTypes.string.isRequired,
  milestoneId: PropTypes.string,
  featureId: PropTypes.string,
  taskId: PropTypes.string,
  refetch: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  editRecord: PropTypes.any,
  noHeader: PropTypes.bool,
  viewBugId: PropTypes.string,
  testingType: PropTypes.string,
};

export default ReportBug;
