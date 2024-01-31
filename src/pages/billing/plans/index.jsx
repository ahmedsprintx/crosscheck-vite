import React, { useState , useEffect } from 'react';

import style from './style.module.scss';
import Button from 'components/button';
import ArrowRight from 'components/icon-component/arrow-right';
import ConfirmationModal from './buy-release-modal';
import { useToaster } from 'hooks/use-toaster';
import { useCancelSubscription, useUpdateSubscription } from 'hooks/api-hooks/payment/payment.hook';
import { useNavigate } from 'react-router-dom';
import { useGetUserById } from 'hooks/api-hooks/settings/user-management.hook';
import { useAppContext } from 'context/app.context';

const Index = ({ _billingInfo, refetch }) => {
  const { userDetails } = useAppContext();
  const { toastError, toastSuccess } = useToaster();
  const { setUserDetails } = useAppContext();
  const [isOpen, setIsOpen] = useState({ open: false, type: '', clickHandler: () => {} });
  const [subscription, setSubscription] = useState({
    planPeriod: 'Monthly',
  });

  const { mutateAsync: _updateSubscriptionHandler, isLoading } = useUpdateSubscription();
  const { mutateAsync: _cancelSubscriptionHandler, isLoading: _isCancelLoading } =
    useCancelSubscription();

  const {
    data: _userData,
    isLoading: _userLoading,
    refetch: _userRefetch,
  } = useGetUserById(userDetails?.id);

  const onSubmit = async (name, seatsOccupied, invitedUsers) => {
    try {
      const res = await _updateSubscriptionHandler({
        plan: name,
        seatsCount: +seatsOccupied + invitedUsers,
        planPeriod: subscription?.planPeriod,
      });
      setIsOpen({ open: false });

      if (res?.url) {
        window.location.href = res?.url;
      }

      if (res?.msg) {
        toastSuccess(res?.msg);
        setTimeout(async () => {
          await refetch();
        }, 2000);
      }
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    const data = userDetails;
    if (data) {
      data.activePlan = _billingInfo?.plan;
      localStorage.setItem('user', JSON.stringify(data));
      setUserDetails((pre) => ({ ...pre, activePlan: _billingInfo?.plan }));
    }
  }, [_billingInfo]);

  const onCancelSubscription = async () => {
    try {
      const res = await _cancelSubscriptionHandler();
      setIsOpen({ open: false });
      if (res?.msg) {
        toastSuccess(res?.msg);
        setTimeout(() => {
          refetch();
        }, 2000);
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div>
        <div className={style.planPeriod}>
          <div className={style.packages}>
            <p
              className={`${style.btn} ${
                subscription?.planPeriod === 'Monthly' ? style.btnColor : ''
              }`}
              onClick={() => {
                setSubscription((pre) => ({ ...pre, planPeriod: 'Monthly' }));
              }}
            >
              Monthly
            </p>
            <p
              className={`${style.btn} ${
                subscription?.planPeriod === 'Yearly' ? style.btnColor : ''
              }`}
              onClick={() => {
                setSubscription((pre) => ({ ...pre, planPeriod: 'Yearly' }));
              }}
            >
              Yearly
            </p>
          </div>
          {_billingInfo?.plan !== 'Free' && userDetails.superAdmin && (
            <div
              className={style.cancelBtn}
              onClick={() =>
                setIsOpen(() => ({
                  open: true,
                  type: 'cancel',
                  clickHandler: onCancelSubscription,
                }))
              }
            >
              Cancel Subscription
            </div>
          )}
        </div>
        <div className={style.planWrapper}>
          {plans.map((x) => {
            return (
              <div className={style.card} key={x.name}>
                <div
                  className={`${style.cardTitle} ${
                    x.name !== 'Basic' ? style.cardTitleColor2 : ''
                  } `}
                >
                  {x.name}
                </div>
                <span>{x?.subtitle}</span>
                <div className={style.pricing}>
                  <h2>
                    ${subscription?.planPeriod === 'Monthly' ? x?.price : x?.priceYearly || 0}
                  </h2>
                  <span>per seat per month</span>
                  <hr></hr>
                </div>

                <div className={style.features}>
                  <h5> Basic includes:</h5>
                  {x?.description.map((y, index) => {
                    return <p key={index + y}>{y}</p>;
                  })}
                </div>

                <div className={style.submit}>
                  {userDetails.superAdmin && (
                    <Button
                      text={
                        _billingInfo?.plan === x.name &&
                        _billingInfo?.planPeriod === subscription?.planPeriod
                          ? 'Active Plan'
                          : 'Get started'
                      }
                      btnClass={`${style.btn} ${
                        _billingInfo?.plan === x.name &&
                        _billingInfo?.planPeriod === subscription?.planPeriod
                          ? style.btnActive
                          : x.name !== 'Basic'
                          ? style.btn2
                          : style.btn1
                      }`}
                      className={style.title}
                      disabled={isLoading}
                      handleClick={() => {
                        if (
                          !(
                            _billingInfo?.plan === x.name &&
                            _billingInfo?.planPeriod === subscription?.planPeriod
                          )
                        ) {
                          setIsOpen(() => ({
                            open: true,
                            type: 'update',
                            clickHandler: () => {
                              onSubmit(
                                x.name,
                                _billingInfo?.seatsOccupied,
                                _billingInfo?.invitedUsers,
                              );
                            },
                          }));
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className={style.extra}>
          Compare Plans or View Details <ArrowRight />
        </p>
      </div>
      <ConfirmationModal
        isLoading={isLoading || _isCancelLoading}
        isOpen={isOpen?.open}
        setIsOpen={() => setIsOpen({ open: false })}
        type={isOpen?.type}
        onSubmitHandler={isOpen.clickHandler}
      />
    </>
  );
};

export default Index;

const plans = [
  {
    name: 'Basic',
    subtitle: 'Best for small size teams',
    price: 8,
    priceYearly: 6,
    description: [
      ` 50 Seats`,
      `+ 5 Free Developer Role Per Paid Seat`,
      `50 Projects`,
      `3,000 Bugs, Test Cases Per Project`,
      `1,000 Test Runs Per Project`,
      `Click-up Integration`,
      `Activity / Audit Log & Trash`,
      `QA Report & Feedback Widget`,
      `And More`,
    ],
  },
  {
    name: 'Premium',
    subtitle: 'Best for medium / large teams',
    price: 16,
    priceYearly: 12,
    description: [
      `Unlimited Seats`,
      `+ 5 Free Developer Role Per paid Member`,
      `Unlimited Projects Bugs, Test Cases, Test Runs`,
      `Click-up Integration`,
      `Activity / Audit Log & Trash`,
      `QA Report & Feedback Widget`,
      `Bugs Reporting Extension (Upcoming)`,
      `Priority Support`,
      `And More`,
    ],
  },
];
