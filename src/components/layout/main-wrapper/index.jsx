import React, { useState } from 'react';
import TextField from 'components/text-field';

import search from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';
import arrow from 'assets/arrow-separate-vertical.svg';
import style from '../layout.module.scss';
import layoutStyle from './style.module.scss';

import _ from 'lodash';
import { useGetProjectsForMainWrapper } from 'hooks/api-hooks/projects/projects.hook';
import { useNavigate } from 'react-router-dom';
import { useMode } from 'context/dark-mode';
import HamburgerIcon from 'components/icon-component/hamburgen';
import MobileMenu from 'components/mobile-menu';

const MainWrapper = ({
  title,
  date = new Date(),
  children,
  searchField,
  stylesBack,
  onSearch,
  barIcon = false,
  activeTab = 0,
  noHeader = false,
  onClear,
}) => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const { data: _allProjects } = useGetProjectsForMainWrapper(
    barIcon ? { search: '' } : {},
    barIcon,
  );

  const navigate = useNavigate();

  const { isDarkMode } = useMode();
  return (
    <main className={style.mainWrapper} style={{ position: 'relative' }}>
      {title && (
        <>
          <div
            className={`${style.navbarDiv} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            style={{ marginBottom: noHeader && '0px' }}
          >
            {!noHeader && (
              <div
                style={{
                  position: 'relative',
                }}
              >
                <h6>
                  {barIcon && (
                    <div
                      alt=""
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      <HamburgerIcon />
                    </div>
                  )}
                  {title}
                </h6>
                <p>{date}</p>

                {open && (
                  <div className={style.allProjects}>
                    {_allProjects?.allProjects.map((x) => {
                      return (
                        <div
                          className={style.innerFlex}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setOpen(false);
                            navigate(`/projects/${x._id}?active=${activeTab}`);
                          }}
                          key={x._id}
                        >
                          <span>
                            {_.chain(_.words(x.name))
                              .take(2)
                              .map((word) => word.charAt(0))
                              .join('')
                              .value()}
                          </span>
                          <p>{x.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {open && <div className={style.backdrop} onClick={() => setOpen(false)}></div>}
              </div>
            )}
            <div className={style.searchDiv}>
              {searchField && (
                <TextField
                  wraperClass={noHeader && layoutStyle.input}
                  searchField={searchField}
                  icon={search}
                  clearIcon={clearIcon}
                  placeholder="Search..."
                  onClear={onClear}
                  onChange={onSearch}
                />
              )}
            </div>
          </div>
          <div
            className={`${style.navbarDivMobile} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            style={{ marginBottom: noHeader && '0px', padding: noHeader && '0px 20px 0px 0px' }}
          >
            {!isSearch ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '5px',
                }}
              >
                {!noHeader && (
                  <>
                    <div
                      style={{
                        position: 'relative',
                      }}
                    >
                      <h6>
                        {title}
                        {barIcon && (
                          <div
                            alt=""
                            onClick={() => {
                              setIsOpen(true);
                              setOpen(true);
                            }}
                          >
                            <img src={arrow} />
                          </div>
                        )}
                      </h6>
                      {open && (
                        <div className={style.allProjects}>
                          {_allProjects?.allProjects.map((x) => {
                            return (
                              <div
                                className={style.innerFlex}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  navigate(`/projects/${x._id}?active=${activeTab}`);
                                }}
                              >
                                <span>
                                  {_.chain(_.words(x.name))
                                    .take(2)
                                    .map((word) => word.charAt(0))
                                    .join('')
                                    .value()}
                                </span>
                                <p>{x.name}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {open && (
                        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                          <div className={style.allProjectsMobile}>
                            {_allProjects?.allProjects.map((x) => {
                              return (
                                <div
                                  className={style.innerFlex}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    navigate(`/projects/${x._id}?active=${activeTab}`);
                                  }}
                                >
                                  <span>
                                    {_.chain(_.words(x.name))
                                      .take(2)
                                      .map((word) => word.charAt(0))
                                      .join('')
                                      .value()}
                                  </span>
                                  <p>{x.name}</p>
                                </div>
                              );
                            })}
                          </div>
                        </MobileMenu>
                      )}

                      {open && (
                        <div className={style.backdrop} onClick={() => setOpen(false)}></div>
                      )}
                    </div>
                    {searchField && <img src={search} onClick={() => setIsSearch(true)} />}
                  </>
                )}
              </div>
            ) : (
              <div className={style.mobileSearchDiv}>
                {searchField && (
                  <TextField
                    wraperClass={noHeader && layoutStyle.input}
                    searchField={searchField}
                    icon={search}
                    clearIcon={clearIcon}
                    placeholder="Search..."
                    onClear={onClear}
                    onChange={onSearch}
                  />
                )}

                {searchField && (
                  <span className={style.doneText} onClick={() => setIsSearch(false)}>
                    Done
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
      <div className={style.childDiv} style={stylesBack}>
        {children}
      </div>
    </main>
  );
};

export default MainWrapper;
