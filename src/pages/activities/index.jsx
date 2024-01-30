import React, { useEffect, Fragment, useCallback, useState, useRef } from 'react';
import { entries as _entries, debounce as _debounce } from 'lodash';
import { useForm } from 'react-hook-form';

import { isToday, isYesterday } from 'date-fns';
import { useGetActivities } from 'hooks/api-hooks/settings/activities.hook';
import { formattedDate } from 'utils/date-handler';

import MobileMenu from 'components/mobile-menu';
import MainWrapper from 'components/layout/main-wrapper';
import MenuIcon from 'components/icon-component/menu';
import FilterIcon from 'components/icon-component/filter-icon';
import SplitPane from 'components/split-pane/split-pane';
import FilterIconOrange from 'components/icon-component/filter-icon-orange';
import Button from 'components/button';
import Loader from 'components/loader';

import ActivityCard from './activity-card';
import FiltersDrawer from './filters-drawer';
import FilterHeader from './header';
import { initialFilters } from './helper';

import noData from 'assets/no-found.svg';

import style from './activity.module.scss';

const Activities = ({ noHeader, projectId, testCaseId }) => {
  const { control, register, watch, setValue, handleSubmit, reset } = useForm(initialFilters);
  const ref = useRef();
  const containerRef = useRef(null);
  const [filters, setFilters] = useState({ ...initialFilters, page: 1 });
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState({});
  const [allowResize, setAllowResize] = useState(false);
  const [sizes, setSizes] = useState(['20%', 'auto']);
  const [filtersCount, setFiltersCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: _getActivities, isLoading } = useGetActivities();

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

  const countAppliedFilters = () => {
    let count = 0;
    if (watch('activityBy')?.length > 0) {
      count++;
    }
    if (watch('activityType')?.length > 0) {
      count++;
    }
    if (watch('activityAt')?.start !== null && watch('activityAt')?.start !== undefined) {
      count++;
    }
    return setFiltersCount(count);
  };

  const getActivities = async (filters) => {
    const res = await _getActivities({
      ...filters,
      ...(projectId && { projectId }),
      ...(testCaseId && { testCaseId }),

      perPage: 25,
    });
    const preActivities = filters.page === 1 ? [] : [...activities];
    const newActivity = [...preActivities, ...res?.activities];

    const updatedFilteredActivities = _entries(
      newActivity.reduce((acc, x) => {
        const key = isToday(new Date(x.activityAt))
          ? 'Today'
          : isYesterday(new Date(x.activityAt))
          ? 'Yesterday'
          : formattedDate(x.activityAt, 'dd MMM, yyyy');

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(x);
        return acc;
      }, {}),
    );

    setActivities(newActivity);

    setFilteredActivities(() => ({
      activitiesCount: res?.activitiesCount,
      activities: updatedFilteredActivities,
    }));
  };

  useEffect(() => {
    getActivities(projectId ? { ...filters, page: 0 } : filters);
  }, [filters, projectId, testCaseId]);

  const onFilterSubmit = _debounce((data) => {
    setActivities([]);
    setFilteredActivities({});

    setFilters((pre) => ({
      ...pre,
      ...(data?.activityAt?.start &&
        data?.activityAt?.end && {
          activityAt: {
            start: formattedDate(data?.activityAt?.start, 'yyyy-MM-dd'),
            end: formattedDate(data?.activityAt?.end, 'yyyy-MM-dd'),
          },
        }),
      activityBy: data?.activityBy || [],
      activityType: data?.activityType || [],
      page: 1,
    }));
    countAppliedFilters();
    setAllowResize(false);
  });
  const onFilterReset = (data) => {
    setActivities([]);
    setFilteredActivities({});
    setFilters((pre) => ({ ...initialFilters, page: 1 }));
  };

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (filteredActivities?.activitiesCount !== activities?.length && !isLoading) {
        containerRef?.current?.removeEventListener('scroll', handleScroll);

        setFilters((prev) => ({ ...prev, page: prev?.page + 1 }));
        // NOTE: Scroll up by 10 pixels from the last scroll position
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [activities, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      containerRef?.current?.addEventListener('scroll', handleScroll);
    } else if (isLoading) {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    }
    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, activities, isLoading]);

  return (
    <div
      style={{
        height: testCaseId ? '50vh' : '100vh',
        overflow: 'hidden',
      }}
    >
      <SplitPane ref={ref} sizes={sizes} onChange={setSizes} allowResize={allowResize}>
        <MainWrapper title="Activities" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')} noHeader={noHeader}>
          <div className={style.headerDiv}>
            <Button
              startCompo={filtersCount > 0 ? <FilterIconOrange /> : <FilterIcon />}
              text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
              btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
              handleClick={() => {
                setAllowResize(!allowResize);
              }}
            />
          </div>
          <div className={style.headerDivMobile}>
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
              <FilterHeader
                onSubmit={onFilterSubmit}
                onReset={onFilterReset}
                {...{
                  control,
                  register,
                  watch,
                  setValue,
                  handleSubmit,
                  reset,
                }}
              />
            </MobileMenu>
          </div>
          <div className={style.menuIcon} onClick={() => setIsOpen(true)}>
            <MenuIcon />
          </div>
          {isLoading && !activities.length ? (
            <Loader />
          ) : (
            <div ref={containerRef} className={style.activityWrapper} style={{ height: '80vh', overflow: 'auto' }}>
              {filteredActivities?.activitiesCount ? (
                filteredActivities?.activities?.map((x) => {
                  return (
                    <Fragment key={x[0]}>
                      {!testCaseId && (
                        <p
                          className={style.dayText}
                          style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000, // NOTE: Set a higher zIndex to ensure it's above other elements
                          }}
                        >
                          {x[0]}
                        </p>
                      )}
                      <div className={style.activitiesSection}>
                        {x[1]?.map((ele, index) => (
                          <>
                            <ActivityCard
                              title={ele.title}
                              activityType={ele.activityType}
                              description={ele.description}
                              activityBy={ele.activityBy}
                              createdAt={ele.createdAt}
                            />
                          </>
                        ))}
                      </div>
                    </Fragment>
                  );
                })
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
              {isLoading && <Loader tableMode />}
            </div>
          )}
        </MainWrapper>
        <div className={style.flex1}>
          {allowResize && (
            <FiltersDrawer
              noHeader={noHeader}
              setDrawerOpen={setAllowResize}
              onFilterApply={onFilterSubmit}
              onReset={onFilterReset}
              {...{
                control,
                register,
                watch,
                setValue,
                handleSubmit,
                reset,
              }}
            />
          )}
        </div>
      </SplitPane>
    </div>
  );
};

export default Activities;
