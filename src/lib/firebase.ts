// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getDatabase} from 'firebase/database';
import {getMessaging, getToken, Messaging, onMessage} from 'firebase/messaging';
import {sendErrorToSlack, sendInfoToSlack} from './slack';
import {toast} from 'sonner';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//Check if the user agent is using IOS
let messaging: Messaging;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//filter out in-app browsers
const isInAppBrowser = /FBAN|FBAV|Instagram|Daum|KAKAOTALK|NAVER/.test(
    navigator.userAgent,
);
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (!isIOS && !isInAppBrowser) {
    messaging = getMessaging(app);
    try {
        if (messaging) {
            onMessage(messaging, (payload) => {
                console.log(payload.notification?.title);
                console.log(payload.notification?.body);
                toast(payload.notification?.title, {
                    description: payload.notification?.body,
                    duration: 5000,
                    position: 'top-center',
                });
            });
        }
    } catch (error) {
        sendErrorToSlack({
            message: `[FCM] foreground message error: ${error}`,
            errorPoint: 'FCM',
        });
    }
}

export const firebaseMessagingConfig = async (): Promise<string> => {
    if (isIOS || isInAppBrowser) {
        return Promise.resolve('ios');
    }
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications.');
        return Promise.reject('This browser does not support notifications.');
    }

    // Check if the browser supports Firebase messaging
    if (!messaging) {
        console.log('Firebase messaging is not supported in this browser.');
        return Promise.reject(
            'Firebase messaging is not supported in this browser.',
        );
    }

    try {
        let permission = Notification.permission;

        // Only request permission if it's not already granted or denied
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            });
            // console.log(token);
            return Promise.resolve(token);
        } else {
            console.log('Notification permission not granted.');
            return Promise.reject('Notification permission not granted.');
        }
    } catch (err) {
        console.error('An error occurred while setting up notifications:', err);
        return Promise.reject(
            'An error occurred while setting up notifications.',
        );
    }
};
const analytics = getAnalytics(app);

export const db = getDatabase(app);
