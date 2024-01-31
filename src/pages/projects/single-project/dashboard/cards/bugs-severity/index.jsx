import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

// NOTE: comonents
import Menu from 'components/menu';
// NOTE: import TestCasesStatus from './test-case-stats';
import Chart from 'components/chart';
// NOTE: hooks
// NOTE: utils
import { formattedDate } from 'utils/date-handler';
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

// NOTE: assets
import dots from 'assets/threeDots.svg';
import expandIcon from 'assets/expand.svg';

// NOTE: css
import style from './bugs-severity.module.scss';
import _ from 'lodash';
import ShareModal from './Modals/share-modal';
import ExpandModal from './Modals/expand-modal';
import { useAppContext } from 'context/app.context';
import FiltersModal from './Modals/filters-modal';
import ValueChart from 'components/value-chart';
import Loader from 'components/loader';
import Button from 'components/button';

const BugsSeverity = ({
  isLoading,
  data,
  projectId,
  expanded,
  handleClose,
  setBugsSeverity,
  modalMode,
  setSeverityFilters,
  initialFilter,
}) => {
  const componentRef = useRef();
  const { control, reset, watch, setValue } = useForm();
  const { userDetails } = useAppContext();
  const [more, setMore] = useState({ open: false, view: '' });
  const [shareModal, setShareModal] = useState(false);
  const [expandModal, setExpandModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }
    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setBugsSeverity({});
    setSeverityFilters((pre) => ({
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
      ...(watch('developers') && { developers: watch('developers') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('reportedBy') && { reportedBy: watch('reportedBy') || [] }),
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
          <h2>Bugs Severity</h2>
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
      {isLoading ? (
        <Loader className={style.loaderHeight} />
      ) : (
        <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', height: '100%' }}>
          {data?.count?.allBugs > 0 ? (
            <ValueChart data={data?.count} percentage={data?.percentage} />
          ) : (
            <span className={style.totalText}>No data found</span>
          )}
        </div>
      )}
      {more?.open && (
        <div className={style.backdropDiv} onClick={() => setMore((pre) => ({ open: false, view: '' }))}></div>
      )}

      {shareModal && <ShareModal open={shareModal} setOpen={() => setShareModal(false)} />}
      {expandModal && (
        <ExpandModal open={expandModal} setOpen={() => setExpandModal(false)} className={style.modal} data={data} />
      )}
      {filtersModal && (
        <FiltersModal
          projectId={projectId}
          open={filtersModal}
          setOpen={() => setFiltersModal(false)}
          {...{
            control,
            watch,
            setValue,
            reset: () => {
              reset({ ...initialFilter });
              setFiltersCount(0);
              setBugsSeverity({});
              setSeverityFilters(() => ({ ...initialFilter }));
            },
          }}
          onFilterApply={onFilterApply}
        />
      )}
    </div>
  );
};

export default BugsSeverity;
