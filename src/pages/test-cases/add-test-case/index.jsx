import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import GenericTable from 'components/generic-table';
import FilterHeader from './header';
import ColumnModal from './choose-columns-modal';
import _ from 'lodash';

import deleteBtn from 'assets/deleteButton.svg';
import run from 'assets/CreateRun.svg';
import noData from 'assets/no-found.svg';
import style from './add.module.scss';
import { columnsData } from './helper';
import Checkbox from 'components/checkbox';
import Drawer from './drawer/index';
import DeleteModal from 'components/delete-modal';
import BulkEditModal from 'components/bulk-edit-modal';
import SplitPane from 'components/split-pane/split-pane';
import MainWrapper from 'components/layout/main-wrapper';
import { formattedDate } from 'utils/date-handler';
import { useForm } from 'react-hook-form';
import ViewTestCase from '../view-test-cases';
import {
  useBulkEditTestCase,
  useCreateTestCase,
  useDeleteTestCase,
  useGetTestCasesByFilter,
  useImportTestCase,
  useUpdateOrderTestCase,
  useUpdateTestCase,
} from 'hooks/api-hooks/test-cases/test-cases.hook';
import { initialFilter, useProjectOptions } from '../helper';
import { useToaster } from 'hooks/use-toaster';
import ReportBug from '../report-bug';
import { sortData } from 'utils/sorting-handler';
import DelIcon from 'components/icon-component/del-icon';
import Loader from 'components/loader';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import TestRunIcon from 'components/icon-component/test-run';
import DrawerForRun from 'pages/test-runs/drawer';

