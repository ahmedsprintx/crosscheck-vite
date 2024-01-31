import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import SplitPane from 'components/split-pane/split-pane';

import search from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';

import Button from 'components/button';
import GenericTable from 'components/generic-table';
import Checkbox from 'components/checkbox';
import ColumnModal from 'pages/qa-testing/choose-columns-modal';
import SelectBox from 'components/select-box';
import Drawer from './drawer';

import ReportBug from './report-bug';

import arrow from 'assets/arrow-right.svg';

import style from './functional.module.scss';
import DeleteModal from 'components/delete-modal';
import ViewBug from './view-bug';
import MainWrapper from 'components/layout/main-wrapper';
import { formattedDate } from 'utils/date-handler';
import _ from 'lodash';
import TextField from 'components/text-field';
import BulkEditModal from 'components/bulk-edit-modal';

import {
  useBulkEditBugs,
  useDeleteBug,
  useGetBugsByFilter,
  useUpdateSeverityBug,
} from 'hooks/api-hooks/bugs/bugs.hook';
import { initialFilters } from 'pages/qa-testing/helper';
import { initialFilter as testCasesFilters, columnsData } from './helper';

import { useToaster } from 'hooks/use-toaster';
import { sortData } from 'utils/sorting-handler';
import { useBugsFiltersOptions } from 'pages/qa-testing/header/helper';
import RetestModal from './retest-modal';
import { CSVLink } from 'react-csv';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import AddBug from './add-bug';
import ExportIcon from 'components/icon-component/export-icon';
import ArrowRight from 'components/icon-component/arrow-right';
import DelIcon from 'components/icon-component/del-icon';
import { useGetTestCasesByFilter } from 'hooks/api-hooks/test-cases/test-cases.hook';
import MobileMenu from 'components/mobile-menu';
import MenuIcon from 'components/icon-component/menu';
import Loader from 'components/loader';

