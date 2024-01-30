import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, every, pick, pickBy } from 'utils/lodash';
import PropTypes from 'prop-types';
import SplitPane from 'components/split-pane/split-pane';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import MainWrapper from 'components/layout/main-wrapper';
import BulkEditModal from '../../components/bulk-edit-modal';
import Button from 'components/button';
import GenericTable from 'components/generic-table';
import DeleteModal from 'components/delete-modal';
import Loader from 'components/loader';
import ExportIcon from 'components/icon-component/export-icon';
import TestRunIcon from 'components/icon-component/test-run';
import DelIcon from 'components/icon-component/del-icon';
import Plus from 'components/icon-component/plus';
import CreateTaskModal from 'components/create-task-modal';
import Permissions from 'components/permissions';
import { columnsData, initialFilter, menuData, useProjectOptions } from './helper';
import FilterHeader from './header';
import ViewTestCases from './view-test-cases';
import Drawer from './add-test-case/drawer';
import ReportBug from './report-bug';
import DrawerForRun from 'pages/test-runs/drawer';

import { useAppContext } from 'context/app.context';

import {
  useBulkEditTestCase,
  useDeleteTestCase,
  useExportTestCases,
  useGetTestCasesByFilter,
  useUpdateStatusTestCase,
  useUpdateTestCase,
} from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useToaster } from 'hooks/use-toaster';
import { useCreateJiraTask, useCreateTask } from 'hooks/api-hooks/task/task.hook';

import { sortData } from 'utils/sorting-handler';
import { formattedDate } from 'utils/date-handler';

import deleteBtn from 'assets/deleteButton.svg';
import run from 'assets/CreateRun.svg';
import threeDots from 'assets/threeDots.svg';
import noData from 'assets/no-found.svg';
import FilterIcon from 'components/icon-component/filter-icon';
import FilterIconOrange from 'components/icon-component/filter-icon-orange';

import style from './test.module.scss';
import MobileMenu from 'components/mobile-menu';
import MenuIcon from 'components/icon-component/menu';
import FiltersDrawer from './filters-drawer';
import { downloadCSV } from 'utils/file-handler';
import { useCreateTestRun } from 'hooks/api-hooks/test-runs/test-runs.hook';
import EditIcon from 'components/icon-component/edit-icon';
import CreateTask from 'components/icon-component/create-task';
import ChangeStatus from 'components/icon-component/change-status';

