import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SplitPane from 'components/split-pane/split-pane';
import PropTypes from 'prop-types';

import style from './test-runs.module.scss';
import Button from 'components/button';
import FilterHeader from './header';
import ColumnModal from './choose-columns-modal';
import { columnsData, initialFilter, menuData } from './helper';
import GenericTable from 'components/generic-table';
import Drawer from './drawer';
import MainWrapper from 'components/layout/main-wrapper';
import { sortData } from 'utils/sorting-handler';
import DeleteModal from 'components/delete-modal';
import { formattedDate } from 'utils/date-handler';
import _ from 'lodash';
import {
  useChangePriorityTestRun,
  useDeleteTestRun,
  useExportTestRuns,
  useGetTestRunsByFilter,
} from 'hooks/api-hooks/test-runs/test-runs.hook';
import { useToaster } from 'hooks/use-toaster';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import Loader from 'components/loader';
import ExportIcon from 'components/icon-component/export-icon';
import threeDots from 'assets/threeDots.svg';
import DelIcon from 'components/icon-component/del-icon';
import MobileMenu from 'components/mobile-menu';
import MenuIcon from 'components/icon-component/menu';
import FiltersDrawer from './filters-drawer';
import FilterIconOrange from 'components/icon-component/filter-icon-orange';
import FilterIcon from 'components/icon-component/filter-icon';
import { downloadCSV } from 'utils/file-handler';
import EditIcon from 'components/icon-component/edit-icon';
const TestRuns = ({ noHeader, projectId }) => {
  const { control, register, watch, reset, setValue } = useForm();
  const navigate = useNavigate();
  const ref = useRef();
  const containerRef = useRef(null);
  const [choseColModal, setChoseColModal] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const { userDetails } = useAppContext();
  const [delModal, setDelModal] = useState(false);
  const [openRetestModal, setOpenRetestModal] = useState(false);
  const [openDelModal] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  const [allowResize, setAllowResize] = useState(false);
  const [allowFilterDrawer, setAllowFilterDrawer] = useState(false);
  const [sizes, setSizes] = useState(['20%', 'auto']);
  const [editRecord, setEditRecord] = useState(null);
  const [filtersCount, setFiltersCount] = useState(0);
  const [filters, setFilters] = useState({
    ...initialFilter,
    projectId: projectId ? [projectId] : [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [testRuns, setTestRuns] = useState({});
  const [menu, setMenu] = useState(false);

  const { toastSuccess, toastError } = useToaster();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isHoveringName, setIsHoveringName] = useState({});
  const [rightClickedRecord, setRightClickedRecord] = useState({});
  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });
  const add = searchParams.get('add');

  const projectInitialFilter = {
    search: '',
    status: [],
    assignedTo: [],
    createdBy: [],
    projectId: projectId ? [projectId] : [],
    page: 1,
    perPage: 25,
  };

  useEffect(() => {
    if (add === 'true') {
      setAllowResize(true);
    }
  }, [add]);

  const countAppliedFilters = () => {
    let count = 0;

    if (watch('status')?.length > 0) {
      count++;
    }
    if (watch('assignedTo')?.length > 0) {
      count++;
    }
    if (watch('dueDate')?.start !== null && watch('dueDate')?.start !== undefined) {
      count++;
    }
    if (watch('createdAt')?.start !== null && watch('createdAt')?.start !== undefined) {
      count++;
    }
    if (watch('createdBy')?.length > 0) {
      count++;
    }

    return setFiltersCount(count);
  };

  useEffect(() => {
    if (allowResize || allowFilterDrawer) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['65%', '35%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [allowResize || allowFilterDrawer]);

  const { mutateAsync: _getAllTestRuns, isLoading: _isLoading } = useGetTestRunsByFilter();
  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testRuns?.count !== testRuns?.testruns?.length && !_isLoading) {
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
  }, [containerRef, testRuns, _isLoading]);

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _.debounce(({ sortBy = '', sort = '' }) => {
    setSortFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
    }));
  }, 1000);

  useEffect(() => {
    if (testRuns?.testruns?.length) {
      const sortedData = sortData(testRuns?.testruns, sortFilters.sortBy, sortFilters.sort);

      setTestRuns((pre) => ({ ...pre, testruns: sortedData }));
    }
  }, [sortFilters]);

  const { mutateAsync: _deleteTestRunHandler, isLoading: isDeleting } = useDeleteTestRun();

  const onDelete = async (e, bulk) => {
    try {
      const res = await _deleteTestRunHandler({
        body: {
          toDelete: bulk ? selectedRecords : [delModal?.id],
        },
      });
      toastSuccess(res.msg);
      refetchHandler(bulk ? selectedRecords : [delModal?.id], 'delete');
      setDelModal(() => ({ open: false }));
      bulk && setSelectedRecords([]);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setTestRuns({
      count: 0,
      testruns: [],
    });
    setFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('search') && { search: watch('search') }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
      ...(watch('dueDate') &&
        watch('dueDate.start') &&
        watch('dueDate.end') && {
          dueDate: {
            start: formattedDate(watch('dueDate.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('dueDate.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('createdAt') &&
        watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('createdBy') && { createdBy: watch('createdBy') || [] }),
    }));
    countAppliedFilters();
    setIsOpen(false);
    setAllowFilterDrawer(false);
  }, 1000);

  // NOTE: fetching TextRuns

  const fetchTestRuns = async (filters) => {
    try {
      setLoadingMore(true);
      const response = await _getAllTestRuns(filters);
      setTestRuns((pre) => ({
        ...(pre || {}),
        count: response?.count || 0,
        testruns: filters?.page === 1 ? response?.testruns : [...(pre.testruns || []), ...(response?.testruns || [])],
      }));

      setLoadingMore(false);
    } catch (error) {
      toastError(error);
    }
  };

  const { mutateAsync: _exportTestRuns } = useExportTestRuns();

  const exportHandler = async () => {
    try {
      const res = await _exportTestRuns({
        ...filters,
        page: 0,
      });
      if (res) {
        downloadCSV(res, `TestRuns Export File ${new Date()}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const _values = _.pick(Object.fromEntries([...searchParams]), [
      'reportedBy',
      'reportedAtStart',
      'reportedAtEnd',
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

    delete _values.reportedBy;
    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, []);

  useEffect(() => {
    !_isLoading &&
      fetchTestRuns({
        ...filters,
        ...(watch('createdBy') && { createdBy: watch('createdBy') }),
        ...(watch('status') && { status: watch('status') }),
        ...(watch('createdAt.start') &&
          watch('createdAt.end') && {
            createdAt: {
              start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
              end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
            },
          }),
      });
  }, [filters]);

  useEffect(() => {
    if (projectId) {
      setTestRuns({
        count: 0,
        testruns: [],
      });
      setFilters((pre) => ({ ...pre, projectId: projectId ? [projectId] : [] }));
    }
  }, [projectId]);

  const { mutateAsync: _changePriorityHandler } = useChangePriorityTestRun();

  const onChangePriority = async (id, value) => {
    try {
      const res = await _changePriorityHandler({ id, body: { newPriority: value } });
      refetchHandler(id, 'edit', res?.runData);
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const refetchHandler = (id, scenario, newData) => {
    const index = id && scenario !== 'delete' ? testRuns?.testruns?.findIndex((x) => x._id === id) : null;
    if (scenario === 'add') {
      setTestRuns((pre) => ({
        ...pre,
        count: (pre.count || 0) + 1,
        testruns: testRuns.count < 25 * filters.page ? [...(pre.testruns || []), newData] : pre.testruns || [],
      }));
    } else if (id && scenario === 'edit') {
      const updatedTestRuns = testRuns?.testruns?.map((run, i) => {
        if (i === index) {
          return newData; // NOTE: Update the element at the specified index
        } else {
          return run; // NOTE: Keep the other elements unchanged
        }
      });
      setTestRuns((pre) => ({ ...pre, testruns: updatedTestRuns }));
    } else if (scenario === 'delete' && id?.length) {
      const updatedTestRuns = testRuns?.testruns?.filter((run) => !id.includes(run._id));
      setTestRuns((pre) => ({
        ...pre,
        count: (pre.count || 0) - id?.length,
        testruns: updatedTestRuns,
      }));
    }
  };

  const optionMenu = [
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: (e) => {
            e.preventDefault();
            setAllowResize(!allowResize);
            setEditRecord(rightClickedRecord?._id);
          },
          icon: <EditIcon backClass={style.editColor} />,
          text: 'Edit',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setDelModal({
              open: true,
              name: rightClickedRecord?.runId,
              id: rightClickedRecord?._id,
            }),
          icon: <DelIcon backClass={style.editColor1} />,
          text: 'Delete',
        },
      ],
    },
  ];

  return (
    <div style={{ height: !noHeader ? '100vh' : '85vh', overflow: 'hidden' }}>
      <SplitPane ref={ref} sizes={sizes} onChange={setSizes} allowResize={allowResize}>
        <MainWrapper
          title={'Test Runs'}
          date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
          searchField
          stylesBack={noHeader ? { marginTop: '10px' } : {}}
          noHeader={noHeader}
          onSearch={_.debounce((e) => {
            setTestRuns({
              count: 0,
              testruns: [],
            });
            setFilters((pre) => ({ ...pre, page: 1, search: e.target.value }));
          }, 1000)}
          onClear={_.debounce(() => {
            setTestRuns({
              count: 0,
              testruns: [],
            });
            setFilters((pre) => ({ ...pre, page: 1, search: '' }));
          }, 1000)}
        >
          <div className={style.functional}>
            <div className={style.mainClass} style={{ height: 'fit-content' }}>
              <div className={style.flex}>
                <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                  <Button
                    text="Add Test Run"
                    handleClick={() => {
                      setAllowResize(!allowResize);
                      setAllowFilterDrawer(false);
                    }}
                    data-cy="testrun-addtestrun-btn"
                  />
                </Permissions>
              </div>
              <div className={style.exportDiv}>
                <Button
                  startCompo={filtersCount > 0 ? <FilterIconOrange /> : <FilterIcon />}
                  text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                  btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                  handleClick={() => {
                    setAllowFilterDrawer(!allowFilterDrawer);
                    setAllowResize(false);
                  }}
                  data-cy="testrun-filter-btn"
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
                    />
                  </Permissions>
                }
              </div>
              <div className={style.optionsDivMobile}>
                {filtersCount > 0 && (
                  <div>
                    <span
                      onClick={() => {
                        reset(
                          projectId
                            ? { ...projectInitialFilter, projectId: projectId ? [projectId] : [] }
                            : { ...initialFilter },
                        );
                        setFilters(() =>
                          projectId
                            ? { ...projectInitialFilter, projectId: projectId ? [projectId] : [] }
                            : { ...initialFilter },
                        );

                        setTestRuns({
                          count: 0,
                          testruns: [],
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
                  mobileView
                  {...{
                    control,
                    register,
                    watch,
                    setValue,
                    reset: () => {
                      reset({ ...initialFilter });
                      setFilters(() => ({ ...initialFilter }));
                      setTestRuns({
                        count: 0,
                        testruns: [],
                      });
                      setSortFilters({ sortBy: '', sort: '' });
                      setFiltersCount(0);
                    },
                  }}
                  onFilterApply={onFilterApply}
                />
              </MobileMenu>
            </div>
            <>
              <div
                className={style.mainClass}
                style={{
                  marginTop: '10px',
                }}
              >
                <h6>
                  Test Runs ({selectedRecords.length ? `${selectedRecords.length}/` : ''}
                  {testRuns?.count})
                </h6>
                <div className={style.secondMenu}>
                  {selectedRecords.length ? (
                    <div
                      id={'deleteButton'}
                      style={{
                        height: '30px',
                        width: '36px',
                        cursor: 'pointer',
                        border: '1px solid var(--text-color3)',
                        borderRadius: '3px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className={style.change}
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
                  ) : null}
                </div>
                <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
                  <div className={style.secondMenuMobile}>
                    {selectedRecords.length ? (
                      <div
                        id={'deleteButton'}
                        className={style.change}
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
                    ) : null}
                    <div
                      id={'columnChange'}
                      alt=""
                      onClick={() => setChoseColModal(true)}
                      className={style.change}
                    ></div>
                    <div className={style.change}>
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
                    </div>
                  </div>
                </MobileMenu>
              </div>
              {_isLoading && filters?.page < 2 ? (
                <Loader />
              ) : (
                <div className={style.tableWidth} style={{ position: 'relative' }}>
                  <GenericTable
                    setRightClickedRecord={setRightClickedRecord}
                    menu={menu}
                    setMenu={setMenu}
                    menuData={menuData}
                    selectedItem={selectedRecords}
                    containerRef={containerRef}
                    ref={ref}
                    optionMenu={optionMenu}
                    noHeader={noHeader}
                    columns={columnsData({
                      testRuns: testRuns?.testruns,
                      setSelectedRecords,
                      selectedRecords,
                      setOpenRetestModal,
                      openRetestModal,
                      setEditRecord,
                      allowResize,
                      control,
                      watch,
                      setAllowResize,
                      register,
                      searchedText: filters?.search,
                      setOpenCreateTicket,
                      navigate,
                      setDelModal,
                      isHoveringName,
                      setIsHoveringName,
                      openDelModal,
                      openCreateTicket,
                      noHeader,
                      searchParams,
                      setSearchParams,
                      role: userDetails?.role,
                      userDetails,
                      onChangePriority,
                    })}
                    dataSource={testRuns?.testruns || []}
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
                  {loadingMore && <Loader tableMode />}
                </div>
              )}
              <ColumnModal
                choseColModal={choseColModal}
                setChoseColModal={setChoseColModal}
                columns={columnsData({
                  setOpenRetestModal,
                  openRetestModal,
                  control,
                  watch,
                  register,
                  setOpenCreateTicket,
                  openCreateTicket,
                })}
              />
              <DeleteModal
                openDelModal={!!delModal.open}
                setOpenDelModal={() => setDelModal({ open: false })}
                name={'Test Run'}
                clickHandler={(e) => onDelete(e, delModal.bulk)}
                isLoading={isDeleting}
              />
            </>
          </div>
        </MainWrapper>
        <div className={style.flex1}>
          {allowResize && !allowFilterDrawer && (
            <Drawer
              setSelectedRunRecords={setSelectedRecords}
              setDrawerOpen={setAllowResize}
              editRecord={editRecord}
              setEditRecord={setEditRecord}
              refetch={refetchHandler}
              drawerOpen={allowResize}
              noHeader={noHeader}
              projectId={projectId}
            />
          )}
          {allowFilterDrawer && !allowResize && (
            <FiltersDrawer
              noHeader={noHeader}
              setDrawerOpen={setAllowFilterDrawer}
              {...{
                control,
                register,
                watch,
                setValue,
                reset: () => {
                  reset(projectId ? { ...projectInitialFilter } : { ...initialFilter });
                  setFilters(() => (projectId ? { ...projectInitialFilter } : { ...initialFilter }));
                  setTestRuns({
                    count: 0,
                    testruns: [],
                  });
                  setSortFilters({ sortBy: '', sort: '' });
                  setFiltersCount(0);
                },
              }}
              onFilterApply={onFilterApply}
            />
          )}
          {/* NOTE: {===============  DONot remove this div this belongs to hotkeys =================} */}
          {allowResize && (
            <div
              id="splitpane"
              style={{ display: 'none' }}
              onClick={() => {
                setAllowResize(false);
              }}
            />
          )}
        </div>
      </SplitPane>
    </div>
  );
};
TestRuns.propTypes = {
  noHeader: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default TestRuns;
