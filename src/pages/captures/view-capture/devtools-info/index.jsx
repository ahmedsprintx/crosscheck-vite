import React, { useMemo, useState } from 'react';
import Tabs from 'components/tabs';
import ButtonCustom from 'components/capture-components/button-custom';

import style from './style.module.scss';
import Consoles from './consoles';
import Actions from './actions';
import Networks from './networks';
import ShareIcon from 'components/icon-component/share-icon';

const DevtoolsInfo = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [actions, setActions] = useState([]);
  const [consoles, setConsoles] = useState({});
  const [network, setNetwork] = useState({
    All: [],
    'Fetch/Xrh': [],
    JS: [],
    Css: [],
    Doc: [],
    Font: [],
    Img: [],
    WS: [],
    Other: [],
  });
  const [loading, setLoading] = useState(false);

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        tabTitle: 'Console',
        content: <Consoles consoles={consoles} />,
      },
      {
        id: 1,
        tabTitle: 'Network',
        content: <Networks network={network} />,
      },
      {
        id: 2,
        tabTitle: 'Actions',
        content: <Actions actions={actions} />,
      },
    ];
  }, [actions, network, consoles]);

  return (
    <div className={style.modalChild}>
      <div className={style.tabsDiv}>
        <Tabs
          searchMode={type !== 'captureScreenShot'}
          pages={pages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className={style.btnDiv}>
        {activeTab === 2 && <ShareIcon />}
        <ButtonCustom text={'Report bug to Cross Check App  '} btnClass={style.strokeBtn} />
        {activeTab !== 2 && <ButtonCustom text={'Create'} />}
      </div>
    </div>
  );
};

export default DevtoolsInfo;
