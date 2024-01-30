import React, { useState } from 'react';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

// NOTE: comonents
import Menu from 'components/menu';
import DateRange from 'components/date-range';
import Chart from 'components/chart';
// NOTE: hooks
import { useBugsReported } from 'hooks/api-hooks/projects/dashboard.hook';
// NOTE: utils
import { formattedDate } from 'utils/date-handler';

// NOTE: assets
import dots from 'assets/threeDots.svg';
import expandIcon from 'assets/expand.svg';

// NOTE: css
import style from './testcase.module.scss';
import _ from 'lodash';
import ShareModal from './Modals/share-modal';
import ExpandModal from './Modals/expand-modal';
import { useAppContext } from 'context/app.context';
import Loader from 'components/loader';

const TestCaseSummary = ({ downloadHandler, componentRef, expanded, handleClose, modalMode }) => {
  const { id } = useParams();
  const { control } = useForm();
  const { userDetails } = useAppContext();
  const [more, setMore] = useState({ open: false, view: '' });
  const [shareModal, setShareModal] = useState(false);
  const [expandModal, setExpandModal] = useState(false);
  const today = new Date();

  const [type, setType] = useState({
    open: false,
    view: 'This Week',
    values: {
      start: startOfWeek(today),
      end: endOfWeek(today),
    },
  });

  const menu = [
    {
      title: 'This Week',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'This Week',
          values: {
            start: startOfWeek(today),
            end: endOfWeek(today),
          },
        }));
      },
    },
    {
      title: 'Last Week',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'Last Week',
          values: {
            start: startOfWeek(subWeeks(today, 1)),
            end: endOfWeek(subWeeks(today, 1)),
          },
        }));
      },
    },
    {
      title: 'This Month',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'This Month',
          values: {
            start: startOfMonth(today),
            end: endOfMonth(today),
          },
        }));
      },
    },
    {
      title: 'Last Month',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'Last Month',
          values: {
            start: startOfMonth(subMonths(today, 1)),
            end: endOfMonth(subMonths(today, 1)),
          },
        }));
      },
    },
    {
      title: 'Range',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'Range',
        }));
      },
    },
  ];
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

    userDetails?.activePlan !== 'Free' &&
      !modalMode && {
        title: 'Shareable Link',
        click: () => {
          setShareModal(true);
          setMore((pre) => ({
            ...pre,
            open: false,
            view: 'Shareable Link',
          }));
        },
      },
    ,
  ];

  const { data: _bugsReportedData, isLoading: _isLoading } = useBugsReported({
    id,
    filters: {
      startDate: formattedDate(type?.values?.start, 'yyyy-MM-dd'),
      endDate: formattedDate(type?.values?.end, 'yyyy-MM-dd'),
    },
  });

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
          <h2>Bugs Reported</h2>
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
            {type?.view === 'Range' && (
              <DateRange
                className={style.dateRange}
                handleChange={(e) => {
                  const [start, end] = e;
                  setType((pre) => ({
                    ...pre,
                    values: {
                      start,
                      end,
                    },
                  }));
                }}
                startDate={type?.view === 'Range' && type?.values?.start}
                endDate={type?.view === 'Range' && type?.values?.end}
                placeholder={'Select'}
                name={'Range'}
                control={control}
              />
            )}

            {!modalMode && (
              <div className={style.day} onClick={() => setType((pre) => ({ ...pre, open: true }))}>
                {type?.view}
              </div>
            )}

            {type?.open && (
              <div className={style.menuDiv}>
                <Menu menu={menu} active={style.active} />
              </div>
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
            <img src={dots} onClick={() => setMore((pre) => ({ ...pre, open: true }))} />

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
        {_isLoading ? (
          <Loader className={style.loaderHeight} />
        ) : (
          <Chart
            className={style.chart}
            chartOptions={chartOptions}
            chartData={{
              labels: _bugsReportedData?.bugsReportedData?.map((x) => x.date),
              datasets: [
                {
                  label: 'Open',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Open),
                  fill: false,
                  borderColor: '#F96E6E',
                  tension: 0.4,
                  backgroundColor: '#F96E6E',
                },
                {
                  label: 'Closed',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Closed),
                  fill: false,
                  borderColor: '#34C369',
                  tension: 0.4,
                  backgroundColor: '#34C369',
                },
                {
                  label: 'Reproducible',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Reproducible),
                  fill: false,
                  borderColor: '#B79C11',
                  tension: 0.4,
                  backgroundColor: '#B79C11',
                },
                {
                  label: 'Need To Discuss',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x['Need To Discuss']),
                  fill: false,
                  borderColor: '#11103D',
                  tension: 0.4,
                  backgroundColor: '#11103D',
                },
                {
                  label: 'Blocked',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Blocked),
                  fill: false,
                  borderColor: ' #F80101',
                  tension: 0.4,
                  backgroundColor: '#F80101',
                },
              ],
            }}
          />
        )}
      </div>
      {type?.open && (
        <div className={style.backdropDiv} onClick={() => setType((pre) => ({ ...pre, open: false }))}></div>
      )}
      {more?.open && (
        <div className={style.backdropDiv} onClick={() => setMore((pre) => ({ open: false, view: '' }))}></div>
      )}

      {shareModal && <ShareModal open={shareModal} setOpen={() => setShareModal(false)} />}
      {expandModal && <ExpandModal open={expandModal} setOpen={() => setExpandModal(false)} className={style.modal} />}
    </div>
  );
};

export default TestCaseSummary;

const chartOptions = {
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
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      grid: {
        display: false,

        drawBorder: false,
      },
    },
  },
};
