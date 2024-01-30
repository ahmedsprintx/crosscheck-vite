import React from 'react';
import style from './retest.module.scss';
import Tags from 'components/tags';
import { formattedDate } from 'utils/date-handler';

export const columnsData = [
  {
    name: 'Retest Date',
    key: 'retestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={style.imgDiv} style={{ justifyContent: 'flex-start' }}>
          <p className={style.userName}>{formattedDate(row?.reTestDate, 'dd MMM, yy')}</p>
        </div>
      );
    },
  },
  {
    name: 'Retest Version',
    key: 'retestVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reTestVersion}</p>
      </div>
    ),
  },
  {
    name: 'Retest By',
    key: 'retestBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reTestBy?.name}</p>
      </div>
    ),
  },
  {
    name: 'Retest Status',
    key: 'retestStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <Tags
          text={row?.reTestStatus}
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
    name: 'Retest Evidence',
    key: 'retestEvidence',
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
          <a
            href={row?.reTestEvidence}
            target="_blank"
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
            rel="noreferrer"
          >
            {row.reTestEvidenceKey}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Retest Remarks',
    key: 'retestRemarks',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.remarks || 'None'}</p>
      </div>
    ),
  },
];

export const rows = [
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
];
