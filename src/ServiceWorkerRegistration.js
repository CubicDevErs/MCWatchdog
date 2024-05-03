export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then(registration => {
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }