import React, { useEffect, useRef, useState } from 'react';

import { getFirebaseToken, messageInitialization, onForegroundMessage } from 'config/firebase';
import { useUpdateFCMToken } from './api-hooks/settings/fcm.hook';
import { useToaster } from './use-toaster';

const useNotification = () => {
  const ref = useRef(false);
  const [token, setToken] = useState('');

  const { mutateAsync: _fcmTokenHandler } = useUpdateFCMToken();
  const { toastNotification } = useToaster();

  const tokenGeneration = async () => {
    getFirebaseToken()
      .then(async (firebaseToken) => {
        if (firebaseToken) {
          setToken(firebaseToken);
          await updateTokenOnBackend(firebaseToken); // NOTE: #TODO: send Token to Backend, use thisFunction updateTokenOnBackend()
          initializeMessaging();
        }
      })
      .catch((err) => console.error('An error occured while retrieving firebase token. ', err));
  };

  const getNewTokenHandler = async () => {
    try {
      if (Notification.permission === 'default' || Notification.permission === 'granted') {
        // NOTE: Ask for permission
        await tokenGeneration();
      }
      if (Notification.permission === 'denied') {
        console.warn('Notification Permission Denied ');
      }
    } catch (error) {
      console.error('Error getting permission or token:', error);
    }
  };

  // NOTE: Function to initialize messaging for receiving messages
  const initializeMessaging = async () => {
    // NOTE: Implement initialization logic using 'onMessage' function
    messageInitialization()
      .then((payload) => {
        // NOTE: messaging is initialized
      })
      .catch((err) => console.error('An error occured while retrieving foreground message. ', err));
  };

  // NOTE: Function to update the token on the backend
  const updateTokenOnBackend = async (newToken) => {
    // NOTE: Hit your API endpoint to update the token
    try {
      const res = await _fcmTokenHandler({ fcmToken: newToken });
    } catch (err) {
      throw new Error('An error occurred while sending token to backend');
    }
  };

  // NOTE: #Todo: instead of Show Browser notification We Can use custom Toaster for display notification

  useEffect(() => {
    if (!ref.current) {
      // NOTE: Call the function to handle permission and token retrieval on component mount
      getNewTokenHandler();
      ref.current = true;
    }
  }, []);

  // NOTE: #todo:  make some function to remove message listening and remove serverWorker and return them
};

export default useNotification;
