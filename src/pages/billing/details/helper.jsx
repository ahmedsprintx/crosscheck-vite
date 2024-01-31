import { formattedDate } from 'utils/date-handler';

import InvoiceIcon from 'components/icon-component/invoice';
import style from './style.module.scss';

const handleDownloadClick = (fileUrl) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = 'file.ext'; // NOTE: You can specify the file name here
  downloadLink.click();
};

export const columnsData = () => [
  {
    name: 'Transaction ID',
    key: 'transaction_id',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.invoiceNumber}</p>
        </div>
      </>
    ),
  },
  {
    name: 'Description',
    key: 'description',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <div className={style.imgDiv}>
          <p className={style.userName}>{row?.description}</p>
        </div>
      </>
    ),
  },
  {
    name: 'Transaction Date',
    key: 'transaction-date',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <div className={style.imgDiv}>
          <p className={style.userName}>{formattedDate(row?.date, 'dd MMM, yyyy')}</p>
        </div>
      </>
    ),
  },
  {
    name: 'Amount',
    key: 'amount',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <div className={style.imgDiv}>
          <p className={style.userName}>{`$${row?.amount}`}</p>
        </div>
      </>
    ),
  },
  {
    name: 'Invoice',
    key: 'invoice',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <>
        <div className={style.imgDiv1}>
          <div
            className={style.img}
            onClick={() => {
              handleDownloadClick(row.invoiceLink);
            }}
          >
            <div className={style.invoiceIcon}>
              <InvoiceIcon />
            </div>
            <div className={style.tooltip}>
              <p>Invoice</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];
