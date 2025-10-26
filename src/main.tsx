import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { Analytics } from '@vercel/analytics/react';

// PWA service worker (auto handled by vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './providers/auth_provider.tsx'
import { AppStateProvider } from './providers/app_provider.tsx';
import { HistoryStateProvider } from './providers/history_provider.tsx';
import { queryClient } from './query_client.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { NoteStateProvider } from './providers/note_provider.tsx';

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient} >
        <AuthProvider>
            <AppStateProvider>
                <HistoryStateProvider>
                    <NoteStateProvider>
                        <App />
                        <Analytics />
                    </NoteStateProvider>
                </HistoryStateProvider>
            </AppStateProvider>
        </AuthProvider>
    </QueryClientProvider>

)
