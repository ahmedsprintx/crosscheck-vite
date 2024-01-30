import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import style from './drawer.module.scss';
import TextField from 'components/text-field';
import TextArea from 'components/text-area';
import SelectBox from 'components/select-box';
import DatePicker from 'components/date-picker';
import Button from 'components/button';
import SelectTestCases from '../select-test-cases';
import Warning from 'components/icon-component/warning';

import _ from 'lodash';
import { useCreateTestRun, useGetTestRunById, useUpdateTestRun } from 'hooks/api-hooks/test-runs/test-runs.hook';
import { useToaster } from 'hooks/use-toaster';
import { useProjectOptions } from '../helper';
import { formattedDate } from 'utils/date-handler';
import CrossIcon from 'components/icon-component/cross';
import Loader from 'components/loader';
import FormCloseModal from 'components/form-close-modal';

const Drawer = ({
  setDrawerOpen,
  refetch,
  editRecord,
  setEditRecord,
  projectId,
  selectedRunRecords,
  setSelectedRunRecords,
}) => {
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      dueDate: null,
      assignee: null,
      priority: null,
      testCases: [],
    },
  });

  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);

  const { data = {} } = useProjectOptions();
  const { toastError, toastSuccess } = useToaster();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(selectedRunRecords?.length > 0 ? selectedRunRecords : []);
  const { assignedTo = [], priorityOptions = [] } = data;

  const { data: _testRunData, isLoading } = useGetTestRunById({
    id: editRecord,
    tested: watch('tested') || 'all',
  });
  useEffect(() => {
    if (editRecord && _testRunData?.testRun && !_testRunData?.testRun.isEmpty) {
      let values = _.pick(_testRunData.testRun, [
        'name',
        'projectId',
        'description',
        'priority',
        'assignee',
        'dueDate',
        'testCases',
      ]);
      const testCases = editRecord
        ? values.testCases.map((x) => ({
            testCaseId: x.testCaseId._id,
            tested: x.tested,
          }))
        : values?.testCases?.map((x) => x.testCaseId._id);

      setSelectedRecords(values?.testCases?.map((x) => x.testCaseId));
      Object.entries({
        ...values,
        assignee: values?.assignee?._id,
        testCases,
        dueDate: new Date(values.dueDate),
      }).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_testRunData]);

  const { mutateAsync: _createTestRunHandler, isLoading: _createIsLoading } = useCreateTestRun();
  const { mutateAsync: _updateTestRunHandler, isLoading: _updateIsLoading } = useUpdateTestRun();
  const submitHandler = async (data) => {
    try {
      const testCases = editRecord
        ? data.testCases.map((testCase) => ({
            testCaseId: testCase,
            tested: false,
          }))
        : data?.testCases;

      const formData = {
        ...data,
        dueDate: formattedDate(watch('dueDate'), 'yyyy-MM-dd'),
        testCases,
        projectId: projectId || watch('projectId'),
      };

      const res = editRecord
        ? await _updateTestRunHandler({ id: editRecord, body: formData })
        : await _createTestRunHandler(formData);

      toastSuccess(res.msg);
      setSelectedRecords([]);
      setSelectedRunRecords([]);

      reset();
      refetch(editRecord, editRecord ? 'edit' : 'add', res?.runData);
      setDrawerOpen(null);
      setEditRecord(null);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onSubmit = (data) => {
    submitHandler(data, reset);
  };

  useEffect(() => {
    const allSelectedTestCasesIds = selectedRecords.map((x) => x._id);
    setValue('testCases', allSelectedTestCasesIds);
  }, [selectedRecords]);

  const closeForm = () => {
    reset();
    setSelectedRecords([]);
    setDrawerOpen(null);
    setEditRecord(null);
    setSelectedRunRecords([]);
    setOpenFormCloseModal(false);
  };
  const handleDiscard = () => {
    if (editRecord) {
      const isFormChanged =
        formattedDate(watch('dueDate'), 'yyyy-MM-dd') !== formattedDate(_testRunData.testRun?.dueDate, 'yyyy-MM-dd') ||
        watch('testCases')?.length !== _testRunData.testRun?.testCases?.length ||
        watch('assignee') !== _testRunData.testRun?.assignee._id ||
        watch('priority') !== _testRunData.testRun?.priority ||
        watch('name') !== _testRunData.testRun?.name ||
        watch('description') !== _testRunData.testRun?.description
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    } else {
      const isFormChanged =
        dirtyFields?.name ||
        watch('testCases').length > 0 ||
        dirtyFields?.description ||
        dirtyFields?.dueDate ||
        dirtyFields?.assignee ||
        dirtyFields?.priority
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    }
  };

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
      <div className={style.main}>
        <div className={style.header}>
          <span className={style.headerText}>{editRecord ? 'Edit' : `Create`} Test Run</span>
          <div
            alt=""
            onClick={() => {
              handleDiscard();
            }}
            className={style.hover1}
          >
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        {editRecord && isLoading ? (
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
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style.body}>
              <div className={style.contentDiv}>
                <TextField
                  label={'Run Title'}
                  name={'name'}
                  register={() => register('name', { required: 'Required' })}
                  placeholder={'Enter Run Title'}
                  errorMessage={errors?.name?.message}
                  data-cy="testrun-modal-runtitle"
                />
              </div>
              <div className={style.contentDiv}>
                <TextField
                  label={'Test Cases'}
                  name={'testCases'}
                  placeholder={'Select Test Cases'}
                  register={() => register('testCases', { required: 'Required' })}
                  value={watch('testCases')?.length ? `${watch('testCases')?.length} Selected` : ''}
                  onClickHandle={() => {
                    setOpenModal(true);
                  }}
                  errorMessage={errors?.testCases?.message}
                  data-cy="testrun-modal-testcase"
                />
              </div>
              <div className={style.contentDiv}>
                <TextArea
                  label={'Description'}
                  name={'description'}
                  placeholder={'Write Your Text Here'}
                  register={() => register('description')}
                  dataCy="testrun-modal-description"
                />
              </div>
              <div className={style.flex}>
                <div className={style.flexDate}>
                  <DatePicker
                    control={control}
                    label={'Due Date'}
                    name={'dueDate'}
                    placeholder={'Select'}
                    rules={{ required: 'Required' }}
                    errorMessage={errors?.dueDate?.message}
                    id="testrun-modal-datepicker"
                  />
                </div>
                <div className={style.flexSelect}>
                  <SelectBox
                    control={control}
                    name={'priority'}
                    label={'Priority'}
                    options={priorityOptions}
                    placeholder="Select"
                    rules={{ required: 'Required' }}
                    errorMessage={errors?.priority?.message}
                    id="testrun-modal-priority"
                  />
                </div>
              </div>
              <SelectBox
                control={control}
                placeholder="Select"
                name={'assignee'}
                watch={watch}
                options={assignedTo}
                label={'Assignee'}
                rules={{ required: 'Required' }}
                errorMessage={errors?.assignee?.message}
                id="testrun-modal-assignee"
              />
              <div className={style.btnFlex}>
                <Button
                  text={'Discard'}
                  type={'button'}
                  btnClass={style.reset}
                  handleClick={(e) => {
                    e.preventDefault();
                    handleDiscard();
                  }}
                  data-cy="testrun-modal-discard-btn"
                />
                <Button
                  text={'Save'}
                  type={'submit'}
                  disabled={_createIsLoading || _updateIsLoading}
                  isLoading={_createIsLoading || _updateIsLoading}
                  data-cy="testrun-modal-save-btn"
                />
              </div>
            </div>
          </form>
        )}
      </div>

      {openModal && (
        <SelectTestCases
          openAddModal={openModal}
          setOpenAddModal={setOpenModal}
          projectId={editRecord ? watch('projectId') : projectId}
          options={data}
          editRecords={_testRunData?.testRun.testCases.map((x) => x.testCaseId)}
          onSubmit={(testCases, projectId) => {
            setSelectedRecords(testCases);
            setValue('projectId', projectId);
          }}
        />
      )}
    </>
  );
};
Drawer.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  editRecord: PropTypes.any,
  setEditRecord: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
  selectedRunRecords: PropTypes.any.isRequired,
  setSelectedRunRecords: PropTypes.func.isRequired,
};

export default Drawer;
