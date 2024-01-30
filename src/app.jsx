import { BrowserRouter } from 'react-router-dom';
import Router from './routes';

// NOTE:  third party
import { QueryClient, QueryClientProvider } from 'react-query';

import { ToastContainer } from 'react-toastify';
import { AuthContextProvider } from 'context/auth.context';
import 'react-toastify/dist/ReactToastify.css';
import { AppContextProvider } from 'context/app.context';
import { ModeProvider } from 'context/dark-mode';

import HighLevelHotKeys from 'components/high-level-hot-keys';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ErrorBoundary from 'components/error-boundry';

const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <AppContextProvider>
                <ModeProvider>
                  <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                  <HighLevelHotKeys>
                    <Router />
                  </HighLevelHotKeys>
                </ModeProvider>
              </AppContextProvider>
            </AuthContextProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
};

export default App;
