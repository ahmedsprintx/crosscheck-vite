import React from 'react';

import Button from 'components/button';

import style from './boarding.module.scss';
import SelectBox from 'components/select-box';

const WorkspaceHearing = ({ selectedSource, control, setSelectedSource, active, setActive }) => {
  return (
    <>
      <div className={style.workspace}>
        <h3>How did you hear about us?</h3>
        <div className={style.innerFlex}>
          {data?.map((ele, index) => (
            <div
              className={`${style.tag} ${ele === selectedSource ? style.selectedPeople : ''}`}
              key={index}
              onClick={() => setSelectedSource(ele)}
              data-cy={`onboard-workspace-hear-about-us${index}`}
            >
              <p>{ele}</p>
            </div>
          ))}
        </div>
        <div className={style.small}>
          <SelectBox
            control={control}
            name={'source'}
            isSearchable={false}
            options={options}
            placeholder="Select"
            isClearable={false}
            dynamicClass={style.zIndexClass}
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
            data-cy=" onboard-workspace-hear-about-us-back-btn"
          />
        )}

        <Button
          text="Next"
          btnClass={style.nextBtn}
          type={'button'}
          handleClick={(e) => {
            setActive(active + 1);
          }}
          data-cy="onboard-workspace-hear-about-us-nxt-btn"
        />
      </div>
    </>
  );
};

export default WorkspaceHearing;

const data = [
  'Search Engine',
  'Linkedin',
  'Facebook / Instagram',
  'Youtube',
  'Billboard',
  'Friend / Colleague',
  'Other',
];

const options = [
  {
    label: 'Search Engine',
    value: 'Search Engine',
  },
  {
    label: 'Linkedin',
    value: 'Linkedin',
  },
  {
    label: 'Facebook / Instagram',
    value: 'Facebook / Instagram',
  },
  {
    label: 'Youtube',
    value: 'Youtube',
  },
  {
    label: 'Billboard',
    value: 'Billboard',
  },
  {
    label: 'Friend / Colleague',
    value: 'Friend / Colleague',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];
