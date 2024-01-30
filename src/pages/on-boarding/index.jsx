import React from 'react';

import style from './boarding.module.scss';
import WorkspaceName from './workspace-name';
import { useState } from 'react';
import WorkspaceAvatar from './workspace-avatar';
import WorkspaceWorking from './people-working';
import WorkspaceHearing from './hear-about';
import WorkspacePlan from './workspace-plan';
import WorkspaceReady from './workspace-ready';
import { useForm } from 'react-hook-form';
import { useOnboarding } from 'hooks/api-hooks/auth.hook';
import { useParams } from 'react-router-dom';
import { useToaster } from 'hooks/use-toaster';
import { useAppContext } from 'context/app.context';
import crosscheckLogo from 'assets/cross-check-logo.svg';

const OnBoarding = () => {
  const { email } = useParams();
  const [active, setActive] = useState(0);
  const [color, setColor] = useState('#333333');
  const [selectedPeople, setSelectedPeople] = useState('Just Me');
  const [selectedSource, setSelectedSource] = useState('Search Engine');
  const { toastSuccess, toastError } = useToaster();
  const { setError, register, setValue, watch, handleSubmit, control } = useForm();
  const { setUserDetails } = useAppContext();
  const [planPeriod, setPlanPeriod] = useState('Monthly');
  const [activePlan, setActivePlan] = useState('Free');

  const { mutateAsync: _onBoardingHandler, isLoading: isSubmitting } = useOnboarding();

  const onSubmit = async (data) => {
    if (active !== 4) {
      return;
    }
    try {
      const formData = {
        ...data,
        email: email,
        workSpaceName: data?.name,
        orgSize: watch('peopleWorking') || selectedPeople,
        source: watch('source') || selectedSource,
        plan: activePlan,
        planPeriod: planPeriod,
        ...(activePlan === 'Free'
          ? { seatsCount: 1 }
          : { seatsCount: data.seatsCount ? +data.seatsCount : 1 }),
      };

      const res = await _onBoardingHandler({
        ...formData,
      });

      localStorage.setItem('user', JSON.stringify(res.data?.data));
      setUserDetails(res?.data?.data);
      toastSuccess(res?.data?.msg, { autoClose: 500 });
      if (res?.data?.stripeCheckoutUrl) {
        window.location.href = res?.data?.stripeCheckoutUrl;
      } else {
        setActive(5);
      }
    } catch (error) {
      toastError(error, setError);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={style.main}>
        <div className={style.left}>
          <p>
            "Quality in a service or product is not what you put into it. It is what the customer
            gets out of it."
          </p>
        </div>
        <div className={style.right}>
          <div className={style.frame}>
            <div className={style.textWrapper}>
              <img src={crosscheckLogo} alt="" />
            </div>
            {active === 5 ? (
              ''
            ) : (
              <div className={style.div}>
                <div className={style.div2}>
                  {[...Array(5)].map((_, index) => {
                    const tabClassName = index === active ? style.activeTab : style.inactiveTab;

                    return (
                      <div
                        className={`${style.rectangle} ${tabClassName}`}
                        style={{
                          background:
                            index === active
                              ? 'linear-gradient(85deg, #E25E3E 0%, #E24872 49.24%, #A44E86 98.49%)'
                              : index < active
                              ? 'linear-gradient(85deg, #E25E3E 0%, #E24872 49.24%, #A44E86 98.49%)'
                              : index === active + 1
                              ? '#c5c5c5'
                              : '#e8eae9',
                        }}
                        key={index}
                      />
                    );
                  })}
                </div>
                <div className={style.text2}>{active + 1} of 5</div>
              </div>
            )}
          </div>
          {active === 0 && (
            <WorkspaceName register={register} active={active} setActive={setActive} />
          )}
          {active === 1 && (
            <WorkspaceAvatar
              watch={watch}
              setValue={setValue}
              color={color}
              setColor={setColor}
              active={active}
              setActive={setActive}
            />
          )}
          {active === 2 && (
            <WorkspaceWorking
              selectedPeople={selectedPeople}
              setSelectedPeople={setSelectedPeople}
              active={active}
              setActive={setActive}
              control={control}
            />
          )}
          {active === 3 && (
            <WorkspaceHearing
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              active={active}
              setActive={setActive}
              control={control}
            />
          )}
          {active === 4 && (
            <WorkspacePlan
              planPeriod={planPeriod}
              setPlanPeriod={setPlanPeriod}
              activePlan={activePlan}
              setActivePlan={setActivePlan}
              active={active}
              control={control}
              setActive={setActive}
              isLoading={isSubmitting}
              watch={watch}
              register={register}
            />
          )}
          {active === 5 && <WorkspaceReady />}
        </div>
      </div>
    </form>
  );
};

export default OnBoarding;
