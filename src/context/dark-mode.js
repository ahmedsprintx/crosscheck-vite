import { useDarkMoodToggle } from 'hooks/api-hooks/settings/user-management.hook';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppContext } from './app.context';
import { useToaster } from 'hooks/use-toaster';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toastSuccess, toastError } = useToaster();

  const { userDetails, setUserDetails } = useAppContext();

  const { mutateAsync: _darkMoodToggle } = useDarkMoodToggle();

  const toggleMode = async () => {
    try {
      const res = await _darkMoodToggle(userDetails?.id);
      const userData = { ...userDetails, darkMode: res.darkMode };
      localStorage.setItem('user', JSON.stringify(userData));
      setUserDetails(userData);
    } catch (error) {
      toastError(error);
    }
  };

  // NOTE: useEffect(() => {
  // NOTE:   userDetails?.darkMode && setIsDarkMode(userDetails?.darkMode);
  // NOTE: }, [userDetails]);

  return (
    <ModeContext.Provider value={{ isDarkMode: userDetails.darkMode, toggleMode }}>{children}</ModeContext.Provider>
  );
};

export const useMode = () => {
  return useContext(ModeContext);
};
