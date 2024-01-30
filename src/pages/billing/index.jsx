import React from 'react';
import { formattedDate } from 'utils/date-handler';
import { useGetBillingDetails } from 'hooks/api-hooks/payment/payment.hook';

import MainWrapper from 'components/layout/main-wrapper';

import Plans from './plans';
import Details from './details';

import style from './style.module.scss';

const Index = () => {
  const { data: _billingInfo, refetch, isLoading: _isLoading } = useGetBillingDetails();
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <MainWrapper title="Billing" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        <div className={style.mainWrapper}>
          <Details
            isLoadingBillingInfo={_isLoading}
            _billingInfo={_billingInfo?.data}
            refetch={refetch}
          />
          <Plans _billingInfo={_billingInfo?.data} refetch={refetch} />
        </div>
      </MainWrapper>
    </div>
  );
};

export default Index;
