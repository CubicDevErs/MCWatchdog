importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAJ4VkcMLT01_Qc6VmszGLRu8Bnqi6yaBU",
    authDomain: "serverstatustracker.firebaseapp.com",
    projectId: "serverstatustracker",
    storageBucket: "serverstatustracker.appspot.com",
    messagingSenderId: "606031045534",
    appId: "1:606031045534:web:df17f4e17e43b4b5106c8f",
    measurementId: "G-VN8BSCPJEQ"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
  
  self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');
  
    event.notification.close();
  

    event.waitUntil(
      clients.openWindow('https://mcwatchdog.com')
    );
  });
  
  self.addEventListener('notificationclose', (event) => {
    console.log('[firebase-messaging-sw.js] Notification closed.');
  });