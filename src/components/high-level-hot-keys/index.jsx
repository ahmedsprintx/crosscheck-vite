import React from 'react';

import { HotKeys } from 'react-hotkeys';

import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'context/app.context';

const HighLevelHotKeys = ({ children }) => {
  const navigate = useNavigate();

  const { userDetails } = useAppContext();

  const keyMap = {
    // NOTE: PageLevel
    OPEN_DASHBOARD: 'alt+d',
    OPEN_PROJECTS: 'alt+p',
    OPEN_TEST_CASES: 'alt+t',
    OPEN_TEST_RUNS: 'alt+r',
    OPEN_BUG_REPORTING: 'alt+b',
    OPEN_USER_MANAGEMENT: 'alt+u',
    OPEN_ACTIVITIES: 'alt+a',
    OPEN_SHORTCUTS: 'alt+s',
    OPEN_NOTIFICATIONS: 'alt+n',
    ADD_TEST_CASE: 'shift+a',
    START_TESTING: 'shift+t',

    // NOTE: Page Search Level
    SHOW_ACHIEVED_PROJECTS: 'alt+shift+a',
    SHOW_ALL_PROJECTS: 'alt+shift+s',
    START_FUNCTIONAL_TESTING: 'shift+f',
    START_REGRESSION_TESTING: 'shift+r',
    START_INTEGRATION_TESTING: 'shift+i',
    START_USER_ACCEPTANCE_TESTING: 'shift+u',
    ADD_TEST_RUN: 'shift+e',

    // NOTE: Component Level
    ESC: 'esc',
    EXECUTE_SEARCH: 'alt+q',
    DELETE_SELECTED_RECORDS: 'ctrl+alt+d',
    MOVE_TO_NEXT: 'alt+right',
    MOVE_TO_PREVIOUS: 'alt+left',
    TABLE_COLUMN_CHANGE: 'alt+c',
    RETEST_BUG: 'alt+e',
    REOPEN_BUG: 'alt+z',
  };

  const handlers = {
    OPEN_DASHBOARD: (e) => {
      e.preventDefault();
      navigate('/dashboard');
    },
    OPEN_PROJECTS: (e) => {
      e.preventDefault();
      navigate('/projects');
    },
    OPEN_TEST_CASES: (e) => {
      e.preventDefault();
      navigate('/test-cases');
    },
    OPEN_TEST_RUNS: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/test-run');
      }
    },
    OPEN_BUG_REPORTING: (e) => {
      e.preventDefault();
      navigate('/qa-testing');
    },
    OPEN_USER_MANAGEMENT: (e) => {
      e.preventDefault();
      navigate('/user-management');
    },
    OPEN_ACTIVITIES: (e) => {
      e.preventDefault();
      navigate('/activities');
    },
    OPEN_SHORTCUTS: (e) => {
      e.preventDefault();
      navigate('/shortcuts');
    },
    OPEN_NOTIFICATIONS: (e) => {
      e.preventDefault();
      navigate('/notifications');
    },
    SHOW_ACHIEVED_PROJECTS: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager'])) {
        navigate('/projects?active=1');
      }
    },
    SHOW_ALL_PROJECTS: (e) => {
      e.preventDefault();
      navigate('/projects?active=0');
    },
    ADD_TEST_CASE: (e) => {
      e.preventDefault();
      navigate('/test-cases/add');
    },
    START_TESTING: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/bug-testing');
      }
    },
    START_FUNCTIONAL_TESTING: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/bug-testing?type=functionalTesting');
      }
    },
    START_REGRESSION_TESTING: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/bug-testing?type=regressionTesting');
      }
    },
    START_INTEGRATION_TESTING: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/bug-testing?type=integrationTesting');
      }
    },
    START_USER_ACCEPTANCE_TESTING: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/bug-testing?type=userAcceptanceTesting');
      }
    },
    ADD_TEST_RUN: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        navigate('/test-run?add=true');
      }
    },
    ESC: () => {
      const modal = document.getElementById('generalModal');
      const splitPane = document.getElementById('splitpane');
      modal?.click();
      splitPane?.click();
    },
    EXECUTE_SEARCH: () => {
      const searchField = document.getElementById('searchField');
      searchField?.focus();
    },
    DELETE_SELECTED_RECORDS: () => {
      const deleteButton = document.getElementById('deleteButton');
      deleteButton?.click();
    },
    MOVE_TO_NEXT: (e) => {
      e.preventDefault();
      const nextButton = document.getElementById('nextButton');
      nextButton?.click();
    },
    MOVE_TO_PREVIOUS: (e) => {
      e.preventDefault();
      const prevButton = document.getElementById('prevButton');
      prevButton?.click();
    },
    TABLE_COLUMN_CHANGE: (e) => {
      e.preventDefault();
      const columnChange = document.getElementById('columnChange');
      columnChange?.click();
    },
    RETEST_BUG: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        const retestButton = document.getElementById('retestButton');
        retestButton?.click();
      }
    },
    REOPEN_BUG: (e) => {
      e.preventDefault();
      if (permissions(['Admin', 'Project Manager', 'QA'])) {
        const reopenButton = document.getElementById('reopenButton');
        reopenButton?.click();
      }
    },
  };

  const permissions = (acceptedRoles) => {
    if (acceptedRoles.includes(userDetails.role)) {
      return true;
    } else {
      console.error('not allowed');
      return false;
    }
  };

  return (
    <>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        {children}
      </HotKeys>
    </>
  );
};

export default HighLevelHotKeys;
