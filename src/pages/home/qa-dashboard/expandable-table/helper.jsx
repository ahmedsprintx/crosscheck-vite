import style from './expandable.module.scss';

import Tags from 'components/tags';

export const columnsData = ({ type, navigate }) => {
  return [
    {
      name: 'Project', // NOTE: table head name
      key: 'projectId', // NOTE: table column unique key
      hidden: false,
      widthAndHeight: { width: '90px', height: '36px' },
      render: ({ value }) => {
        return (
          <div
            className={style.imgDiv}
            style={{
              justifyContent: 'flex-start',
            }}
          >
            <p className={style.name}>{value?.name}</p>
          </div>
        );
      },
    },
    {
      name: 'Bug ID',
      key: 'bugId',
      hidden: false,
      widthAndHeight: { width: '90px', height: '36px' },

      render: ({ value }) => (
        <div
          className={style.imgDiv}
          style={{
            justifyContent: 'flex-start',
          }}
        >
          <p
            className={style.name}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/qa-testing?bugId=${value}`)}
          >
            {value}
          </p>
        </div>
      ),
    },
    {
      name: 'Feedback',
      key: 'feedback',
      hidden: false,
      widthAndHeight: { width: '250px', height: '36px' },

      render: ({ value }) => (
        <div
          className={style.imgDiv}
          style={{
            justifyContent: 'flex-start',
          }}
        >
          <p className={style.name}>{value?.text}</p>
        </div>
      ),
    },
    {
      name: 'Latest Remarks',
      key: 'latestRemarks',
      hidden: false,
      widthAndHeight: { width: '250px', height: '36px' },

      render: ({ value }) => (
        <div
          className={style.imgDiv}
          style={{
            justifyContent: 'flex-start',
          }}
        >
          <p className={style.name}>{value ? value : '-'}</p>
        </div>
      ),
    },
    {
      name: 'Severity',
      key: 'severity',
      hidden: false,
      widthAndHeight: {
        width: '90px',
        height: '36px',
      },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>
            <Tags
              text={value}
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
      name: `${type} From`,
      key:
        type === 'Blocked'
          ? 'blockedFromDays'
          : type === 'Opened'
          ? 'openFromDays'
          : type === 'Reproducible'
          ? 'reproducibleFromDays'
          : 'needToDiscussFromDays',
      hidden: false,
      widthAndHeight: {
        width: type === 'Blocked' ? '90px' : type === 'Opened' ? '90px' : type === 'Reproducible' ? '120px' : '120px',
        height: '36px',
      },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>{value ? <div className={style.orangeDiv}>{value} days</div> : '-'}</p>
        </div>
      ),
    },
  ];
};
