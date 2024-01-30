import React from 'react';

import home from 'assets/homeBlue.svg';
import bag from 'assets/bagBlue.svg';
import testRunLogo from 'assets/testRunLogoBlue.svg';
import setting from 'assets/settingBlue.svg';
import test from 'assets/test-case-blue.svg';
import notification from 'assets/notification.svg';

import style from './navbar.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Navbar = ({ pathname }) => {
  const [open, setOpen] = useState(false);

  const routes = [
    {
      icon: home,
      path: '/dashboard',
      noPath: false,
    },
    {
      icon: bag,
      path: '/projects',
      noPath: false,
    },
    {
      icon: setting,
      noPath: false,
      path: '/qa-testing',
    },
    {
      icon: test,
      path: '/test-cases',
      noPath: false,
    },
    {
      icon: testRunLogo,
      noPath: false,
      path: '/test-run',
    },
    {
      icon: notification,
      noPath: false,
      path: '/activities',
    },
  ];
  return (
    <div className={style.navbar}>
      {' '}
      {routes?.map((ele, index) =>
        ele?.noPath ? (
          <div
            className={style.routes}
            key={index}
            style={{
              marginTop: '20px',
              backgroundColor:
                open ||
                pathname === '/account-setting' ||
                pathname === '/user-management' ||
                pathname === '/activities' ||
                pathname === '/trash' ||
                pathname === '/shortcuts'
                  ? 'var(--active)'
                  : '',
            }}
          >
            <img
              src={ele.icon}
              onClick={ele.click && ele.click}
              alt=""
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        ) : (
          <div
            className={style.routes}
            key={index}
            style={{
              backgroundColor:
                pathname.startsWith(ele.path) && !ele.noPath && !open
                  ? ' rgba(7, 25, 82, 0.1)'
                  : '',
            }}
          >
            <Link to={ele.path}>
              <img src={ele.icon} alt="" onClick={ele.click && ele.click} />
            </Link>
          </div>
        ),
      )}
    </div>
  );
};

export default Navbar;
