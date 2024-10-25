import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {DevTools} from 'jotai-devtools';
import 'jotai-devtools/styles.css';
import {CookiesProvider} from 'react-cookie';
import '@/assets/css/style.css';
import ErrorBoundary from './ErrorBoundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <CookiesProvider>
                <DevTools />
                <App />
            </CookiesProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
