// Firebase Cloud Messaging Service Worker
// File: /public/firebase-messaging-sw.js
// TODO: Replace placeholder values with your actual Firebase config

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'RoastRoom';
  const options = {
    body: payload.notification?.body || 'You have a new challenge!',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'roastroom-notification',
    data: payload.data,
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // TODO: navigate to the room URL stored in event.notification.data.roomUrl
});
