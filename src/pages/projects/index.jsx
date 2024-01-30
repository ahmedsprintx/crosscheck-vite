import React, { useEffect, useState } from 'react';

import Menu from 'components/menu';
import HeaderSection from './header';
import AllProjects from './all-projects';
import ArchivedProjects from './archived-projects';

import { useSearchParams } from 'react-router-dom';

import _ from 'lodash';

import search from 'assets/search.svg';

import menuIcon from 'assets/menu.svg';
import style from './projects.module.scss';
import MainWrapper from 'components/layout/main-wrapper';

import {
  useArchiveToggle,
  useCreateProject,
  useDeleteProject,
  useFavoritesToggle,
  useGetProjects,
  useUpdateProject,
} from 'hooks/api-hooks/projects/projects.hook';
import { useToaster } from 'hooks/use-toaster';
import TextField from 'components/text-field';
import { formattedDate } from 'utils/date-handler';
import { useAppContext } from 'context/app.context';
import Loader from 'components/loader';
import MenuIcon from 'components/icon-component/menu';
import TickIcon from 'components/icon-component/tick';
import MobileMenu from 'components/mobile-menu';

const Projects = () => {
  const { userDetails } = useAppContext();
  const [filter, setFilter] = useState({ search: '' });
  const { toastSuccess, toastError } = useToaster();
  const { data: _allProjects, refetch, isLoading: _isLoading } = useGetProjects(filter);
  const { mutateAsync: _favoriteToggleHandler, isLoading: _favLoadingProject } =
    useFavoritesToggle();
  const { mutateAsync: _archiveToggleHandler, isLoading: _archLoadingProject } = useArchiveToggle();
  const { mutateAsync: _createProjectHandler, isLoading: _addingProject } = useCreateProject();
  const { mutateAsync: _updateProjectHandler, isLoading: _updatingProject } = useUpdateProject();
  const { mutateAsync: _deleteProjectHandler, isLoading: _deletingProject } = useDeleteProject();

  const [active, setActive] = useState(0);
  const [searchParams] = useSearchParams();
  const activeItem = searchParams.get('active');

  useEffect(() => {
    setActive(+activeItem);
  }, [activeItem]);

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const allowedRoles = ['Admin', 'Project Manager'];
  const userRole = userDetails?.role;

  const canSeeButton = allowedRoles.includes(userRole);

  const menu = [
    {
      cypressAttr: 'project-allproject',
      title: 'All Projects',
      compo: active === 0 && (
        <div data-cy="project-menue-allproject1">
          <TickIcon />
        </div>
      ),
      click: () => {
        setActive(0);
        setOpen(false);
        setIsOpen(false);
      },
    },
    ...(canSeeButton
      ? [
          {
            cypressAttr: 'project-allarchived',
            title: 'Archived Projects',
            compo: active === 1 && (
              <div data-cy="project-menue-allproject2">
                <TickIcon />
              </div>
            ),
            click: () => {
              setActive(1);
              setOpen(false);
              setIsOpen(false);
            },
          },
        ]
      : []),
  ];

  const onFavoriteToggle = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await _favoriteToggleHandler(id);

      toastSuccess(res.msg);

      refetch();
    } catch (error) {
      toastError(error);
    }
  };
  const onArchiveToggle = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await _archiveToggleHandler(id);
      toastSuccess(res.msg);
      refetch();
    } catch (error) {
      toastError(error);
    }
  };

  const onAddProject = async (id, body, setError) => {
    try {
      const res = id
        ? await _updateProjectHandler({ id, body })
        : await _createProjectHandler({ body });
      toastSuccess(res.msg);
      refetch();
      return res;
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onDeleteProject = async (id, body) => {
    try {
      const res = await _deleteProjectHandler({ id, body });
      toastSuccess(res.msg);
      refetch();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <MainWrapper
      title="Projects"
      date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
      searchField
      onSearch={_.debounce((e) => setFilter((pre) => ({ ...pre, search: e.target.value })), 1000)}
      onClear={_.debounce((e) => {
        setFilter((pre) => ({ ...pre, search: '' }));
      }, 1000)}
    >
      {_isLoading ? (
        <Loader />
      ) : (
        <div>
          <HeaderSection favorites={_allProjects?.favProjects} favoriteToggle={onFavoriteToggle} />
          <div className={style.header}>
            <p>{active === 0 ? 'All Projects' : ' Archived Projects '}</p>
            <div
              onClick={() => {
                setOpen(true);
                setIsOpen(true);
              }}
            >
              <MenuIcon />
            </div>

            {open && (
              <div className={style.menuDiv}>
                <Menu menu={menu} active={active} />
              </div>
            )}
          </div>
          <div className={style.menuDivMobile}>
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
              {menu?.map((ele, index) => {
                return (
                  <div className={style.innerDiv} onClick={ele.click} key={index}>
                    {<p>{ele?.title}</p>}
                  </div>
                );
              })}
            </MobileMenu>
          </div>
          <div
            style={{
              height: 'calc(100vh - 240px)',
            }}
          >
            {active === 0 && (
              <AllProjects
                data-cy="project-menue-allproject"
                searchedText={filter?.search}
                projects={_allProjects?.allProjects}
                favoriteToggle={onFavoriteToggle}
                addProject={onAddProject}
                archiveToggle={onArchiveToggle}
                refetch={refetch}
                deleteProject={onDeleteProject}
                isLoading={_addingProject || _updatingProject || _deletingProject}
                loadingArchFav={_favLoadingProject || _archLoadingProject}
              />
            )}
            {active === 1 && (
              <ArchivedProjects
                archived={_allProjects?.archiveProjects}
                favoriteToggle={onFavoriteToggle}
                addProject={onAddProject}
                archiveToggle={onArchiveToggle}
                refetch={refetch}
                deleteProject={onDeleteProject}
                loadingArchFav={_favLoadingProject || _archLoadingProject}
                data-cy="project-menue-allproject"
              />
            )}
          </div>
          {open && <div className={style.backdropDiv} onClick={() => setOpen(false)}></div>}
        </div>
      )}
    </MainWrapper>
  );
};

export default Projects;
