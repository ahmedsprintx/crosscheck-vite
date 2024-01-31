import { useCallback, useEffect, useRef, useState } from 'react';
import { pickBy } from 'utils/lodash';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SplitPane from 'components/split-pane/split-pane';
import _ from 'lodash';

import Button from 'components/button';
import GenericTable from 'components/generic-table';
import MainWrapper from 'components/layout/main-wrapper';
import DeleteModal from 'components/delete-modal';
import ImportModal from 'components/import-modal';
import Permissions from 'components/permissions';
import BulkEditModal from 'components/bulk-edit-modal';
import Loader from 'components/loader';
import ExportIcon from 'components/icon-component/export-icon';
import DelIcon from 'components/icon-component/del-icon';
import Plus from 'components/icon-component/plus';
import CreateTaskModal from 'components/create-task-modal';
import Drawer from './drawer';
import FilterHeader from './header';
import ViewBug from './view-bug';
import ReportBug from './report-bug';
import RetestModal from './retest-modal';
import { columnsData, initialFilters, menuData } from './helper';
import { useBugsFiltersOptions } from './header/helper';

import { useAppContext } from 'context/app.context';

import {
  useBulkEditBugs,
  useDeleteBug,
  useExportBugs,
  useGetBugsByFilter,
  useUpdateSeverityBug,
} from 'hooks/api-hooks/bugs/bugs.hook';
import { useCreateTestCase } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useCreateJiraTask, useCreateTask } from 'hooks/api-hooks/task/task.hook';
import { useToaster } from 'hooks/use-toaster';
import { formattedDate } from 'utils/date-handler';
import { sortData } from 'utils/sorting-handler';

import threeDots from 'assets/threeDots.svg';
import FilterIconOrange from 'components/icon-component/filter-icon-orange';
import noData from 'assets/no-found.svg';
import style from './testing.module.scss';
import MobileMenu from 'components/mobile-menu';
import MenuIcon from 'components/icon-component/menu';
import FiltersDrawer from './filters-drawer';
import FilterIcon from 'components/icon-component/filter-icon';
import StartTestingModal from './start-testing-modal';
import { downloadCSV } from 'utils/file-handler';
import ConvertIcon from 'components/icon-component/convert-icon';
import TestRunIcon from 'components/icon-component/test-run';
import CreateTask from 'components/icon-component/create-task';
import EvidenceLink from 'components/icon-component/evidence-link';
import ReopenIcon from 'components/icon-component/reopen-icon';
import RetestIcon from 'components/icon-component/retest-icon';
import EditIcon from 'components/icon-component/edit-icon';