const RegressionTesting = ({ type, noHeader = false, projectId }) => {
  const ref = useRef();
  const containerRef = useRef();

  const { data = {} } = useBugsFiltersOptions();

  const { projectOptions = [], mileStonesOptions = [], featuresOptions = [], statusOptions = [] } = data;

  const { control, watch, setValue } = useForm();

  const { toastError, toastSuccess } = useToaster();

  const { userDetails } = useAppContext();

  const [viewBugId, setViewBugId] = useState();
  const [taskId, setTaskId] = useState('');
  const [editRecord, setEditRecord] = useState('');
  const [retestOpen, setRetestOpen] = useState({ open: false });
  const [isHoveringName, setIsHoveringName] = useState({});

  const [reportBug, setReportBug] = useState(false);
  const [addBug, setAddBug] = useState(false);
  const [viewBug, setViewBug] = useState(false);
  const [allowResize, setAllowResize] = useState(false);
  const [choseColModal, setChoseColModal] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [bugs, setBugs] = useState({});
  const [testCases, setTestCases] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });
  const [sizes, setSizes] = useState(['20%', 'auto']);
  const [bugSizes, setBugSizes] = useState(['20%', 'auto']);
  const [viewSizes, setViewSizes] = useState(['20%', 'auto']);

  useEffect(() => {
    if (allowResize) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['60%', '40%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [allowResize]);

  useEffect(() => {
    if (reportBug) {
      if (window.innerWidth <= 768) {
        setBugSizes(['0%', '100%']);
      } else {
        setBugSizes(['60%', '40%']);
      }
    } else {
      setBugSizes(['100%', '0%']);
    }
  }, [reportBug]);

  useEffect(() => {
    if (viewBug) {
      if (window.innerWidth <= 768) {
        setViewSizes(['0%', '100%']);
      } else {
        setViewSizes(['60%', '40%']);
      }
    } else {
      setViewSizes(['100%', '0%']);
    }
  }, [viewBug]);

  const { mutateAsync: _getFilteredBugsHandler, isLoading: _isLoading } = useGetBugsByFilter();
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
    } else if (_isLoading) containerRef?.current?.removeEventListener('scroll', handleScroll);

    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, bugs, _isLoading]);

  const fetchBugs = async (filters) => {
    try {
      const updatedFilters = _.pickBy(filters, (value, key) => {
        if (key === 'closedDate' || key === 'reTestDate' || key === 'reportedAt') {
          return !(value.start === null);
        }
        return true;
      });

      await fetchTestCases(
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
      const res = await _getFilteredBugsHandler(updatedFilters);

      setBugs((pre) => ({
        ...(pre || {}),
        count: res?.count || 0,
        bugs: [...(pre.bugs || []), ...(res?.bugs || [])],
      }));
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (
      (filters.projects.length > 0 && filters.milestones.length > 0 && filters.features.length > 0) ||
      filters.taskId
    ) {
      fetchBugs(filters);
    }
  }, [filters]);

  useEffect(() => {
    if ((watch('projectId') && watch('milestoneId') && watch('featureId')) || watch('taskId')) {
      setBugs({
        count: 0,
        bugs: [],
      });
      setTestCases({
        count: 0,
        testcases: [],
      });
      setFilters((pre) => ({
        ...pre,
        page: 1,
        ...(watch('search') && { search: watch('search') }),
        ...(watch('projectId') && { projects: [watch('projectId')] || [] }),
        ...(watch('milestoneId') && { milestones: [watch('milestoneId')] || [] }),
        ...(watch('featureId') && { features: [watch('featureId')] || [] }),
        ...(watch('taskId') && { taskId: watch('taskId') || '' }),
      }));
    }
  }, [watch('projectId'), watch('milestoneId'), watch('featureId'), watch('taskId'), watch('search')]);

  useEffect(() => {
    if (projectId) {
      setBugs({
        count: 0,
        bugs: [],
      });
      setTestCases({
        count: 0,
        testcases: [],
      });
      setValue('projectId', projectId);
    }
  }, [projectId]);

  const onAdd = () => {
    if (watch('projectId') && watch('milestoneId') && watch('featureId') && type !== 'functionalTesting') {
      setReportBug(!reportBug);
    } else if (watch('taskId') && type === 'functionalTesting') {
      setReportBug(!reportBug);
      setValue('taskId', '');
    } else {
      toastError({
        msg: 'Please Select a Project, Milestone, or Feature Or Task id  to start ',
      });
    }
  };

  // NOTE: Deleting Single orBulk Records
  const { mutateAsync: _deleteBugHandler } = useDeleteBug();
  const onDelete = async (e, bulk) => {
    try {
      const res = await _deleteBugHandler({
        body: {
          toDelete: bulk ? selectedRecords : [openDel?.id],
        },
      });
      toastSuccess(res.msg);
      refetchHandler(bulk ? selectedRecords : [openDel?.id], 'delete');
      setOpenDel(() => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };

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

  const csvData = useMemo(() => {
    return bugs?.bugs?.map((x) => ({
      'Bug Id': x?.bugId || '',
      'Bug Type': x?.bugType || '',
      'Bug SubType': x?.bugSubType || '',
      Project: x?.projectId?.name || '',
      MileStone: x?.milestoneId?.name || '',
      Feature: x?.featureId?.name || '',
      'Developer Name': x?.developerId?.name || '',
      feedback: x?.feedback?.text || '',
      'Ideal Behaviour': x?.idealBehaviour?.text || '',
      IssueType: x?.issueType || '',
      'Reported At': formattedDate(x?.reportedAt, 'dd MMM ,yy') || '',
      'Reported By': x?.reportedBy?.name || '',
      'Reproduce Steps': x?.reproduceSteps?.text || '',
      Severity: x?.severity || '',
      'Task Id': x?.taskId || '',
      'Test Evidence': x?.testEvidence || '',
      'Test Evidence Key': x?.testEvidenceKey || '',
      'Tested Version': x?.testedVersion || '',
      'Testing Type': x?.testingType || '',
      'Closed By': x?.closed?.by?.name || '',
      'Closed At': formattedDate(x?.closed?.date, 'dd MMM ,yy') || '',
    }));
  }, [bugs]);

  // NOTE: testcases
  const { mutateAsync: _getAllTestCases, isLoading } = useGetTestCasesByFilter();
  const fetchTestCases = async (filters) => {
    try {
      const response = await _getAllTestCases(filters);
      setTestCases(response.testcases);
    } catch (error) {
      toastError(error);
    }
  };

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
        bugs: bugs.count < 25 * filters.page ? [...(pre.bugs || []), newData] : pre.bugs || [],
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

  // NOTE: Bulk Edit
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

  return (
    <>
      <div style={{ height: !noHeader ? '100vh' : '85vh', overflow: 'hidden' }}>
        <SplitPane
          sizes={reportBug ? bugSizes : viewBug ? viewSizes : sizes}
          onChange={reportBug ? setBugSizes : viewBug ? setViewSizes : setSizes}
          allowResize={reportBug ? reportBug : viewBug ? viewBug : allowResize}
        >
          <MainWrapper
            title={_.startCase(type)}
            date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
            searchField={!noHeader}
            stylesBack={noHeader ? { marginTop: '10px' } : {}}
            onSearch={_.debounce((e) => {
              setValue('search', e.target.value);
            }, 1000)}
            onClear={_.debounce(() => {
              setValue('search', '');
            }, 1000)}
            noHeader={noHeader}
          >
            <div className={style.functional}>
              <div className={style.tabDiv}>
                <Link to={noHeader ? `/projects/${projectId}?active=2` : '/qa-testing'}>
                  <p>Bugs Reporting</p>
                </Link>
                <img src={arrow} alt="" />
                <Link to={noHeader ? `/projects/${projectId}?active=2&bugs=add` : '/bug-testing'}>
                  <p>Testing Type</p>
                </Link>
                <img src={arrow} alt="" />
                <p className={style.p}>{_.startCase(type)}</p>
              </div>
              <div
                className={style.mainClass}
                style={{
                  marginTop: '10px',
                  gap: '20px',
                }}
              >
                <div></div>

                {csvData && (
                  <CSVLink data={csvData} filename={`Bugs Export File ${new Date()}`}>
                    <Permissions
                      allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                      currentRole={userDetails?.role}
                      locked={userDetails?.activePlan === 'Free'}
                    >
                      <Button text="Export" startCompo={<ExportIcon />} btnClass={style.btn} />
                    </Permissions>
                  </CSVLink>
                )}
                {noHeader && (
                  <TextField
                    searchField
                    wraperClass={style.input}
                    icon={search}
                    placeholder="Search..."
                    onChange={_.debounce((e) => {
                      setValue('search', e.target.value);
                    }, 1000)}
                    onClear={_.debounce(() => {
                      setValue('search', '');
                    }, 1000)}
                    clearIcon={clearIcon}
                  />
                )}
              </div>
              <div className={style.gridDiv}>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                  }}
                >
                  {type === 'functionalTesting' && (
                    <>
                      <div className={style.statusBar}>
                        <TextField
                          onEnter={(e) => {
                            if (e.key === 'Enter') {
                              setValue('taskId', e.target.value);
                              setTaskId(e.target.value);
                            }
                            if (e.target.value === '') {
                              setTaskId('');
                            }
                          }}
                          name="taskId"
                          label={'Ticket ID'}
                          placeholder="OPL-123"
                        />
                      </div>

                      {!reportBug && <Button text="Report Bug" handleClick={onAdd} disabled={!watch('taskId')} />}
                    </>
                  )}

                  {type !== 'functionalTesting' && (
                    <>
                      {!projectId && (
                        <div className={style.statusBar}>
                          <SelectBox
                            options={projectOptions}
                            label={'Project'}
                            name={'projectId'}
                            control={control}
                            numberBadgeColor={'#39695b'}
                            showNumber
                            dynamicClass={style.zDynamicState4}
                          />
                        </div>
                      )}
                      <div className={style.statusBar}>
                        <SelectBox
                          options={mileStonesOptions?.filter((x) => x.projectId === watch('projectId'))}
                          label={'Milestone'}
                          name={'milestoneId'}
                          control={control}
                          numberBadgeColor={'#39695b'}
                          showNumber
                          placeholder={watch('projectId') ? 'Select' : 'Select Project First'}
                          dynamicClass={style.zDynamicState4}
                        />
                      </div>
                      <div className={style.statusBar}>
                        <SelectBox
                          options={featuresOptions?.filter((x) => x.milestoneId === watch('milestoneId'))}
                          label={'Feature'}
                          name={'featureId'}
                          control={control}
                          numberBadgeColor={'#39695b'}
                          showNumber
                          placeholder={watch('milestoneId') ? 'Select' : 'Select Milestone First'}
                          dynamicClass={style.zDynamicState4}
                        />
                      </div>
                      <div>
                        {!reportBug && (
                          <Button
                            text="Report Bug"
                            handleClick={onAdd}
                            disabled={!(watch('projectId') && watch('milestoneId') && watch('featureId'))}
                          />
                        )}{' '}
                      </div>
                    </>
                  )}
                </div>
                {testCases?.length ? (
                  <div
                    className={style.inner}
                    style={{
                      width: '250px',
                    }}
                    onClick={() => setAllowResize(!allowResize)}
                  >
                    <p>Test Cases</p>
                    <ArrowRight />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className={style.gridDivMobile}>
                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} extraPadding>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap',
                    }}
                  >
                    {type === 'functionalTesting' && (
                      <>
                        <div className={style.statusBar}>
                          <TextField
                            onEnter={(e) => {
                              if (e.key === 'Enter') {
                                setValue('taskId', e.target.value);
                              }
                            }}
                            name="taskId"
                            label={'Ticket ID'}
                            placeholder="OPL-123"
                          />
                        </div>

                        {!reportBug && <Button text="Report Bug" handleClick={onAdd} disabled={!watch('taskId')} />}
                      </>
                    )}

                    {type !== 'functionalTesting' && (
                      <>
                        {!projectId && (
                          <div className={style.statusBar}>
                            <SelectBox
                              options={projectOptions}
                              label={'Project'}
                              name={'projectId'}
                              control={control}
                              numberBadgeColor={'#39695b'}
                              showNumber
                            />
                          </div>
                        )}
                        <div className={style.statusBar}>
                          <SelectBox
                            options={mileStonesOptions?.filter((x) => x.projectId === watch('projectId'))}
                            label={'Milestone'}
                            name={'milestoneId'}
                            control={control}
                            numberBadgeColor={'#39695b'}
                            showNumber
                            placeholder={watch('projectId') ? 'Select' : 'Select Project First'}
                          />
                        </div>
                        <div className={style.statusBar}>
                          <SelectBox
                            options={featuresOptions?.filter((x) => x.milestoneId === watch('milestoneId'))}
                            label={'Feature'}
                            name={'featureId'}
                            control={control}
                            numberBadgeColor={'#39695b'}
                            showNumber
                            placeholder={watch('milestoneId') ? 'Select' : 'Select Milestone First'}
                            menuPlacement={'auto'}
                          />
                        </div>
                        <div>
                          {!reportBug && (
                            <Button
                              text="Report Bug"
                              handleClick={onAdd}
                              disabled={!(watch('projectId') && watch('milestoneId') && watch('featureId'))}
                            />
                          )}{' '}
                        </div>
                      </>
                    )}
                  </div>
                </MobileMenu>
              </div>
              {testCases?.length ? (
                <div
                  className={style.innerMobile}
                  style={{
                    width: '250px',
                  }}
                  onClick={() => setAllowResize(!allowResize)}
                >
                  <p>Test Cases</p>
                  <ArrowRight />
                </div>
              ) : (
                <></>
              )}

              {(_isLoading || isLoading) && filters?.page < 2 ? (
                <Loader />
              ) : (
                <>
                  <div
                    className={style.mainClass}
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    <h6>
                      Bugs ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                      {bugs?.count || 0})
                    </h6>
                    <div className={style.flex}>
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
                      {selectedRecords.length > 0 ? (
                        <div
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
                          onClick={() =>
                            selectedRecords.length > 0
                              ? setOpenDel({ open: true, bulk: true })
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
                      ) : null}

                      <div className={style.menuIconDiv} onClick={() => setIsOpen(true)}>
                        <MenuIcon />
                      </div>
                    </div>
                  </div>
                  <div className={style.tableWidth}>
                    <GenericTable
                      ref={ref}
                      containerRef={containerRef}
                      columns={columnsData({
                        setOpenDel,
                        setViewBug,
                        setReportBug,
                        setViewBugId,
                        searchedText: filters?.search,
                        setEditRecord,
                        setSelectedBugs,
                        bugs: bugs?.bugs,
                        selectedRecords,
                        isHoveringName,
                        setIsHoveringName,
                        setSelectedRecords,
                        setRetestOpen,
                        role: userDetails.role,
                        activePlan: userDetails.activePlan,
                        onChangeSeverity,
                        noHeader,
                      })}
                      dataSource={bugs.bugs || []}
                      height={noHeader ? 'calc(100vh - 418px)' : 'calc(100vh - 260px)'}
                      overflowX={_isLoading ? 'hidden' : 'auto'}
                      selectable={true}
                      filters={sortFilters}
                      onClickHeader={({ sortBy, sort }) => {
                        handleFilterChange({ sortBy, sort });
                      }}
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
                    {(_isLoading || isLoading) && <Loader tableMode />}
                  </div>
                </>
              )}
            </div>
          </MainWrapper>

          <div className={style.flex1}>
            {allowResize && !addBug && (
              <Drawer
                noHeader={noHeader}
                setDrawerOpen={setAllowResize}
                drawerOpen={allowResize}
                setAddBug={setAddBug}
                setEditRecord={setEditRecord}
                isLoading={isLoading}
                testCases={testCases}
                refetch={() =>
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
                          ...(watch('taskId') && {
                            relatedTicketId: watch('taskId'),
                          }),
                        }
                      : {
                          ..._.pickBy(testCasesFilters, (value, key) => {
                            if (key === 'createdAt' || key === 'lastTestedAt') {
                              return !(value.start === null);
                            }
                            return true;
                          }),
                        },
                  )
                }
              />
            )}
            {reportBug && !addBug && (
              <ReportBug
                noHeader={noHeader}
                projectSpecific={projectId}
                setReportBug={setReportBug}
                options={data}
                editRecord={editRecord}
                setEditRecord={setEditRecord}
                viewBugId={viewBugId}
                {...{
                  refetch: refetchHandler,
                  projectId: watch('projectId') || projectId,
                  milestoneId: watch('milestoneId'),
                  featureId: watch('featureId'),
                  testingType: _.startCase(type),
                  taskId: taskId,
                }}
              />
            )}
            {addBug && (
              <AddBug
                noHeader={noHeader}
                {...{
                  refetch: refetchHandler,
                  projectId: watch('projectId') || projectId,
                  milestoneId: watch('milestoneId'),
                  featureId: watch('featureId'),
                  testingType: _.startCase(type),
                  taskId: taskId,
                }}
                refetchTestCases={() =>
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
                          ...(watch('taskId') && {
                            relatedTicketId: watch('taskId'),
                          }),
                        }
                      : {
                          ..._.pickBy(testCasesFilters, (value, key) => {
                            if (key === 'createdAt' || key === 'lastTestedAt') {
                              return !(value.start === null);
                            }
                            return true;
                          }),
                        },
                  )
                }
                options={data}
                editRecord={editRecord}
                setAddBug={setAddBug}
                setEditRecord={setEditRecord}
              />
            )}

            {viewBug && (
              <ViewBug
                setDrawerOpen={setViewBug}
                viewBug={viewBug}
                setViewBugId={setViewBugId}
                viewBugId={viewBugId}
                allData={bugs?.bugs}
                noHeader={noHeader}
                {...{ setEditRecord, setRetestOpen, setAddBug, setViewBug, setOpenDel }}
              />
            )}

            {/* NOTE: {===============DoNot remove this div this belongs to hotkeys =================} */}
            {(allowResize || reportBug || addBug || viewBug) && (
              <div
                id="splitpane"
                style={{ display: 'none' }}
                onClick={() => {
                  setAllowResize(false);
                  setReportBug(false);
                  setAddBug(false);
                  setViewBug(false);
                  setViewBugId('');
                  setEditRecord({});
                }}
              />
            )}
          </div>
        </SplitPane>
      </div>
      <ColumnModal
        choseColModal={choseColModal}
        setChoseColModal={setChoseColModal}
        columns={columnsData({
          setOpenDel,
          setViewBug,
        })}
      />
      <DeleteModal
        openDelModal={!!openDel.open}
        setOpenDelModal={() => setOpenDel({ open: false })}
        name="Record"
        clickHandler={(e) => onDelete(e, openDel.bulk)}
        cancelText="No, Keep this Record"
      />

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

      <RetestModal
        openRetestModal={retestOpen}
        setOpenRetestModal={() => setRetestOpen({ open: false })}
        options={{ statusOptions }}
        refetch={refetchHandler}
      />
    </>
  );
};
RegressionTesting.propTypes = {
  type: PropTypes.string.isRequired,
  noHeader: PropTypes.bool,
  projectId: PropTypes.string.isRequired,
};

export default RegressionTesting;
