import MainWrapper from 'components/layout/main-wrapper';
import React from 'react';

import ArrowRight from 'components/icon-component/arrow-right';
import ArrowLeft from 'components/icon-component/arrow-left';
import Permissions from 'components/permissions';

import { formattedDate } from 'utils/date-handler';

import { useAppContext } from 'context/app.context';

import style from './shortcuts.module.scss';

const Shortcuts = () => {
  const { userDetails } = useAppContext();
  return (
    <div>
      {' '}
      <MainWrapper title="Shortcut" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        <div>
          <div className={style.mainClass}>
            <h6>
              Count (
              {shortcutsLeft.filter((x) => x.access.includes(userDetails.role)).length +
                shortcutsRight.filter((x) => x.access.includes(userDetails.role)).length}
              )
            </h6>
          </div>
          <div className={style.sectionWrapper}>
            <div className={style.leftSection}>
              {shortcutsLeft?.map((ele, index) => (
                <Permissions allowedRoles={ele.access} currentRole={userDetails?.role}>
                  <div className={style.shortcutWrapper}>
                    {ele?.second && (
                      <>
                        <div className={style.btn}>{ele.first}</div>
                        <span>+</span>
                      </>
                    )}
                    <div className={style.btn}>{ele.second}</div>
                    {ele.third && (
                      <>
                        <span>+</span>
                        <div className={style.btn}>{ele?.third}</div>
                      </>
                    )}
                    <span>{ele.text}</span>
                  </div>
                </Permissions>
              ))}
            </div>

            <div className={style.rightSection}>
              {shortcutsRight?.map((ele, index) => (
                <Permissions allowedRoles={ele.access} currentRole={userDetails?.role}>
                  <div className={style.shortcutWrapper}>
                    <div className={style.btn}>{ele.first}</div>
                    {ele?.second && (
                      <>
                        <span>+</span>
                        <div className={style.btn}>{ele.second}</div>
                      </>
                    )}
                    {ele.third && (
                      <>
                        <span>+</span>
                        <div className={style.btn}>{ele?.third}</div>
                      </>
                    )}
                    <span>{ele.text}</span>
                  </div>
                </Permissions>
              ))}
            </div>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
};

export default Shortcuts;

const shortcutsLeft = [
  {
    first: 'Alt',
    second: 'E',
    text: 'Retest Bug',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Alt',
    second: 'Q',
    text: 'Execute Search',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'D',
    text: 'Open Home/Dashboard',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'P',
    text: 'Open Projects',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'T',
    text: 'Open Test Cases',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'R',
    text: 'Open Test Runs',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Alt',
    second: 'B',
    text: 'Open Bugs Reporting',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'U',
    text: 'Open User Management',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'A',
    text: 'Open Activities',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'C',
    text: 'Table Column Change modal',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'N',
    text: 'Open Notifications',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: 'S',
    text: 'Open Shortcuts',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  { first: 'Alt', second: 'Z', text: 'Reopen a Bug', access: ['Admin', 'Project Manager', 'QA'] },
];
const shortcutsRight = [
  // NOTE:   { first: 'Alt', second: '', third: '', text: '' },
  {
    first: 'Shift',
    second: 'T',
    text: 'Start Testing',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'A',
    text: ' Add Test Case',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'E',
    text: ' Create Test Run',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'F',
    text: ' Start Functional Testing',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'R',
    text: 'Start Regression Testing',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'I',
    text: 'Start Integration Testing',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'U',
    text: 'Start User Acceptance Testing',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    first: 'Shift',
    second: 'Alt',
    third: 'D',
    text: 'Delete Selected Records',

    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Shift',
    second: 'Alt',
    third: 'S',
    text: 'Show All Projects',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Shift',
    second: 'Alt',
    third: 'A',
    text: 'Show Achieved Projects',
    access: ['Admin', 'Project Manager'],
  },
  {
    first: 'Alt',
    second: <ArrowRight />,
    text: 'Move to Next Bug/Test Case',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Alt',
    second: <ArrowLeft />,
    text: 'Move to Previous Bug/Test Case',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    first: 'Esc',
    text: 'Close Side drawer/Modal',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
];
