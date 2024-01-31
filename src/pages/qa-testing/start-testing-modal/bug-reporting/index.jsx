import React from 'react';

import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import Warning from 'components/icon-component/warning';

import style from './report.module.scss';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import TextEditor from 'components/editor/text-editor';
import { validateDescription } from 'utils/validations';
import UploadAttachment from 'components/upload-attachments/upload-attachment';

import { useBugsFiltersOptions } from 'pages/qa-testing/header/helper';
import FormCloseModal from 'components/form-close-modal';

const ReportBug = ({ formHook, projectId, closeForm, openFormCloseModal, setOpenFormCloseModal }) => {
  const { data = {} } = useBugsFiltersOptions();
  const {
    projectOptions = [],
    mileStonesOptions = [],
    featuresOptions = [],
    bugTypeOptions = [],
    bugSubtypeOptions = [],
    severityOptions = [],
    testTypeOptions = [],
    assignedToOptions = [],
    testedEnvironmentOptions = [],
    testedDevicesOptions = [],
  } = data;

  const { control, register, watch, setValue, errors } = formHook;

  return (
    <>
      {openFormCloseModal && (
        <FormCloseModal
          modelOpen={openFormCloseModal}
          setModelOpen={setOpenFormCloseModal}
          confirmBtnHandler={closeForm}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
          confirmBtnText={`Discard Changes`}
          icon={<Warning />}
          cancelBtnText={`Back To Form`}
        />
      )}
      <div>
        <div className={style.main}>
          <div className={style.bottom}>
            <div className={style.gridThree}>
              <div>
                <SelectBox
                  options={projectOptions}
                  label={'Project'}
                  name={'projectId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  disabled={projectId}
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                  }}
                  errorMessage={errors?.projectId?.message}
                  id={'reportbug-project-dropdown'}
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
                  id={'reportbug-milestone-dropdown'}
                />
              </div>
              <div>
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
                  id={'reportbug-feature-dropdown'}
                />
              </div>
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
                id="reportbug-texteditor"
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
                id="reportbug-texteditor"
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
                id="reportbug-texteditor"
              />
            </div>
            <div
              className={style.gridThree}
              style={{
                marginTop: '10px',
              }}
            >
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
                  id="reportbug-severity-dropdown"
                />
              </div>{' '}
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
                  id="reportbug-bugtype-dropdown"
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
                errorMessage={errors?.bugSubType?.message}
                id="reportbug-bugsubtype-dropdown"
              />
              <div>
                <SelectBox
                  options={assignedToOptions}
                  label={'Developer Name'}
                  name={'developerId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  id="reportbug-developername-dropdown"
                />
              </div>
              <TextField
                register={() => register('taskId', {})}
                name={'taskId'}
                placeholder="Enter Task ID"
                label="Task ID"
                data-cy="reportbug-taskid"
              />
              <TextField
                register={() => register('testedVersion')}
                name={'testedVersion'}
                placeholder="Enter Test Version"
                label="Tested Version"
                data-cy="reportbug-testedversion-dropdown"
              />
            </div>
            <div className={style.gridThree} style={{ marginTop: '10px' }}>
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
                  id="reportbug-testingtype-dropdown"
                />
              </div>
              <CreatableSelectComponent
                defaultOptions={testedDevicesOptions}
                label={'Tested Device'}
                name={'testedDevice'}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                errorMessage={errors?.testedDevice?.message}
                id="reportbug-testeddevice-dropdown"
              />
              <CreatableSelectComponent
                defaultOptions={testedEnvironmentOptions}
                label={'Tested Environment '}
                name={'testedEnvironment'}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                errorMessage={errors?.testedEnvironment?.message}
                id="reportbug-testedenvironment-dropdown"
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
                id="reportbug-evidence"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ReportBug);
