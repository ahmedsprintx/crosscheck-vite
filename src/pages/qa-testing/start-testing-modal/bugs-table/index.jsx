import React, { useMemo } from 'react';

import style from './style.module.scss';
import GenericTable from 'components/generic-table';
import Highlighter from 'components/highlighter';
import UserName from 'components/user-name';
import { formattedDate } from 'utils/date-handler';
import Tags from 'components/tags';
import Loader from 'components/loader';

const BugsListing = ({ isLoading, bugs, bugsRef, page }) => {
  return isLoading && page < 2 ? (
    <Loader />
  ) : (
    <div className={style.tableWidth}>
      <GenericTable
        containerRef={bugsRef}
        columns={columnsData({})}
        dataSource={bugs.bugs || []}
        height={'64vh'}
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
      {isLoading && <Loader tableMode />}
    </div>
  );
};

export default BugsListing;

export const columnsData = ({ isHoveringName, searchedText }) => [
  {
    name: 'Bug #',
    key: 'bugId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
          style={{
            cursor: 'pointer',
          }}
        >
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.bugId}</Highlighter>
          </p>
        </div>
      );
    },
  },
  {
    name: 'Project',
    key: 'projectId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.projectId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Milestone',
    key: 'milestoneId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.milestoneId?.name}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Feature',
    key: 'featureId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.featureId?.name}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Testing Type',
    key: 'testingType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testingType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Issue Type',
    key: 'issueType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.issueType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Ticket ID',
    key: 'taskId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.taskId}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Developer Name',
    key: 'developerId.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName} style={{ cursor: 'pointer' }}>
            <UserName
              user={row?.developerId}
              isHovering={
                isHoveringName?.userId === row?.developerId?._id &&
                isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Bug Type',
    key: 'bugType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.bugType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Bug Sub Type',
    key: 'bugSubType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.bugSubType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Bug Feedback',
    key: 'feedback.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '190px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.feedback?.text}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Steps to Reproduce',
    key: 'reproduceSteps.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.reproduceSteps?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Ideal Behaviour',
    key: 'idealBehaviour.text',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '240px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.idealBehaviour?.text}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Tested Version',
    key: 'testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.testedVersion}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Test Evidence',
    key: 'testEvidence',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '230px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a
            href={row?.testEvidence}
            target="_blank"
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
          >
            <Highlighter search={searchedText}>{row?.testEvidenceKey}</Highlighter>
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Reported Date',
    key: 'reportedAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{formattedDate(row?.reportedAt, 'dd MMM ,yy')}</p>
      </div>
    ),
  },
  {
    name: 'Reported By',
    key: 'reportedBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName} style={{ cursor: 'pointer' }}>
            <UserName
              user={row?.reportedBy}
              isHovering={
                isHoveringName?.userId === row?.reportedBy?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Reported By'
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Severity',
    key: 'severity',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Tags
            droppable
            menu={[
              {
                title: 'Low',
              },
              {
                title: 'Medium',
              },
              {
                title: 'High',
              },

              {
                title: 'Critical',
              },
            ]}
            text={row?.severity}
            colorScheme={{
              Low: '#4F4F6E',
              High: '#F96E6E',
              Medium: '#B79C11',
              Critical: ' #F80101',
            }}
          />
        </p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'status',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}></p>
        <Tags
          text={row?.status}
          colorScheme={{
            Closed: '#34C369',
            Open: '#F96E6E',
            Blocked: '#F96E6E',
            Reproducible: '#B79C11',
            'Need To Discuss': '#11103D',
          }}
        />
      </div>
    ),
  },
  {
    name: 'Assigned to',
    key: 'taskHistory.0.assignedTo.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName} style={{ cursor: 'pointer' }}>
            <UserName
              user={row?.taskHistory?.[0]?.assignedTo}
              isHovering={
                isHoveringName?.userId === row?.taskHistory?.[0]?.assignedTo?._id &&
                isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Assigned Ticket ID',
    key: 'taskHistory.0.taskId.customId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a
            href={row?.taskHistory?.[0]?.taskId?.url}
            target="_blank"
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
          >
            <Highlighter search={searchedText}>
              {row?.taskHistory?.[0]?.taskId?.customId || row?.taskHistory?.[0]?.taskId?.id}
            </Highlighter>
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest Date',
    key: 'history.0.reTestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          {formattedDate(row?.history[_.findLastIndex(row?.history)]?.reTestDate, 'dd MMM, yy')}
        </p>
      </div>
    ),
  },
  {
    name: 'Last Retest by',
    key: 'history.0.reTestBy.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName} style={{ cursor: 'pointer' }}>
            <UserName
              user={row?.history[_.findLastIndex(row?.history)]?.reTestBy}
              isHovering={
                isHoveringName?.userId ===
                  row?.history[_.findLastIndex(row?.history)]?.reTestBy?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Last Retest by'
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
  {
    name: 'Closed Date',
    key: 'closed.date',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}> {formattedDate(row?.closed?.date, 'dd MMM, yy')}</p>
      </div>
    ),
  },
  {
    name: 'Closed Version',
    key: 'closed.version',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '170px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.closed?.version}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Closed By',
    key: 'closed.by.name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.userName} style={{ cursor: 'pointer' }}>
            <UserName
              user={row?.closed?.by}
              isHovering={
                isHoveringName?.userId === row?.closed?.by?._id &&
                isHoveringName?.rowId === row?._id &&
                isHoveringName?.columnName === 'Closed By'
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },
];
