import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/inter-tight';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './index.css';
import { ThemeProvider } from './theme/Theme';
import { chooseView, settleAfterSwitch } from './lib/mode';

// the desktop page and the phone layout are separate chunks: each device downloads only its own
const view = chooseView();
settleAfterSwitch();
document.documentElement.dataset.view = view;
const App = lazy(() => import('./App'));
const PhoneApp = lazy(() => import('./phone/PhoneApp'));

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Suspense fallback={null}>{view === 'phone' ? <PhoneApp /> : <App />}</Suspense>
  </ThemeProvider>
);
