import React, { useMemo, useState } from 'react';
import FilterTag from 'components/capture-components/filter-tags';
import ConsoleText from 'components/capture-components/console';

const ConsolesTab = ({ consoles }) => {
  const [activeTag, setActiveTag] = useState(0);

  const tagsPages = useMemo(() => {
    return [
      {
        id: 0,
        text: 'Info',
        type: 'info',
        count: consoles?.logs?.length || 0,
        content: (
          <div style={{ height: '340px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {consoles?.logs?.length ? (
                consoles?.logs?.map((ele, index) => (
                  <ConsoleText
                    key={index}
                    type={ele.type}
                    data={{
                      time: 'hehe',
                      text: 'hehe',
                      desc: 'hehe',
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  NO DATA
                </div>
              )}
            </div>{' '}
          </div>
        ),
      },

      {
        id: 1,
        text: 'Warnings',
        type: 'warning',
        count: consoles?.warns?.length || 0,
        content: (
          <div style={{ height: '340px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {consoles?.warns?.length ? (
                consoles?.warns?.map((ele, index) => (
                  <ConsoleText
                    key={index}
                    type={ele.type}
                    data={{
                      time: formattedToSecond(ele.createdAt),
                      text: ele.data,
                      desc: ele.data,
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  NO DATA
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: 2,
        text: 'Errors',
        type: 'error',
        count: consoles?.errors?.length || 0,
        content: (
          <div style={{ height: '340px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {consoles?.errors?.length ? (
                consoles?.errors?.map((ele, index) => (
                  <ConsoleText
                    key={index}
                    type={ele.type}
                    data={{
                      time: formattedToSecond(ele.createdAt),
                      text: ele.data,
                      desc: ele.data,
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  NO DATA
                </div>
              )}
            </div>
          </div>
        ),
      },
    ];
  }, [consoles]);

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <FilterTag
          icons
          pages={tagsPages}
          activeTab={activeTag}
          setActiveTab={setActiveTag}
          multiMode={undefined}
        />
      </div>
    </div>
  );
};

export default ConsolesTab;
