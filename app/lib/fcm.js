// TODO: Firebase Cloud Messaging scaffold
// Full FCM requires:
// 1. VAPID key from Firebase Console → Cloud Messaging → Web Push certificates
// 2. Service worker registration (firebase-messaging-sw.js in /public)
// 3. User permission prompt for notifications

// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import app from './firebase';

/**
 * TODO: Initialize FCM and request notification permission
 *
 * export const initializeFCM = async () => {
 *   const messaging = getMessaging(app);
 *   const permission = await Notification.requestPermission();
 *   if (permission === 'granted') {
 *     const token = await getToken(messaging, {
 *       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
 *     });
 *     // Send token to backend for push targeting
 *     return token;
 *   }
 *   return null;
 * };
 */

/**
 * TODO: Handle foreground messages
 *
 * export const onForegroundMessage = (callback) => {
 *   const messaging = getMessaging(app);
 *   return onMessage(messaging, (payload) => {
 *     callback(payload);
 *   });
 * };
 */

export const FCM_STATUS = 'scaffold';
