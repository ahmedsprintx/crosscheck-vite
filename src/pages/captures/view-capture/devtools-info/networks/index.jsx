import React, { useMemo, useState } from 'react';

import FilterTag from 'components/capture-components/filter-tags';

import style from '../style.module.scss';

const Networks = ({ network }) => {
  const [activeMultiTag, setActiveMultiTag] = useState(0);

  const multiTagsPages = useMemo(() => {
    return [
      {
        id: 0,
        text: 'All',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 1,
        text: 'Fetch/XHR',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 2,
        text: 'Doc',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 3,
        text: 'JS',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 4,
        text: 'CSS',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 5,
        text: 'Font',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 6,
        text: 'Img',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 7,
        text: 'WS',
        content: <div className={style.resizableTable}></div>,
      },
      {
        id: 8,
        text: 'Other',
        content: <div className={style.resizableTable}></div>,
      },
    ];
  }, [network]);

  return !network?.['All'].length ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {' '}
      NO DATA
    </div>
  ) : (
    <div>
      <div style={{ marginTop: '10px' }}>
        <FilterTag
          multiMode
          pages={multiTagsPages}
          activeTab={activeMultiTag}
          setActiveTab={setActiveMultiTag}
          icons={undefined}
        />
      </div>
    </div>
  );
};

export default Networks;

const columns = [
  { id: 'name', title: 'Name' },
  { id: 'status', title: 'Status' },
  { id: 'method', title: 'Method' },
  { id: 'type', title: 'Type' },
  { id: 'initiator', title: 'Initiator' },
  { id: 'size', title: 'Size' },
];
