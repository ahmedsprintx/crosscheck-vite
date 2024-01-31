import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

// NOTE: comonents
import Menu from 'components/menu';
import Chart from 'components/chart';
// NOTE: hooks
// NOTE: utils
import { formattedDate } from 'utils/date-handler';

// NOTE: assets
import dots from 'assets/threeDots.svg';
import expandIcon from 'assets/expand.svg';

// NOTE: css
import style from './bugs-status.module.scss';
import _ from 'lodash';
import ExpandModal from './Modals/expand-modal';
import FiltersModal from './Modals/filters-modal';
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';
import Loader from 'components/loader';
import Button from 'components/button';

const BugsReporter = ({
  name,
  isLoading,
  expanded,
  projectId,
  handleClose,
  modalMode,
  bugsReporter,
  setBugsReporterFilters,
  initialFilter,
  setBugsReporter,
}) => {
  const componentRef = useRef();
  const { control, reset, watch, setValue } = useForm();
  const [more, setMore] = useState({ open: false, view: '' });
  const [expandModal, setExpandModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [chartData, setChartData] = useState({});
  const [filtersCount, setFiltersCount] = useState(0);

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }
    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

  useEffect(() => {
    const labels = bugsReporter?.map((reporter) => (reporter.developer ? reporter.developer : reporter.reporter));
    const datasets = [
      {
        label: 'Closed',
        backgroundColor: '#34C369',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.closedBugs),
      },
      {
        label: 'Open',
        backgroundColor: '#F96E6E',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.openBugs),
      },

      {
        label: 'Blocked',
        backgroundColor: '#F80101',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.blockedBugs),
      },
      {
        label: 'Reproducible',
        backgroundColor: '#B79C11',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.reproducibleBugs),
      },
      {
        label: 'Need To Discuss',
        backgroundColor: '#11103D',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.needToDiscuss),
      },
    ];

    const data = {
      labels,
      datasets,
    };

    setChartData(data);
  }, [bugsReporter]);

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setBugsReporter({});
    setBugsReporterFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('reportedAt') &&
        watch('reportedAt.start') &&
        watch('reportedAt.end') && {
          reportedAt: {
            start: formattedDate(watch('reportedAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('reportedAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('milestones') && { milestones: watch('milestones') || [] }),
      ...(watch('features') && { features: watch('features') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
      ...(watch('testingType') && { testingType: watch('testingType') || [] }),
      ...(watch('issueType') && { issueType: watch('issueType') || [] }),
      ...(watch('bugType') && { bugType: watch('bugType') || [] }),
      ...(watch('developers') && { developers: watch('developers') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('severity') && { severity: watch('severity') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
    }));
    countAppliedFilters();
    setFiltersModal(false);
  }, 1000);

  const countAppliedFilters = () => {
    let count = 0;

    if (
      watch('reportedAt')?.start !== null &&
      watch('reportedAt')?.start !== undefined &&
      watch('reportedAt')?.start !== ''
    ) {
      count++;
    }
    if (watch('milestones')?.length > 0) {
      count++;
    }
    if (watch('features')?.length > 0) {
      count++;
    }
    if (watch('testingType')?.length > 0) {
      count++;
    }
    if (watch('issueType')?.length > 0) {
      count++;
    }
    if (watch('bugType')?.length > 0) {
      count++;
    }
    if (watch('developers')?.length > 0) {
      count++;
    }
    if (watch('assignedTo')?.length > 0) {
      count++;
    }
    if (watch('reportedBy')?.length > 0) {
      count++;
    }
    if (watch('status')?.length > 0) {
      count++;
    }
    if (watch('severity')?.length > 0) {
      count++;
    }

    return setFiltersCount(count);
  };

  const menu2 = [
    {
      title: 'Download as',
      click: () => {
        setMore((pre) => ({
          ...pre,
          view: 'Download as',
        }));
      },
      subMenu: [
        {
          title: 'PDF',
          click: () => {
            setMore((pre) => ({ open: false, view: '' }));
            _.delay(() => downloadHandler('PDF'), 2000, 'PDF download');
          },
        },
        {
          title: 'PNG',
          click: () => {
            setMore((pre) => ({ open: false, view: '' }));
            _.delay(() => downloadHandler('PNG'), 2000, 'PNG download');
          },
        },
      ],
    },
  ];

  return (
    <div className={`${style.main} ${expanded && style.noBorder}`} ref={componentRef}>
      <div className={style.header}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            position: 'relative',
          }}
        >
          <h2>{name ? name : 'Bugs Reporter'}</h2>
        </div>

        <div
          style={{
            display: 'flex',

            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {!modalMode && (
              <Button
                text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                handleClick={() => {
                  setFiltersModal(true);
                }}
              />
            )}
          </div>
          {!modalMode && (
            <img src={expandIcon} alt="" onClick={!expanded ? () => setExpandModal(true) : () => handleClose()} />
          )}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <img alt="" src={dots} onClick={() => setMore((pre) => ({ ...pre, open: true }))} />

            {more?.open && (
              <div className={style.menuDiv}>
                <Menu
                  menu={menu2?.filter((x) => {
                    return x.title;
                  })}
                  active={style.active}
                />
              </div>
            )}
            {more?.view === 'Download as' && (
              <div className={style.menuDiv2}>
                <Menu menu={menu2.find((x) => x.title === more?.view).subMenu} active={style.active} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={style.chartMain}>
        {isLoading ? (
          <Loader className={style.loaderHeight} />
        ) : (
          <Chart className={style.chart} type="bar" chartOptions={chartOptions} chartData={chartData} />
        )}
      </div>
      {more?.open && (
        <div className={style.backdropDiv} onClick={() => setMore((pre) => ({ open: false, view: '' }))}></div>
      )}

      {expandModal && (
        <ExpandModal
          name={name ? name : 'Bugs Reporter'}
          open={expandModal}
          setOpen={() => setExpandModal(false)}
          className={style.modal}
          bugsReporter={bugsReporter}
        />
      )}
      {filtersModal && (
        <FiltersModal
          projectId={projectId}
          devType={name === `Developer's Bugs` && true}
          open={filtersModal}
          setOpen={() => setFiltersModal(false)}
          {...{
            control,
            watch,
            setValue,
            reset: () => {
              reset({ ...initialFilter });
              setFiltersCount(0);
              setBugsReporter({});
              setBugsReporterFilters(() => ({ ...initialFilter }));
            },
          }}
          onFilterApply={onFilterApply}
        />
      )}
    </div>
  );
};

export default BugsReporter;

const chartOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  aspectRatio: 1.5,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 10, // NOTE: Set the width of the legend item (square)
        boxHeight: 10,
      },
    },
  },
  scales: {
    x: {
      stacked: true,

      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      stacked: true,
      ticks: {},
      grid: {
        display: false,

        drawBorder: false,
      },
    },
  },
};
