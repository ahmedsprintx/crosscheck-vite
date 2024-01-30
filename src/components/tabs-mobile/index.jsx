import React, { useState } from 'react';
import style from './tabs.module.scss';
import MobileMenu from 'components/mobile-menu';

import arrow from 'assets/arrow-up.svg';
import Menu from 'components/menu';

const TabsMobile = ({ pages, activeTab, setActiveTab, drawerMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {pages?.slice(0, drawerMode ? 3 : 4).map((page, index) => (
          <p
            className={`${style.tabTitle} ${activeTab === index && !isOpen ? style.active : ''}`}
            key={index}
            onClick={() => handleTabClick(index)}
          >
            {page.tabTitle}
          </p>
        ))}

        {pages?.length > (drawerMode ? 3 : 4) && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img
              onClick={() => {
                window.innerWidth >= 768 ? setIsOpen2(!isOpen2) : setIsOpen(!isOpen);
              }}
              src={arrow}
              style={{ rotate: '180Deg', marginLeft: '5px', cursor: 'pointer' }}
            />
            {drawerMode && (
              <div className={style.menuDiv}>
                {isOpen2 && (
                  <div className={style.mainDiv}>
                    {pages?.slice(drawerMode ? 3 : 4).map((ele, index) => {
                      return (
                        <div className={`${style.innerDiv} `}>
                          <p
                            key={index + (drawerMode ? 3 : 4)}
                            onClick={() => {
                              handleTabClick(index + (drawerMode ? 3 : 4));
                              setIsOpen2(false);
                            }}
                          >
                            {ele?.tabTitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className={style.menuDivMobile}>
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} extraPadding>
            {pages?.slice(drawerMode ? 3 : 4).map((page, index) => (
              <p
                className={style.tabTitleMenu}
                key={index + (drawerMode ? 3 : 4)} // NOTE: Adding 4 to avoid key conflicts with the first 4 tabs
                onClick={() => {
                  handleTabClick(index + (drawerMode ? 3 : 4));
                  setIsOpen(false);
                }}
              >
                {page.tabTitle}
              </p>
            ))}
          </MobileMenu>
        </div>
      </div>
      {isOpen2 && <div className={style.backdropDiv} onClick={() => setIsOpen2(false)} />}
      <div className="tab-content">{pages[activeTab].content}</div>
    </div>
  );
};

export default TabsMobile;
