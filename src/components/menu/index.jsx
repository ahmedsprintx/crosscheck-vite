import React from 'react';

import style from './menu.module.scss';

const Menu = ({ menu, active }) => {
  return (
    <div className={style.mainDiv}>
      {menu?.map((ele, index) => {
        if (!ele) {
          return;
        }
        return (
          <div className={`${style.innerDiv} `} onClick={ele?.click} key={`${ele?.title}-${index}`}>
            {ele?.img ||
              (ele?.compo && (
                <div style={{ width: '15px' }}>
                  {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
                </div>
              ))}
            {<p data-cy={ele?.cypressAttr}>{ele?.title}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
