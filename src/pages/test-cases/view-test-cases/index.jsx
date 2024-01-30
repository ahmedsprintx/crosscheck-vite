import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import SelectBox from 'components/select-box';
import ReportBugModal from 'components/report-bug-modal';
import ArrowLeft from 'components/icon-component/arrow-left';
import ArrowRight from 'components/icon-component/arrow-right';
import CrossIcon from 'components/icon-component/cross';
import Detail from './detail';
import More from './more';
import History from './history';
import Activities from './activities';
import TaskHistory from './task-history';

import { useAppContext } from 'context/app.context';

import { useGetTestCaseById, useUpdateStatusTestCase } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useToaster } from 'hooks/use-toaster';

import Dots from 'components/icon-component/dots';
import saveIcon from 'assets/save-icon.png';
import noData from 'assets/no-found.svg';

import style from './drawer.module.scss';
import Loader from 'components/loader';
import Tags from 'components/tags';
import TabsMobile from 'components/tabs-mobile';
import Menu from 'components/menu';
import DelIcon from 'components/icon-component/del-icon';
import EditIcon from 'components/icon-component/edit-icon';

const ViewTestCase = ({
  setDrawerOpen,
  setViewTestCaseId,
  viewTestCaseId,
  setAllowResize,
  setReportBug,
  setDelModal,
  setEditRecord,
  noHeader,
  refetchAll = () => {},
  testRunStatus = false,
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

  const { userDetails } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const testCaseId = searchParams.get('testCaseId');
  const [open, setOpen] = useState();

  const [bugModal, setBugModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editCaseStatus, setEditCaseStatus] = useState(false);

  const { toastError, toastSuccess } = useToaster();

  const { data: _testCaseData = {}, refetch, isLoading } = useGetTestCaseById(viewTestCaseId);

  const { testCase = {} } = _testCaseData;

  const option = [
    {
      title: 'Edit',
      compo: (
        <div>
          <EditIcon />
        </div>
      ),
      click: () => {
        setAllowResize && setAllowResize(true);
        setEditRecord(testCase._id);
        setOpen(false);
      },
    },

    {
      title: 'Delete',
      compo: (
        <div className={style.deleteIcon}>
          <DelIcon />
        </div>
      ),
      click: () => {
        setDelModal({ open: true, name: testCase?.testCaseId, id: testCase?._id });
        setOpen(false);
      },
    },
  ];

  useEffect(() => {
    if (testCase && !_.isEmpty(testCase)) {
      setValue('testStatus', testCase?.status);
    }
  }, [testCase]);

  const { mutateAsync: _updateStatusTestCase } = useUpdateStatusTestCase();

  const statusUpdateHandler = async (data) => {
    const res = await _updateStatusTestCase({
      id: testCase._id,
      body: data,
    });
    toastSuccess(res?.msg);
    reset();
    setModalDismissed(false);
    setEditCaseStatus(false);
    refetchAll(testCase._id, 'edit', res?.testCaseData);
    await refetch();
  };

  const onStatusUpdate = async (data) => {
    try {
      if (watch('testStatus') === 'Failed' && !modalDismissed) {
        setBugModal(true);
      } else {
        statusUpdateHandler(data);
      }
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className={style.hover}
              id={'prevButton'}
              onClick={() => {
                if (testCase?.previousTestCase?.[0]?._id && testCaseId) {
                  setSearchParams({
                    testCaseId: testCase?.previousTestCase?.[0]?.testCaseId,
                  });
                } else if (testCase?.previousTestCase?.[0]?._id) {
                  setViewTestCaseId(testCase?.previousTestCase?.[0]?._id);
                }
              }}
            >
              <ArrowLeft type={!testCase?.previousTestCase?.[0]?._id} />
              <div className={style.tooltip}>
                <p>Back</p>
              </div>
            </div>
            <span className={style.headerText}>{testCase?.testCaseId}</span>
            <div
              className={style.hover}
              id={'nextButton'}
              onClick={() => {
                if (testCase?.nextTestCase?.[0]?._id && testCaseId) {
                  setSearchParams({
                    testCaseId: testCase?.nextTestCase?.[0]?.testCaseId,
                  });
                } else if (testCase?.nextTestCase?.[0]?._id) {
                  setViewTestCaseId(testCase?.nextTestCase?.[0]?._id);
                }
              }}
            >
              <ArrowRight type={!testCase?.nextTestCase?.[0]?._id} />
              <div className={style.tooltip}>
                <p>Next</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {testRunStatus && <p className={style.tag}>Tested</p>}
            <div
              onClick={() => {
                setDrawerOpen(false);
                setViewTestCaseId('');
                if (testCaseId) {
                  setSearchParams({});
                }
              }}
              className={style.hover1}
            >
              <CrossIcon />
            </div>
          </div>
        </div>
        {testCase?._id && !isLoading ? (
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
                <span>Status </span>
              </div>
              <div className={style.innerRight}>
                {testCase?.status && !editCaseStatus ? (
                  <span
                    onClick={
                      userDetails?.role !== 'Developer'
                        ? (e) => {
                            e.preventDefault();
                            setEditCaseStatus(true);
                          }
                        : () => {}
                    }
                    data-cy="status-click-viewtestcase"
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
                          options={statusOptions}
                          placeholder={testCase?.status ? testCase?.status : 'Select Status'}
                          defaultValue={testCase?.status && [testCase?.status]}
                          errorMessage={errors?.testStatus?.message}
                          dynamicClass={style.zIndex}
                          id="viewtestcase-statuschange-selectbox"
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
                        data-cy="viewtestcase-statuschange-submit-btn"
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
              <div className={style.tabsIconDiv}>
                <div
                  className={style.hover}
                  onClick={() => {
                    setOpen((pre) => !pre);
                  }}
                >
                  <Dots />
                  <div className={style.tooltip}>
                    <p>Menu</p>
                  </div>
                </div>
              </div>
              <div className={style.menuDiv}>{open && <Menu menu={option.filter((x) => x.title)} />}</div>
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
        closeHandler={async () => {
          await statusUpdateHandler({
            testStatus: watch('testStatus'),
          });
        }}
        clickHandler={
          userDetails?.activePlan === 'Free'
            ? () => {
                statusUpdateHandler({
                  testStatus: watch('testStatus'),
                });
              }
            : () => {
                setReportBug(true);
                setEditRecord(testCase._id);
              }
        }
        locked={userDetails?.activePlan === 'Free'}
        setOpenDelModal={() => {
          setBugModal(false);
        }}
        setModalDismissed={setModalDismissed}
      />
      {open && <div className={style.backdropDiv} onClick={() => setOpen(false)}></div>}
    </>
  );
};
ViewTestCase.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  setViewTestCaseId: PropTypes.func.isRequired,
  viewTestCaseId: PropTypes.string,
  setAllowResize: PropTypes.func.isRequired,
  setReportBug: PropTypes.func.isRequired,
  setDelModal: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  refetchAll: PropTypes.func,
  testRunStatus: PropTypes.bool,
};

export default ViewTestCase;

const pages = (data) => [
  {
    tabTitle: 'Detail',
    content: <Detail data={data} />,
  },
  {
    tabTitle: 'Task History',
    content: <TaskHistory data={data} />,
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

const statusOptions = [
  { value: 'Not Tested', label: 'Not Tested' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'Passed', label: 'Passed' },
  { value: 'Failed', label: 'Failed' },
];
