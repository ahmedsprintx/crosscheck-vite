import React, { useState } from 'react';
import style from './tabs.module.scss';

const Tabs = ({ pages, activeTab, setActiveTab }) => {
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {pages?.map((page, index) => (
          <p
            className={`${style.tabTitle} ${activeTab === index ? style.active : ''}`}
            key={index}
            onClick={() => handleTabClick(index)}
          >
            {page.tabTitle}
          </p>
        ))}
      </div>
      <div className="tab-content">{pages[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
