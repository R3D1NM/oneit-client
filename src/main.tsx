import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {DevTools} from 'jotai-devtools';
import 'jotai-devtools/styles.css';
import {CookiesProvider} from 'react-cookie';
import '@/assets/css/style.css';
import ErrorBoundary from './ErrorBoundary.tsx';

import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: 'https://b5cf8dbfb608602655e7a40c46548ddf@o4508121903661056.ingest.us.sentry.io/4508186449936384',
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
