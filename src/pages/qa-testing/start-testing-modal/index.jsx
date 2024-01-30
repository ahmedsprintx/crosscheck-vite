import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';

import Modal from 'components/modal';

import CrossIcon from 'components/icon-component/cross';
import ReportBug from './bug-reporting';
import style from './start-testing.module.scss';
import DashedLeftIcon from 'components/icon-component/dashed-left-icon';
import SplitPane from 'components/split-pane/split-pane';

import { useForm } from 'react-hook-form';
import Tabs from 'components/tabs';
import { useGetTestCasesByFilter } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useCreateBug, useGetBugsByFilter } from 'hooks/api-hooks/bugs/bugs.hook';
import { useToaster } from 'hooks/use-toaster';
import _ from 'lodash';

import { initialFilters as bugsFilters } from 'pages/qa-testing/helper';
import { initialFilter as testCasesFilters } from 'pages/test-cases/helper';
import Drawer from './drawer';
import BugsListing from './bugs-table';
import FormCloseModal from 'components/form-close-modal';
import Warning from 'components/icon-component/warning';
import Checkbox from 'components/checkbox';
import Button from 'components/button';

const StartTestingModal = ({ open, handleClose, backClass, refetch, projectId = null }) => {
  const { control, register, watch, setValue, formState, handleSubmit, setError, reset, resetField } = useForm({
    defaultValues: {
      bugSubType: null,
      bugType: null,
      developerId: null,
      featureId: null,
      feedback: {
        text: '',
      },
      idealBehaviour: {
        text: '',
      },
      milestoneId: null,
      projectId: null,
      reproduceSteps: {
        text: '',
      },
      severity: null,
      taskId: '',
      testEvidence: {},
      testedDevice: null,
      testedEnvironment: null,
      testedVersion: '',
      addAnother: false,
      testingType: null,
    },
  });
  const { isDirty, dirtyFields } = formState;

  const { toastError, toastSuccess } = useToaster();

  const testCasesRef = useRef(null);
  const bugsRef = useRef(null);

  const [viewSizes, setViewSizes] = useState(['80%', 'auto']);
  const [viewBug, setViewBug] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [testCases, setTestCases] = useState({});
  const [testCasesPage, setTestCasePage] = useState(1);
  const [bugs, setBugs] = useState({});
  const [bugsPage, setBugsPage] = useState(1);

  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);

  const { mutateAsync: _getFilteredBugsHandler, isLoading: _isBugsLoading } = useGetBugsByFilter();

  const { mutateAsync: _getAllTestCases, isLoading: _isLoading } = useGetTestCasesByFilter();

  const handleBugsScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = bugsRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (bugs?.count !== bugs?.bugs.length && !_isBugsLoading) {
        bugsRef?.current?.removeEventListener('scroll', handleBugsScroll);
        setBugsPage((prev) => prev + 1);
        // NOTE: Scroll up by 10 pixels from the last scroll position
        bugsRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isBugsLoading]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = testCasesRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testCases?.count !== testCases?.testcases.length && !_isLoading) {
        testCasesRef?.current?.removeEventListener('scroll', handleScroll);
        setTestCasePage((prev) => prev + 1);
        // NOTE: Scroll up by 10 pixels from the last scroll position
        testCasesRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading]);

  useEffect(() => {
    if (!_isBugsLoading) {
      bugsRef?.current?.addEventListener('scroll', handleBugsScroll);
    } else if (_isBugsLoading) {
      bugsRef?.current?.removeEventListener('scroll', handleBugsScroll);
    }
    return () => {
      bugsRef?.current?.removeEventListener('scroll', handleBugsScroll);
    };
  }, [bugsRef, bugs, _isBugsLoading]);

  useEffect(() => {
    if (!_isLoading) {
      testCasesRef?.current?.addEventListener('scroll', handleScroll);
    } else if (_isLoading) {
      testCasesRef?.current?.removeEventListener('scroll', handleScroll);
    }
    return () => {
      testCasesRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [testCasesRef, testCases, _isLoading]);

  const fetchBugs = async (filters) => {
    try {
      const res = await _getFilteredBugsHandler(filters);

      setBugs((pre) => ({
        ...(pre || {}),
        count: res?.count || 0,
        bugs: [...(pre.bugs || []), ...res?.bugs],
      }));
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: testcases

  const fetchTestCases = async (filters) => {
    try {
      const res = await _getAllTestCases(filters);
      setTestCases((pre) => ({
        ...(pre || {}),
        count: res?.count || 0,
        testcases: [...(pre.testcases || []), ...res?.testcases],
      }));
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    setTestCasePage(1);
    setTestCases({});
    setBugsPage(1);
    setBugs({});
  }, [watch('featureId')]);

  useEffect(() => {
    if (watch('projectId') && watch('milestoneId') && watch('featureId')) {
      fetchTestCases(
        (watch('projectId') && watch('milestoneId') && watch('featureId')) || watch('taskId')
          ? {
              ..._.pickBy(testCasesFilters, (value, key) => {
                if (key === 'createdAt' || key === 'lastTestedAt') {
                  return !(value.start === null);
                }
                return true;
              }),
              ...(watch('projectId') &&
                watch('milestoneId') &&
                watch('featureId') && {
                  projects: [watch('projectId')],
                  milestones: [watch('milestoneId')],
                  features: [watch('featureId')],
                }),
              page: testCasesPage,
              ...(watch('taskId') && {
                relatedTicketId: watch('taskId'),
              }),
            }
          : _.pickBy(testCasesFilters, (value, key) => {
              if (key === 'createdAt' || key === 'lastTestedAt') {
                return !(value.start === null);
              }
              return true;
            }),
      );
    }
  }, [watch('featureId'), testCasesPage]);

  useEffect(() => {
    if (watch('projectId') && watch('milestoneId') && watch('featureId')) {
      // NOTE: Clear existing bugs before making the new fetch
      setBugs((prev) => ({
        ...prev,
        bugs: [],
      }));
      fetchBugs(
        (watch('projectId') && watch('milestoneId') && watch('featureId')) || watch('taskId')
          ? {
              ..._.pickBy(bugsFilters, (value, key) => {
                if (
                  key === 'createdAt' ||
                  key === 'lastTestedAt' ||
                  key === 'closedDate' ||
                  key === 'reTestDate' ||
                  key === 'reportedAt'
                ) {
                  return !(value.start === null);
                }
                return true;
              }),
              ...(watch('projectId') &&
                watch('milestoneId') &&
                watch('featureId') && {
                  projects: [watch('projectId')],
                  milestones: [watch('milestoneId')],
                  features: [watch('featureId')],
                }),
              page: bugsPage,
              ...(watch('taskId') && {
                relatedTicketId: watch('taskId'),
              }),
            }
          : _.pickBy(bugsFilters, (value, key) => {
              if (
                key === 'createdAt' ||
                key === 'lastTestedAt' ||
                key === 'closedDate' ||
                key === 'reTestDate' ||
                key === 'reportedAt'
              ) {
                return !(value.start === null);
              }
              return true;
            }),
      );
    }
  }, [watch('featureId'), bugsPage, refetch]);

  useEffect(() => {
    setValue('milestoneId', null);
  }, [watch('projectId')]);

  useEffect(() => {
    setValue('featureId', null);
  }, [watch('milestoneId')]);

  useEffect(() => {
    if (projectId) {
      setValue('projectId', projectId);
    }
  }, [projectId]);

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        tabTitle: `Related Test Case (${testCases?.count || 0})`,
        content: (
          <Drawer
            testCases={testCases.testcases}
            testCasesRef={testCasesRef}
            page={testCasesPage}
            isLoading={_isLoading}
            refetch={(id, status) => {
              const index = testCases.testcases.findIndex((x) => x._id === id);
              const newTestCases = testCases.testcases;
              newTestCases[index].status = status;
              setTestCases((pre) => ({
                ...(pre || {}),

                testcases: newTestCases,
              }));
            }}
          />
        ),
      },
      {
        id: 0,
        tabTitle: `Related Bugs (${bugs?.count || 0})`,
        content: <BugsListing {...{ isLoading: _isBugsLoading, bugs, bugsRef, page: bugsPage }} />,
      },
    ];
  }, [activeTab, testCasesRef, testCases, bugs, bugsRef, _isBugsLoading, _isLoading, testCasesPage, bugsPage]);

  useEffect(() => {
    if (viewBug) {
      if (window.innerWidth <= 768) {
        setViewSizes(['0%', '99%']);
      } else {
        setViewSizes(['40%', '60%']);
      }
    } else {
      setViewSizes(['99%', '0%']);
    }
  }, [viewBug]);

  const closeForm = () => {
    !watch('addAnother') && handleClose();
    reset();
    setOpenFormCloseModal(false);
  };

  const handleDiscard = useCallback(() => {
    const isFormChanged =
      dirtyFields.bugSubType !== undefined ||
      dirtyFields.bugType !== undefined ||
      dirtyFields.developerId !== undefined ||
      dirtyFields.featureId !== undefined ||
      watch('feedback')?.text !== '' ||
      watch('idealBehaviour')?.text !== '' ||
      watch('reproduceSteps')?.text !== '' ||
      dirtyFields.milestoneId !== undefined ||
      dirtyFields.projectId !== undefined ||
      dirtyFields.severity !== undefined ||
      dirtyFields.taskId !== undefined ||
      dirtyFields.testedDevice !== undefined ||
      dirtyFields.testedEnvironment !== undefined ||
      dirtyFields.testedVersion !== undefined ||
      dirtyFields.testingType !== undefined ||
      dirtyFields.addAnother !== undefined ||
      watch('testEvidence')?.url
        ? true
        : false;
    isFormChanged ? setOpenFormCloseModal(true) : closeForm();
  }, [dirtyFields]);

  const { mutateAsync: _createBugHandler, isLoading: _createIsLoading } = useCreateBug();

  const resetHandler = (data) => {
    reset();
    if (data.addAnother) {
      Object.entries({
        projectId: data.projectId,
        milestoneId: data.milestoneId,
        featureId: data.featureId,
        taskId: data.taskId,
        testingType: data.testingType,
        reproduceSteps: data.reproduceSteps,
        addAnother: data.addAnother,
      }).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      let testEvidenceValue = data.testEvidence.base64;

      if (data.testEvidence.url && !data.testEvidence.url.startsWith('blob:')) {
        testEvidenceValue = data.testEvidence.url;
      }

      const formData = {
        ...data,

        bugSubType: data?.bugSubType?.value,
        testedDevice: data?.testedDevice?.value,
        testedEnvironment: data?.testedEnvironment?.value,
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
        testEvidence: testEvidenceValue,
      };
      if (formData.developerId === null || formData.developerId === undefined) {
        delete formData.developerId;
      }

      const res = await _createBugHandler(formData);

      toastSuccess(res.msg);
      refetch('', 'add', res?.bugData);
      if (!watch('addAnother')) {
        handleClose();
      }
      resetHandler(data);
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <Modal
      open={open}
      handleClose={handleDiscard}
      className={`${style.mainDiv} ${viewBug ? style.widthOpened : style.widthClosed} `}
      backClass={backClass}
    >
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
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Report Bug</span>
        <div className={style.hover}>
          <div onClick={handleDiscard} data-cy="close-bugreporting-modal">
            <CrossIcon />
          </div>
          {watch('projectId') && watch('milestoneId') && watch('featureId') && (
            <div
              style={{ padding: '5px 0 0' }}
              onClick={() => {
                setViewBug((pre) => !pre);
              }}
            >
              <DashedLeftIcon />
            </div>
          )}{' '}
        </div>
      </div>
      {/* // NOTE: Reporting Bug */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.modalBody}>
          <SplitPane sizes={viewSizes} onChange={setViewSizes} allowResize={viewBug}>
            <ReportBug
              handleClose={handleClose}
              projectId={projectId}
              closeForm={closeForm}
              formHook={{
                control,
                register,
                watch,
                setValue,
                errors: formState.errors,
              }}
            />

            <div
              style={{
                height: '70vh',
                overflow: 'hidden',
                padding: '10px',
                borderLeft: '1px solid #d6d6d6',
              }}
            >
              <Tabs pages={pages?.filter((x) => x.tabTitle)} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </SplitPane>
        </div>
        <div className={style.btnDiv}>
          <Checkbox register={register} name={'addAnother'} label={'Add another'} />
          <Button
            text="Discard"
            type={'button'}
            btnClass={style.btn}
            handleClick={(e) => {
              e.preventDefault();
              handleDiscard();
            }}
            id="reportbug-discard-btn"
          />
          <Button text="Save" type={'submit'} disabled={_createIsLoading} id="reportbug-save-btn" />
        </div>
      </form>
    </Modal>
  );
};

export default StartTestingModal;
