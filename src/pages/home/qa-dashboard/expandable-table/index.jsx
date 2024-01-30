import React, { useEffect, useMemo, useRef, useState } from 'react';
import noFound from 'assets/no-found.svg';
import expandIcon from 'assets/expand.svg';
import ExpandModal from './expand-modal';
import { columnsData } from './helper';

import style from './expandable.module.scss';
import Tabs from 'components/tabs';
import GenericTable from 'components/generic-table';
import Loader from 'components/loader';
import { useNavigate } from 'react-router-dom';

const ExpandableTable = ({
  title,
  expanded,
  maxHeight,
  data,
  containerRef,
  activeTab,
  setActiveTab,
  setQaAnalyticsPage,
  _isLoading,
}) => {
  const navigate = useNavigate();

  const [expandModal, setExpandModal] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const pages = [
    {
      id: 'blocked',
      tabTitle: `Blocked (${data?.blocked?.totalCount || 0})`,
      content:
        activeTabIndex === 0 ? (
          <>
            <div className={style.tableWidth} style={{ position: 'relative' }}>
              <GenericTable
                id={'blocked'}
                containerRef={containerRef}
                columns={columnsData({ type: 'Blocked', navigate })}
                dataSource={data?.blocked?.bugs || []}
                height={'calc(100vh - 655px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                isEditMode={true}
              />
              {_isLoading && <Loader tableMode />}
            </div>
          </>
        ) : (
          <></>
        ),
    },
    {
      id: 'needToDiscuss',
      tabTitle: `Need to Discuss (${data?.needToDiscuss?.totalCount || 0})`,
      content:
        activeTabIndex === 1 ? (
          <>
            <div className={style.tableWidth} style={{ position: 'relative' }}>
              <GenericTable
                containerRef={containerRef}
                id={'needToDiscuss'}
                columns={columnsData({ type: 'Need to discuss', navigate })}
                dataSource={data?.needToDiscuss?.bugs || []}
                height={'calc(100vh - 655px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                isEditMode={true}
              />
            </div>
            {_isLoading && <Loader tableMode />}
          </>
        ) : (
          <></>
        ),
    },
    {
      id: 'reproducible',
      tabTitle: `Reproducible (${data?.reproducible?.totalCount || 0})`,
      content:
        activeTabIndex === 2 ? (
          <>
            <div className={style.tableWidth} style={{ position: 'relative' }}>
              <GenericTable
                containerRef={containerRef}
                id={'reproducible'}
                columns={columnsData({ type: 'Reproducible', navigate })}
                dataSource={data?.reproducible?.bugs || []}
                height={'calc(100vh - 655px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                isEditMode={true}
              />
            </div>
            {_isLoading && <Loader tableMode />}
          </>
        ) : (
          <></>
        ),
    },
    {
      id: 'open',
      tabTitle: `Opened (${data?.open?.totalCount || 0})`,
      content:
        activeTabIndex === 3 ? (
          <>
            <div className={style.tableWidth} style={{ position: 'relative' }}>
              <GenericTable
                containerRef={containerRef}
                id={'open'}
                columns={columnsData({ type: 'Opened', navigate })}
                dataSource={data?.open?.bugs || []}
                height={'calc(100vh - 655px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                isEditMode={true}
              />
            </div>
            {_isLoading && <Loader tableMode />}
          </>
        ) : (
          <></>
        ),
    },
  ];
  useEffect(() => {
    setActiveTab(pages[activeTabIndex].id);
    setQaAnalyticsPage(1);
  }, [activeTabIndex]);

  return (
    <div className={style.upcomingDiv} style={{ maxHeight: maxHeight && maxHeight }}>
      <div className={style.upcomingHeader}>
        <span>{title}</span>
        {!expanded && <img src={expandIcon} onClick={() => setExpandModal(true)} />}
      </div>
      <div className={style.tabDiv}>
        <Tabs
          pages={pages?.filter((x) => x.tabTitle)}
          activeTab={activeTabIndex}
          setActiveTab={setActiveTabIndex}
        />
      </div>

      {expandModal && (
        <ExpandModal
          data={data}
          open={expandModal}
          setOpen={() => setExpandModal(false)}
          className={style.modal}
          title={title}
          {...{
            containerRef,
            activeTab,
            setActiveTab,
            setQaAnalyticsPage,
            _isLoading,
          }}
        />
      )}
    </div>
  );
};

export default ExpandableTable;
