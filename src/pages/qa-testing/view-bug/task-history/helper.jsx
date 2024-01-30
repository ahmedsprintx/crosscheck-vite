import Tags from 'components/tags';

import { formattedDate } from 'utils/date-handler';

import style from './history.module.scss';
import UserName from 'components/user-name';

export const columnsData = ({ isHoveringName, setIsHoveringName }) => [
  {
    name: 'Task ID',
    key: 'taskId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          <a
            href={row?.taskId?.url}
            target="_blank"
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
          >
            {row?.taskId?.customId || row?.taskId?.id}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Assigned To',
    key: 'assignedTo',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;
      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.assignedTo?._id,
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
              user={row?.assignedTo}
              isHovering={
                isHoveringName?.userId === row?.assignedTo?._id &&
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
    name: 'Created At',
    key: 'createdAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {formattedDate(row?.createdAt, 'dd MMM, yy')}
        </p>
      </div>
    ),
  },
  {
    name: 'Created By',
    key: 'createdBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '125px', height: '36px' },
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

export const rows = [
  {
    testDate: '29 May 23',
    testedBy: 'John Doe',
    testStatus: <Tags color={'#34C369'} text={'Pass'} />,
    relatedBy: 'BUG-1119',
  },
  {
    testDate: '29 May 23',
    testedBy: 'John Doe',
    testStatus: <Tags color={'#34C369'} text={'Pass'} />,
    relatedBy: 'BUG-1119',
  },
  {
    testDate: '29 May 23',
    testedBy: 'John Doe',
    testStatus: <Tags color={'#F96E6E'} text={'Fail'} />,
    relatedBy: 'BUG-1119',
  },
];
