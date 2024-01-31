import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// NOTE: comonents
import Menu from 'components/menu';
import TestCasesStatus from './test-case-stats';

// NOTE: hooks
import {
  useProfileTestCasesSummaryMilleStoneWise,
  useTestCasesSummaryMilleStoneWise,
} from 'hooks/api-hooks/projects/dashboard.hook';
// NOTE: assets
import dots from 'assets/threeDots.svg';
import arrowLeft from 'assets/arrowLeftKey.svg';
import expandIcon from 'assets/expand.svg';

// NOTE: css
import style from './testcase.module.scss';

const TestCaseSummary = () => {
  const { id } = useParams();
  const [more, setMore] = useState({ open: false, view: 'table' });

  const [type, setType] = useState({ open: false, view: 'Percentage' });
  const [feature, setFeature] = useState('');
  const [selectedMilestone, setselectedMilestone] = useState('');

  const menu = [
    {
      title: 'Percentage',
      click: () => {
        setType((pre) => ({ ...pre, view: 'Percentage', open: false }));
      },
    },
    {
      title: 'Weightage',
      click: () => {
        setType('Weightage');
        setType((pre) => ({ ...pre, view: 'Weightage', open: false }));
      },
    },
    {
      title: 'Count',
      click: () => {
        setType('Count');
        setType((pre) => ({ ...pre, view: 'Count', open: false }));
      },
    },
  ];
  const menu2 = [
    {
      title: 'Chart View',
      click: () => {
        setMore((pre) => ({ ...pre, view: 'chart', open: false }));
      },
    },
    {
      title: 'Table View',
      click: () => {
        setMore((pre) => ({ ...pre, view: 'table', open: false }));
      },
    },
  ];

  const { data: _mileStoneWiseData, isLoading } = useTestCasesSummaryMilleStoneWise(id);
  const { data: _featureWiseData, isLoading: _isFeatureLoading } = useProfileTestCasesSummaryMilleStoneWise(feature);

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            position: 'relative',
          }}
        >
          <h2>
            {feature ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img
                  src={arrowLeft}
                  alt=""
                  onClick={() => {
                    setFeature('');
                    setselectedMilestone('');
                  }}
                />{' '}
                <p> {selectedMilestone} Test Cases Summary </p>
              </div>
            ) : (
              'Test Cases Summary'
            )}
          </h2>
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
            <div className={style.day} onClick={() => setType((pre) => ({ ...pre, open: true }))}>
              {type?.view}
            </div>

            {type?.open && (
              <div className={style.menuDiv}>
                <Menu menu={menu} active={style.active} />
              </div>
            )}
          </div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <img alt="" src={expandIcon} onClick={() => setMore((pre) => ({ ...pre, open: true }))} />
            <img alt="" src={dots} onClick={() => setMore((pre) => ({ ...pre, open: true }))} />

            {more?.open && (
              <div className={style.menuDiv}>
                <Menu menu={menu2} active={style.active} />
              </div>
            )}
          </div>
        </div>
      </div>
      {feature ? (
        <TestCasesStatus
          view={more?.view}
          type={type?.view}
          data={_featureWiseData?.featureTestCasesCount || []}
          totalData={_featureWiseData?.totalCombined || {}}
          isLoading={_isFeatureLoading}
          feature={feature}
        />
      ) : (
        <TestCasesStatus
          view={more?.view}
          type={type?.view}
          data={_mileStoneWiseData?.milestoneTestCasesCount || []}
          totalData={_mileStoneWiseData?.totalCombined || {}}
          isLoading={isLoading}
          setFeature={setFeature}
          setselectedMilestone={setselectedMilestone}
          feature={feature}
        />
      )}

      {type?.open && (
        <div className={style.backdropDiv} onClick={() => setType((pre) => ({ ...pre, open: false }))}></div>
      )}
      {more?.open && (
        <div className={style.backdropDiv} onClick={() => setMore((pre) => ({ ...pre, open: false }))}></div>
      )}
    </div>
  );
};

export default TestCaseSummary;
