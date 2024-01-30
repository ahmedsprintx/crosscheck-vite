import React, { useRef } from 'react';

import Slider from 'react-slick';

import style from './boarding.module.scss';
import Button from 'components/button';
import TextField from 'components/text-field';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const WorkspacePlan = ({
  active,
  setActive,
  isLoading,
  planPeriod,
  setPlanPeriod,
  activePlan,
  setActivePlan,
  watch,
  register,
}) => {
  const handleButtonClick = (plan) => {
    setActivePlan(plan);
  };

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '10px',
    slidesToShow: 1,
    speed: 500,
    autoPlay: true,
    dots: true,
  };

  const sliderRef = useRef(null);

  return (
    <>
      <div className={style.workspace}>
        <div className={style.mainMain}>
          <h1>Choose a Plan</h1>
          <div className={style.tabDiv}>
            <div
              className={style.innerTab}
              style={{
                background:
                  planPeriod === 'Monthly'
                    ? 'linear-gradient(85deg, #E25E3E 0%, #E24872 49.24%, #A44E86 98.49%)'
                    : '',
              }}
              onClick={() => setPlanPeriod('Monthly')}
            >
              <p className={planPeriod === 'Monthly' ? style.classBack : ''}>Monthly</p>
            </div>
            <div
              className={style.innerTab}
              style={{
                background:
                  planPeriod === 'Yearly'
                    ? 'linear-gradient(85deg, #E25E3E 0%, #E24872 49.24%, #A44E86 98.49%)'
                    : '',
              }}
              onClick={() => setPlanPeriod('Yearly')}
            >
              <p className={planPeriod === 'Yearly' ? style.classBack : ''}>Yearly</p>
            </div>
          </div>
        </div>
        <div className={style.planCard}>
          {planCards?.map((ele, index) => (
            <div className={style.mainCard} key={index}>
              <h6
                style={{
                  color: ele.color,
                }}
              >
                {ele.heading}
              </h6>
              <p className={style.p}>{ele.subtitle}</p>
              <h1>{planPeriod === 'Monthly' ? ele?.price : ele?.priceYearly}</h1>
              <p className={style.p}>per seat per month</p>
              <div className={style.div}>
                <div className={style.text}>{ele.heading} includes:</div>

                {ele.description.map((x) => {
                  return (
                    <>
                      <div className={style.text2}>{x}</div>
                    </>
                  );
                })}
              </div>

              <Button
                handleClick={() => handleButtonClick(ele?.heading)}
                type={'button'}
                text={ele.btnText}
                btnClass={activePlan === ele?.heading ? ele.activeButton : ele.cardBtn}
                data-cy={`onboard-plans-btn${index}`}
              />
            </div>
          ))}
        </div>

        <div className={style.planCard1}>
          <Slider {...settings} ref={sliderRef}>
            {planCards?.map((ele, index) => (
              <div className={style.mainCard} key={index}>
                <h6
                  style={{
                    color: ele.color,
                  }}
                >
                  {ele.heading}
                </h6>
                <p className={style.p}>{ele.subtitle}</p>
                <h1>{planPeriod === 'Monthly' ? ele?.price : ele?.priceYearly}</h1>
                <p className={style.p}>per seat per month</p>
                <div className={style.div}>
                  <div className={style.text}>{ele.heading} includes:</div>

                  {ele.description.map((x) => {
                    return (
                      <>
                        <div className={style.text2}>{x}</div>
                      </>
                    );
                  })}
                </div>

                <Button
                  handleClick={() => handleButtonClick(ele?.heading)}
                  type={'button'}
                  text={ele.btnText}
                  btnClass={activePlan === ele?.heading ? ele.activeButton : ele.cardBtn}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div
        className={style.seats}
        style={{
          justifyContent: 'center',
        }}
      >
        {activePlan !== 'Free' && (
          <div className={style.seatsCount1}>
            <span> No. of Seats</span>
            <TextField
              type={'number'}
              name={'seatsCount'}
              className={style.input}
              defaultValue={2}
              register={register}
              min={0}
            />
          </div>
        )}
      </div>
      <div
        className={style.btnFlex}
        style={{
          marginBottom: '50px',
        }}
      >
        {active === 0 ? (
          <div></div>
        ) : (
          <Button
            type={'button'}
            text="Back"
            btnClass={style.btn}
            handleClick={() => setActive(active - 1)}
          />
        )}
        <div className={style.seats}>
          {activePlan !== 'Free' && (
            <div className={style.seatsCount}>
              <span> No. of Seats</span>
              <TextField
                type={'number'}
                name={'seatsCount'}
                className={style.input}
                defaultValue={2}
                register={register}
                min={0}
                data-cy="onboard-plan-no-of-seats"
              />
            </div>
          )}
          <Button
            text="submit"
            btnClass={style.nextBtn}
            type={'submit'}
            disabled={isLoading}
            data-cy="onboard-plan-submit-btn"
          />
        </div>
      </div>
    </>
  );
};

export default WorkspacePlan;

const planCards = [
  {
    heading: 'Free',
    color: '#34C369',
    subtitle: 'Best for Personal Use',

    price: '$0',
    priceYearly: '$0',
    btnText: 'Get started for free',
    cardBtn: style.btn1,
    activeButton: style.activeButton1,
    description: [
      ` 5 Seats`,
      `+ 25 Free Developer Role Seats`,
      `2 Projects`,
      `500 Bugs, Test Cases per project`,
      `20 Test Runs Per Project`,
      `Projects Dashboard`,
      `Upload Files`,
      `Mobile App`,
      `24/7 Support`,
    ],
  },
  {
    heading: 'Basic',
    color: '#FD71AF',
    subtitle: 'Best for small size teams',

    price: '$8',
    priceYearly: '$6',
    btnText: 'Get started',
    cardBtn: style.btn2,
    activeButton: style.activeButton2,
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
    heading: 'Premium',
    color: '#49CCF9',
    price: '$16',
    priceYearly: '$12',
    subtitle: 'Best for medium / large teams',

    btnText: 'Get started',
    cardBtn: style.btn3,
    activeButton: style.activeButton3,
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
