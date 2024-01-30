import React, { useState } from 'react';

import style from './style.module.scss';
import Button from 'components/button';
import BuyReleaseModal from './buy-release-modal';
import GenericTable from 'components/generic-table';
import { columnsData } from './helper';
import Info from 'components/icon-component/info';
import Loader from 'components/loader';
import { useAppContext } from 'context/app.context';

const Index = ({ _billingInfo, refetch, isLoadingBillingInfo }) => {
  const { userDetails } = useAppContext();

  const [isOpen, setIsOpen] = useState({ open: false });

  const handleDownloadClick = (fileUrl) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.target = '_blank';
    downloadLink.click();
  };

  return (
    <>
      <div className={style.mainWrapper}>
        {_billingInfo?.plan !== 'Free' ? (
          <div className={style.btnSeats}>
            {userDetails.superAdmin && (
              <>
                <Button
                  text={'Buy Seats'}
                  btnClass={style.btn1}
                  className={style.btnText}
                  handleClick={() => {
                    setIsOpen((pre) => ({ open: true, type: 'buy' }));
                  }}
                />
                <Button
                  text={'Release Seats'}
                  handleClick={() => {
                    setIsOpen((pre) => ({ open: true, type: 'release' }));
                  }}
                />
              </>
            )}
          </div>
        ) : (
          <></>
        )}
        {isLoadingBillingInfo ? (
          <Loader />
        ) : (
          <>
            <div className={style.mainDetails}>
              <div className={style.perDetails}>
                <span className={style.title}>Billing Cycle</span>
                <span className={style.subtitle}>{_billingInfo?.planPeriod}</span>
              </div>
              <div className={style.perDetails}>
                <span className={style.title}>Next Billing Date</span>
                <span className={style.subtitle}>
                  {_billingInfo?.invoiceData?.upcomingInvoice?.date}
                </span>
              </div>
              <div className={style.perDetails}>
                <span className={style.title}>Users</span>
                <span className={style.subtitle}>{`${
                  _billingInfo?.seatsOccupied + _billingInfo?.invitedUsers || ''
                }/${_billingInfo?.seatsAvailable || ''}`}</span>
              </div>
              <div className={style.perDetails}>
                <span className={style.title}>Upcoming Invoice Amount</span>
                <span
                  className={style.subtitle}
                  style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                  onClick={() => {
                    handleDownloadClick(_billingInfo?.invoiceData?.portalUrl);
                  }}
                >
                  {`$${_billingInfo?.invoiceData?.upcomingInvoice?.amount || 0.0}`}
                  <Info />
                </span>
              </div>
            </div>
            <div className={style.tableDetails}>
              <GenericTable
                columns={columnsData({})}
                dataSource={_billingInfo?.invoiceData?.invoiceHistory || []}
                height={'calc(100vh - 330px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
              />
            </div>
          </>
        )}
      </div>

      <BuyReleaseModal
        isOpen={isOpen?.open}
        setIsOpen={() => {
          setIsOpen({ open: false });
        }}
        type={isOpen?.type}
        refetch={refetch}
      />
    </>
  );
};

export default Index;
