import { publicRoute, routes } from './helper';
import { useMemo } from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { useAppContext } from 'context/app.context';
import { getToken } from 'utils/token';

const Router = () => {
  const { userDetails } = useAppContext();
  const token = getToken();
  const privateRoutes = useMemo(() => {
    return routes(userDetails?.role, userDetails?.activePlan);
  }, [userDetails]);

  return (
    <Routes>
      {/* NOTE: Public routes */}
      {!token && publicRoute?.map(({ path, element }, index) => <Route key={index} path={path} element={element} />)}

      {/* NOTE: Private routes */}
      {privateRoutes?.map(({ path, element }, index) => (
        <Route key={index} path={path} element={token ? element : <Navigate to="/login" />} />
      ))}
      {/* NOTE: all AccessAble routes */}
    </Routes>
  );
};

export default Router;
