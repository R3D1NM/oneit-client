// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

// try {
//     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//     //filter out in-app browsers
//     const isInAppBrowser = /FBAN|FBAV|Instagram|Daum|KAKAOTALK|NAVER/.test(
//         navigator.userAgent,
//     );
//     if (isIOS ||isInAppBrowser) { 
//         throw new Error('skip firebase messaging')
//     }

//     console.log('firebase messaging init');
    
//     const firebaseApp = firebase.initializeApp({
//         apiKey: 'AIzaSyDq7NJnUTjJYrpwWgYk0y1pKX_QaFqBZ6M',
//         projectId: 'oneit-gpt',
//         messagingSenderId: '937146027892',
//         appId: '1:937146027892:web:130b51a23773b896d22621',
//     })
//     const messaging = firebase.messaging(firebaseApp)
    
//     // Background message handler
//     messaging.onBackgroundMessage(function(payload) {
//         console.log('[firebase-messaging-sw.js] Received background message ', payload);
        
//         // Customize notification here
//         const notificationTitle = payload.notification?.title || 'ONE!T';
//         const notificationOptions = {
//         body: payload.notification?.body || 'ONE!T에서 새로운 메시지가 도착했습니다.',
//         icon: '/oneit.png',
//         data: payload.data
//     };
  
//     return self.registration.showNotification(notificationTitle, notificationOptions);
//   });
// } catch (error) {
//   console.log('error', error)
// }

// try {
//     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//     //filter out in-app browsers
//     const isInAppBrowser = /FBAN|FBAV|Instagram|Daum|KAKAOTALK|NAVER/.test(
//         navigator.userAgent,
//     );
//     if (isIOS ||isInAppBrowser) { 
//         throw new Error('skip firebase messaging')
//     }

//     // // Optional: Handle notification click event
//     self.addEventListener('notificationclick', function(event) {
//       console.log('[firebase-messaging-sw.js] Notification click Received.');
    
//       event.notification.close();
    
//       // This looks to see if the current is already open and focuses if it is
//       event.waitUntil(clients.matchAll({
//         type: "window"
//       }).then(function(clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url == '/' && 'focus' in client)
//             return client.focus();
//         }
//         if (clients.openWindow)
//           return clients.openWindow('/');
//       }));
//     });
// }catch (error) {
//     console.log('error', error)
// }


