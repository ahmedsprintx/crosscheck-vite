import React, { useCallback, useEffect, useRef, useState } from 'react';
import style from './qa-dashboard.module.scss';
import ValueBox from 'components/value-box';
import ExpandableCard from './expandable-card';
import { useGetMyReportedBugsWidget, useGetQaAnalytics } from 'hooks/api-hooks/dashboard/dashboard.hook';
import Loader from 'components/loader';
import Report from '../report';
import { useForm } from 'react-hook-form';
import { useAppContext } from 'context/app.context';
import { useGetTestRunsByFilter } from 'hooks/api-hooks/test-runs/test-runs.hook';
import { useToaster } from 'hooks/use-toaster';
import ValuePalette from 'components/value-palette';
import ExpandableTable from './expandable-table';

const QaDashboard = () => {
  const containerRef = useRef();
  const { control, watch } = useForm();
  const { userDetails } = useAppContext();
  const { toastError } = useToaster();

  const [qaAnalytics, setQaAnalytics] = useState({});
  const [myReportedBugs, setMyReportedBugs] = useState({});
  const [testRuns, setTestRuns] = useState({});

  // NOTE: get Testruns

  const { mutateAsync: _getAllTestRuns, isLoading: _isLoading } = useGetTestRunsByFilter();

  const fetchTestRuns = async (filters) => {
    try {
      const response = await _getAllTestRuns(filters);
      setTestRuns((pre) => ({
        ...(pre || {}),
        count: response?.count || 0,
        testruns: [...(pre?.testruns || []), ...response?.testruns],
      }));
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    fetchTestRuns({
      search: '',
      status: [],
      assignedTo: [],
      projectId: [],
      createdBy: [],
      page: 0,
    });
  }, []);

  // NOTE: get QA analytics
  const { mutateAsync: _getQaAnalytics, isLoading: _QaAnalyticsLoading } = useGetQaAnalytics();
  const fetchQaAnalytics = async () => {
    try {
      const response = await _getQaAnalytics();
      setQaAnalytics(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchQaAnalytics();
  }, []);

  const [activeTab, setActiveTab] = useState('');

  const [qaAnalyticsPage, setQaAnalyticsPage] = useState(2);
  // NOTE: Get My Reported Bugs Widget DAta
  const { data: _qaAnalyticsData, isLoading: isRefetching } = useGetMyReportedBugsWidget({
    page: qaAnalyticsPage,
    perPage: 5,
    onSuccess: (data) => {
      const currentTab = activeTab;
      if (qaAnalyticsPage === 1) {
        setMyReportedBugs(data?.data);
      } else {
        setMyReportedBugs((pre) => ({
          ...pre,
          [currentTab]: {
            totalCount: data?.data[currentTab]?.totalCount || 0,
            bugs: [...(pre[currentTab]?.bugs || []), ...(data?.data[currentTab]?.bugs || [])],
          },
        }));
      }
    },
  });

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft } = containerRef.current;
    if (scrollHeight - Math.ceil(scrollTop) === clientHeight) {
      if (myReportedBugs[activeTab]?.totalCount !== myReportedBugs[activeTab]?.bugs?.length && !isRefetching) {
        setQaAnalyticsPage((prev) => prev + 1);
        containerRef.current.scrollTo(scrollLeft, scrollTop - 10);
      }
    }
  }, [isRefetching, activeTab]);

  useEffect(() => {
    if (!isRefetching) {
      containerRef?.current?.addEventListener('scroll', handleScroll);
    } else if (isRefetching) {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    }
    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, _qaAnalyticsData, isRefetching, activeTab]);

  return (
    <>
      {_isLoading || _QaAnalyticsLoading ? (
        <Loader />
      ) : (
        <div className={style.mainWrapper}>
          <div className={style.upperDiv}>
            <ValueBox className={style.boxWidth} heading={'My Reported Bugs'} value={qaAnalytics?.myReportedBugs} />
            <ValueBox className={style.boxWidth} heading={'Closed'} value={qaAnalytics?.closedBugs} />
            <ValueBox className={style.boxWidth} heading={'Opened'} value={qaAnalytics?.openedBugs} />
            <ValueBox className={style.boxWidth} heading={'Reproducible'} value={qaAnalytics?.reproducibleBugs} />
            <ValueBox className={style.boxWidth} heading={'Need to Discuss'} value={qaAnalytics?.needToDiscussBugs} />
            <ValueBox className={style.boxWidth} heading={'Blocked'} value={qaAnalytics?.blockedBugs} />
          </div>
          <div className={style.middleDiv}>
            <div className={style.left}>
              <Report control={control} watch={watch} userDetails={userDetails} />
              <div className={style.valueBoxDiv}>
                <ValueBox
                  heading={'Bug Closure Rate'}
                  value={qaAnalytics?.bugsClosureRateDays > 0 ? `${qaAnalytics?.bugsClosureRateDays} Days` : '-'}
                  className={style.valueBoxClass}
                />
                <ValuePalette heading={'Bugs Types'} className={style.valuePaletteClass} data={qaAnalytics?.bugTypes} />
              </div>
            </div>
            <div className={style.right}>
              <ExpandableCard title={'My Test Runs'} data={testRuns} />
            </div>
          </div>
          <div className={style.lowerDiv}>
            <ExpandableTable
              title={'My Reported Bugs'}
              data={myReportedBugs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              containerRef={containerRef}
              setQaAnalyticsPage={setQaAnalyticsPage}
              _isLoading={isRefetching}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default QaDashboard;
