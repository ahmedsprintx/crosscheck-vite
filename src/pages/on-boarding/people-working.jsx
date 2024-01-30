import React from 'react';

import Button from 'components/button';
import SelectBox from 'components/select-box';

import style from './boarding.module.scss';

const WorkspaceWorking = ({ selectedPeople, setSelectedPeople, control, active, setActive }) => {
  return (
    <>
      <div className={style.workspace}>
        <h3>How many people will you be working with?</h3>
        <div className={style.innerFlex}>
          {data?.map((ele, index) => (
            <div
              className={`${style.tag} ${ele === selectedPeople ? style.selectedPeople : ''}`}
              key={index}
              onClick={() => setSelectedPeople(ele)}
              data-cy={`onboard-workspace-avatar-ranges${index}`}
            >
              <p>{ele}</p>
            </div>
          ))}
        </div>
        <div className={style.small}>
          <SelectBox
            control={control}
            name={'peopleWorking'}
            options={options}
            placeholder="Select"
            isClearable={false}
            isSearchable={false}
            dynamicClass={style.btnZindex}
          />
        </div>
      </div>
      <div className={style.btnFlex}>
        {active === 0 ? (
          <div></div>
        ) : (
          <Button
            type={'button'}
            text="Back"
            btnClass={style.btn}
            handleClick={() => setActive(active - 1)}
            data-cy="onboard-workspace-peopleworking-backbtn"
          />
        )}

        <Button
          text="Next"
          btnClass={style.nextBtn}
          type={'button'}
          handleClick={(e) => {
            setActive(active + 1);
          }}
          data-cy="onboard-workspace-peopleworking-nxtbtn"
        />
      </div>
    </>
  );
};

export default WorkspaceWorking;

const data = ['Just Me', '2-5', '6-10', '11-25', '26-50', '51-200', '500+', "I don't know"];

const options = [
  {
    label: 'Just Me',
    value: 'Just Me',
  },
  {
    label: '2-5',
    value: '2-5',
  },
  {
    label: '6-10',
    value: '6-10',
  },
  {
    label: '11-25',
    value: '11-25',
  },
  {
    label: '26-50',
    value: '26-50',
  },
  {
    label: '51-200',
    value: '51-200',
  },
  {
    label: '500+',
    value: '500+',
  },
  {
    label: `I don't know`,
    value: `I don't know`,
  },
];
