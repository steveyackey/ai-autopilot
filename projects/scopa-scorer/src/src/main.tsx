import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import App from './App'
import './i18n/config'
import './index.css'

// Register PWA service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Dynamic import of workbox-window for tree-shaking
      const { Workbox } = await import('workbox-window');
      
      const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`);
      
      // Add event listeners for various service worker events
      wb.addEventListener('installed', event => {
        if (!event.isUpdate) {
          // First-time install
          console.log('Scopa Scorer is now available offline!');
        }
      });
      
      wb.addEventListener('activated', event => {
        if (event.isUpdate) {
          // Show update notification or auto-reload
          if (confirm('New version available! Reload to update?')) {
            window.location.reload();
          }
        }
      });
      
      wb.addEventListener('waiting', () => {
        console.log('New version available, waiting for reload');
        // Could implement a custom update notification UI here
      });
      
      // Register the service worker
      wb.register();
      
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

// Register service worker in production
if (import.meta.env.PROD) {
  registerServiceWorker();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
