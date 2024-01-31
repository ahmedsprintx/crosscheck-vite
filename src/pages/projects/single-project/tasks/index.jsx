import Button from 'components/button';
import ExportIcon from 'components/icon-component/export-icon';
import MainWrapper from 'components/layout/main-wrapper';
import { useCallback, useEffect, useRef, useState } from 'react';
import { columnsData, initialFilter } from './helper';

import style from './tasks.module.scss';
import { useToaster } from 'hooks/use-toaster';
import SplitPane from 'components/split-pane/split-pane';
import FilterHeader from './header';
import { useForm } from 'react-hook-form';
import GenericTable from 'components/generic-table';
import { useGetTasksByFilter } from 'hooks/api-hooks/task/task.hook';
import { formattedDate } from 'utils/date-handler';
import FilterIconOrange from 'components/icon-component/filter-icon-orange';
import { debounce as _debounce } from 'utils/lodash';
import Loader from 'components/loader';
import MenuIcon from 'components/icon-component/menu';
import threeDots from 'assets/threeDots.svg';
import MobileMenu from 'components/mobile-menu';
import FiltersDrawer from './filters-drawer';
import FilterIcon from 'components/icon-component/filter-icon';

const Tasks = ({ noHeader, projectId }) => {
  const ref = useRef();
  const containerRef = useRef(null);
  const [tasks, setTasks] = useState({});
  const { toastError } = useToaster();
  const [filters, setFilters] = useState(initialFilter);
  const [filtersCount, setFiltersCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { control, register, watch, reset, setValue } = useForm();
  const [isHoveringName, setIsHoveringName] = useState({});
  const [allowResize, setAllowResize] = useState(false);
  const [sizes, setSizes] = useState(['20%', 'auto']);
  const [isOpen2, setIsOpen2] = useState(false);

  useEffect(() => {
    if (allowResize) {
      if (window.innerWidth <= 768) {
        setSizes(['0%', '100%']);
      } else {
        setSizes(['65%', '35%']);
      }
    } else {
      setSizes(['100%', '0%']);
    }
  }, [allowResize]);
  const { mutateAsync: _getAllTasks, isLoading: _isLoading } = useGetTasksByFilter();

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (tasks?.tasksCount !== tasks?.tasks.length && !_isLoading) {
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
  }, [containerRef, tasks, _isLoading]);

  const countAppliedFilters = () => {
    let count = 0;
    if (watch('applicationType')?.length > 0) {
      count++;
    }
    if (watch('taskType')?.length > 0) {
      count++;
    }
    if (watch('crossCheckAssignee')?.length > 0) {
      count++;
    }
    if (watch('createdBy')?.length > 0) {
      count++;
    }
    if (watch('createdAt')?.start !== null && watch('createdAt')?.start !== undefined) {
      count++;
    }
    return setFiltersCount(count);
  };

  // NOTE: onFilter Apply
  const onFilterApply = _debounce(() => {
    setTasks({
      count: 0,
      tasks: [],
    });
    setFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('applicationType') && {
        applicationType: watch('applicationType') || [],
      }),
      ...(watch('taskType') && { taskType: watch('taskType') || [] }),
      ...(watch('createdAt') &&
        watch('createdAt.start') &&
        watch('createdAt.end') && {
          createdAt: {
            start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('createdBy') && { createdBy: watch('createdBy') || [] }),
      ...(watch('crossCheckAssignee') && {
        crossCheckAssignee: watch('crossCheckAssignee') || [],
      }),
    }));
    countAppliedFilters();
    setAllowResize(false);
    setIsOpen(false);
  }, 1000);

  // NOTE: fetching TextRuns
  const fetchTasks = async (filters) => {
    try {
      const response = await _getAllTasks({
        id: projectId,
        filters,
      });
      setTasks((pre) => ({
        ...(pre || {}),
        tasksCount: response?.tasksCount || 0,
        tasks: filters.page === 1 ? response?.tasks : [...(pre.tasks || []), ...(response?.tasks || [])],
      }));
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  return (
    <div style={{ height: !noHeader ? '100vh' : '85vh', overflow: 'hidden' }}>
      <SplitPane ref={ref} sizes={sizes} onChange={setSizes} allowResize={allowResize}>
        <MainWrapper
          title={'Test Runs'}
          stylesBack={noHeader ? { marginTop: '10px' } : {}}
          noHeader={noHeader}
          searchField
          onSearch={_debounce((e) => {
            setTasks({
              tasksCount: 0,
              tasks: [],
            });
            setFilters((pre) => ({
              ...pre,
              page: 1,
              search: e.target.value,
            }));
          }, 1000)}
          onClear={_debounce(() => {
            setTasks({
              tasksCount: 0,
              tasks: [],
            });
            setFilters((pre) => ({ ...pre, page: 1, search: '' }));
          }, 1000)}
        >
          <div className={style.mainClass}>
            <div className={style.exportDiv}>
              <Button
                startCompo={filtersCount > 0 ? <FilterIconOrange /> : <FilterIcon />}
                text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                handleClick={() => {
                  setAllowResize(!allowResize);
                }}
              />

              <Button
                text="Export"
                startCompo={<ExportIcon />}
                btnClass={style.btn}
                handleClick={() => {
                  toastError({ msg: 'No Data available to export' });
                }}
              />
            </div>
            <div className={style.optionsDivMobile}>
              {filtersCount > 0 && (
                <div>
                  <span
                    onClick={() => {
                      setFilters(initialFilter);
                      reset();
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
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} extraPadding>
              <FilterHeader
                {...{
                  control,
                  register,
                  watch,
                  setValue,
                  reset: () => {
                    setFilters(initialFilter);
                    reset();
                    setIsOpen(false);
                    setFiltersCount(0);
                  },
                }}
                onFilterApply={onFilterApply}
              />
            </MobileMenu>
          </div>
          <div className={style.flex}>
            <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
              <div className={style.secondMenuMobile}>
                <div className={style.change}>
                  <ExportIcon />
                  <p
                    onClick={() => {
                      toastError({ msg: 'No Data available to export' });
                    }}
                  >
                    Export
                  </p>
                </div>
              </div>
            </MobileMenu>
          </div>
          {_isLoading && !tasks?.tasks?.length ? (
            <Loader />
          ) : (
            <>
              <h6> Tasks ({tasks?.tasks?.length})</h6>
              <div className={style.tableWidth} style={{ position: 'relative' }}>
                <GenericTable
                  containerRef={containerRef}
                  ref={ref}
                  columns={columnsData({
                    tasks: tasks?.tasks,
                    control,
                    watch,
                    isHoveringName,
                    setIsHoveringName,
                    searchedText: filters?.search,
                    register,
                    noHeader,
                  })}
                  dataSource={tasks?.tasks || []}
                  height={'calc(100vh - 265px)'}
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
          )}
        </MainWrapper>
        <div className={style.flex1}>
          {allowResize && (
            <FiltersDrawer
              noHeader={noHeader}
              setDrawerOpen={setAllowResize}
              {...{
                control,
                register,
                watch,
                setValue,
                reset: () => {
                  reset({ ...initialFilter });
                  setFilters(() => ({ ...initialFilter }));
                  setIsOpen(false);
                  setFiltersCount(0);
                },
              }}
              onFilterApply={onFilterApply}
            />
          )}
        </div>
      </SplitPane>
    </div>
  );
};

export default Tasks;