const AddTestCaseData = ({ noHeader = false, projectId }) => {
  const containerRef = useRef(null);
  const { userDetails } = useAppContext();
  const { data = {} } = useProjectOptions();

  const { mutateAsync: _getFilteredTestCasesHandler, isLoading: _isLoading } = useGetTestCasesByFilter();

  const { control, watch, setError, setValue } = useForm();

  const { toastError, toastSuccess } = useToaster();

  const [choseColModal, setChoseColModal] = useState(false);
  const [editRecord, setEditRecord] = useState(false);
  const [selectedRunRecords, setSelectedRunRecords] = useState([]);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [viewTestCase, setViewTestCase] = useState(false);
  const [viewTestRun, setViewTestRun] = useState(false);
  const [reportBug, setReportBug] = useState(false);

  const [viewTestCaseId, setViewTestCaseId] = useState('');
  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });

  const [filters, setFilters] = useState({
    ...{
      page: 0,
      perPage: 25,
    },
    ...initialFilter,
  });

  const [testCases, setTestCases] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [sizes, setSizes] = useState(['20%', 'auto']);
  const [bugSizes, setBugSizes] = useState(['20%', 'auto']);
  const [allowResize, setAllowResize] = useState(false);

  useEffect(() => {
    if (allowResize) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else setSizes(['70%', '30%']);
    } else {
      setSizes(['100%', '0%']);
    }
  }, [allowResize]);

  useEffect(() => {
    if (viewTestCase) {
      setBugSizes(['65%', '35%']);
    } else {
      setBugSizes(['100%', '0%']);
    }
  }, [viewTestCase]);

  const fetchTestCases = async (filters) => {
    if (watch('projectId') && watch('milestoneId') && watch('featureId')) {
      const filteredfilter = _.pickBy(filters, (value, key) => {
        if (key === 'createdAt' || key === 'lastTestedAt') {
          return !(value.start === null);
        }
        return true;
      });

      const response = await _getFilteredTestCasesHandler({
        ...filteredfilter,
        ...(watch('projectId') && { projects: [watch('projectId')] || [] }),
        ...(watch('milestoneId') && {
          milestones: [watch('milestoneId')] || [],
        }),
        ...(watch('featureId') && { features: [watch('featureId')] || [] }),
        ...(watch('search') && { search: watch('search') || '' }),
      });

      setTestCases((pre) => ({
        ...(pre || {}),
        count: response.count || 0,
        testcases: filters?.page === 1 ? response?.testcases : [...(pre.testcases || []), ...response.testcases],
      }));
      setSelectedRecords([]);
    }
  };

  useEffect(() => {
    fetchTestCases(filters);
  }, [filters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [watch('projectId'), watch('milestoneId'), watch('featureId'), watch('search')]);

  // NOTE: handleScroll

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testCases.count !== testCases?.testcases?.length && !_isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({
          ...prev,
          page: prev?.page + 1,
        }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading]);

  useEffect(() => {
    if (!_isLoading) {
      containerRef?.current?.addEventListener('scroll', handleScroll);
    } else if (_isLoading) containerRef?.current?.removeEventListener('scroll', handleScroll);

    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, testCases, _isLoading]);

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _.debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  useEffect(() => {
    if (testCases?.testcases?.length) {
      const sortedData = sortData(testCases?.testcases, sortFilters.sortBy, sortFilters.sort);

      setTestCases((pre) => ({ ...pre, testcases: sortedData }));
    }
  }, [sortFilters]);

  const resetHandler = () => {
    setValue('testObjective', {});
    setValue('preConditions', {});
    setValue('testSteps', {});
    setValue('expectedResults', {});
    setValue('weightage', 1);
    setValue('testType', []);
    setValue('relatedTicketId', '');
  };
  const { mutateAsync: _createTestCaseHandler, isLoading: _createIsLoading } = useCreateTestCase();
  const { mutateAsync: _updateTestCaseHandler, isLoading: _updateIsLoading } = useUpdateTestCase();
  const submitHandler = async (data, resetHandler) => {
    try {
      const formData = {
        ...data,
        projectId: watch('projectId'),
        milestoneId: watch('milestoneId'),
        featureId: watch('featureId'),
        // NOTE: state: editRecord ? watch('state') : 'active',
        testObjective: {
          ...data.testObjective,
          description: JSON.stringify(data.testObjective?.description),
        },
        testSteps: {
          ...data.testSteps,
          description: JSON.stringify(data.testSteps?.description),
        },
        expectedResults: {
          ...data.expectedResults,
          description: JSON.stringify(data.expectedResults?.description),
        },
        preConditions: {
          ...data.preConditions,
          description: JSON.stringify(data.preConditions?.description),
        },
      };

      const res = editRecord
        ? await _updateTestCaseHandler({ id: editRecord, body: formData })
        : await _createTestCaseHandler(formData);
      resetHandler();
      setEditRecord(null);
      toastSuccess(res.msg);
      refetchHandler(editRecord, editRecord ? 'edit' : 'add', res?.testCaseData);
      // NOTE: fetchTestCases(filters);
      !data.addAnother && setAllowResize(false);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { mutateAsync: _deleteTestCaseHandler } = useDeleteTestCase();

  const onDelete = async (e, bulk) => {
    try {
      const res = await _deleteTestCaseHandler({
        body: {
          toDelete: bulk ? selectedRecords : [delModal?.id],
        },
      });
      toastSuccess(res.msg);
      refetchHandler(bulk ? selectedRecords : [delModal?.id], 'delete');
      // NOTE: await fetchTestCases(filters);
      setDelModal(() => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };

  const { mutateAsync: _updateOrderHandler } = useUpdateOrderTestCase();
  const onOrderUpdate = async (e) => {
    try {
      const id = testCases?.testcases[e?.source?.index]?._id;
      const body = {
        newOrder: e?.destination?.index,
      };

      const res = await _updateOrderHandler({ id, body });
      // NOTE: fetchTestCases(filters);
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const downloadCSV = (data) => {
    const url = URL.createObjectURL(new Blob([data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'result.csv'); // NOTE: Replace with desired filename and extension
    document.body.appendChild(link);
    link.click();

    // NOTE: Cleanup the temporary URL
    window.URL.revokeObjectURL(url);
  };

  const { mutateAsync: _importTestCaseHandler } = useImportTestCase();

  const submitFileImportHandler = async (data) => {
    try {
      if (data?.importTestCases[0]?.attachment) {
        const body = {
          projectDetails: {
            projectId: watch('projectId'),
            milestoneId: watch('milestoneId'),
            featureId: watch('featureId'),
          },
          csvBase64: data?.importTestCases[0]?.attachment,
        };

        const res = await _importTestCaseHandler({ body });

        if (res) {
          downloadCSV(res);
          setTestCases({ count: 0, testcases: [] });
          await fetchTestCases({ ...filters, page: 1 });
        }
      }
    } catch (error) {
      toastError(
        error.msg
          ? error
          : {
              msg: 'Error Occurred in file reading',
            },
      );
    }
  };
  const csvData = useMemo(() => {
    return testCases?.testcases?.length > 0
      ? testCases?.testcases?.map((x) => ({
          testCaseNum: x?.testCaseNum || ' ',
          testCaseId: x?.testCaseId || ' ',
          project: x?.projectId?.name || ' ',
          milestone: x?.milestoneId?.name || ' ',
          feature: x?.featureId?.name || ' ',
          testType: x?.testType || ' ',
          weightage: x?.weightage || ' ',
          relatedTickedId: x?.relatedTickedId || ' ',
          status: x?.status || ' ',

          createdBy: x?.createdBy?.name || ' ',
          lastTestedBy: x?.lastTestedBy?.name || ' ',
          createdAt: formattedDate(x?.createdAt, 'dd MMM , yy') || ' ',
          lastTestedAt: formattedDate(x?.lastTestedAt, 'dd MMM , yy') || ' ',
          testObjective: `${x?.testObjective?.text}` || ' ',
          preConditions: `${x?.preConditions?.text}` || ' ',
          testSteps: `${x?.testSteps?.text}` || '',
          expectedResults: `${x?.expectedResults?.text}` || ' ',
        }))
      : [];
  }, [testCases]);

  const refetchHandler = (id, scenario, newData) => {
    const index = id && scenario !== 'delete' ? testCases?.testcases?.findIndex((x) => x?._id === id) : null;
    if (scenario === 'add') {
      setTestCases((pre) => ({
        ...pre,
        count: (pre.count || 0) + 1,
        testcases: testCases.count < 25 * filters.page ? [...(pre.testcases || []), newData] : pre.testcases || [],
      }));
    } else if (id && scenario === 'edit') {
      const updatedTestCases = testCases?.testcases?.map((testcase, i) => {
        if (i === index) {
          return newData; // NOTE: Update the element at the specified index
        } else {
          return testcase; // NOTE: Keep the other elements unchanged
        }
      });
      setTestCases((pre) => ({ ...pre, testcases: updatedTestCases }));
    } else if (scenario === 'delete' && id?.length) {
      const updatedTestCases = testCases?.testcases?.filter((testCase) => !id.includes(testCase?._id));
      setTestCases((pre) => ({
        ...pre,
        count: (pre.count || 0) - id?.length,
        testcases: updatedTestCases,
      }));
    } else if (scenario === 'bulkEdit' && id?.length) {
      const updatedTestCases = testCases?.testcases?.map((testCase) => {
        const newTestCase = newData.find((newTestCase) => newTestCase?._id === testCase?._id);
        return newTestCase || testCase;
      });
      setTestCases((pre) => ({
        ...pre,
        count: pre.count,
        testcases: updatedTestCases,
      }));
    }
  };

  const { mutateAsync: _bulkEditHandler, isLoading: _isBulkEditLoading } = useBulkEditTestCase();
  const onBulkEdit = async (data, setError) => {
    try {
      const formData = {
        ...data,
        testCaseIds: data.selectedRecords,
      };
      if (data.testSteps) {
        formData.testSteps = {
          ...data.testSteps,
          description: JSON.stringify(data.testSteps.description),
        };
      }
      if (data.preConditions) {
        formData.preConditions = {
          ...data.preConditions,
          description: JSON.stringify(data.preConditions.description),
        };
      }

      const res = await _bulkEditHandler({ body: formData });
      toastSuccess(res?.msg);
      setBulkEdit(false);
      setSelectedRecords([]);
      setSelectedRunRecords([]);
      refetchHandler(data.selectedRecords, 'bulkEdit', res?.testCaseData);
    } catch (error) {
      toastError(error, setError);
    }
  };
  return (
    <>
      <div style={{ height: !noHeader ? '100vh' : '85vh', overflow: 'hidden' }}>
        <SplitPane
          sizes={viewTestCase ? bugSizes : sizes}
          onChange={viewTestCase ? setBugSizes : setSizes}
          allowResize={viewTestCase ? viewTestCase : allowResize}
        >
          <MainWrapper
            title={'Test Cases'}
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            searchField
            noHeader={noHeader}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            onSearch={_.debounce((e) => {
              setValue('search', e.target.value);
            }, 1000)}
          >
            <div className={style.main}>
              <FilterHeader
                projectSpecific={projectId}
                allowResize={allowResize}
                submitFileImportHandler={submitFileImportHandler}
                setAllowResize={setAllowResize}
                setSelectedRecords={setSelectedRecords}
                csvData={csvData}
                {...{ control, watch, setValue }}
              />
              {_isLoading && filters?.page < 2 ? (
                <Loader />
              ) : (
                <>
                  {testCases?.testcases?.length ? (
                    <div>
                      <div
                        className={style.mainClass}
                        style={{
                          marginTop: '10px',
                        }}
                      >
                        <h6>
                          Test Cases ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                          {testCases?.count})
                        </h6>
                        <div className={style.flex}>
                          {_.every(
                            selectedRunRecords,
                            (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                          ) &&
                            selectedRunRecords.length > 0 && (
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                {' '}
                                <div
                                  className={style.change}
                                  src={run}
                                  alt=""
                                  onClick={() => {
                                    setBulkEdit(true);
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    padding: '7px',
                                    border: '1px solid var(--text-color3)',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Bulk Edit</p>
                                </div>
                              </Permissions>
                            )}
                          {_.every(
                            selectedRunRecords,
                            (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                          ) &&
                            selectedRunRecords.length > 1 && (
                              <div
                                className={style.change}
                                src={run}
                                alt=""
                                onClick={() => {
                                  setViewTestRun(true);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  height: '30px',
                                  width: '36px',
                                  border: '1px solid var(--text-color3)',
                                  borderRadius: '3px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <TestRunIcon />
                                <div className={style.tooltip}>
                                  <p>Test Run</p>
                                </div>
                              </div>
                            )}

                          {selectedRecords.length > 0 && (
                            <>
                              <div
                                className={style.change}
                                src={deleteBtn}
                                alt=""
                                id={'deleteButton'}
                                style={{
                                  cursor: 'pointer',
                                  height: '30px',
                                  width: '36px',
                                  border: '1px solid var(--text-color3)',
                                  borderRadius: '3px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                onClick={() =>
                                  selectedRecords.length > 0
                                    ? setDelModal({ open: true, bulk: true })
                                    : toastError({
                                        msg: 'Select Test Cases to delete',
                                      })
                                }
                              >
                                <DelIcon />
                                <div className={style.tooltip}>
                                  <p>Delete</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={style.tableWidth} style={{ position: 'relative' }}>
                        <GenericTable
                          selectedItem={selectedRecords}
                          containerRef={containerRef}
                          columns={columnsData({
                            testCases: testCases?.testcases,
                            delModal,
                            setDelModal,
                            setViewTestCase,
                            selectedRecords,
                            setSelectedRecords,
                            setEditRecord,
                            setAllowResize,
                            setViewTestCaseId,
                            setSelectedRunRecords,
                          })}
                          draggable={true}
                          separateDraggingElement
                          dataSource={testCases?.testcases || []}
                          height={noHeader ? 'calc(100vh - 295px)' : 'calc(100vh - 225px)'}
                          selectable={true}
                          filters={sortFilters}
                          onClickHeader={({ sortBy, sort }) => {
                            handleFilterChange({ sortBy, sort });
                          }}
                          onDragUpdate={onOrderUpdate}
                          renderSelector={(selectedRowChecked) => (
                            <>
                              <div className={style.checkDiv}>
                                <Checkbox containerClass={style.checkboxContainer1} checked={selectedRowChecked} />
                              </div>
                            </>
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
                        {_isLoading && filters?.page > 1 && <Loader tableMode />}
                      </div>
                      <ColumnModal
                        choseColModal={choseColModal}
                        setChoseColModal={setChoseColModal}
                        columns={columnsData({
                          delModal,
                          setDelModal,
                          setViewTestCase,
                        })}
                      />
                      <DeleteModal
                        openDelModal={!!delModal.open}
                        setOpenDelModal={() => setDelModal({ open: false })}
                        name="test case"
                        cancelText="No, Keep this test case"
                        clickHandler={(e) => onDelete(e, delModal.bulk)}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: noHeader ? 'calc(100vh - 288px)' : 'calc(100vh - 214px)',
                      }}
                    >
                      <img src={noData} alt="" />
                    </div>
                  )}
                </>
              )}
            </div>
          </MainWrapper>
          <div className={style.flex1}>
            {allowResize && (
              <Drawer
                setDrawerOpen={setAllowResize}
                editRecord={editRecord}
                setEditRecord={setEditRecord}
                drawerOpen={allowResize}
                noHeader={noHeader}
                resetHandler={resetHandler}
                submitHandler={submitHandler}
                addMore
                _createUpdateIsLoading={_createIsLoading || _updateIsLoading}
              />
            )}

            {viewTestCase && !editRecord && !reportBug && (
              <ViewTestCase
                setDrawerOpen={setViewTestCase}
                setDelModal={setDelModal}
                setAllowResize={setAllowResize}
                viewTestCase={viewTestCase}
                setViewTestCaseId={setViewTestCaseId}
                viewTestCaseId={viewTestCaseId}
                refetchAll={refetchHandler}
                noHeader={noHeader}
                setReportBug={setReportBug}
                setEditRecord={setEditRecord}
              />
            )}

            {reportBug && (
              <ReportBug
                noHeader={noHeader}
                options={data}
                editRecord={editRecord}
                setReportBug={setReportBug}
                setEditRecord={setEditRecord}
                refetchAll={refetchHandler}
              />
            )}

            {viewTestRun && (
              <DrawerForRun
                setDrawerOpen={setViewTestRun}
                editRecord={null}
                setEditRecord={() => {}}
                refetch={() => {}}
                drawerOpen={viewTestRun}
                noHeader={noHeader}
                projectId={projectId ? projectId : selectedRunRecords[0]['projectId']?._id}
                selectedRunRecords={selectedRunRecords}
              />
            )}
            {/* NOTE: {===============DONot remove this div this belongs to hotkeys =================} */}
            {(viewTestCase || allowResize) && (
              <div
                id="splitpane"
                style={{ display: 'none' }}
                onClick={() => {
                  setAllowResize(false);
                  setViewTestCase(false);
                  setViewTestCaseId('');
                  setEditRecord(null);
                }}
              />
            )}
          </div>
        </SplitPane>
      </div>

      {bulkEdit && (
        <BulkEditModal
          type={'testCase'}
          open={bulkEdit}
          handleClose={() => setBulkEdit(false)}
          projectId={projectId ? projectId : selectedRunRecords[0]['projectId']?._id}
          milestoneId={watch('milestoneId')}
          featureId={watch('featureId')}
          selectedRecords={selectedRecords}
          options={data}
          onSubmit={onBulkEdit}
          isLoading={_isBulkEditLoading}
        />
      )}
    </>
  );
};
AddTestCaseData.propTypes = {
  noHeader: PropTypes.bool,
  projectId: PropTypes.string.isRequired,
};

export default AddTestCaseData;
