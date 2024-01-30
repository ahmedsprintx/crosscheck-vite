import { changeWorkspace } from 'api/v1/settings/user-management';
import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';
import { onBackgroundMessage } from 'firebase/messaging/sw';
import { toastNotification } from 'hooks/use-toaster';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const serviceWorkerConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
    return window.navigator.serviceWorker.getRegistration('/firebase-push-notification-scope').then((serviceWorker) => {
      if (serviceWorker) return serviceWorker;
      return window.navigator.serviceWorker.register(
        `./firebase-messaging-sw.js?firebaseconfig=${serviceWorkerConfig}`,
        {
          scope: '/firebase-push-notification-scope',
        },
      );
    });
  }
  throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPIDKEY,
      serviceWorkerRegistration,
    }),
  );

export const messageInitialization = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => onForegroundMessage(payload));
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      if (type === 'notificationClicked') {
        // NOTE: console.log('i am called from background Message');
        // NOTE: Call your updateWorkspace function with the data from the notification
        updateWorkspace(data);
      }
    });
    resolve({ msg: 'Notification Initialized' });
  });

export const onForegroundMessage = (payload) => {
  const { data } = payload;
  const options = {
    hideProgressBar: false,
    icon: false,
    autoClose: 5000,
    newestOnTop: true,
    closeOnClick: false,
  };
  const NotificationOptions = {
    title: data.title || '',
    body: data.body || '',
    icon: data?.actorImage || '', // NOTE: Set the path to your custom icon
    onClick:
      payload?.data?.lastAccessedWorkspace &&
      payload?.data?.lastAccessedWorkspace !== JSON.parse(localStorage.getItem('user')).lastAccessedWorkspace
        ? () => updateWorkspace(data)
        : () => handleChangeWorkSpaceClick(data),
  };

  toastNotification({ options, ...NotificationOptions });
};

export const updateWorkspace = async (data) => {
  try {
    if (data?.lastAccessedWorkspace) {
      const userDetails = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));

      const _getAllWorkspaces = userDetails.workspaces;
      if (!_getAllWorkspaces || !_getAllWorkspaces.length) {
        return false;
      }
      const newWorkspace = _getAllWorkspaces?.find((x) => x.workSpaceId === data.lastAccessedWorkspace);

      const res = await changeWorkspace(data.lastAccessedWorkspace);
      // NOTE: toastSuccess(res?.msg);

      if (res?.msg === 'Workspace changed successfully') {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...userDetails,
            role: newWorkspace.role,
            lastAccessedWorkspace: data.lastAccessedWorkspace,
            activePlan: newWorkspace.plan,
          }),
        );
        handleChangeWorkSpaceClick(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleChangeWorkSpaceClick = (data) => {
  const url = data.redirectUrl;
  window.location.href = url;
};
