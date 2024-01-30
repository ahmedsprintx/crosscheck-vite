import React, { useEffect, useRef, useState } from 'react';

// NOTE: component
import TestCaseSummary from './cards/test-case-summary';
import BugsReported from './cards/bugs-reported';

// NOTE: utils
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';
import {
  useBugReporter,
  useDevelopersBug,
  useGetAnalytics,
  useGetBugsAging,
  useGetBugsSeverity,
  useGetBugsStatus,
  useGetBugsTypes,
} from 'hooks/api-hooks/projects/dashboard.hook';
import { useToaster } from 'hooks/use-toaster';
import { initialFilter } from './helper';
import { useParams } from 'react-router-dom';
// NOTE: css
import styles from './dashboard.module.scss';
import BugsStatus from './cards/bugs-status';
import BugsType from './cards/bugs-type';
import BugsSeverity from './cards/bugs-severity';
import AnalyticsCards from './cards/analytics-cards';
import BugsAging from './cards/bugs-aging';
import BugsReporter from './cards/bugs-reporter';

const Index = () => {
  const { id } = useParams();
  const componentRef = useRef();
  const { toastError } = useToaster();
  const [filters, setFilters] = useState({ ...initialFilter });
  const [typesFilters, setTypesFilters] = useState({ ...initialFilter });
  const [severityFilters, setSeverityFilters] = useState({ ...initialFilter });

  const [bugsReporterFilters, setBugsReporterFilters] = useState({ ...initialFilter });
  const [developersBugFilters, setDevelopersBugFilters] = useState({ ...initialFilter });
  const [bugsStatus, setBugsStatus] = useState({});
  const [bugsTypes, setBugsTypes] = useState({});
  const [bugsSeverity, setBugsSeverity] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [bugsAging, setBugsAging] = useState({});
  const [bugsReporter, setBugsReporter] = useState({});
  const [developersBug, setDevelopersBug] = useState({});

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }
    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

  // NOTE: Get Bugs Status
  const { mutateAsync: _getBugsStatus, isLoading: _loadingGetBugsStatus } = useGetBugsStatus();
  const fetchBugsStatus = async ({ id, filters }) => {
    try {
      const response = await _getBugsStatus({ id, filters });
      setBugsStatus(response);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    fetchBugsStatus({
      id: id,
      filters: { ...filters },
    });
  }, [filters, id]);

  useEffect(() => {
    fetchBugsTypes({
      id: id,
      filters: { ...typesFilters },
    });
  }, [typesFilters, id]);

  useEffect(() => {
    fetchBugsSeverity({
      id: id,
      filters: { ...severityFilters },
    });
  }, [severityFilters, id]);

  useEffect(() => {
    getAnalytics(id);
    fetchBugsAging(id);
  }, [id]);

  useEffect(() => {
    fetchBugsReporter({ id, filters: bugsReporterFilters });
  }, [bugsReporterFilters, id]);

  useEffect(() => {
    fetchDevelopersBug({ id, filters: developersBugFilters });
  }, [developersBugFilters, id]);

  // NOTE: Get Bugs Types
  const { mutateAsync: _getBugsTypes, isLoading: _loadingGetBugsTypes } = useGetBugsTypes();
  const fetchBugsTypes = async ({ id, filters }) => {
    try {
      const response = await _getBugsTypes({ id, filters });
      setBugsTypes(response);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: Get Bugs  severity
  const { mutateAsync: _getBugsSeverity, isLoading: _loadingGetBugsSeverity } = useGetBugsSeverity();
  const fetchBugsSeverity = async ({ id, filters }) => {
    try {
      const response = await _getBugsSeverity({ id, filters });
      setBugsSeverity(response);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: Get Overall Analytics
  const { mutateAsync: _getAnalytics, isLoading: _loadingGetAnalytics } = useGetAnalytics();
  const getAnalytics = async (id) => {
    try {
      const response = await _getAnalytics(id);
      setAnalytics(response?.data);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: Get Bugs Aging
  const { mutateAsync: _getBugsAging, isLoading: _loadingGetBugsAging } = useGetBugsAging();
  const fetchBugsAging = async (id) => {
    try {
      const response = await _getBugsAging(id);
      setBugsAging(response?.bugsAgingData);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: getBugs Reporter
  const { mutateAsync: _getBugsReporterHandler, isLoading: _loadingBugReporter } = useBugReporter();
  const fetchBugsReporter = async ({ id, filters }) => {
    try {
      const response = await _getBugsReporterHandler({ id, filters });
      setBugsReporter(response);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: getBugs Reporter
  const { mutateAsync: _getDevelopersBugHandler, isLoading: _loadingDevelopersBug } = useDevelopersBug();
  const fetchDevelopersBug = async ({ id, filters }) => {
    try {
      const response = await _getDevelopersBugHandler({ id, filters });
      setDevelopersBug(response);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.flexWrapperLeft}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <AnalyticsCards analyticsData={analytics} />
            <div className={styles.mainWrapper2}>
              <BugsAging data={bugsAging} />
              <BugsSeverity
                isLoading={_loadingGetBugsSeverity}
                projectId={id}
                data={bugsSeverity?.severityData}
                setBugsSeverity={setBugsSeverity}
                initialFilter={initialFilter}
                setSeverityFilters={setSeverityFilters}
              />
            </div>
          </div>
          <div>
            <TestCaseSummary />
          </div>
        </div>
        <div className={styles.flexWrapperRight}>
          <BugsStatus
            isLoading={_loadingGetBugsStatus}
            projectId={id}
            statusData={bugsStatus?.count}
            statusDataPercentage={bugsStatus?.percentage}
            initialFilter={initialFilter}
            setFilters={setFilters}
            setBugsStatus={setBugsStatus}
          />

          <BugsReported componentRef={componentRef} downloadHandler={downloadHandler} />
        </div>
      </div>
      <div className={styles.bottomWrapper}>
        <BugsReporter
          isLoading={_loadingBugReporter}
          projectId={id}
          bugsReporter={bugsReporter?.bugsReporterData}
          initialFilter={initialFilter}
          setBugsReporterFilters={setBugsReporterFilters}
          setBugsReporter={setBugsReporter}
        />
        <BugsType
          isLoading={_loadingGetBugsTypes}
          projectId={id}
          data={bugsTypes?.bugTypeData}
          setBugsTypes={setBugsTypes}
          initialFilter={initialFilter}
          setTypesFilters={setTypesFilters}
        />
        <BugsReporter
          isLoading={_loadingDevelopersBug}
          projectId={id}
          name={`Developer's Bugs`}
          bugsReporter={developersBug?.developersData}
          initialFilter={initialFilter}
          setBugsReporterFilters={setDevelopersBugFilters}
          setBugsReporter={setDevelopersBug}
        />
      </div>
    </>
  );
};

export default Index;
