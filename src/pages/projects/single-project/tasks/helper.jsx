import UserName from 'components/user-name';
import style from './tasks.module.scss';
import Highlighter from 'components/highlighter';

export const initialFilter = {
  applicationType: [],

  taskType: [],
  createdBy: [],
  crossCheckAssignee: [],
  page: 1,
  perPage: 25,
};

export const columnsData = ({ isHoveringName, searchedText, setIsHoveringName }) => [
  {
    name: 'Task ID',
    key: 'id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv} style={{ justifyContent: 'start' }}>
        <p
          className={style.userName}
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(row?.url, '_blank')}
        >
          <Highlighter search={searchedText}>{row?.id ? row?.id : '-'}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Custom Task ID',
    key: 'customId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p
          className={style.userName}
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(row?.url, '_blank')}
        >
          {' '}
          <Highlighter search={searchedText}>{row?.customId ? row?.customId : '-'}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Bugs/Test cases',
    key: 'bugIds',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div style={{ position: 'relative' }}>
        <div
          className={style.imgDivTooltip}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          }}
        >
          {row?.bugIds &&
            row?.bugIds.map((ele) => (
              <p>
                <Highlighter search={searchedText}>{ele?.bugId},</Highlighter>{' '}
              </p>
            ))}
          {row?.testCaseIds &&
            row?.testCaseIds.map((ele) => (
              <p>
                <Highlighter search={searchedText}>{ele?.testCaseId}, </Highlighter>{' '}
              </p>
            ))}
          {row?.bugIds?.length + row?.testCaseIds?.length > 8 && (
            <div className={style.tooltip}>
              {row?.bugIds &&
                row?.bugIds.map((ele) => (
                  <p>
                    <Highlighter search={searchedText}>{ele?.bugId}</Highlighter>,{' '}
                  </p>
                ))}
              {row?.testCaseIds &&
                row?.testCaseIds.map((ele) => (
                  <p>
                    <Highlighter search={searchedText}>{ele?.testCaseId}</Highlighter>,{' '}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
    ),
  },

  {
    name: 'Application',
    key: 'applicationType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '80px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row.applicationType}</Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Task Type',
    key: 'taskType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <Highlighter search={searchedText}>{row?.taskType}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Assignee',
    key: 'crossCheckAssignee',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '70px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.crossCheckAssignee?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };
      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              user={row?.crossCheckAssignee}
              isHovering={
                isHoveringName?.userId === row?.crossCheckAssignee?._id &&
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
    name: 'Created by',
    key: 'createdBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.createdBy?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          >
            <UserName
              user={row?.createdBy}
              isHovering={
                isHoveringName?.userId === row?.createdBy?._id && isHoveringName?.rowId === row?._id
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