const QaTesting = ({ noHeader = false, projectId }) => {
  const { data = {} } = useBugsFiltersOptions();

  const ref = useRef();
  const containerRef = useRef(null);

  const { control, register, watch, setValue, reset } = useForm();

  const { toastError, toastSuccess } = useToaster();
  const [searchParams, setSearchParams] = useSearchParams();
  const bugId = searchParams.get('bugId');

  const [addTestCase, setAddTestCase] = useState(false);
  const [menu, setMenu] = useState(false);

  const [isStartTesting, setIsStartTesting] = useState({ open: false });

  const [editRecord, setEditRecord] = useState();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [allowFilterDrawer, setAllowFilterDrawer] = useState(false);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [bulkEdit, setBulkEdit] = useState(false);

  const [retestOpen, setRetestOpen] = useState({ open: false });
  const [openRetestModal, setOpenRetestModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [rightClickedRecord, setRightClickedRecord] = useState({});
  const [openImport, setOpenImport] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  const [isHoveringName, setIsHoveringName] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [viewBug, setViewBug] = useState(false);

  const [viewSizes, setViewSizes] = useState(['20%', 'auto']);

  useEffect(() => {
    if (viewBug || allowFilterDrawer) {
      if (window.innerWidth <= 768) {
        setViewSizes(['0%', '100%']);
      } else {
        setViewSizes(['65%', '35%']);
      }
    } else {
      setViewSizes(['100%', '0%']);
    }
  }, [viewBug || allowFilterDrawer]);

  const {
    control: control2,
    watch: watch2,
    register: register2,
    formState: { errors },
    setError: setError2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm();

  const { userDetails } = useAppContext();

  const [viewBugId, setViewBugId] = useState();
  const [filtersCount, setFiltersCount] = useState(0);

  const [filters, setFilters] = useState({
    ...initialFilters,
    projectId: projectId ? [projectId] : [],
  });
  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });
  const [bugs, setBugs] = useState({});

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
    if (watch('bugType')?.length > 0) {
      count++;
    }
    if (watch('issueType')?.length > 0) {
      count++;
    }
    if (watch('severity')?.length > 0) {
      count++;
    }
    if (watch('testingType')?.length > 0) {
      count++;
    }
    if (watch('reportedBy')?.length > 0) {
      count++;
    }
    if (watch('bugBy')?.length > 0) {
      count++;
    }
    if (watch('assignedTo')?.length > 0) {
      count++;
    }
    if (watch('reportedAt')?.start !== null && watch('reportedAt')?.start !== undefined) {
      count++;
    }
    if (watch('closedDate')?.start !== null && watch('closedDate')?.start !== undefined) {
      count++;
    }
    if (watch('reTestDate')?.start !== null && watch('reTestDate')?.start !== undefined) {
      count++;
    }
    return setFiltersCount(count);
  };
  const { mutateAsync: _getAllBugs, isLoading: _isLoading } = useGetBugsByFilter();

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (bugs?.count !== bugs?.bugs.length && !_isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1 }));
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
  }, [containerRef, bugs, _isLoading]);

  // NOTE: fetching bugs

  const bugsHandler = async (filters) => {
    const response = await _getAllBugs(
      _.pickBy(filters, (value, key) => {
        if (key === 'reportedAt' || key === 'closedDate' || key === 'reTestDate') {
          return !(value.start === null);
        }
        return true;
      }),
    );
    setBugs((pre) => ({
      ...(pre || {}),
      count: response?.count || 0,
      bugs: filters.page === 1 ? response?.bugs : [...(pre.bugs || []), ...(response?.bugs || [])],
    }));
  };

  const { mutateAsync: _exportBugs } = useExportBugs();

  const exportHandler = async () => {
    try {
      const res = await _exportBugs(
        pickBy(
          {
            ...filters,
            page: 0,
          },
          (value, key) => {
            if (key === 'reportedAt' || key === 'closedDate' || key === 'reTestDate') {
              return !(value.start === null);
            }
            return true;
          },
        ),
      );
      if (res) {
        downloadCSV(res, `Bugs Export File ${new Date()}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBugs = async (filters) => {
    try {
      bugsHandler(filters);
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    const _values = _.pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
      'issueType',
      'status',
      'retestDateStart',
      'retestDateEnd',
    ]);

    if (_values.reportedBy) {
      _values.reportedBy = _values?.reportedBy?.split(',') || [];
    }
    if (_values.issueType) {
      _values.issueType = _values?.issueType?.split(',') || [];
    }
    if (_values.status) {
      _values.status = _values?.status?.split(',') || [];
    }
    if (_values?.reportedAtStart && _values?.reportedAtEnd) {
      _values.reportedAt = {
        start: new Date(_values?.reportedAtStart),
        end: new Date(_values?.reportedAtEnd),
      };
    }

    if (_values?.retestDateStart && _values?.retestDateEnd) {
      _values.reTestDate = {
        start: new Date(_values?.retestDateStart),
        end: new Date(_values?.retestDateEnd),
      };
    }

    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;
    delete _values.retestDateStart;
    delete _values.retestDateEnd;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, []);

  useEffect(() => {
    !_isLoading &&
      fetchBugs(
        projectId
          ? { ...filters, projects: [projectId] }
          : {
              ...filters,
              ...(watch('reportedBy') && { reportedBy: watch('reportedBy') }),
              ...(watch('issueType') && { issueType: watch('issueType') }),
              ...(watch('status') && { status: watch('status') }),
              ...(watch('reportedAt.start') &&
                watch('reportedAt.end') && {
                  reportedAt: {
                    start: formattedDate(watch('reportedAt.start'), 'yyyy-MM-dd'),
                    end: formattedDate(watch('reportedAt.end'), 'yyyy-MM-dd'),
                  },
                }),

              ...(watch('reTestDate.start') &&
                watch('reTestDate.end') && {
                  reTestDate: {
                    start: formattedDate(watch('reTestDate.start'), 'yyyy-MM-dd'),
                    end: formattedDate(watch('reTestDate.end'), 'yyyy-MM-dd'),
                  },
                }),
            },
      );
  }, [filters]);

  useEffect(() => {
    if (projectId) {
      setBugs({
        count: 0,
        bugs: [],
      });
      setFilters((pre) => ({ ...pre, projectId: projectId ? [projectId] : [] }));
    }
  }, [projectId]);

  // NOTE: Deleting Single orBulk Records
  const { mutateAsync: _deleteBugHandler, isLoading: deletingBbug } = useDeleteBug();
  const onDelete = async (e, bulk) => {
    try {
      const res = await _deleteBugHandler({
        body: {
          toDelete: bulk ? selectedRecords : [openDelModal?.id],
        },
      });
      toastSuccess(res.msg);
      refetchHandler(bulk ? selectedRecords : [openDelModal?.id], 'delete');
      setOpenDelModal(() => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };

  const onFilterApply = _.debounce(() => {
    setBugs({
      count: 0,
      bugs: [],
    });
    setFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('search') && { search: watch('search') }),
      ...(watch('projects') && { projects: watch('projects') || [] }),
      ...(watch('milestones') && { milestones: watch('milestones') || [] }),
      ...(watch('features') && { features: watch('features') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('reportedBy') && {
        reportedBy: watch('reportedBy') || [],
      }),
      ...(watch('bugBy') && {
        bugBy: watch('bugBy') || [],
      }),
      ...(watch('assignedTo') && {
        assignedTo: watch('assignedTo') || [],
      }),
      ...(watch('testingType') && { testingType: watch('testingType') || [] }),
      ...(watch('bugType') && { bugType: watch('bugType') || [] }),
      ...(watch('severity') && { severity: watch('severity') || [] }),
      ...(watch('issueType') && { issueType: watch('issueType') || [] }),
      ...(watch('closedDate') &&
        watch('closedDate.start') &&
        watch('closedDate.end') && {
          closedDate: {
            start: formattedDate(watch('closedDate.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('closedDate.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('reportedAt') &&
        watch('reportedAt.start') &&
        watch('reportedAt.end') && {
          reportedAt: {
            start: formattedDate(watch('reportedAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('reportedAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('reTestDate') &&
        watch('reTestDate.start') &&
        watch('reTestDate.end') && {
          reTestDate: {
            start: formattedDate(watch('reTestDate.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('reTestDate.end'), 'yyyy-MM-dd'),
          },
        }),
    }));
    countAppliedFilters();
    setAllowFilterDrawer(false);
    setIsOpen(false);
  }, 1000);

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _.debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  useEffect(() => {
    if (bugs?.bugs?.length) {
      const sortedData = sortData(bugs?.bugs, sortFilters.sortBy, sortFilters.sort);

      setBugs((pre) => ({ ...pre, bugs: sortedData }));
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

  const submitHandler = async (data, resetHandler) => {
    try {
      const formData = {
        ...data,
        projectId: data?.projectId,
        milestoneId: data?.milestoneId,
        featureId: data?.featureId,
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

      const res = await _createTestCaseHandler(formData);
      resetHandler();
      toastSuccess(res.msg);
      setAddTestCase(null);
      setViewBug(false);
    } catch (error) {
      toastError(error, setError2);
    }
  };

  const { mutateAsync: _createTaskHandler, isLoading: _createTaskIsLoading } = useCreateTask();

  const submitHandlerTask = async (data) => {
    try {
      const res = await _createTaskHandler(data);
      toastSuccess(res.msg);
      setOpenTaskModal({ open: false });
      setSelectedRecords([]);
    } catch (error) {
      toastError(error, setError2);
    }
  };

  const { mutateAsync: _createJiraTaskHandler, isLoading: _createJiraTaskIsLoading } = useCreateJiraTask();

  const submitHandlerJiraTask = async (id, body) => {
    try {
      const res = await _createJiraTaskHandler({
        id,
        body,
      });
      toastSuccess(res.msg);
      setOpenTaskModal({ open: false });
      setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (bugId) {
      setViewBugId(bugId);
      setViewBug(true);
    }
  }, [bugId]);

  const { mutateAsync: _changeSeverityHandler } = useUpdateSeverityBug();

  const onChangeSeverity = async (id, value) => {
    try {
      const res = await _changeSeverityHandler({ id, body: { newSeverity: value } });
      refetchHandler(id, 'edit', res?.bugData);
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const refetchHandler = (id, scenario, newData) => {
    const index = id && scenario !== 'delete' ? bugs?.bugs?.findIndex((x) => x._id === id) : null;
    if (scenario === 'add') {
      setBugs((pre) => ({
        ...pre,
        count: (pre.count || 0) + 1,
        bugs: bugs.count < 25 * filters.page ? [newData, ...(pre.bugs || [])] : pre.bugs || [],
      }));
    } else if (id && scenario === 'edit') {
      const updatedBugs = bugs?.bugs?.map((bug, i) => {
        if (i === index) {
          return newData; // NOTE: Update the element at the specified index
        } else {
          return bug; // NOTE: Keep the other elements unchanged
        }
      });
      setBugs((pre) => ({ ...pre, bugs: updatedBugs }));
    } else if (scenario === 'delete' && id?.length) {
      const updatedBugs = bugs?.bugs?.filter((bug) => !id.includes(bug._id));
      setBugs((pre) => ({
        ...pre,
        count: (pre.count || 0) - id?.length,
        bugs: updatedBugs,
      }));
    } else if (scenario === 'bulkEdit' && id?.length) {
      const updatedBugs = bugs?.bugs.map((bug) => {
        const newBug = newData.find((newBug) => newBug._id === bug._id);
        return newBug || bug;
      });
      setBugs((pre) => ({
        ...pre,
        count: pre.count,
        bugs: updatedBugs,
      }));
    }
  };
  const { mutateAsync: _bulkEditHandler, isLoading: _isBulkEditLoading } = useBulkEditBugs();

  const onBulkEdit = async (data, setError) => {
    try {
      let formData = {
        ...data,
        bugIds: data.selectedRecords,
        bugSubType: data?.bugSubType?.value,
      };
      const res = await _bulkEditHandler({ body: formData });
      toastSuccess(res?.msg);
      setBulkEdit(false);
      setSelectedRecords([]);
      setSelectedBugs([]);
      refetchHandler(data.selectedRecords, 'bulkEdit', res?.bugData);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const optionMenu = [
    {
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setEditRecord({ id: rightClickedRecord?._id });
            setViewBug(true);
          },
          icon: <EditIcon backClass={style.editColor} />,
          text: 'Edit',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => setRetestOpen(() => ({ open: true, id: rightClickedRecord?._id })),
          icon: <RetestIcon backClass={style.editColor} />,
          text: 'Retest',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () => {
            setEditRecord({ id: rightClickedRecord?._id, reopen: true });
            setViewBug(true);
          },
          icon: <ReopenIcon backClass={style.editColor} />,
          text: 'Reopen',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () =>
            window.open(
              rightClickedRecord?.history[rightClickedRecord?.history?.length - 1]?.reTestEvidence ||
                rightClickedRecord?.testEvidence,
              '_blank',
            ),
          icon: <EvidenceLink backClass={style.editColor} />,
          text: 'View Evidence',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            selectedBugs.length > 1
              ? _.every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                setOpenTaskModal({ open: true })
              : (setSelectedBugs((prev) => [...prev, rightClickedRecord]), setOpenTaskModal({ open: true })),
          icon: <CreateTask backClass={style.editColor} />,
          text: 'Create Task',
        },
      ],
    },
    {
      bodyData: [
        {
          icon: <TestRunIcon backClass={style.editColor} />,
          text: 'Create Test Run',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: () => {
            setAddTestCase({ id: rightClickedRecord?._id, reopen: true });
            setViewBug(true);
          },
          icon: <ConvertIcon backClass={style.editColor} />,
          text: 'Convert to Test Case',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setOpenDelModal({
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
        <SplitPane sizes={viewSizes} onChange={setViewSizes} allowResize={viewBug}>
          <MainWrapper
            title="Bugs Reporting"
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            searchField
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            noHeader={noHeader}
            onSearch={_.debounce((e) => {
              setBugs({
                count: 0,
                bugs: [],
              });
              setFilters((pre) => ({
                ...pre,
                page: 1,
                search: e.target.value,
              }));
            }, 1000)}
            onClear={_.debounce(() => {
              setBugs({
                count: 0,
                bugs: [],
              });
              setFilters((pre) => ({ ...pre, page: 1, search: '' }));
            }, 1000)}
          >
            <div className={style.mainClass} style={{ height: 'fit-content' }}>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <Button
                  text=" Report Bug"
                  handleClick={() => {
                    setIsStartTesting({ open: true });
                  }}
                  data-cy="bug-reporting-starttesting-btn"
                />
              </Permissions>

              <div className={style.exportDiv} style={{ width: '100%' }}>
                <Button
                  startCompo={filtersCount > 0 ? <FilterIconOrange /> : <FilterIcon />}
                  text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                  btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                  handleClick={() => {
                    setAllowFilterDrawer(!allowFilterDrawer);
                    setViewBug(false);
                  }}
                />

                <Permissions
                  allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                  currentRole={userDetails?.role}
                  locked={userDetails?.activePlan === 'Free'}
                >
                  <Button handleClick={exportHandler} text="Export" startCompo={<ExportIcon />} btnClass={style.btn} />
                </Permissions>
              </div>

              <div className={style.optionsDivMobile}>
                {filtersCount > 0 && (
                  <div>
                    <span
                      onClick={() => {
                        reset({ ...initialFilters });
                        setFilters(() => ({ ...initialFilters }));
                        setBugs({
                          count: 0,
                          bugs: [],
                        });
                        setSortFilters({ sortBy: '', sort: '' });
                        setIsOpen(false);
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
                  mobileView={true}
                  {...{
                    data,
                    control,
                    register,
                    watch,
                    setValue,
                    reset: () => {
                      reset({ ...initialFilters });
                      setFilters(() => ({ ...initialFilters }));
                      setBugs({
                        count: 0,
                        bugs: [],
                      });
                      setSortFilters({ sortBy: '', sort: '' });
                      setIsOpen(false);
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
                {bugs.count ? (
                  <>
                    <div
                      className={style.mainClass}
                      style={{
                        marginTop: '10px',
                      }}
                    >
                      <h6>
                        {' '}
                        Bugs ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                        {bugs.count})
                      </h6>
                      <div className={style.secondMenu}>
                        {_.every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                          selectedBugs.length > 1 && (
                            <Permissions
                              allowedRoles={['Admin', 'Project Manager', 'QA']}
                              currentRole={userDetails?.role}
                            >
                              {' '}
                              <div
                                className={style.change}
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

                        {selectedRecords.length ? (
                          <div
                            onClick={() =>
                              selectedRecords.length > 0
                                ? setOpenDelModal({ open: true, bulk: true })
                                : toastError({
                                    msg: 'Select Test Cases to delete',
                                  })
                            }
                            className={style.change}
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
                          >
                            <div className={style.imgDel}>
                              <DelIcon />
                            </div>
                            <div className={style.tooltip}>
                              <p>Delete</p>
                            </div>
                          </div>
                        ) : null}
                        {_.every(selectedBugs, (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id) &&
                        selectedRecords.length > 0 ? (
                          <div onClick={() => setOpenTaskModal({ open: true })} className={style.addTask}>
                            <Plus />
                            <span>Task</span>
                          </div>
                        ) : null}
                      </div>
                      <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
                        <div className={style.secondMenuMobile}>
                          {_.every(
                            selectedBugs,
                            (bug) => bug['projectId']?._id === selectedBugs[0]['projectId']?._id,
                          ) &&
                            selectedBugs.length > 1 && (
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                <div onClick={() => setBulkEdit(true)} className={style.change} id={'deleteButton'}>
                                  <p>Bulk Edit</p>
                                </div>
                              </Permissions>
                            )}
                          {selectedRecords.length ? (
                            <div
                              onClick={() =>
                                selectedRecords.length > 0
                                  ? setOpenDelModal({ open: true, bulk: true })
                                  : toastError({
                                      msg: 'Select Test Cases to delete',
                                    })
                              }
                              className={style.change}
                              id={'deleteButton'}
                            >
                              <div className={style.imgDel}>
                                <DelIcon />
                              </div>

                              <p>Delete</p>
                            </div>
                          ) : null}
                          {selectedRecords.length > 0 && projectId ? (
                            <div onClick={() => setOpenTaskModal({ open: true })} className={style.change}>
                              <Plus />
                              <p>Task</p>
                            </div>
                          ) : null}
                        </div>
                      </MobileMenu>
                    </div>
                    <div className={style.tableWidth} style={{ position: 'relative' }}>
                      <GenericTable
                        noHeader={noHeader}
                        setRightClickedRecord={setRightClickedRecord}
                        optionMenu={optionMenu}
                        menu={menu}
                        setMenu={setMenu}
                        menuData={menuData}
                        selectedItem={selectedRecords}
                        containerRef={containerRef}
                        ref={ref}
                        columns={columnsData({
                          setSearchParams,
                          setOpenRetestModal,
                          openRetestModal,
                          control,
                          searchedText: filters?.search,
                          watch,
                          register,
                          setOpenCreateTicket,
                          setOpenDelModal,
                          openDelModal,
                          openCreateTicket,
                          setAddTestCase,
                          setViewBug,
                          setViewBugId,
                          setEditRecord,
                          bugs: bugs?.bugs,
                          isHoveringName,
                          setIsHoveringName,
                          selectedRecords,
                          setSelectedRecords,
                          selectedBugs,
                          setSelectedBugs,
                          setRetestOpen,
                          role: userDetails?.role,
                          activePlan: userDetails?.activePlan,
                          onChangeSeverity,
                          noHeader,
                        })}
                        dataSource={bugs?.bugs || []}
                        height={noHeader ? 'calc(100vh - 275px)' : 'calc(100vh - 205px)'}
                        filters={sortFilters}
                        onClickHeader={({ sortBy, sort }) => {
                          handleFilterChange({ sortBy, sort });
                        }}
                        selectable={true}
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
                  </>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: noHeader ? 'calc(100vh - 334px)' : 'calc(100vh - 338px)',
                    }}
                  >
                    <img src={noData} alt="" />
                  </div>
                )}
              </>
            )}
          </MainWrapper>

          <div className={style.flex1}>
            {viewBug && !editRecord && !addTestCase && (
              <ViewBug
                setDrawerOpen={setViewBug}
                viewBug={viewBug}
                setViewBugId={setViewBugId}
                setAddTestCase={setAddTestCase}
                viewBugId={viewBugId}
                allData={bugs?.bugs}
                noHeader={noHeader}
                setRetestOpen={setRetestOpen}
                setViewBug={setViewBug}
                setEditRecord={setEditRecord}
                setOpenDelModal={setOpenDelModal}
              />
            )}

            {viewBug && editRecord && !addTestCase && (
              <ReportBug
                noHeader={noHeader}
                options={data}
                editRecord={editRecord}
                setReportBug={setViewBug}
                setEditRecord={setEditRecord}
                viewBugId={viewBugId}
                {...{
                  refetch: refetchHandler,
                  projectId: watch('projectId'),
                  milestoneId: watch('milestoneId'),
                  featureId: watch('featureId'),
                }}
              />
            )}
            {allowFilterDrawer && !addTestCase && (
              <FiltersDrawer
                noHeader={noHeader}
                searchParams={bugId}
                setViewBug={setViewBug}
                setDrawerOpen={setAllowFilterDrawer}
                projectSpecific={projectId}
                mobileView={true}
                {...{
                  data,
                  control,
                  register,
                  watch,
                  setValue,
                  reset: () => {
                    reset({ ...initialFilters });
                    setFilters(() => ({ ...initialFilters }));
                    setBugs({
                      count: 0,
                      bugs: [],
                    });
                    setSortFilters({ sortBy: '', sort: '' });
                    setIsOpen(false);
                    setFiltersCount(0);
                  },
                }}
                onFilterApply={onFilterApply}
              />
            )}
            {addTestCase && (
              <Drawer
                setDrawerOpen={setAddTestCase}
                editRecord={addTestCase}
                setEditRecord={setAddTestCase}
                drawerOpen={addTestCase}
                noHeader={noHeader}
                submitHandler={submitHandler}
                _createIsLoading={_createIsLoading}
                setViewBug={setViewBug}
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

            {}
            {viewBug && (
              <div
                id="splitpane"
                style={{ display: 'none' }}
                onClick={() => {
                  setViewBug(false);
                  setViewBugId('');
                  setEditRecord(null);
                }}
              />
            )}
          </div>
        </SplitPane>
      </div>

      {isStartTesting.open && (
        <StartTestingModal
          open={isStartTesting.open}
          handleClose={() => setIsStartTesting({ open: false })}
          refetch={refetchHandler}
          projectId={projectId}
        />
      )}

      {!!openDelModal.open && (
        <DeleteModal
          openDelModal={!!openDelModal.open}
          setOpenDelModal={() => setOpenDelModal({ open: false })}
          name="Record"
          clickHandler={(e) => onDelete(e, openDelModal.bulk)}
          cancelText="No, Keep this Record"
          isLoading={deletingBbug}
        />
      )}

      {!!openTaskModal.open && (
        <CreateTaskModal
          setSelectedBugs={setSelectedBugs}
          bugsData={selectedBugs}
          isSubmitting={_createTaskIsLoading}
          submitHandlerTask={submitHandlerTask}
          isJiraSubmitting={_createJiraTaskIsLoading}
          submitHandlerJiraTask={submitHandlerJiraTask}
          openDelModal={!!openTaskModal.open}
          projectId={projectId}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          setOpenDelModal={() => setOpenTaskModal({ open: false })}
        />
      )}

      {retestOpen && (
        <RetestModal
          openRetestModal={retestOpen}
          setOpenRetestModal={() => setRetestOpen({ open: false })}
          options={data}
          refetch={refetchHandler}
        />
      )}
      {openImport && <ImportModal openImportModal={openImport} setOpenImportModal={setOpenImport} />}

      {bulkEdit && (
        <BulkEditModal
          type={'bug'}
          open={bulkEdit}
          handleClose={() => setBulkEdit(false)}
          projectId={projectId ? projectId : selectedBugs[0]['projectId']?._id}
          selectedRecords={selectedRecords}
          options={data}
          onSubmit={onBulkEdit}
          isLoading={_isBulkEditLoading}
        />
      )}
    </>
  );
};

export default QaTesting;
