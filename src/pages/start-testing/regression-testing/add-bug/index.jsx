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
import { useCreateBug } from 'hooks/api-hooks/bugs/bugs.hook';
import { useToaster } from 'hooks/use-toaster';
import _ from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';
import { useGetTestCaseById, useUpdateStatusTestCase } from 'hooks/api-hooks/test-cases/test-cases.hook';
import CrossIcon from 'components/icon-component/cross';

const AddBug = ({
  setAddBug,
  options,
  refetch,
  projectId,
  milestoneId,
  featureId,
  testingType,
  taskId,
  setEditRecord,
  editRecord,
  noHeader,
  refetchTestCases,
}) => {
  const {
    projectOptions,
    mileStonesOptions,
    featuresOptions,
    bugSubtypeOptions = [],
    severityOptions,
    testTypeOptions,
    bugTypeOptions,
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
    Object.entries({ projectId, milestoneId, featureId }).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [projectId, milestoneId, featureId]);

  const { mutateAsync: _createBugHandler } = useCreateBug();
  const { mutateAsync: _updateStatusTestCase } = useUpdateStatusTestCase();

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        taskId: watch('relatedTicketId'),
        bugSubType: (data && data.bugSubType?.value) || '',
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
        testingType: watch('testingType'),
        ...(editRecord?.reopen && { issueType: 'Reopened Bug' }),
        ...(editRecord?.reopen && { reOpenId: editRecord?._id }),
      };
      const res = await _createBugHandler(formData);
      if (res?.newBugId) {
        await _updateStatusTestCase({
          id: editRecord?._id,
          body: { testStatus: 'Failed', relatedBug: res?.newBugId },
        });
      }
      toastSuccess(res.msg);

      refetch(editRecord?.id, editRecord?.id && !editRecord?.reopen ? 'edit' : 'add', res?.bugData);
      refetchTestCases();
      if (!watch('addAnother')) {
        !editRecord?.id && setAddBug(null);
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
  const { data: _testCaseData = {} } = useGetTestCaseById(editRecord?._id);

  const { testCase = {} } = _testCaseData;
  useEffect(() => {
    (async () => {
      if (testCase && !_.isEmpty(testCase)) {
        let values = _.pick(testCase, [
          'testObjective',
          'testSteps',
          'expectedResults',
          'projectId',
          'milestoneId',
          'featureId',
          'bugType',
          'relatedTicketId',
          'testType',
          'bugSubType',
          'severity',
          'testedVersion',
          'taskId',
          'developerId',
        ]);

        const feedback = values?.testObjective?.description && JSON.parse(values?.testObjective?.description);
        const reproduceSteps = values?.testSteps?.description && JSON.parse(values?.testSteps?.description);
        const idealBehaviour = values?.expectedResults?.description && JSON.parse(values?.expectedResults?.description);

        const developerId = values?.developerId?._id;
        const projectId = values.projectId?._id;
        const milestoneId = values.milestoneId?._id;
        const featureId = values.featureId?._id;
        const bugType = values.testType;

        values = {
          ...values,
          feedback: {
            ...values?.testObjective,
            description: feedback,
            editorState: EditorState.createWithContent(convertFromRaw(feedback)),
          },
          reproduceSteps: {
            ...values?.testSteps,
            description: reproduceSteps,
            editorState: EditorState.createWithContent(convertFromRaw(reproduceSteps)),
          },
          idealBehaviour: {
            ...values?.expectedResults,
            description: idealBehaviour,
            editorState: EditorState.createWithContent(convertFromRaw(idealBehaviour)),
          },
          developerId,

          projectId,
          milestoneId,
          featureId,
          bugType,
        };
        Object.entries(values).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
    })();
  }, [testCase]);

  useEffect(() => {
    if (!watch('projectId')) {
      setValue('milestoneId', '');
      setValue('featureId', '');
    }
  }, [watch('projectId')]);

  return (
    <div className={style.main}>
      <div className={style.mainInnerFlex}>
        <p>Report a bug</p>\
        <div
          className={style.hover}
          onClick={() => {
            setAddBug(false);
            setEditRecord(null);
          }}
        >
          <CrossIcon />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ height: noHeader ? '78vh' : '90vh', overflowY: 'auto' }}>
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
            <div>
              <TextField
                register={() =>
                  register('testedVersion', {
                    // NOTE: required: 'Required',
                  })
                }
                name={'testedVersion'}
                placeholder="Enter Test Version"
                label="Tested Version"
                errorMessage={errors?.testedVersion?.message}
              />
            </div>
            <TextField
              register={() =>
                register('relatedTicketId', {
                  // NOTE: required: "Required",
                })
              }
              name={'relatedTicketId'}
              placeholder="Enter Task ID"
              label="Task ID"
              errorMessage={errors?.relatedTicketId?.message}
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
              onTextChange={(e) => {
                setValue('testEvidence', {
                  base64: e.target.value,
                  url: e.target.value,
                });
              }}
              placeholder="Attach Test Evidence"
              label="Test Evidence"
              setValue={setValue}
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
              !watch('addAnother') && setAddBug(false);
              reset();
            }}
          />
          <Button text="Save" type={'submit'} disabled={false} />
        </div>
      </form>
    </div>
  );
};
AddBug.propTypes = {
  setAddBug: PropTypes.func.isRequired,
  options: PropTypes.any.isRequired,
  refetch: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  milestoneId: PropTypes.string,
  featureId: PropTypes.string,
  testingType: PropTypes.string,
  taskId: PropTypes.string,
  setEditRecord: PropTypes.func.isRequired,
  editRecord: PropTypes.any,
  noHeader: PropTypes.bool,
  refetchTestCases: PropTypes.func.isRequired,
};

export default AddBug;
