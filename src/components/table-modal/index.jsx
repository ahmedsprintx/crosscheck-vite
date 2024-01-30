import React, { useCallback, useEffect, useRef, useState } from 'react';

// NOTE: components
import Modal from 'components/modal';

// NOTE: utils

// NOTE: styles
import style from './table-modal.module.scss';
import GenericTable from 'components/generic-table';
import { columnsData, columnsDataDeleted, columnsDataTestCase, columnsDataTestRun, initialFilters } from './helper';
import { useSearchParams } from 'react-router-dom';
import Loader from 'components/loader';
import { useGetBugsByFilter } from 'hooks/api-hooks/bugs/bugs.hook';
import { useForm } from 'react-hook-form';
import { useToaster } from 'hooks/use-toaster';
import _ from 'lodash';
import { formattedDate } from 'utils/date-handler';
import CrossIcon from 'components/icon-component/cross';
import { useGetTestCasesByFilter } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useGetTestRunsByFilter } from 'hooks/api-hooks/test-runs/test-runs.hook';
import { useGetAllTrash } from 'hooks/api-hooks/trash/trash.hook';

const TableModal = ({ open, setOpen, projectId, className, title, type, setType, data }) => {
  const ref = useRef();
  const containerRef = useRef(null);
  const [testRuns, setTestRuns] = useState({});
  const [trash, setTrash] = useState({});
  const [bugs, setBugs] = useState({});
  const [testCases, setTestCases] = useState({});
  const { watch, setValue } = useForm();
  const { toastError } = useToaster();
  const [loadingMore, setLoadingMore] = useState(false);
  const [isHoveringName, setIsHoveringName] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    projectId: projectId ? [projectId] : [],
  });
  const [sortFilters, setSortFilters] = useState({
    sortBy: '',
    sort: '',
  });
  // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: /Bugs
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

  const bugsHandler = async (filters) => {
    const response = await _getAllBugs(
      _.pickBy(filters, (value, key) => {
        if (key === 'reportedAt' || key === 'closedDate' || key === 'reTestDate' || key === 'createdAt') {
          return !(value.start === null);
        }
        return true;
      }),
    );
    setBugs((pre) => ({
      ...(pre || {}),
      count: response?.count || 0,
      bugs: filters.page === 1 ? response?.bugs : [...(pre.bugs || []), ...response?.bugs],
    }));
  };

  const fetchBugs = async (filters) => {
    try {
      bugsHandler(filters);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const _values =
      open === true &&
      type === 'bugs' &&
      _.pick(Object.fromEntries([...searchParams]), [
        'reportedBy',
        'reportedAtStart',
        'reportedAtEnd',
        'issueType',
        'status',
        'bugType',
        'bugBy',
        'severity',
        'retestDateStart',
        'createdAtStart',
        'createdAtEnd',
        'retestDateEnd',
      ]);

    if (_values.reportedBy) {
      _values.reportedBy = _values?.reportedBy?.split(',') || [];
    }
    if (_values.bugBy) {
      _values.bugBy = _values?.bugBy?.split(',') || [];
    }
    if (_values.issueType) {
      _values.issueType = _values?.issueType?.split(',') || [];
    }
    if (_values.status) {
      _values.status = _values?.status?.split(',') || [];
    }
    if (_values.severity) {
      _values.severity = _values?.severity?.split(',') || [];
    }
    if (_values.bugType) {
      _values.bugType = _values?.bugType?.split(',') || [];
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
    if (_values?.createdAtStart && _values?.createdAtEnd) {
      _values.createdAt = {
        start: new Date(_values?.createdAtStart),
        end: new Date(_values?.createdAtEnd),
      };
    }

    delete _values.reportedAtStart;
    delete _values.reportedAtEnd;
    delete _values.retestDateStart;
    delete _values.retestDateEnd;

    Object.entries(_values).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [searchParams, open]);

  useEffect(() => {
    !_isLoading &&
      open === true &&
      type === 'bugs' &&
      fetchBugs(
        projectId
          ? { ...filters, projects: [projectId] }
          : {
              ...filters,
              ...(watch('reportedBy') && { reportedBy: watch('reportedBy') }),
              ...(watch('bugBy') && { bugBy: watch('bugBy') }),
              ...(watch('issueType') && { issueType: watch('issueType') }),
              ...(watch('status') && { status: watch('status') }),
              ...(watch('bugType') && { bugType: watch('bugType') }),
              ...(watch('severity') && { severity: watch('severity') }),
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
              ...(watch('createdAt.start') &&
                watch('createdAt.end') && {
                  createdAt: {
                    start: formattedDate(watch('createdAt.start'), 'yyyy-MM-dd'),
                    end: formattedDate(watch('createdAt.end'), 'yyyy-MM-dd'),
                  },
                }),
            },
      );
  }, [filters, open]);

  const resetHandler = () => {
    setValue('status', []);
    setValue('bugType', []);
    setValue('severity', []);
    setValue('issueType', []);
    setValue('bugBy', []);
  };

  // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: /Test-Cases
  const { mutateAsync: _getAllTestCases, isLoading: _isLoadingTestCases } = useGetTestCasesByFilter();

  const handleScrollTestCases = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
      if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
        if (testCases.count !== testCases?.testcases?.length && !_isLoadingTestCases) {
          containerRef?.current?.removeEventListener('scroll', handleScrollTestCases);

          setFilters((prev) => ({
            ...prev,
            page: !_isLoadingTestCases && prev?.page + 1,
          }));

          // NOTE: Scroll up by 10 pixels from the last scroll position
          containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
        }
      }
    },
    [_isLoadingTestCases],
  );

  useEffect(() => {
    if (!_isLoadingTestCases) {
      containerRef?.current?.addEventListener('scroll', handleScrollTestCases);
    } else if (_isLoadingTestCases) {
      containerRef?.current?.removeEventListener('scroll', handleScrollTestCases);
    }
    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScrollTestCases);
    };
  }, [containerRef, testCases, _isLoadingTestCases]);

  const testCaseHandler = async (filters) => {
    const response = await _getAllTestCases(
      _.pickBy(filters, (value, key) => {
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

  const fetchTestCases = async (filters) => {
    try {
      await testCaseHandler(filters);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const _values =
      open === true &&
      type === 'testCase' &&
      _.pick(Object.fromEntries([...searchParams]), [
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
  }, [searchParams, open]);

  useEffect(() => {
    !_isLoadingTestCases &&
      open === true &&
      type === 'testCase' &&
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
  }, [filters, open]);

  // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: /Test-Runs
  const { mutateAsync: _getAllTestRuns, isLoading: _isLoadingTestRuns } = useGetTestRunsByFilter();
  const handleScrollTestRuns = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (testRuns?.count !== testRuns?.testruns?.length && !_isLoadingTestRuns) {
        containerRef?.current?.removeEventListener('scroll', handleScrollTestRuns);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1 }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [_isLoadingTestRuns]);

  useEffect(() => {
    if (!_isLoadingTestRuns) {
      containerRef?.current?.addEventListener('scroll', handleScrollTestRuns);
    } else if (_isLoadingTestRuns) {
      containerRef?.current?.removeEventListener('scroll', handleScrollTestRuns);
    }
    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScrollTestRuns);
    };
  }, [containerRef, testRuns, _isLoadingTestRuns]);

  const fetchTestRuns = async (filters) => {
    try {
      setLoadingMore(true);
      const response = await _getAllTestRuns(filters);
      setTestRuns((pre) => ({
        ...(pre || {}),
        count: response?.count || 0,
        testruns: filters?.page === 1 ? response?.testruns : [...(pre.testruns || []), ...response?.testruns],
      }));

      setLoadingMore(false);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const _values =
      open === true &&
      type === 'testRun' &&
      _.pick(Object.fromEntries([...searchParams]), ['reportedBy', 'reportedAtStart', 'reportedAtEnd', 'status']);

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
  }, [searchParams, open]);

  useEffect(() => {
    !_isLoadingTestRuns &&
      open === true &&
      type === 'testRun' &&
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
  }, [filters, open]);

  // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: // NOTE: Trash
  const { mutateAsync: _getAllTrash, isLoading: _IsLoading } = useGetAllTrash();
  const fetchAllTrash = async (filters) => {
    try {
      const response = await _getAllTrash(filters);
      setTrash(response);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const _values =
      open === true &&
      type === 'delete' &&
      _.pick(Object.fromEntries([...searchParams]), ['reportedBy', 'reportedAtStart', 'reportedAtEnd', 'searchType']);

    if (_values.reportedBy) {
      _values.deletedBy = _values?.reportedBy?.split(',') || [];
    }
    if (_values.searchType) {
      _values.searchType = _values?.searchType?.split(',') || [];
    }

    if (_values?.reportedAtStart && _values?.reportedAtEnd) {
      _values.deletedOn = {
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
  }, [searchParams, open]);

  useEffect(() => {
    !_IsLoading &&
      open === true &&
      type === 'delete' &&
      fetchAllTrash({
        ...filters,
        ...(watch('deletedBy') && { deletedBy: watch('deletedBy') }),
        ...(watch('deletedOn.start') &&
          watch('deletedOn.end') && {
            deletedOn: {
              start: formattedDate(watch('deletedOn.start'), 'yyyy-MM-dd'),
              end: formattedDate(watch('deletedOn.end'), 'yyyy-MM-dd'),
            },
          }),
        ...(watch('searchType') && { searchType: watch('searchType') }),
      });
  }, [filters, open]);
  return (
    <Modal open={open} className={`${style.modalClass} ${className && className}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {type === 'bugs' && (
          <span className={style.modalTitle}>
            {type === 'bugs' && 'Bugs | '}
            {Object.fromEntries([...searchParams])?.issueType ||
              Object.fromEntries([...searchParams])?.status ||
              (Object.fromEntries([...searchParams])?.bugType &&
                `${Object.fromEntries([...searchParams])?.bugType} Type`) ||
              (Object.fromEntries([...searchParams])?.severity &&
                `${Object.fromEntries([...searchParams])?.severity} Severity`)}{' '}
            ({bugs?.count})
          </span>
        )}
        {type === 'testCase' && (
          <span className={style.modalTitle}>
            {type === 'testCase' && 'Test Cases | '}
            {Object.fromEntries([...searchParams])?.status || 'Added'} ({testCases?.count})
          </span>
        )}
        {type === 'testRun' && (
          <span className={style.modalTitle}>
            {type === 'testRun' && 'Test Runs | '}
            {Object.fromEntries([...searchParams])?.status || 'Created'} ({testRuns?.count})
          </span>
        )}
        {type === 'delete' && (
          <span className={style.modalTitle}>
            {Object.fromEntries([...searchParams])?.searchType === 'Bug' && 'Bugs | '}
            {Object.fromEntries([...searchParams])?.searchType === 'TestCase' && 'Test Cases | '}
            {'Deleted'} ({trash?.count})
          </span>
        )}
        <div
          onClick={() => {
            setBugs({});
            setTrash({});
            setType('');
            resetHandler();
            setOpen(false);
            setTestCases({});
            setTestRuns({});
            setSearchParams('');
          }}
        >
          <CrossIcon />
        </div>
      </div>
      <div className={style.innerWrapper}>
        {type === 'bugs' && (
          <div className={style.tableWidth} style={{ position: 'relative' }}>
            <GenericTable
              containerRef={containerRef}
              ref={ref}
              columns={columnsData({
                isHoveringName,
                setIsHoveringName,
              })}
              dataSource={bugs?.bugs || []}
              filters={sortFilters}
              selectable={true}
              height={'calc(100vh - 275px)'}
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
        )}
        {type === 'testCase' && (
          <div className={style.tableWidth} style={{ position: 'relative' }}>
            <GenericTable
              containerRef={containerRef}
              ref={ref}
              columns={columnsDataTestCase({
                setSearchParams,
                isHoveringName,
                setIsHoveringName,
              })}
              dataSource={testCases?.testcases || []}
              overflowX={_isLoadingTestCases ? 'hidden' : 'auto'}
              height={'calc(100vh - 275px)'}
              selectable={true}
              filters={sortFilters}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
            />
            {_isLoadingTestCases && <Loader tableMode />}
          </div>
        )}
        {type === 'testRun' && (
          <div className={style.tableWidth} style={{ position: 'relative' }}>
            <GenericTable
              containerRef={containerRef}
              ref={ref}
              columns={columnsDataTestRun({
                isHoveringName,
                setIsHoveringName,
              })}
              dataSource={testRuns?.testruns || []}
              height={'calc(100vh - 267px)'}
              overflowX={_isLoadingTestRuns ? 'hidden' : 'auto'}
              selectable={true}
              filters={sortFilters}
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
        {type === 'delete' && (
          <div className={style.tableWidth} style={{ position: 'relative' }}>
            <div className={style.tableWidth}>
              <GenericTable
                ref={ref}
                columns={columnsDataDeleted({
                  isHoveringName,
                  setIsHoveringName,
                  trash: trash,
                })}
                dataSource={trash?.allTrash || []}
                height={'calc(100vh - 267px)'}
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
              {_IsLoading && <Loader tableMode />}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TableModal;
