import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import noData from 'assets/No-record.svg';
import PropTypes from 'prop-types';

import style from './drawer.module.scss';
import SelectBox from 'components/select-box';
import saveIcon from 'assets/save-icon.png';
import Detail from './detail';
import More from './more';
import History from './history';
import ReportBugModal from 'components/report-bug-modal';

import _ from 'lodash';
import { useGetTestCaseById, useUpdateStatusTestCase } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useToaster } from 'hooks/use-toaster';
import { useAppContext } from 'context/app.context';
import ArrowLeft from 'components/icon-component/arrow-left';
import ArrowRight from 'components/icon-component/arrow-right';
import CrossIcon from 'components/icon-component/cross';
import Activities from './activities';
import Loader from 'components/loader';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';

const ViewTestCase = ({
  setDrawerOpen,
  setViewTestCaseIndex,
  viewTestCaseIndex,
  allData,
  noHeader,
  setReportBug,
  setEditRecord,
  refetchAll,
  testRunStatus = false,
  testRunId,
  accessParticular,
}) => {
  const {
    control,
    setValue,
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [bugModal, setBugModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editCaseStatus, setEditCaseStatus] = useState(false);

  const { toastError, toastSuccess } = useToaster();

  const {
    data: _testCaseData = {},
    refetch,
    isLoading,
  } = useGetTestCaseById(allData?.[viewTestCaseIndex]?.testCaseId?._id);

  const { testCase = {} } = _testCaseData;

  const { userDetails } = useAppContext();

  useEffect(() => {
    if (testCase && !_.isEmpty(testCase)) {
      setValue('testStatus', testCase?.status);
    }
  }, [testCase]);

  const { mutateAsync: _updateStatusTestCase, isLoading: _isLoadingTestCase } = useUpdateStatusTestCase();

  const statusUpdateHandler = async (data) => {
    const res2 = await _updateStatusTestCase({
      id: allData?.[viewTestCaseIndex]?.testCaseId?._id,
      body: { ...data, testRunId: testRunId },
    });
    toastSuccess(res2?.msg);

    reset();
    setModalDismissed(false);
    setEditCaseStatus(false);
    refetchAll();
    refetch();

    setTimeout(() => {
      setViewTestCaseIndex((pre) => (pre < allData?.length - 1 ? pre + 1 : pre));
    }, 1000);
  };
  const onStatusUpdate = async (data) => {
    if (watch('testStatus') === 'Failed' && !modalDismissed) {
      setBugModal(true);
    } else {
      try {
        await statusUpdateHandler(data);
      } catch (error) {
        toastError(error, setError);
      }
    }
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              id={'prevButton'}
              className={style.hover}
              onClick={() => setViewTestCaseIndex((pre) => (pre > 0 ? pre - 1 : pre))}
            >
              <ArrowLeft type={viewTestCaseIndex === 0} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{testCase?.testCaseId}</span>
            <div
              id={'nextButton'}
              className={style.hover}
              onClick={() => setViewTestCaseIndex((pre) => (pre < allData?.length - 1 ? pre + 1 : pre))}
            >
              <ArrowRight type={viewTestCaseIndex === allData?.length - 1} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {testRunStatus && (
              <p className={`${allData?.[viewTestCaseIndex]?.tested ? style.tag2 : style.tag}`}>
                {allData?.[viewTestCaseIndex]?.tested ? 'Tested' : 'Not Tested'}
              </p>
            )}
            <div
              style={{
                height: '16px',
                width: '16px',
              }}
              onClick={() => {
                setDrawerOpen(false);
                setViewTestCaseIndex(null);
              }}
              className={style.hover1}
            >
              <CrossIcon />
              <div className={style.tooltip}>
                <p>Cross</p>
              </div>
            </div>
          </div>
        </div>
        {testCase?._id ? (
          <div
            className={style.body}
            style={{
              height: noHeader ? '78vh' : '90vh',
              overflowY: 'auto',
            }}
          >
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Project</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.projectId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Milestone</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.milestoneId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Feature</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.featureId?.name}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Test Type</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.testType}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Weightage</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.weightage}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Related Task ID</span>
              </div>
              <div className={style.innerRight}>
                <span>{testCase?.relatedTicketId}</span>
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>State</span>
              </div>
              <div className={style.innerRight} style={{ flex: '0' }}>
                <Tags
                  text={testCase?.state}
                  backClass={style.tagStyle}
                  colorScheme={{
                    Active: '#34C369',
                    Obsolete: '#8B909A',
                  }}
                />
              </div>
            </div>
            <div className={style.contentHeader}>
              <div className={style.innerLeft}>
                <span>Status</span>
              </div>
              <div className={style.innerRight}>
                {testCase?.status && !editCaseStatus ? (
                  <span
                    onClick={
                      (userDetails?.role !== 'Developer' ||
                        accessParticular ||
                        userDetails?.role === 'Admin' ||
                        userDetails?.role === 'Project Manager') &&
                      !allData?.[viewTestCaseIndex]?.tested
                        ? (e) => {
                            e.preventDefault();
                            setEditCaseStatus(true);
                          }
                        : () => {}
                    }
                  >
                    {testCase?.status}
                  </span>
                ) : (
                  <form onSubmit={handleSubmit(onStatusUpdate)}>
                    <div className={style.selectClass}>
                      <div>
                        <SelectBox
                          control={control}
                          name={'testStatus'}
                          dynamicWrapper={style.dynamicWrapper}
                          options={option}
                          placeholder={testCase?.status ? testCase?.status : 'Select Status'}
                          defaultValue={testCase?.status && [testCase?.status]}
                          errorMessage={errors?.testStatus?.message}
                          dynamicClass={style.zIndex}
                        />
                      </div>
                      <button
                        className={style.saveBtn}
                        style={{
                          padding: 0,
                          border: 'none',
                          filter: 'none',
                          margin: 0,
                          borderRadius: '8px',
                          backgroundColor: '#00000000',
                          width: '36.091px',
                          height: '29px',
                        }}
                        type="submit"
                        disabled={_isLoadingTestCase}
                      >
                        <img
                          src={saveIcon}
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                          alt=""
                        />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className={style.tabsDiv}>
              <TabsMobile drawerMode pages={pages(testCase)} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        ) : isLoading ? (
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100vh - 265px)',
            }}
          >
            <img src={noData} alt="" />
          </div>
        )}
      </div>
      <ReportBugModal
        openDelModal={bugModal}
        setOpenDelModal={async () => {
          setBugModal(false);
        }}
        closeHandler={async () =>
          await statusUpdateHandler({
            testStatus: watch('testStatus'),
          })
        }
        setModalDismissed={setModalDismissed}
        clickHandler={
          userDetails?.activePlan === 'Free'
            ? () => {
                statusUpdateHandler({
                  testStatus: watch('testStatus'),
                });
              }
            : () => {
                setReportBug(true);
                setEditRecord(allData?.[viewTestCaseIndex]);
              }
        }
        locked={userDetails?.activePlan === 'Free'}
      />
    </>
  );
};

ViewTestCase.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  setViewTestCaseIndex: PropTypes.func.isRequired,
  viewTestCaseIndex: PropTypes.number.isRequired,
  allData: PropTypes.any.isRequired,
  noHeader: PropTypes.bool.isRequired,
  setReportBug: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  refetchAll: PropTypes.func.isRequired,
  testRunStatus: PropTypes.any,
  testRunId: PropTypes.string,
  accessParticular: PropTypes.any.isRequired,
};
export default ViewTestCase;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: <Detail data={data} />,
  },
  {
    tabTitle: 'History',
    content: <History data={data} />,
  },
  {
    tabTitle: 'Activities',
    content: <Activities noHeader testCaseId={data?._id} />,
  },
  {
    tabTitle: 'More',
    content: <More data={data} />,
  },
];

const option = [
  { value: 'Not Tested', label: 'Not Tested' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'Passed', label: 'Passed' },
  { value: 'Failed', label: 'Failed' },
];
