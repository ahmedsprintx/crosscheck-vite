import { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// NOTE: components
import GenericTable from 'components/generic-table';
import SplitPane from 'components/split-pane/split-pane';
import Button from 'components/button';
import Loader from 'components/loader';
import MultiColorProgressBar from 'components/progress-bar';

// NOTE: utils
import { columnsData } from './helper';
import { debounce as _debounce, isEmpty as _isEmpty, pick as _pick } from 'utils/lodash';

import right from 'assets/arrow-right.svg';
import noData from 'assets/no-found.svg';

import Checkbox from 'components/checkbox';
import MainWrapper from 'components/layout/main-wrapper';
import CloseTestRun from './close-test-run';
import { useCloseTestRuns, useGetTestRunById } from 'hooks/api-hooks/test-runs/test-runs.hook';
import { formattedDate } from 'utils/date-handler';
import { useToaster } from 'hooks/use-toaster';
import ViewTestCase from './view-test-cases';
import ReportBug from './report-bug';
import { useProjectOptions } from './helper';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import WarningTestRun from './warning-test-run';
import SelectBox from 'components/select-box';

import style from './test-run.module.scss';
const TestRunSingle = ({ noHeader, runId }) => {
  const { data = {} } = useProjectOptions();

  const { userDetails } = useAppContext();

  const { control, register, setError, watch } = useForm();
  const ref = useRef();
  const { id } = useParams();
  const [viewTestCase, setViewTestCase] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [viewTestCaseIndex, setViewTestCaseIndex] = useState(0);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [closeTestRun, setCloseTestRun] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const [reportBug, setReportBug] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState({});
  const [testRun, setTestRun] = useState({});
  const [search, setSearch] = useState('');

  const [warning, setWarning] = useState({ open: false, msg: '' });

  const [sizes, setSizes] = useState(['20%', 'auto']);
  useEffect(() => {
    if (viewTestCase) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['65%', '35%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [viewTestCase]);

  const {
    data: _testRunData,
    refetch,
    isLoading: _isLoading,
  } = useGetTestRunById({
    id: noHeader ? runId : id,
    tested: watch('tested') || 'all',
    search,
  });
  useEffect(() => {
    if (_testRunData?.testRun && !_isEmpty(_testRunData?.testRun)) {
      let values = _pick(_testRunData?.testRun, [
        'runId',
        'name',
        'status',
        'projectId',
        'createdBy',
        'notTestedCount',
        'testedCount',
        'description',
        'priority',
        'dueDate',
        'assignee',
        'updatedAt',
        'createdAt',
        'dueDate',
        'closedDate',
        'testCases',
      ]);
      values = {
        ...values,
      };
      setTestRun(values);
    }
  }, [_testRunData, watch('tested')]);

  const { mutateAsync: _closeTestRunHandler, isLoading: _isCloseLoading } = useCloseTestRuns();
  const closeHandler = async () => {
    try {
      const res = await _closeTestRunHandler(noHeader ? runId : id);
      setCloseTestRun(false);
      await refetch();
      toastSuccess(res?.msg);
    } catch (error) {
      setCloseTestRun(false);
      error?.msg?.includes('not tested') && setWarning({ open: true, msg: error.msg });

      !error?.msg?.includes('not tested') && toastError(error, setError);
    }
  };

  return (
    <>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <SplitPane ref={ref} sizes={sizes} onChange={setSizes} allowResize={viewTestCase}>
          <MainWrapper
            title="Test Run"
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            searchField
            onSearch={_debounce((e) => {
              setSearch(e.target.value);
            }, 1000)}
            onClear={_debounce(() => {
              setSearch('');
            }, 1000)}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            noHeader={noHeader}
          >
            {_isLoading ? (
              <Loader />
            ) : (
              <>
                <div className={style.pathDiv}>
                  <Link to="/test-run">
                    <span className={style.grey}> Test Run </span>
                  </Link>
                  <img src={right} height={14} width={14} alt="" />
                  <span className={style.blue}>
                    {testRun?.name} ({formattedDate(testRun?.createdAt, 'MMM d')}) - {testRun?.runId}
                  </span>
                </div>
                <div className={style.descriptionDiv}>
                  <span className={style.descriptionHeading}> Description: </span>
                  <p className={style.description}>{testRun?.description}</p>
                </div>
                <div className={style.infoDiv}>
                  <div>
                    <span className={style.infoHeading}>Priority:</span>
                    <p className={style.infoText}>{testRun?.priority}</p>
                  </div>
                  <div>
                    <span className={style.infoHeading}>Due Date:</span>
                    <p className={style.infoText}>{formattedDate(testRun?.dueDate, 'd MMM, yyyy')}</p>
                  </div>
                  <div>
                    <span className={style.infoHeading}>Assignee:</span>
                    <p className={style.infoText}>{testRun?.assignee?.name}</p>
                  </div>
                </div>
                <div className={style.infoDivLower}>
                  <div className={style.singleDiv}>
                    <span className={style.infoHeading}>Progress:</span>
                    <MultiColorProgressBar
                      readings={[
                        testRun?.testedCount && {
                          name: 'testedCount',
                          value: (testRun.testedCount / testRun?.testCases?.length) * 100,
                          color: '#34C369',
                          tooltip: `Tested (${testRun.testedCount})`,
                        },
                        testRun?.notTestedCount && {
                          name: 'notTestedCount',
                          value: (testRun?.notTestedCount / testRun?.testCases?.length) * 100,
                          color: '#F96E6E',
                          tooltip: `Not Tested (${testRun?.notTestedCount})`,
                        },
                      ]}
                    />
                    <p className={style.infoText}>
                      {testRun?.testCases?.length > 0 && `${testRun.testedCount}/${testRun?.notTestedCount}`}
                    </p>
                  </div>
                  <div className={style.singleDiv}>
                    <span className={style.infoHeading} style={{ width: '-webkit-fill-available' }}>
                      Show Test Cases:
                    </span>
                    <SelectBox
                      noLabel
                      control={control}
                      name={'tested'}
                      dynamicClass={style.selectBoxClass}
                      placeholder="All"
                      options={testedOptions}
                    />
                  </div>
                </div>
                <div
                  className={style.mainClass}
                  style={{
                    marginTop: '10px',
                  }}
                >
                  <h6> Test Cases ({testRun?.testCases?.length})</h6>
                  <div className={style.flex}></div>
                </div>
                {testRun?.testCases?.length && !_isLoading ? (
                  <div className={style.tableWidth}>
                    <GenericTable
                      ref={ref}
                      columns={columnsData({
                        testCases: testRun?.testCases,
                        control,
                        watch,
                        register,
                        setViewTestCase,
                        openDelModal,
                        setOpenDelModal,
                        isHoveringName,
                        setIsHoveringName,
                        setViewTestCaseIndex,
                      })}
                      dataSource={testRun?.testCases || []}
                      height={noHeader ? 'calc(100vh - 360px)' : 'calc(100vh - 300px)'}
                      selectable={true}
                      renderSelector={(selectedRowChecked) => (
                        <div className={style.checkDiv}>
                          <Checkbox containerClass={style.checkboxContainer1} checked={selectedRowChecked} />
                        </div>
                      )}
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
                ) : _isLoading ? (
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

                <div className={style?.btnDiv}>
                  <Permissions
                    allowedRoles={['Admin', 'Project Manager']}
                    currentRole={userDetails?.role}
                    accessParticular={
                      userDetails?.role === 'QA' &&
                      (userDetails?.id === testRun?.createdBy?._id || userDetails?.id === testRun?.assignee?._id)
                    }
                  >
                    {testRun?.status !== 'Closed' && (
                      <Button
                        text={'Close Run'}
                        handleClick={() => setCloseTestRun(true)}
                        btnClass={style.backclassbtn}
                      />
                    )}
                  </Permissions>
                </div>
              </>
            )}
          </MainWrapper>
          <div className={style.flex1}>
            {viewTestCase && !reportBug && (
              <div className={style.flex1}>
                <ViewTestCase
                  setDrawerOpen={setViewTestCase}
                  viewTestCase={viewTestCase}
                  setViewTestCaseIndex={setViewTestCaseIndex}
                  viewTestCaseIndex={viewTestCaseIndex}
                  allData={testRun?.testCases}
                  testRunId={noHeader ? runId : id}
                  noHeader={noHeader}
                  testRunStatus={true}
                  setReportBug={setReportBug}
                  setEditRecord={setEditRecord}
                  refetchAll={refetch}
                  accessParticular={
                    userDetails?.role === 'QA' &&
                    (userDetails?.id === testRun?.createdBy?._id || userDetails?.id === testRun?.assignee?._id)
                  }
                />
              </div>
            )}
            {reportBug && (
              <ReportBug
                noHeader={noHeader}
                options={data}
                editRecord={editRecord?.testCaseId}
                setReportBug={setReportBug}
                setEditRecord={setEditRecord}
                setViewTestCaseIndex={setViewTestCaseIndex}
                allData={testRun?.testCases}
                testRunId={noHeader ? runId : id}
                refetchAll={refetch}
              />
            )}

            {/* NOTE: {===============DoNot remove this div this belongs to hotkeys =================} */}
            {(reportBug || viewTestCase) && (
              <div
                id="splitpane"
                style={{ display: 'none' }}
                onClick={() => {
                  setReportBug(false);
                  setViewTestCase(false);
                  setViewTestCaseIndex(0);
                  setEditRecord(null);
                }}
              />
            )}
          </div>
        </SplitPane>
      </div>

      <CloseTestRun
        closeTestRun={closeTestRun}
        setCloseTestRun={setCloseTestRun}
        clickHandler={closeHandler}
        _isCloseLoading={_isCloseLoading}
      />

      <WarningTestRun
        closeTestRun={warning?.open}
        setCloseTestRun={() => setWarning({ open: false, msg: '' })}
        msg={warning?.msg}
      />
    </>
  );
};
TestRunSingle.propTypes = {
  noHeader: PropTypes.bool.isRequired,
  runId: PropTypes.string.isRequired,
};

export default TestRunSingle;

const testedOptions = [
  { label: 'All', value: 'all' },
  { label: 'Tested', value: 'tested' },
  { label: 'Not Tested', value: 'not-tested' },
];
