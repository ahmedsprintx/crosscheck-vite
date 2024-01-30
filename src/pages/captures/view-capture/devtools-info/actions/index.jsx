import React from 'react';

import ActionsText from 'components/capture-components/actions-text';
import NoData from 'components/icon-component/no-data';

const Index = ({ actions }) => {
  return (
    <div style={{ height: '340px', overflowY: 'auto' }}>
      {' '}
      {actions.length ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'flex-start',
          }}
        >
          {actions?.map((x, index) => (
            <ActionsText key={index} data={x} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <NoData />
        </div>
      )}
    </div>
  );
};

export default Index;
