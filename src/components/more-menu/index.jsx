import React from 'react';

import style from './more.module.scss';

const MoreMenu = ({ menu }) => {
  return (
    <>
      <div className={style.editor}>
        {menu?.map((ele, index) => (
          <div className={style.flexFlex} onClick={ele.click} key={index}>
            {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
            <p>{ele.title}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default MoreMenu;