const TestCases = ({ noHeader, projectId }) => {
  const ref = useRef();
  const containerRef = useRef(null);
  const { data = {} } = useProjectOptions();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const { control, watch, register, reset, setError, setValue } = useForm();

  const testCaseId = searchParams.get('testCaseId');

  const {
    control: control2,
    watch: watch2,
    register: register2,
    formState: { errors },
    setError: setError2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm();

  const [editRecord, setEditRecord] = useState(null);
  const [menu, setMenu] = useState(false);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedRunRecords, setSelectedRunRecords] = useState([]);
  const [delModal, setDelModal] = useState(false);
  const [viewTestCase, setViewTestCase] = useState(false);
  const [viewTestRun, setViewTestRun] = useState(false);
  const [allowFilterDrawer, setAllowFilterDrawer] = useState(false);

  const [bulkEdit, setBulkEdit] = useState(false);
  const [moreMenu, setMoreMenu] = useState(false);

  const [reportBug, setReportBug] = useState(false);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [viewTestCaseId, setViewTestCaseId] = useState('');
  const { userDetails } = useAppContext();
  const [viewBug, setViewBug] = useState(false);
  const [rightClickedRecord, setRightClickedRecord] = useState({});
  const [isHoveringName, setIsHoveringName] = useState({});

  const { toastSuccess, toastError } = useToaster();
  const [filtersCount, setFiltersCount] = useState(0);
  const [filters, setFilters] = useState({
    ...initialFilter,
    projectId: projectId ? [projectId] : [],
  });
  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });

  const [testCases, setTestCases] = useState({});

  const countAppliedFilters = () => {
    let count = 0;
    if (watch('projects')?.length > 0 && !noHeader) {
      count++;
    }
    if (watch('milestones')?.length > 0) {
      count++;
    }
    if (watch('features')?.length > 0) {
      count++;
    }
    if (watch('status')?.length > 0) {
      count++;
    }
    if (watch('createdBy')?.length > 0) {
      count++;
    }
    if (watch('createdAt')?.start !== undefined && watch('createdAt')?.start !== null) {
      count++;
    }
    if (watch('lastTestedAt')?.start !== undefined && watch('lastTestedAt')?.start !== null) {
      count++;
    }
    if (watch('lastTestedBy')?.length > 0) {
      count++;
    }
    if (watch('testType')?.length > 0) {
      count++;
    }
    if (watch('weightage')?.length > 0) {
      count++;
    }
    if (watch('state')?.length > 0) {
      count++;
    }
    if (watch('relatedTicketId')?.length > 0) {
      count++;
    }
    return setFiltersCount(count);
  };

  // NOTE: get users on frontend as per search query
  const handleFilterChange = debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);
  const { mutateAsync: _getAllTestCases, isLoading: _isLoading } = useGetTestCasesByFilter();

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testCases.count !== testCases?.testcases?.length && !_isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({
          ...prev,
          page: !_isLoading && prev?.page + 1,
        }));

        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoading]);

  useEffect(() => {
    if (!_isLoading) {
      containerRef?.current?.addEventListener('scroll', handleScroll);
    } else if (_isLoading) {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    }

    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, testCases, _isLoading]);

  useEffect(() => {
    if (testCases?.testcases?.length) {
      const sortedData = sortData(testCases?.testcases, sortFilters.sortBy, sortFilters.sort);

      setTestCases((pre) => ({ ...pre, testcases: sortedData }));
    }
  }, [sortFilters]);

  // NOTE: fetching TextCases

  const testCaseHandler = async (filters) => {
    const response = await _getAllTestCases(
      pickBy(filters, (value, key) => {
        if (key === 'createdAt' || key === 'lastTestedAt') {
          return !(value.start === null);
        }
        return true;
      }),
    );
    setSortFilters({ sortBy: '', sort: '' });
    setTestCases((pre) => ({
      ...(pre || {}),
      count: response.count || 0,
      testcases: filters?.page === 1 ? response?.testcases : [...(pre.testcases || []), ...response.testcases],
    }));
  };

  const { mutateAsync: _exportTestCases } = useExportTestCases();
  const exportHandler = async () => {
    try {
      const res = await _exportTestCases(
        pickBy(
          {
            ...filters,
            page: 0,
          },
          (value, key) => {
            if (key === 'createdAt' || key === 'lastTestedAt') {
              return !(value.start === null);
            }
            return true;
          },
        ),
      );
      if (res) {
        downloadCSV(res, `TestCases Export File ${new Date()}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTestCases = async (filters) => {
    try {
      await testCaseHandler(filters);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const _values = pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
      'retestDateStart',
      'retestDateEnd',
      'status',
    ]);

    if (_values.reportedBy) {
      _values.createdBy = _values?.reportedBy?.split(',') || [];
    }
    if (_values.status) {
      _values.status = _values?.status?.split(',') || [];
    }

    if (_values?.reportedAtStart && _values?.reportedAtEnd) {
      _values.createdAt = {
        start: new Date(_values?.reportedAtStart),
        end: new Date(_values?.reportedAtEnd),
      };
    }
    if (_values?.retestDateStart && _values?.retestDateEnd) {
      _values.lastTestedAt = {
        start: new Date(_values?.retestDateStart),
        end: new Date(_values?.retestDateEnd),
      };
    }

    delete _values.reportedBy;
    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;
    delete _values.retestDateStart;
    delete _values.retestDateStart;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, []);

  useEffect(() => {
    !_isLoading &&
      fetchTestCases(
        projectId
          ? { ...filters, projects: [projectId] }
          : {
              ...filters,
              ...(watch('createdBy') && { createdBy: watch('createdBy') }),
              ...(watch('status') && { status: watch('status') }),
              ...(watch('state') && { state: watch('state') }),
              ...(watch('createdAt.start') &&
                watch('createdAt.end') && {
                  createdAt: {
                    start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
                    end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
                  },
                }),

              ...(watch('lastTestedAt.start') &&
                watch('lastTestedAt.end') && {
                  lastTestedAt: {
                    start: formattedDate(watch('lastTestedAt.start'), 'yyyy-MM-dd'),
                    end: formattedDate(watch('lastTestedAt.end'), 'yyyy-MM-dd'),
                  },
                }),
            },
      );
  }, [filters]);

  useEffect(() => {
    if (projectId) {
      setTestCases({
        count: 0,
        testcases: [],
      });
      setFilters((pre) => ({ ...pre, projectId: projectId ? [projectId] : [] }));
    }
  }, [projectId]);

  // NOTE: Deleting Single orBulk Records
  const { mutateAsync: _deleteTestCaseHandler, isLoading: _deletingTc } = useDeleteTestCase();
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

  // NOTE: onFilter Apply
  const onFilterApply = debounce(() => {
    setTestCases({
      count: 0,
      testcases: [],
    });
    setFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('search') && { search: watch('search') }),
      ...(watch('projects') && { projects: watch('projects') || [] }),
      ...(watch('milestones') && { milestones: watch('milestones') || [] }),
      ...(watch('features') && { features: watch('features') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('createdBy') && { createdBy: watch('createdBy') || [] }),
      ...(watch('state') && { state: watch('state') || [] }),

      ...(watch('lastTestedBy') && {
        lastTestedBy: watch('lastTestedBy') || [],
      }),
      ...(watch('testType') && { testType: watch('testType') || [] }),
      ...(watch('weightage') && { weightage: watch('weightage') || [] }),
      ...(watch('createdAt') &&
        watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('lastTestedAt') &&
        watch('lastTestedAt.start') &&
        watch('lastTestedAt.end') && {
          lastTestedAt: {
            start: formattedDate(watch('lastTestedAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('lastTestedAt.end'), 'yyyy-MM-dd'),
          },
        }),
    }));
    countAppliedFilters();
    setAllowFilterDrawer(false);
    setIsOpen(false);
  }, 1000);

  const [sizes, setSizes] = useState(['20%', 'auto']);

  useEffect(() => {
    if (viewTestCase || viewTestRun || allowFilterDrawer) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['65%', '35%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [viewTestCase, viewTestRun || allowFilterDrawer]);

  const resetHandler = () => {
    setValue2('testObjective', {});
    setValue2('preConditions', {});
    setValue2('testSteps', {});
    setValue2('expectedResults', {});
    setValue2('weightage', '0');
    setValue2('testType', []);
    setValue2('relatedTicketId', '');
  };
  const { mutateAsync: _updateTestCaseHandler, isLoading: _updatingTestCase } = useUpdateTestCase();

  const submitHandler = async (data) => {
    try {
      const formData = {
        ...data,
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
      if (editRecord) {
        const res = await _updateTestCaseHandler({
          id: editRecord,
          body: formData,
        });

        resetHandler();
        setEditRecord();
        toastSuccess(res.msg);
        setViewTestCase(false);
        refetchHandler(editRecord, editRecord ? 'edit' : 'add', res?.testCaseData);
      }
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { mutateAsync: _createTaskHandler, isLoading: _createTaskIsLoading } = useCreateTask();
  const { mutateAsync: _createTestRunHandler, isLoading: _createRunIsLoading } = useCreateTestRun();

  const submitHandlerTask = async (data, formRunData) => {
    try {
      const [res, runRes] = await Promise.all([
        _createTaskHandler(data),
        formRunData && _createTestRunHandler(formRunData),
      ]);
      setSelectedRecords([]);
      setOpenTaskModal({ open: false });
      toastSuccess(`${res.msg} ${formRunData ? runRes.msg : ''}`);
    } catch (error) {
      toastError(error);
    }
  };
  const { mutateAsync: _createJiraTaskHandler, isLoading: _createJiraTaskIsLoading } = useCreateJiraTask();

  const submitHandlerJiraTask = async (id, body, formRunData) => {
    try {
      const [res, runRes] = await Promise.all([
        _createJiraTaskHandler({
          id,
          body,
        }),
        formRunData && _createTestRunHandler(formRunData),
      ]);
      toastSuccess(`${res.msg} ${formRunData ? runRes.msg : ''}`);
      setOpenTaskModal({ open: false });
      setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: URLWork
  useEffect(() => {
    if (testCaseId) {
      setViewTestCaseId(testCaseId);
      setViewTestCase(true);
    } else {
      setViewTestCaseId('');
      setViewTestCase(false);
    }
  }, [testCaseId]);

  // NOTE: RefetchHandlerTask
  const refetchHandler = (id, scenario, newData) => {
    const index =
      id && scenario !== 'delete' && scenario !== 'bulkEdit'
        ? testCases?.testcases?.findIndex((x) => x._id === id)
        : null;
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
      const updatedTestCases = testCases?.testcases?.filter((testCase) => !id.includes(testCase._id));
      setTestCases((pre) => ({
        ...pre,
        count: (pre.count || 0) - id?.length,
        testcases: updatedTestCases,
      }));
    } else if (scenario === 'bulkEdit' && id?.length) {
      const updatedTestCases = testCases?.testcases.map((testCase) => {
        const newTestCase = newData.find((newTestCase) => newTestCase._id === testCase._id);
        return newTestCase || testCase;
      });
      setTestCases((pre) => ({
        ...pre,
        count: pre.count,
        testcases: updatedTestCases,
      }));
    }
  };

  // NOTE: bulkEditTest
  const { mutateAsync: _bulkEditHandler, isLoading: _isBulkEditLoading } = useBulkEditTestCase();
  const onBulkEdit = async (data, setError) => {
    try {
      let formData = {
        ...data,
        testCaseIds: data.selectedRecords,
        testSteps: {
          ...data.testSteps,
          description: JSON.stringify(data.testSteps?.description),
        },
        preConditions: {
          ...data.preConditions,
          description: JSON.stringify(data.preConditions?.description),
        },
      };
      !formData?.testSteps?.text && delete formData?.testSteps;
      !formData?.preConditions?.text && delete formData?.preConditions;

      const res = await _bulkEditHandler({ body: formData });
      toastSuccess(res?.msg);
      setBulkEdit(false);
      setSelectedRecords([]);
      setSelectedRunRecords([]);
      setSelectedBugs([]);
      refetchHandler(data.selectedRecords, 'bulkEdit', res?.testCaseData);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { mutateAsync: _updateStatusTestCase } = useUpdateStatusTestCase();

  const optionMenu = [
    {
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setViewTestCase(true);
            setEditRecord(rightClickedRecord?._id);
          },
          icon: <EditIcon backClass={style.editColor} />,
          text: 'Edit',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          icon: <ChangeStatus backClass={style.editColor} />,
          text: 'Change Status',
          moreOptions: [
            {
              subText: 'Passed',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Passed' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
            {
              subText: 'Fail',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Failed' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
            {
              subText: 'Blocked',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Blocked' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
            {
              subText: 'Not Tested',
              optionClick: async function () {
                const res = await _updateStatusTestCase({
                  id: rightClickedRecord._id,
                  body: { testStatus: 'Not Tested' },
                });
                toastSuccess(res?.msg);
                refetchHandler(rightClickedRecord._id, 'edit', res?.testCaseData);
              },
            },
          ],
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            selectedRunRecords.length > 1
              ? every(
                  selectedRunRecords,
                  (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                ) && setOpenTaskModal({ open: true })
              : (setSelectedBugs((prev) => [...prev, rightClickedRecord]), setOpenTaskModal({ open: true })),
          icon: <CreateTask backClass={style.editColor} />,
          text: 'Create Task',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () =>
            selectedRunRecords.length > 1
              ? every(
                  selectedRunRecords,
                  (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                ) && setViewTestRun(true)
              : (setSelectedRunRecords((prevSelected) => [...prevSelected, rightClickedRecord?.projectId?._id]),
                setViewTestRun(true)),
          icon: <TestRunIcon backClass={style.editColor} />,
          text: 'Create Test Run',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setDelModal({
              open: true,
              name: rightClickedRecord?.testCaseId,
              id: rightClickedRecord?._id,
            }),
          icon: <DelIcon backClass={style.editColor1} />,
          text: 'Delete',
        },
      ],
    },
  ];

  return (
    <>
      <div
        style={{
          height: !noHeader ? '100vh' : '85vh',
          overflow: 'hidden',
        }}
      >
        <SplitPane sizes={sizes} onChange={setSizes} allowResize={viewTestCase}>
          <MainWrapper
            title="Test Cases"
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            noHeader={noHeader}
            searchField
            onSearch={debounce((e) => {
              setTestCases({
                count: 0,
                testcases: [],
              });
              setFilters((pre) => ({
                ...pre,
                page: 1,
                search: e.target.value,
              }));
            }, 1000)}
            onClear={debounce(() => {
              setTestCases({
                count: 0,
                testcases: [],
              });
              setFilters((pre) => ({ ...pre, page: 1, search: '' }));
            }, 1000)}
          >
            <div className={style.main}>
              <div
                className={style.flexBetween}
                style={{
                  justifyContent: userDetails?.role === 'Developer' ? 'end' : '',
                }}
              >
                <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                  <Button
                    data-cy="addtestcase-btn"
                    text="Add Test Case"
                    handleClick={() =>
                      !noHeader
                        ? navigate('/test-cases/add')
                        : setSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            testCase: 'add',
                          })
                    }
                  />
                </Permissions>
                <div className={style.exportDiv}>
                  <Button
                    startCompo={filtersCount > 0 ? <FilterIconOrange /> : <FilterIcon />}
                    text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                    btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                    handleClick={() => {
                      setAllowFilterDrawer(!allowFilterDrawer);
                      setViewTestCase(false);
                      setViewTestRun(false);
                    }}
                    data-cy="addtestcase-filter-btn"
                  />
                  {
                    <Permissions
                      allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                      currentRole={userDetails?.role}
                      locked={userDetails?.activePlan === 'Free'}
                    >
                      <Button
                        handleClick={exportHandler}
                        text="Export"
                        startCompo={<ExportIcon />}
                        btnClass={style.btn}
                        data-cy="export-testcase"
                      />
                    </Permissions>
                  }
                </div>
                <div className={style.optionsDivMobile}>
                  {filtersCount > 0 && (
                    <div>
                      <span
                        onClick={() => {
                          reset({ ...initialFilter });
                          setFilters(() => ({ ...initialFilter }));
                          setTestCases({
                            count: 0,
                            testcases: [],
                          });
                          setSortFilters({ sortBy: '', sort: '' });
                          setFiltersCount(0);
                        }}
                      >
                        Reset Filters
                      </span>
                    </div>
                  )}
                  <div onClick={() => setIsOpen(true)} style={{ position: 'relative' }}>
                    <MenuIcon />
                    {filtersCount > 0 && <div className={style.filterCountDot}>{filtersCount}</div>}
                  </div>
                  <div onClick={() => setIsOpen2(true)}>
                    <img src={threeDots} alt="" />
                  </div>
                </div>
              </div>

              <div className={style.headerDivMobile}>
                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                  <FilterHeader
                    projectSpecific={projectId}
                    mobileView
                    {...{
                      control,
                      register,
                      watch,
                      setValue,
                      reset: () => {
                        reset({ ...initialFilter });
                        setFilters(() => ({ ...initialFilter }));
                        setTestCases({
                          count: 0,
                          testcases: [],
                        });
                        setSortFilters({ sortBy: '', sort: '' });
                        setFiltersCount(0);
                      },
                    }}
                    onFilterApply={onFilterApply}
                  />
                </MobileMenu>
              </div>
              {_isLoading && filters?.page < 2 ? (
                <Loader />
              ) : (
                <>
                  {testCases?.count ? (
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
                          <div className={style.secondMenu}>
                            {every(
                              selectedRunRecords,
                              (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                            ) &&
                              selectedRunRecords.length > 1 && (
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
                            {every(
                              selectedRunRecords,
                              (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                            ) &&
                              selectedRunRecords.length > 0 && (
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
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                <div
                                  className={style.change}
                                  src={deleteBtn}
                                  id={'deleteButton'}
                                  alt=""
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
                                  <div className={style.imgDel}>
                                    <DelIcon />
                                  </div>
                                  <div className={style.tooltip}>
                                    <p>Delete</p>
                                  </div>
                                </div>
                              </Permissions>
                            )}
                            {every(
                              selectedRunRecords,
                              (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                            ) &&
                              selectedRecords.length > 0 && (
                                <div onClick={() => setOpenTaskModal({ open: true })} className={style.addTask}>
                                  <Plus />
                                  <span>Task</span>
                                </div>
                              )}
                          </div>
                          <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
                            <div className={style.secondMenuMobile}>
                              {every(
                                selectedRunRecords,
                                (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                              ) &&
                                selectedRunRecords.length > 1 && (
                                  <Permissions
                                    allowedRoles={['Admin', 'Project Manager', 'QA']}
                                    currentRole={userDetails?.role}
                                  >
                                    {' '}
                                    <div className={style.change} src={run} alt="">
                                      <p>Bulk Edit</p>
                                    </div>
                                  </Permissions>
                                )}
                              {every(
                                selectedRunRecords,
                                (runRecord) => runRecord['projectId']?._id === selectedRunRecords[0]['projectId']?._id,
                              ) &&
                                selectedRunRecords.length > 0 && (
                                  <div
                                    className={style.change}
                                    src={run}
                                    alt=""
                                    onClick={() => {
                                      setViewTestRun(true);
                                    }}
                                  >
                                    <TestRunIcon />
                                    <p>Test Run</p>
                                  </div>
                                )}
                              {selectedRecords.length > 0 && (
                                <Permissions
                                  allowedRoles={['Admin', 'Project Manager', 'QA']}
                                  currentRole={userDetails?.role}
                                >
                                  <div
                                    className={style.change}
                                    src={deleteBtn}
                                    id={'deleteButton'}
                                    alt=""
                                    onClick={() =>
                                      selectedRecords.length > 0
                                        ? setDelModal({ open: true, bulk: true })
                                        : toastError({
                                            msg: 'Select Test Cases to delete',
                                          })
                                    }
                                  >
                                    <div className={style.imgDel}>
                                      <DelIcon />
                                    </div>
                                    <p>Delete</p>
                                  </div>
                                </Permissions>
                              )}
                              {selectedRecords.length > 0 && projectId && (
                                <div className={style.change} onClick={() => setOpenTaskModal({ open: true })}>
                                  <Plus />
                                  <p>Task</p>
                                </div>
                              )}
                              <div className={style.change}>
                                {
                                  <Permissions
                                    allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                                    currentRole={userDetails?.role}
                                    locked={userDetails?.activePlan === 'Free'}
                                  >
                                    <Button
                                      handleClick={exportHandler}
                                      text="Export"
                                      startCompo={<ExportIcon />}
                                      btnClass={style.btn}
                                    />
                                  </Permissions>
                                }
                              </div>
                            </div>
                          </MobileMenu>
                        </div>
                      </div>
                      <div className={style.tableWidth} style={{ position: 'relative' }}>
                        <GenericTable
                          noHeader={noHeader}
                          setRightClickedRecord={setRightClickedRecord}
                          optionMenu={optionMenu}
                          menu={menu}
                          setMenu={setMenu}
                          menuData={menuData({
                            moreMenu,
                            setMoreMenu,
                          })}
                          selectedItem={selectedRecords}
                          containerRef={containerRef}
                          ref={ref}
                          columns={columnsData({
                            testCases: testCases?.testcases,
                            setSearchParams,
                            setSelectedRecords,
                            selectedRecords,
                            setSelectedRunRecords,
                            selectedRunRecords,
                            selectedBugs,
                            setSelectedBugs,
                            delModal,
                            setDelModal,
                            setViewTestCase,
                            isHoveringName,
                            setIsHoveringName,
                            setEditRecord,
                            role: userDetails?.role,
                            noHeader,
                            searchedText: filters?.search,
                          })}
                          dataSource={testCases?.testcases || []}
                          height={noHeader ? 'calc(100vh - 275px)' : 'calc(100vh - 205px)'}
                          selectable={true}
                          filters={sortFilters}
                          onClickHeader={({ sortBy, sort }) => {
                            handleFilterChange({ sortBy, sort });
                          }}
                          classes={{
                            test: style.test,
                            table: style.table,
                            thead: style.thead,
                            th: style.th,
                            containerClass: style.checkboxContainer,
                            tableBody: style.tableRow,
                          }}
                        />
                        {_isLoading && <Loader tableMode />}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: noHeader ? 'calc(100vh - 344px)' : 'calc(100vh - 275px)',
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
            {viewTestCase && !editRecord && !reportBug && (
              <ViewTestCases
                setDrawerOpen={setViewTestCase}
                viewTestCase={viewTestCase}
                setViewTestCaseId={setViewTestCaseId}
                setDelModal={setDelModal}
                viewTestCaseId={viewTestCaseId}
                setReportBug={setReportBug}
                setEditRecord={setEditRecord}
                noHeader={noHeader}
                refetchAll={refetchHandler}
              />
            )}
            {viewTestCase && editRecord && !reportBug && (
              <Drawer
                setDrawerOpen={setViewTestCase}
                editRecord={editRecord}
                setEditRecord={setEditRecord}
                drawerOpen={viewTestCase}
                noHeader={noHeader}
                submitHandler={submitHandler}
                _createUpdateIsLoading={_updatingTestCase}
                {...{
                  control: control2,
                  watch: watch2,
                  register: register2,
                  setError: setError2,
                  errors,
                  handleSubmit: handleSubmit2,
                  setValue: setValue2,
                  resetHandler,
                }}
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
                setSelectedRunRecords={setSelectedRunRecords}
                editRecord={null}
                setEditRecord={() => {}}
                refetch={() => {}}
                drawerOpen={viewTestRun}
                noHeader={noHeader}
                projectId={projectId ? projectId : selectedRunRecords[0]['projectId']?._id}
                selectedRunRecords={selectedRunRecords}
              />
            )}

            {allowFilterDrawer && !viewTestRun && !viewTestCase && (
              <FiltersDrawer
                noHeader={noHeader}
                setDrawerOpen={setAllowFilterDrawer}
                projectSpecific={projectId}
                {...{
                  control,
                  register,
                  watch,
                  setValue,
                  reset: () => {
                    reset({ ...initialFilter });
                    setFilters(() => ({ ...initialFilter }));
                    setTestCases({
                      count: 0,
                      testcases: [],
                    });
                    setSortFilters({ sortBy: '', sort: '' });
                    setFiltersCount(0);
                  },
                }}
                onFilterApply={onFilterApply}
              />
            )}

            {/* NOTE: {===============DoNot remove this div this belongs to hotkeys =================} */}
            {(viewBug || viewTestCase || viewTestRun) && (
              <div
                id="splitpane"
                style={{ display: 'none' }}
                onClick={() => {
                  setViewBug(false);
                  setViewTestCase(false);
                  setViewTestCaseId('');
                  setViewTestRun(0);
                  setEditRecord(null);
                }}
              />
            )}
          </div>
        </SplitPane>
      </div>
      {!!openTaskModal.open && (
        <CreateTaskModal
          testCaseData={selectedBugs}
          setSelectedBugs={setSelectedBugs}
          projectId={projectId}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          isSubmitting={_createTaskIsLoading || _createRunIsLoading}
          submitHandlerTask={submitHandlerTask}
          submitHandlerJiraTask={submitHandlerJiraTask}
          isJiraSubmitting={_createJiraTaskIsLoading}
          openDelModal={!!openTaskModal.open}
          setOpenDelModal={() => setOpenTaskModal({ open: false })}
        />
      )}
      <DeleteModal
        openDelModal={!!delModal.open}
        setOpenDelModal={() => setDelModal({ open: false })}
        name="test case"
        clickHandler={(e) => onDelete(e, delModal.bulk)}
        isLoading={_deletingTc}
        cancelText="No, Keep this test case"
      />
      {bulkEdit && (
        <BulkEditModal
          type={'testCase'}
          open={bulkEdit}
          handleClose={() => setBulkEdit(false)}
          projectId={projectId ? projectId : selectedRunRecords[0]['projectId']?._id}
          selectedRecords={selectedRecords}
          options={data}
          onSubmit={onBulkEdit}
          isLoading={_isBulkEditLoading}
        />
      )}
    </>
  );
};
TestCases.propTypes = {
  noHeader: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default TestCases;
