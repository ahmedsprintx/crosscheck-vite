import style from './file.module.scss';
import { formattedDate } from 'utils/date-handler';
import { handleDownload } from 'utils/downlaod-file-handler';
import DelIcon from 'components/icon-component/del-icon';
import EditIcon from 'components/icon-component/edit-icon';
import DownloadIcon from 'components/icon-component/download';
import Highlighter from 'components/highlighter';

export const columnsData = ({ setOpenRenameModal, setOpenDelModal, searchedText }) => [
  {
    name: 'Title',
    key: 'title',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '380px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div
          className={style.imgDiv}
          style={{
            justifyContent: 'flex-start',
          }}
        >
          <p className={style.userName}>
            <Highlighter search={searchedText}>{row?.name ? row?.name : '-'}</Highlighter>
          </p>
        </div>
      );
    },
  },

  {
    name: 'File Type',
    key: 'fileType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ textTransform: 'uppercase' }}>
          <Highlighter search={searchedText}>{row?.type ? row?.type : '-'}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'File Size',
    key: 'fileSize',
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
          <Highlighter search={searchedText}>{row?.size ? `${row.size || 0} MB` : '-'}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'Uploaded by',
    key: 'uploadedBy',
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
          <Highlighter search={searchedText}>
            {row?.uploadedBy?.name || row?.uploadedBy?.email
              ? `${row?.uploadedBy?.name || ''} ${row?.uploadedBy?.email || ''}} `
              : '-'}
          </Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Uploaded Date',
    key: 'uploadedDate',
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
          <Highlighter search={searchedText}>
            {row?.uploadDate ? formattedDate(row?.uploadDate, 'dd MMM, yyyy') : '-'}
          </Highlighter>
        </p>
      </div>
    ),
  },

  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <div className={style.imgDiv1}>
          <div className={style.img} onClick={() => setOpenRenameModal(row)}>
            <EditIcon />
            <div className={style.tooltip}>
              <p>Rename</p>
            </div>
          </div>
          <div
            className={style.img}
            onClick={() => {
              handleDownload(row?.location, row?.name);
            }}
          >
            <DownloadIcon />
            <div className={style.tooltip}>
              <p>Download</p>
            </div>
          </div>
          <div className={style.img} onClick={() => setOpenDelModal(row)}>
            <div className={style.imgDel}>
              <DelIcon />
            </div>
            <div className={style.tooltip}>
              <p>Delete</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export const rows = [
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
];
