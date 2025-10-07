import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueueDisplay } from './components/QueueDisplay';
import { SettingsDialog } from './components/settings-dialog';

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <QueueDisplay />
                <SettingsDialog />
            </div>
        </QueryClientProvider>

    );
}

export default App;
